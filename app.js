const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();


const corsOptions = {
    origin: 'http://localhost:3000', // Specify allowed origin(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
    credentials: true, // Enable credentials (e.g., cookies) for cross-origin requests
  };
  
  app.use(cors(corsOptions));
  
app.use(cors(corsOptions));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
