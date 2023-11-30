import app from './app';
import userRouter from './routes/user'
import utilsRouter from './routes/utils'
import bodyParser from 'body-parser';
app.use(bodyParser.json())
app.use(userRouter)
app.use(utilsRouter)

app.listen(3000, () => {
    console.log('Server running on port: ' + 3000)
})