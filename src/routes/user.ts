import express from 'express';
const router = express.Router()
import z from 'zod'
import { prisma } from '../lib/prisma';

router.post('/signup', async (req, res) => {
    const phoneNumberSchema = z.object({ numero: z.coerce.string().length(9), ddd: z.coerce.string().length(2) })
    const userSchema = z.object({ nome: z.string(), email: z.string().email(), telefones: z.array(phoneNumberSchema) })
    const bodyParsed = userSchema.parse(req.body)
    let userAlreadyExists = await prisma.user.findUnique(
        {
            where: { email: bodyParsed.email}
        }
    )
    if(userAlreadyExists!==null){
        res.status(409).send({"mensagem":"E-mail já existente"})
    }else{

        res.send(bodyParsed)
    }
})
router.get('/signin', (req, res) => {
    res.send()
})
router.get('user/:id', (req, res) => {
    res.send()
})
export default router