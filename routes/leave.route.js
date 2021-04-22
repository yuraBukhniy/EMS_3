const {Router} = require('express');
const Leave = require('../database/Leave');
const User = require('../database/userModel');
const {Types} = require('mongoose');

function getLeaveDays(startDate, endDate) {
  const difference = Math.round((endDate - startDate) / (1000*60*60*24));
  let startDay = startDate.getDate();
  let startMonth = startDate.getMonth();
  let daysCount = 0;
  //console.log(difference, startDay)
  
  for(let i = 0; i <= difference; i++) {
    if(startMonth !== startDate.getMonth()) {
      startDay = 2 - i;
      startMonth = startDate.getMonth()
    }
    startDate.setDate(startDay + i);
    //console.log(startDate)
    if(startDate.getDay() !== 6 && startDate.getDay() !== 0) {
      daysCount++
    }
  }
  return daysCount
}

function translateTypeName(type) {
  switch (type) {
    case 'оплачувана': return 'paid';
    case 'неоплачувана': return 'unpaid';
    case 'лікарняний': return 'illness';
    default: return null
  }
}

const router = Router();

router.get('/balance/:id', async (req, res) => {
  try {
    const {leavesAvailable} = await User.findById(req.params.id)
    res.json(leavesAvailable)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.post('/create', async (req, res) => {
  try {
    const {leaveData, leavesAvailable} = req.body;
    const {description, author, type, startDate, endDate} = leaveData;
    
    const days = getLeaveDays(new Date(startDate), new Date(endDate));
    
    const availableLeavesOfType = type === 'оплачувана' ? leavesAvailable.paid
      : type === 'неоплачувана' ? leavesAvailable.unpaid : leavesAvailable.illness
    if(days > availableLeavesOfType) {
      return res.status(400).json({
        message: 'Недостатньо днів, доступних для відпустки',
      })
    }
    
    const request = new Leave({description, author, type, startDate, endDate, days});
    await request.save();
    
    res.status(201).json({
      message: 'Created',
    })
    
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/', async (req, res) => {
  try {
    const requests = await Leave.find()
      .populate({path: 'author', select: ['firstName', 'lastName']});
    res.json(requests)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const request = await Leave.findById(req.params.id)
      .populate({path: 'author', select: ['firstName', 'lastName']});
    res.json(request)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

// отримати запити від конкретного користувача
router.get('/user/:id', async (req, res) => {
  try {
    const userId  = Types.ObjectId(req.params.id);
    const requests = await Leave.find({author: userId})
      .populate({path: 'author', select: ['firstName', 'lastName']});
    res.json(requests)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/team/:username', async (req, res) => {
  try {
    const username  = req.params.username;
    const requests = await Leave.find()
      .populate({path: 'author', select: ['firstName', 'lastName', 'supervisor']});
    const filtered = requests.filter(request => request.author.supervisor === username)
    res.json(filtered)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.patch('/status/:id', async (req, res) => {
  try {
    const {status} = req.body;
  
    if(status === 'Прийнято') {
      const {author, days, type} = await Leave.findById(req.params.id)
      const {leavesAvailable} = await User.findById(author);
      const availableLeavesOfType = type === 'оплачувана' ? leavesAvailable.paid
        : type === 'неоплачувана' ? leavesAvailable.unpaid : leavesAvailable.illness
      const newLeaveBalance = {
        ...leavesAvailable,
        [translateTypeName(type)] : availableLeavesOfType - days
      }
      await User.findByIdAndUpdate(author, {leavesAvailable: newLeaveBalance})
    }
   
    await Leave.findByIdAndUpdate(req.params.id, {status})
    res.json({
      message: status
    })
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
})

module.exports = router;