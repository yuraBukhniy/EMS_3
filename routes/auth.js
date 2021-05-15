const {Router} = require('express');
const User = require('../database/userModel');
const {Types} = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const sendCredentials = require('../email/credentials-sender')

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, project } = req.body;
    const userData = req.body;
    const candidate = await User.findOne({ username });
    if(candidate) {
      return res.status(400).json({
        message: "Працівник з даним іменем користувача уже існує"
      })
    }
    
    userData.password = await bcrypt.hash(password, 12);
    userData.project = Types.ObjectId(project)
    const newUser = new User(userData);
    await newUser.save();
  
    await sendCredentials({...userData, password});
    
    res.status(201).json({
      message: 'Працівник доданий в систему'
    })
  } catch(err) {
    console.error(err.message)
    res.status(500).send(err)
  }
});

router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({ username });
    if(!user) {
      return res.status(400).json({
        message: "No such user"
      })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({
        message: "Неправильний пароль"
      })
    }
    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '1h' }
    )
    res.json({
      token,
      userId: user.id,
      role: user.role,
      username: user.username,
      project: user.project,
      supervisor: user.supervisor,
      seniority: user.seniority,
      position: user.position
    })
    
  } catch(err) {
    console.error(err.message)
    res.status(500).send(err)
  }
});

router.put('/changepswd/:id', async (req, res) => {
  try {
    const {password} = await User.findById(req.params.id);
    const {currentPassword, newPassword, confirmPassword} = req.body;
    const isMatch = await bcrypt.compare(currentPassword, password);
    if(!isMatch) {
      return res.status(400).json({
        message: "Неправильний поточний пароль"
      })
    }
    if(newPassword !== confirmPassword) {
      return res.status(400).json({
          message: "Пароль не підтверджено"
      })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(req.params.id, {password: hashedPassword})
    res.status(201).json({
      message: 'Пароль змінено'
    })
  } catch(err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

module.exports = router;