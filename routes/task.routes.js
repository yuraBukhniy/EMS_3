const {Router} = require('express');
const Task = require('../database/Task');
const {Types} = require('mongoose')
//const User = require('../database/userModel');

const router = Router();

router.post('/create', async (req, res) => {
  try {
    const {taskData, assigned} = req.body;
    const projectId = Types.ObjectId(taskData.project)
    const newTask = new Task({
      ...taskData,
      project: projectId,
      assignedTo: assigned
    });
    await newTask.save();
    res.status(201).json({
      message: 'Task created'
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/project/:id', async (req, res) => {
  try {
    const project = Types.ObjectId(req.params.id);
    const tasks = await Task.find({project});
    res.json(tasks)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.json(task)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/user/:id', async (req, res) => {
  try {
    const username = req.params.id;
    const tasks = await Task.find({assignedTo: username});
    res.json(tasks)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

// зміна статусу завдання
router.patch('/edit/:id', async (req, res) => {
  try {
    const {status: newStatus} = req.body;
    const {assignedTo} = req.body;
    const endDate = newStatus === 'Закрито' ? new Date(Date.now()) : '';
    if(newStatus && assignedTo.length) {
      await Task.findByIdAndUpdate(req.params.id, {
        status: newStatus,
        assignedTo,
        endDate
      })
    }
    else if(newStatus) {
      await Task.findByIdAndUpdate(req.params.id, {
        status: newStatus,
        endDate
      })
    }
    else if(assignedTo.length) {
      await Task.findByIdAndUpdate(req.params.id, {
        assignedTo
      })
    }
    else res.json({
        message: "Nothing to update"
      })
    
    res.json({
      message: "Updated"
    })
    //res.json({newStatus: !!newStatus, assignedTo: !!assignedTo})
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

module.exports = router;