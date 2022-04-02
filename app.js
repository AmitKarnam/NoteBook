const express  = require('express');
const mongoose = require('mongoose');

const api_routes = require('./routes/api');
const general_routes = require('./routes/general');

const app = express();

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended:false }));

// Url to mongo db atlas
const url = 'mongodb+srv://AmitKarnam:OyuJo9QRqNEnRGN6@cluster0.rb1uc.mongodb.net/NoteBookDatabase?retryWrites=true&w=majority';

//Connecting to Database
mongoose.connect(url).then( () => {
    console.log('Connected to Databse');
}).catch( (err) => {
    console.log(`Error in connecting  database ${err} `);
});

app.use('/api/books',api_routes);
app.use('',general_routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));