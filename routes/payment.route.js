const {Router} = require('express');
const {Types} = require('mongoose')
const Payment = require('../database/payment')
const User = require('../database/userModel')
const Leave = require('../database/Leave')
const Task = require('../database/Task')
const fs = require('fs')
const fetch = require('node-fetch')

const router = Router();
const jsonPath = './payment/paymentSettings.json'
const WORK_HOURS = 8

const setDataToUpdate = data => {
  let dataToUpdate = {}
  for(let item of Object.keys(data)) {
    if(data[item]) dataToUpdate[item] = data[item]
  }
  return dataToUpdate
}

router.put('/settings', async (req, res) => {
  try {
    const currentData = JSON.parse(fs.readFileSync(jsonPath))
    const received = setDataToUpdate(req.body)
    const newData = JSON.stringify({...currentData, ...received})
    fs.writeFileSync(jsonPath, newData)
    res.status(201).json({
      message: 'Дані оновлено'
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.post('/payroll', async (req, res) => {
  try {
    const rawData = fs.readFileSync(jsonPath)
    const paymentParams = JSON.parse(rawData)
    const payDate = paymentParams.date
    const date = new Date(payDate)
    const employees = await User.find({}, {salary: 1, username: 1, registeredDate: 1})
    
    if(new Date(Date.now()) > date) {
      for(let employee of employees) {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1).toLocaleString('en-US', {timeZone: 'Europe/Kiev'})
        const lastDay = new Date(year, month + 1, 1).toLocaleString('en-US', {timeZone: 'Europe/Kiev'})
        
        const existingPayment = await Payment.find({employee: employee._id, date: {$gte: firstDay, $lte: lastDay}})
        
        if(!existingPayment.length && date - employee.registeredDate >= 10*24*3600*1000) {
          let rate = 28;
          fetch('https://v6.exchangerate-api.com/v6/5a6a76bf2a51472ae24be220/latest/USD')
            .then(resp => resp.json())
            .then(async (data) => {
              rate = data.conversion_rates.UAH
              let salary = employee.salary * rate
              const singleTax = +(salary * paymentParams.singleTax / 100).toFixed(2)
              const contribTax = paymentParams.contribTax
              let sum = +(salary - singleTax - contribTax).toFixed(2)
              let deduction = 0
          
              // визначення кількості робочих днів у місяці
              let workDays = 0
              for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
                date.setDate(i)
                if (date.getDay() !== 0 && date.getDay() !== 6) workDays++
              }
              // пошук неоплачуваних відпусток для їх врахування при обчисленні зарплати
              const unpaidLeaves = await Leave.find({
                author: employee._id,
                type: 'неоплачувана',
                status: 'Прийнято',
                startDate: {'$gte': firstDay},
                endDate: {'$lte': lastDay}
              })
          
              if(unpaidLeaves.length) {
                // вирахування сумарної кількості днів неопл. відпусток за місяць
                let leaveDays = 0
                unpaidLeaves.forEach(leave => leaveDays += leave.days)
                // обчислення розміру відрахування за неопл. вихідні
                deduction = +(sum / workDays * leaveDays).toFixed(2)
              }
          
              // визначення кількості годин овертаймів за місяць
              const username = employee.username
              const tasks = await Task.find({assignedTo: username, 'overtime.employee': username})
              let overtimeHours = 0
              tasks.forEach(task => {
                task.overtime.forEach(item => {
                  if(item.employee === username
                    && new Date(item.date).getMonth() === month)
                    overtimeHours += item.hours
                })
              })
              // нарахування надбавки за овертайми
              const premium = +(sum / (workDays * WORK_HOURS) * overtimeHours).toFixed(2)
          
              // обчислення остаточної суми
              sum -= deduction
              sum += premium
          
              const payment = new Payment({date: payDate, employee: employee._id, salary, singleTax, contribTax, sum, deduction, premium})
              await payment.save()
              //console.log({date: payDate, employee: employee._id, salary, singleTax, contribTax, sum, deduction, premium})
            });
        }
      }
    }
    res.json({})
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/', async (req, res) => {
  try {
    const rawData = fs.readFileSync(jsonPath)
    const paymentParams = JSON.parse(rawData)
    const payDate = paymentParams.date
    
    let payments = await Payment.find({date: payDate})
      .populate({path: 'employee', select: ['firstName', 'lastName']})
    
    if(!payments.length) {
      const date = new Date(payDate)
      const prevDate = new Date(date.getFullYear(), date.getMonth() - 1)
      payments = await Payment.find({date: {$gte: prevDate}})
        .populate({path: 'employee', select: ['firstName', 'lastName']})
        .sort({date: -1})
    }
    res.json(payments)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.post('/:id', async (req, res) => {
  try {
    const id = Types.ObjectId(req.params.id)
    const rawData = fs.readFileSync(jsonPath)
    const paymentParams = JSON.parse(rawData)
    const payDate = paymentParams.date
  
    if(new Date(Date.now()) > new Date(payDate)) {
      const date = new Date(payDate)
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDay = new Date(year, month, 1).toLocaleString('en-US', {timeZone: 'Europe/Kiev'})
      const lastDay = new Date(year, month + 1, 1).toLocaleString('en-US', {timeZone: 'Europe/Kiev'})
  
      const existingPayment = await Payment.find({employee: id, date: {$gte: firstDay, $lte: lastDay}})
      const emplData = await User.findById(req.params.id)
      
      if(!existingPayment.length && date - emplData.registeredDate >= 10*24*3600*1000) {
        let rate = 28;
        fetch('https://v6.exchangerate-api.com/v6/5a6a76bf2a51472ae24be220/latest/USD')
          .then(resp => resp.json())
          .then(async (data) => {
            rate = data.conversion_rates.UAH
            let salary = emplData.salary * rate
            const singleTax = +(salary * paymentParams.singleTax / 100).toFixed(2)
            const contribTax = paymentParams.contribTax
            let sum = +(salary - singleTax - contribTax).toFixed(2)
            let deduction = 0
            
            // визначення кількості робочих днів у місяці
            let workDays = 0
            for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
              date.setDate(i)
              if (date.getDay() !== 0 && date.getDay() !== 6) workDays++
            }
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
              // обчислення розміру відрахування за неопл. вихідні
              deduction = +(sum / workDays * leaveDays).toFixed(2)
            }
  
            // визначення кількості годин овертаймів за місяць
            const username = emplData.username
            const tasks = await Task.find({assignedTo: username, 'overtime.employee': username})
            let overtimeHours = 0
            tasks.forEach(task => {
              task.overtime.forEach(item => {
                if(item.employee === username
                  && new Date(item.date).getMonth() === month)
                  overtimeHours += item.hours
              })
            })
            // нарахування надбавки за овертайми
            const premium = +(sum / (workDays * WORK_HOURS) * overtimeHours).toFixed(2)
            
            // обчислення остаточної суми
            sum -= deduction
            sum += premium
            
            const payment = new Payment({date: payDate, employee: id, salary, singleTax, contribTax, sum, deduction, premium})
            await payment.save()
          });
      }
    }
    res.json({})
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = Types.ObjectId(req.params.id)
    const rawData = fs.readFileSync(jsonPath)
    const paymentParams = JSON.parse(rawData)
    const payDate = paymentParams.date
    
    const payments = await Payment.find({employee: id}).sort({date: -1})
    res.json({payDate, payments})
  } catch (err) {
    console.error(err.message)
    res.status(500).send(err)
  }
})

module.exports = router;