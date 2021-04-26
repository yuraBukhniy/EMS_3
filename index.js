const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const authRoutes = require('./routes/auth');
const emplRoutes = require('./routes/employee.routes');
const candRoutes = require('./routes/candidate');
const projectRoutes = require('./routes/project.route');
const taskRoutes = require('./routes/task.routes');
const serviceRoutes = require('./routes/service.routes');
const leaveRoutes = require('./routes/leave.route');
const paymentRoutes = require('./routes/payment.route');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/employees', emplRoutes);
app.use('/cand', candRoutes);
app.use('/project', projectRoutes);
app.use('/task', taskRoutes);
app.use('/service', serviceRoutes);
app.use('/leave', leaveRoutes);
app.use('/payment', paymentRoutes);

const PORT = config.get('port');
const URI = config.get('mongoUri');

async function start() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
      .then(() => {
        console.log("Connected to MongoDB")
      })
      .catch((error) => {
        console.log(error.message)
      })
    
    app.listen(PORT, () => {
      console.log(`App has been started at port ${PORT}`)
    });
  } catch (e) {
    console.log('Server error', e.message);
    process.exit(1)
  }
}

start();