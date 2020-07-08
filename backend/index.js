const express = require ('express');
const morgan = require('morgan');
// const cors = require('cors');
const app = express();
const cors = require('cors');

const { mongoose } = require('./database');


//Settings
app.set('port', process.env.PORT || 3001);

//Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
// app.use(cors({origin: 'http://localhost:4200'}));
//Routes
app.use('/api/config' ,require('./routes/config.routes'));
app.use('/api/bonos' ,require('./routes/bono.routes'));
app.use('/api/users' ,require('./routes/user.routes'));
app.use('/api/inflations' ,require('./routes/inflation.routes'));
app.use('/api/gracePeriods' ,require('./routes/gracePeriod.routes'));



//Start server

// app.listen(3000, () => {
    app.listen(app.get('port'), () => { 
    console.log('"Server on port', app.get('port'));
})