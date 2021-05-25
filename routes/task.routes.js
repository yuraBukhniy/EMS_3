const {Router} = require('express');
const Task = require('../database/Task');
const {Types} = require('mongoose')

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
    const tasks = await Task.aggregate([
      {$match: {"project": project}},
      {$lookup: {
        "from": "users",
        "let": { "assignedTo": "$assignedTo" },
        "pipeline": [
          { "$match": { "$expr": { "$in": [ "$username", "$$assignedTo" ] } } },
          { "$project": {"_id": 0, "firstName": 1, "lastName": 1}}
        ],
        "as": "assignedTo"
      }}
    ])
    res.json(tasks)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.aggregate([
      {$match: {"_id": Types.ObjectId(req.params.id)}},
      {$lookup: {
          "from": "users",
          "let": { "assignedTo": "$assignedTo" },
          "pipeline": [
            { "$match": { "$expr": { "$in": [ "$username", "$$assignedTo" ] } } },
            { "$project": {"_id": 0, "firstName": 1, "lastName": 1, "username": 1}}
          ],
          "as": "assignedTo"
        }}
    ]);
    res.json(task[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/user/:id', async (req, res) => {
  try {
    const username = req.params.id;
    const tasks = await Task.aggregate([
      {$match: {"assignedTo": username}},
      {$lookup: {
          "from": "users",
          "let": { "assignedTo": "$assignedTo" },
          "pipeline": [
            { "$match": { "$expr": { "$in": [ "$username", "$$assignedTo" ] } } },
            { "$project": {"_id": 0, "firstName": 1, "lastName": 1}}
          ],
          "as": "assignedTo"
        }}
    ])
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
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.put('/overtime/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const {overtime} = task;
    
    const newOvertime = req.body;
    let exists, index = -1;
    overtime.forEach(item => {
      if(item.date === newOvertime.date && item.employee === newOvertime.employee) {
        exists = true;
        index = overtime.indexOf(item)
      }
    })
    if(exists) overtime[index].hours = newOvertime.hours;
    else overtime.push(newOvertime);
    await Task.findByIdAndUpdate(req.params.id, {overtime});
    
    res.json({
      message: "Овертайми додано",
      overtime
    });
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

module.exports = router;