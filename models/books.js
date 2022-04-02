const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    book_title:{
        type:String,
        required:true
    },

    author:{
        type:String,
        required:true
    },

    genre:{
        type:String,
        required:false
    },

    notes:[{
        type:String,
        required:false
    }]


});

const Book = module.exports = mongoose.model('BookSchema',bookSchema);