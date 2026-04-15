import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

//Register

router.post('/register', async(req,res) =>{
    const {username,email,password} = req.body;
    try{
        const hashed = await bcrypt.hash(password,10);
        const user = await User.create({username,email,password:hashed});
        res.status(201).json({message:'User created'});
    }catch(err){
        res.status(400).json({message:'Email/Username already exists'});
        console.log(err);
    }
});


//Login

router.post('/login',async(req,res) => {
    const {email,password} = req.body;
     console.log("Login attempt:", email, password);
    try{
        const user = await User.findOne({email});
        console.log("User found:", user);
        if(!user) return res.status(400).json({message:'Invalid credentials'});

        const match = await bcrypt.compare(password,user.password);
        console.log("Password match:", match);
        if(!match) return res.status(400).json({message:'Invalid credentials'});

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.json({token,username:user.username});
    }catch(err){
        res.status(400).json({message:'Invalid credentials'});
        console.log(err);

    }
});

export default router;