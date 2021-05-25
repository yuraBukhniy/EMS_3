const {Router} = require('express');
const User = require('../database/userModel');
const Project = require('../database/Project')

const router = Router();

router.get('/', async (req, res) => {
  try {
    const employees = await User.find()
      .populate({path: 'project', select: ['code', 'name']});
    
    res.json(employees)
  } catch(err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/managers', async (req, res) => {
  try {
    const employees = await User.find({position: 'Project Manager'});
    res.json(employees);
  } catch(err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

// список лідів і менеджерів проекту
router.get('/leads/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    let leads;
    if(project.code === 'P0001' || project.code === 'P0010') { // Administration and HR Department
      leads = await User.find({
        project: req.params.id,
        position: 'Manager'
      }, 'username firstName lastName seniority position')
    }
    else leads = await User.find({
        project: req.params.id,
        role: ['manager', 'teamLead']
      }, 'username firstName lastName seniority position')
    res.json(leads)
  } catch(err) {
    console.error(err)
    res.status(500).send(err)
  }
})

router.get('/team/:id', async (req, res) => {
  try {
    const leadUsername = req.params.id;
    const arr = await User.aggregate([{
      $lookup: {
        from: 'leaves',
        localField: '_id',
        foreignField: 'author',
        as: 'leaves'
      }
    }])
    const team = arr.filter(a => {
      return a.supervisor === leadUsername
    })
    res.json(team)
  } catch(err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/project/:id', async (req, res) => {
  try {
    const project = req.params.id;
    const arr = await User.aggregate([{
      $lookup: {
        from: 'leaves',
        localField: '_id',
        foreignField: 'author',
        as: 'leaves'
      }
    }])
    const team = arr.filter(a => {
      return a.project.toString() === project
    })
    res.json(team)
  } catch(err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const employee = await User.findById(req.params.id)
      .populate({path: 'project', select: ['name']});
    const supervisor = await User.findOne(
      {username: employee.supervisor},
      {firstName: 1, lastName: 1, seniority: 1, position: 1}
    );
    
    res.json({employee, supervisor})
  } catch(err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/costs/:id', async (req, res) => {
  try {
    const project = req.params.id;
    const employees = await User.find({project}, {salary: 1, _id: 0})
    let sum = 0
    employees.forEach(empl => {
      sum += empl.salary
    })
    res.json(sum)
  } catch(err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

module.exports = router;