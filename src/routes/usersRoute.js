import express from 'express'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { UserModel } from '../models/User.js';

const router = express.Router()

router.post("/register",async (req, resp)=>{
    const {username, password} = req.body;

    const user = await UserModel.findOne({username});

    if(user){
        return resp.json({error:"User is already exist!"})
    }

    const hashedPassword = await bcrypt.hash(password,10) 

    const newUser = new UserModel({username, password: hashedPassword});
    await newUser.save()  // save will saved the data in database permentally

    resp.json({message: "user registered successfully"});
})

router.post("/login", async (req, resp)=>{
    const { username , password } = req.body

    const user = await UserModel.findOne({username})

    if(!user){
        return resp.json({message: "user Not exits!"})
    }
    // we cannot unhashed the hashed password
    // to cross check the password we are comparing the exits hashed password with
    // login password using bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return resp.json({message: "Password is incorrect"})
    }
    // if isPasswordValid is valid you are logged in 
    // No we are good to go for json webtoken
    const token = jwt.sign({id: user._id}, 'secret')
    resp.json({token, userId: user._id})
})



export  { router as userRouter };

export const verifyToken = (req, res, next) =>{
    const token = req.headers.authorization;
    if(token){
    jwt.verify(token, "secret", (error)=>{
        if(error) return res.sendStatus(403);
        next()
    })
    }else{
        res.sendStatus(401)
    }
}