const {Router} = require('express');
const Project = require('../database/Project');
const User = require('../database/userModel');

const router = Router();

router.post('/create', async (req, res) => {
  try {
    // const { code, name, description, managers, leads, devs, testers } = req.body;
    // const estimate = {managers, leads, devs, testers};
    // const newProject = new Project({
    //   code, name, description, estimate
    // });
    const data = req.body;
    const newProject = new Project(data)
    await newProject.save();
    res.status(201).json({
      message: 'Проєкт створено'
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
});

router.patch('/setestimate/:id', async (req, res) => {
  try {
    const data = req.body;
    await Project.findByIdAndUpdate(req.params.id, {estimate: data})
    res.status(201).json({
      message: 'Оновлено'
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