var express = require('express');
var createError=require('http-errors');
const mongoose= require('mongoose');


var app=express();
const port=3000;
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const uri = 'mongodb://localhost:27017'

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const router=require('./routes/index');

app.use('/', router);
app.use(function (req,res,next){
    next(createError(404));
})

app.listen(port,
    console.log( 'App listening on port ${port}')
);