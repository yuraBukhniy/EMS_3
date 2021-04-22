const {Router} = require('express');
const ServiceRequest = require('../database/ServiceRequest');
const {Types} = require('mongoose')

const router = Router();

router.post('/new', async (req, res) => {
  try {
    const data = req.body;
    const request = new ServiceRequest(data);
    await request.save();
    res.status(201).json({
      message: 'Created'
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

// отримати всі запити
router.get('/', async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate({path: 'author', select: ['firstName', 'lastName']});
    res.json(requests)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

// отримати конкретну заявку
router.get('/:id', async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
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
    const requests = await ServiceRequest.find({author: userId})
      .populate({path: 'author', select: ['firstName', 'lastName']});
    res.json(requests)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

// зміна статусу заявки
router.patch('/change/:id', async (req, res) => {
  try {
    const {status, reply} = req.body;
    const setDataToUpdate = (status, reply) => {
      if(status && reply) return {status, reply};
      else if(status) return {status};
      else if(reply) return {reply};
      else return null
    };
    const dataToUpdate = setDataToUpdate(status, reply);
    if(dataToUpdate) {
      await ServiceRequest.findByIdAndUpdate(req.params.id, dataToUpdate);
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

module.exports = router;