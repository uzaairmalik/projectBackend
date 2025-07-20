require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const Test = require('./routes/test'); // adjust path as necessary

const app = express();
const { 
  submitApplication,
  getApplications,
  getMyApplications,
  updateStatus
} = require('./controllers/bedController');

// // In your backend server file (app.js or server.js)
// const cors = require('cors');

// Configure CORS properly
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json());

// Connect to Database and start server
(async () => {
  try {
    await connectDB();
    
    // Routes
    app.use('/api/users', require('./routes/users'));
    app.use('/api/bed-applications', require('./routes/bedApplication'));
    
    // Testingzainab route
    app.get('/api/test', (req, res) => {
      res.json({ message: "Backend is workinghghghgh" });
    });

  //   app.get('/api/testtt',async (req,res)=>{
  //      try {
  //   const applications = await Test.find(); // optional: populate user data if ref exists

  //   res.json({
  //     success: true,
     
  //     data: applications
  //   });
  // } catch (err) {
  //   console.error('Fetch error:', err);
  //   res.status(500).json({
  //     success: false,
  //     error: 'Server error'
  //   });
  // }
  //   })


//      app.post('/api/test2',async (req, res) => {
//     try{
//       const bedAppointment= new Test(req.body);
//       console.log('test bed data', bedAppointment);
//       const bedTest=await bedAppointment.save()
//       res.json(bedTest)
//     }
//     catch(error){
// console.log('errrrr',error);
// res,status(500).json({error: 'failed', err: error})
//     }
//     });


app.post('/api/test2', async (req, res) => {
  try {
    const bedAppointment = new Test(req.body);
    console.log('test bed data', bedAppointment);

    const savedData = await bedAppointment.save();
    res.json(savedData);
  } catch (error) {
    console.log('errrrr', error);
    res.status(500).json({ error: 'failed', err: error });
  }
});
//zainab test above
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port test ${PORT}`);
      console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
    });
  } catch (err) {
    console.error('Server initialization failed:', err);
    process.exit(1);
  }
})();