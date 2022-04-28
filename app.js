const express  = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// The dotenv.config() function from the dotenv npm package will read the .env file, assign the variables to process.env, and 
// return an object (named parsed) containing the content. it will also throw an error if it failed.
dotenv.config();

//importing api routes
const api_routes = require('./routes/api');


const app = express();

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended:false }));

// Url to mongo db atlas
const url = process.env.Mongo_Url;

//Connecting to Database
mongoose.connect(url).then( () => {
    console.log('Connected to Databse');
}).catch( (err) => {
    console.log(`Error in connecting  database ${err} `);
});

app.use('/api/books',api_routes);

//importing user context
const User = require("./models/users");

//Register
app.post("/register" ,async (req,res) => {
    try{
        const {firstName, lastName, email, password } = req.body;

        if ( !(email && password && firstName && lastName)){
            res.status(400).json({msg:"All input are required"});
        }

        const oldUser = await User.findOne({email});

        if(oldUser){
            return res.status(400).json({msg:"User Already Exist. Please Login"});
        }

        encryptedUserPasswd = await bcrypt.hash(password,10);

        const user = await User.create({
            first_name:firstName,
            last_name:lastName,
            email:email.toLowerCase(),
            password:encryptedUserPasswd,
        });

        // Create jwt token
        const token = jwt.sign(
            {user_id:user._id,email},
            process.env.TOKEN_KEY,
            {
                expiresIn : "5h",
            }
        );

        user.token = token;

        res.status(201).json(user);
    }catch(err){
        console.log(err);
    }
});

//Login
app.post("/login", async (req,res) => {

        const {email,password} = req.body;

        if(!(email && password)){
            res.status(400).json({msg:"All input are required"})
        }

        const user = await User.findOne({email});

        if(user && (await bcrypt.compare(password,user.password))){
            const token = jwt.sign(
                {user_id : user._id,email},
                process.env.TOKEN_KEY,
                {
                    expiresIn:"5h",
                }
            );

            user.token = token;

            return res.status(200).json(user);
        }

        return res.status(400).json({msg:"Invalid Credentials"});

    }
)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));