/*
Importación de módulos
*/


const express = require('express');
const cors = require('cors');


require('dotenv').config()
const { dbConnection } = require('./database/configdb');


// Crear una aplicación de express
const app = express();

dbConnection();


app.use(cors());
app.use(express.json());

app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/albumes', require('./routes/album'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/hilos', require('./routes/hilo'));
app.use('/api/comentarios', require('./routes/comentario'));
app.use('/api/listal', require('./routes/listal'));
app.use('/api/listar', require('./routes/listar'));

// Abrir la aplicacíon en el puerto 3000
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ', process.env.PORT);
});