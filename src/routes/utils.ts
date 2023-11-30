import express from 'express';
const router = express.Router()
import { prisma } from '../lib/prisma';

router.get('/deleteall', async (request, response) => {
    // const userCreated = await prisma.user.create({data:{name:"John Doe",email:"jd@email.com",password:"senhafraca2"}})
    await prisma.phoneNumbers.deleteMany({})
    await prisma.user.deleteMany({})
    return response.send({
        message: "Deleted All"
    })
})
router.get('/users', async (request, response) => {
    const allUsers = await prisma.user.findMany({})
    response.send(allUsers)
})
export default router
