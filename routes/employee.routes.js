const {Router} = require('express');
const User = require('../database/userModel');

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

// список лідів і менеджерів проекту
router.get('/leads/:id', async (req, res) => {
  try {
    const leads = await User.find(
      {project: req.params.id, role: ['manager', 'teamLead']},
      'username firstName lastName seniority position')
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
    res.json(employee)
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