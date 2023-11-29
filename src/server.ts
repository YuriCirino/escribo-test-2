import express from 'express';
import { prisma } from './lib/prisma';
import userRouter from './routes/user'
import bodyParser from 'body-parser';

const app = express()
app.use(bodyParser.json())
app.use(userRouter)

app.get('/', async (request, response) => {
    // const userCreated = await prisma.user.create({data:{name:"John Doe",email:"jd@email.com",password:"senhafraca2"}})
    const allUsers = await prisma.user.findMany()
    return response.send({message:"Hello World"
    ,allUsers})
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:' + 3000)
})