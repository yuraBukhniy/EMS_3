const {Router} = require('express');

const router = Router();

router.post('/', async (req, res) => {
  try {
    
    res.status(201).json({
      message: ''
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

module.exports = router;