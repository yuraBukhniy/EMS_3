const {Router} = require('express');
const {Schema, model, Types} = require('mongoose')
const Payment = require('../database/payment')
const User = require('../database/userModel')
const Leave = require('../database/Leave')
const fetch = require('node-fetch')

// function convertUSDToUAH(value) {
//   let rate;
//   fetch('https://v6.exchangerate-api.com/v6/5a6a76bf2a51472ae24be220/latest/USD')
//     .then(resp => resp.json())
//     .then(data => {
//       rate = data.conversion_rates.UAH
//     });
//   return (value * rate).toFixed(2)
// }

const router = Router();

const Settings = model('payment_settings', new Schema({
  date: Date,
  singleTax: Number,
  contribTax: Number
}))

router.put('/settings', async (req, res) => {
  try {
    const data = req.body
    const doc = await Settings.find()
    if(doc.length) await Settings.updateOne({}, data)
    else {
      await Settings.insertMany(data)
      //await new Settings(data).save()
    }
    res.status(201).json({
      message: 'Дані оновлено'
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = Types.ObjectId(req.params.id)
    const paymentParams = await Settings.findOne()
    const payDate = paymentParams.date
  
    if(new Date(Date.now()) > payDate) {
      const existingPayment = await Payment.find({employee: id, date: payDate})
      
      if(!existingPayment.length) {
        const emplData = await User.findById(req.params.id, {salary: 1})
  
        let rate = 28;
        fetch('https://v6.exchangerate-api.com/v6/5a6a76bf2a51472ae24be220/latest/USD')
          .then(resp => resp.json())
          .then(async (data) => {
            rate = data.conversion_rates.UAH
            let salary = emplData.salary * rate
            //convertUSDToUAH(emplData.salary)
            const singleTax = +(salary * paymentParams.singleTax / 100).toFixed(2)
            const contribTax = paymentParams.contribTax
            let sum = +(salary - singleTax - contribTax).toFixed(2)
            let deduction = 0
            
            const date = new Date(payDate)
            const year = date.getFullYear()
            const month = date.getMonth()
            const firstDay = new Date(year, month, 1)
            const lastDay = new Date(year, month + 1, 0)
            // пошук неоплачуваних відпусток для їх врахування при обчисленні зарплати
            const unpaidLeaves = await Leave.find({
              author: id,
              type: 'неоплачувана',
              status: 'Прийнято',
              startDate: {'$gte': firstDay},
              endDate: {'$lte': lastDay}
            })
            
            if(unpaidLeaves.length) {
              // вирахування сумарної кількості днів неопл. відпусток за місяць
              let leaveDays = 0
              unpaidLeaves.forEach(leave => leaveDays += leave.days)
              // визначення кількості робочих днів у місяці
              let workDays = 0
              for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
                date.setDate(i)
                if (date.getDay() !== 0 && date.getDay() !== 6) workDays++
              }
              // обчислення розміру відрахування за неопл. вихідні
              deduction = +(sum / workDays * leaveDays).toFixed(2)
              sum -= deduction
            }
            const payment = new Payment({date: payDate, employee: id, salary, singleTax, contribTax, sum, deduction})
            await payment.save()
            //console.log({salary, sum, deduction})
          });
      }
    }
  
    const payments = await Payment.find({employee: id})
    res.json({payDate, payments})
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

module.exports = router;