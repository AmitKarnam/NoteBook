const express    = require('express');
const { json } = require('express/lib/response');
const uuid = require('uuid');
const api_router = express.Router();

const books    = require('../models/books');

// API end point to GET all books data from database and provide it in a json response format
api_router.get('/',async(req,res) => {
    const records = await books.find({});
    res.send(records);
});

//API end point to GET a particular record from database and provide it in a json response format
api_router.get('/:id',async(req,res) => {
    const record = await books.findById(req.params.id);
    //console.log(typeof(record))
    res.send(record);
});

//API end point to POST a particular record 
api_router.post('/' , function (req,res,next)  {
    const newBook = new books( {
        book_title : req.body.book_title,
        author : req.body.author,
        genre : req.body.genre,
        notes : req.body.notes
    });

    if(!newBook.book_title || !newBook.author){
       return res.status(400).json({msg : "Please include a book title and author"});
    }

    newBook.save(function (err, post) {
        if (err) { return next(err) }
        res.status(201).json(newBook)
      })
    
   
});

module.exports = api_router;


