import express from 'express';
const router = express.Router()
import dotenv from 'dotenv'
dotenv.config()
import userController from '../controllers/userController'

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/user/:id',userController.getUserById)

export default router