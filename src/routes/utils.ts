import express from 'express';
const router = express.Router()
import { prisma } from '../lib/prisma';

router.get('/deleteall', async (request, response) => {
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

router.get('/',(request,response)=> {
    return response.send({mensagem:"Hello Escribo"})
})

export default router
