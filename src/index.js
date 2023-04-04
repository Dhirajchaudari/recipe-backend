import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
const port = 3001
import { userRouter } from './routes/usersRoute.js';
import { recipesRouter } from './routes/recipes.js';

const app = express()
const url = `mongodb+srv://Dhiraj:Dhiraj123@recipes.4goev3v.mongodb.net/recipes?retryWrites=true&w=majority`;
// mongoose.set('strictQuery', true)
mongoose.connect(url).then(()=>{
    console.log("mongoose connections successfull")
}).catch((err)=>{
    console.log(err)
})

app.use(cors());         // do study on it --------------------
app.use(express.json())  // when we send data from client to server it sends in the form of json 
app.use("/auth", userRouter) // inside /auth we are posting the login and register
app.use("/recipes", recipesRouter)

app.listen(port , ()=>{console.log(`App is running on port ${port}`)})