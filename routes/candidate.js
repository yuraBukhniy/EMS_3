const {Router} = require('express');
const Candidate = require('../database/candidateModel');
const User = require('../database/userModel');
const Project = require('../database/Project');
const bcrypt = require('bcryptjs');
const sendCredentials = require('../email/credentials-sender')
const sendResult = require('../email/result-sender')

const router = Router();

router.post('/add', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, seniority, position, project, interviewDate, interviewer } = req.body;
    const newCandidate = new Candidate({
      firstName, lastName, email, phone, seniority, position, project, interviewDate, interviewer
    });
    await newCandidate.save();
    res.status(201).json({
      message: 'Кандидат доданий',
      body: req.body
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
});

router.get('/get', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({interviewDate: 'desc'})
      .populate({path: 'project', select: ['code', 'name']});
    res.json(candidates)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate({path: 'project', select: ['code', 'name']});
    res.json(candidate)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.patch('/edit/:id', async (req, res) => {
  try {
    const {newCandData, candidate} = req.body
    const setDataToUpdate = (status, date) => {
      if(status && date) return {status, interviewDate: date};
      else if(status) return {status};
      else if(date) return {interviewDate: date};
      else return null
    };
    const dataToUpdate = setDataToUpdate(newCandData.status, newCandData.interviewDate);
    if(dataToUpdate) {
      await Candidate.findByIdAndUpdate(req.params.id, dataToUpdate);
      if(newCandData.status === 'Пропозиція') {
        await sendResult(candidate, true)
      }
      if(newCandData.status === 'Співбесіда не пройдена') {
        await sendResult(candidate, false)
      }
      res.json({
        message: "Дані оновлено"
      })
    }
    else {
      res.json({
        message: "Немає даних"
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.post('/createuser', async (req, res) => {
  try {
    const { username, password, supervisor, role, salary, candId } = req.body;
    const candidate = await Candidate.findById(candId);
    const { firstName, lastName, email, phone, seniority, position, project } = candidate;
    const exist = await User.findOne({ username });
    if(exist) {
      return res.status(400).json({
        message: "Працівник з даним іменем користувача уже існує"
      })
    }
    const hashedPassword = await bcrypt.hash(password, 12);
  
    const newUser = new User({
      username, password: hashedPassword,
      firstName, lastName,
      email, phone,
      seniority, position, role,
      supervisor, project, salary
    });
    await newUser.save();
    await sendCredentials({firstName, lastName, email, username, password})
    
    let estimateField;
    switch(position) {
      case 'Project Manager': estimateField = 'managers'; break;
      case 'Software Engineer': estimateField = 'devs'; break;
      case 'Test Engineer': estimateField = 'testers'; break;
      case 'Analyst': estimateField = 'analysts'; break;
      case 'Designer': estimateField = 'designers'; break;
    }
    if(seniority === 'Lead') estimateField = 'leads';
  
    const projectData = await Project.findById(project)
    const newEstimateData = projectData.estimate[estimateField]
    if(estimateField === 'devs' || estimateField === 'testers') {
      const seniorityField = seniority.toLowerCase()
      if(newEstimateData[seniorityField] && newEstimateData[seniorityField].amount !== 0)
        newEstimateData[seniorityField].amount -= 1
    } else if(newEstimateData && newEstimateData.amount !== 0) newEstimateData.amount -= 1
  
    await Project.findByIdAndUpdate(project, {
      estimate: {
        ...projectData.estimate,
        [estimateField]: newEstimateData
      }
    })
    
    res.status(201).json({
      message: 'Працівник доданий в систему',
      body: req.body
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    Candidate.deleteOne({_id: req.params.id}, (err) => {
      err ? res.status(500).json(err) : res.json('Кандидат видалений')
    })
    
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

module.exports = router;