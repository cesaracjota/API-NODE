const { dbConnection } = require('./database/config');
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Configurar CORS
app.use(cors());

// Base de datos
dbConnection();

//agylcode
//agadmin

app.get('/', (req, res) => {
    res.json({ 
        message: 'Hello World!',
        status: 'OK' 
    });
});

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});