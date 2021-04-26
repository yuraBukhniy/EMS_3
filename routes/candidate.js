const {Router} = require('express');
const Candidate = require('../database/candidateModel');
const User = require('../database/userModel');
const bcrypt = require('bcryptjs');
const sendCredentials = require('../email/credentials-sender')
const sendResult = require('../email/result-sender')

const router = Router();

router.post('/add', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, project, interviewDate, interviewer } = req.body;
    const newCandidate = new Candidate({
      firstName, lastName, email, phone, position, project, interviewDate, interviewer
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
    //const {status, interviewDate, firstName, lastName, email, position} = req.body;
    const {newCandData, candidate} = req.body
    //const {firstName, lastName, email, position} = candidate
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
    const { candId } = req.body;
    const candidate = await Candidate.findById(candId);
    const { username, password, seniority, position, supervisor, role, salary } = req.body;
    
    const { firstName, lastName, email, phone, project } = candidate;
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
  
    res.status(201).json({
      message: 'Працівник доданий в систему',
      body: req.body
    })
    
    //res.json(candidate)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    //Candidate.deleteOne(req.params.id)
    Candidate.deleteOne({_id: req.params.id}, (err) => {
      err ? res.status(500).json(err) : res.json('Candidate deleted')
    })
    
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

module.exports = router;