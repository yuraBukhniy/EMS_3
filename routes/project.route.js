const {Router} = require('express');
const Project = require('../database/Project');
const User = require('../database/userModel');

const router = Router();

router.post('/create', async (req, res) => {
  try {
    const {code, name, description, manager} = req.body;
    const newProject = new Project({code, name, description})
    await newProject.save();
    if(manager) await User.findByIdAndUpdate(manager, {project: newProject._id});
    res.status(201).json({
      message: 'Проєкт створено'
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
});

const findSum = object => {
  if(Object.keys(object).length) return object.salary * object.amount;
  else return 0
}
const setDataToUpdate = data => {
  let dataToUpdate = {}
  for(let item in data) {
    if(Object.keys(data[item]).length) dataToUpdate[item] = data[item]
  }
  return dataToUpdate
}
router.patch('/setestimate/:id', async (req, res) => {
  try {
    const {costs, currentBudget, newBudget, managers, leads, devs, testers, designers, analysts} = req.body
    
    let devSum = 0
    for(let item in devs) {
      devSum += findSum(devs[item])
    }
    let testerSum = 0
    for(let item in testers) {
      testerSum += findSum(testers[item])
    }
    const sum = findSum(managers) + findSum(leads) + findSum(designers) + findSum(analysts) + devSum + testerSum
    const budget = newBudget ? newBudget : currentBudget
    
    if(sum > budget - costs) {
      return res.status(201).json({
        message: `Витрати на персонал не можуть бути більшими за бюджет. Перевищення на ${sum + costs - budget} $`
      })
    }
    const estimate = setDataToUpdate({managers, leads, devs, testers, designers, analysts})
    if(Object.keys(estimate).length) {
      const project = await Project.findById(req.params.id)
      const oldEstimate = project.estimate
      const finalEstimate = {
        ...oldEstimate,
        ...estimate,
        devs: {
          ...oldEstimate.devs,
          ...estimate.devs
        },
        testers: {
          ...oldEstimate.testers,
          ...estimate.testers
        }
      }
      //console.log(finalEstimate)
      await Project.findByIdAndUpdate(req.params.id, {
        budget,
        estimate: finalEstimate
        //   : {managers, leads, devs, testers, designers, analysts}
      })
    } else await Project.findByIdAndUpdate(req.params.id, { budget })
    res.status(201).json({
      message: 'Дані оновлено'
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
});

router.get('/get', async (req, res) => {
  try {
    const projects = await Project.find().sort({startDate: 'desc'});
    res.json(projects)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/get/names', async (req, res) => {
  try {
    const projectNames = await Project.find({}, {code: 1, name: 1});
    res.json(projectNames)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/get/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/code/:id', async (req, res) => {
  try {
    const project = await Project.find({code: req.params.id});
    res.json(project)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.patch('/edit/:id', async (req, res) => {
  try {
    const {name, description} = await Project.findById(req.params.id);
    const {newName, newDescription} = req.body;
    if(name == newName && description == newDescription) {
      return res.status(400).json({
        message: "Unchanged data"
      })
    }
    if(!name || !description) {
      return res.status(400).json({
        message: "Empty field"
      })
    }
    // await Project.findByIdAndUpdate(req.params.id, {
    //   name: newName,
    //   description: newDescription
    // })
    res.json({
      message: 'Project data updated',
      newName, newDescription
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

module.exports = router;