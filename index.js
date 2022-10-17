const { dbConnection } = require('./database/config');
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));


app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});