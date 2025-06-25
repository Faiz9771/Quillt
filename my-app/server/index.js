//Modules require to create an run express app
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

//data imports
const Accounts = require('./models/Accounts');


//Configuration
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:5173', // Allow your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));

//Routers
const authRouter = require('./routers/authRoute');
const generalRouter = require('./routers/general');
const clientRouter = require('./routers/client');





//Mongoose Setup
const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  app.listen(PORT,()=>console.log(`Server Port: ${PORT}`));
}).catch((error ) => console.log(`${error} did not connect`));

// Routes
app.use('/api/auth', authRouter);
app.use('/general', generalRouter);
app.use('/client', clientRouter);



/*const uri1 = "mongodb+srv://faiz9771:Faiz%401234@Quillt.2gg5auu.mongodb.net/authentication?retryWrites=true&w=majority";
const uri2 = "mongodb+srv://faiz9771:Faiz%401234@Quillt.2gg5auu.mongodb.net/accounts?retryWrites=true&w=majority";*/








 

/*
mongoose.connect(uri1, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to Authentication");
})
.catch((error) => {
  console.error('Failed to connect to Authentication:', error);
});



//Accounts Connection
mongoose.connect(uri2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to Accounts");
})
.catch((error) => {
  console.error('Failed to connect to Accounts:', error);
});
*/







// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});



// Server
/*const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});*/
