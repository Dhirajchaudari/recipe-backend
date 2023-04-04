import express from 'express';
import { RecipesModel } from '../models/Recipes.js';
import { UserModel } from '../models/User.js';
import { verifyToken } from './usersRoute.js';

const router = express.Router();

router.get("/", async (req, resp)=>{
    try{
        const response = await RecipesModel.find({});
        resp.json(response)
    }catch(err){
        resp.json(err)
    }
}) 

router.post("/", verifyToken, async (req, resp)=>{
    const recipe = new RecipesModel(req.body)
    try{
        const response = await recipe.save()
        resp.json(response)
    }catch(err){
        resp.json(err)
    }
})

router.put("/", verifyToken, async (req, resp)=>{
    try{
        const recipe = await RecipesModel.findById(req.body.recipeId)
        const user = await UserModel.findById(req.body.userId)
        user.savedRecipes.push(recipe)
        await user.save()
        resp.json({savedRecipes: user.savedRecipes})
    }catch(err){
        resp.json(err)
    }
})

router.get("/savedRecipes/ids/:userId", async(req, resp)=>{
    try {
        const user = await UserModel.findById(req.params.userId)  
        resp.json({savedRecipes: user?.savedRecipes})
    } catch (error) {
        resp.json(error)
    }
})

router.get("/savedRecipes/:userId", async(req, resp)=>{
    try {
        const user = await UserModel.findById(req.params.userId)  
        const savedRecipes = await RecipesModel.find({
            _id: {$in: user.savedRecipes}
        })
        resp.json({ savedRecipes })
    } catch (error) {
        resp.json(error)
    }
})




export {router as recipesRouter}


