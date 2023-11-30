import express from 'express';
import { prisma } from './lib/prisma';
import userRouter from './routes/user'
import bodyParser from 'body-parser';
import formatDate from './utils'

const app = express()
app.use(bodyParser.json())
app.use(userRouter)
console.log(formatDate(new Date()))

app.get('/deleteall', async (request, response) => {
    // const userCreated = await prisma.user.create({data:{name:"John Doe",email:"jd@email.com",password:"senhafraca2"}})
    await prisma.phoneNumbers.deleteMany({})
    await prisma.user.deleteMany({})
    return response.send({
        message: "Deleted All"
    })
})
app.get('/users', async (request, response) => {
    const allUsers = await prisma.user.findMany({})
    response.send(allUsers)
})


app.listen(3000, () => {
    console.log('Server running on http://localhost:' + 3000)
})