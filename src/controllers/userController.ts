import { Request, Response } from "express";
import z from 'zod'
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const SECRET = process.env.SECRET as string

interface IPayload {
    id: string
    nome: string
}

async function signUp(req: Request, res: Response) {

    const phoneNumberSchema = z.object({
        number: z.coerce.string().length(9),
        ddd: z.coerce.string().length(2)
    })
    const userSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        phoneNumbers: z.array(phoneNumberSchema)
    })
    const bodyParams = {
        name: req.body.nome,
        password: req.body.senha,
        email: req.body.email,
        phoneNumbers: req.body.telefones.map(
            (phone: { numero: string, ddd: string }) => ({ number: phone.numero, ddd: phone.ddd, })
        )

    }

    try {
        const bodyParsed = userSchema.parse(bodyParams)
        const userAlreadyExists = await prisma.user.findUnique(
            { where: { email: bodyParsed.email } }
        )

        if (userAlreadyExists !== null) {
            return res.status(409).send({ "mensagem": "E-mail já existente" })
        } else {
            bcrypt.genSalt(12, async (error, salt) => {
                bcrypt.hash(bodyParsed.password, salt,
                    async (error, hashedPassword) => {
                        const userCreated = await prisma.user.create({
                            data:
                            {
                                name: bodyParsed.name,
                                email: bodyParsed.email,
                                password: hashedPassword,
                                phoneNumbers: {
                                    create:
                                        [...bodyParsed.phoneNumbers]
                                }


                            }
                        })
                        const payload: IPayload = { id: userCreated.id, nome: userCreated.name }
                        const token = jwt.sign(payload, SECRET, { expiresIn: "30m" })
                        return res.send({
                            id: userCreated.id,
                            data_criacao: userCreated.createdAt,
                            data_atualização: userCreated.updatedAt,
                            ultimo_login: userCreated.lastLogin,
                            token
                        })
                    })
            })
        }
    } catch (error) {
        return res.status(400).send({ mensagem: "Parâmetros inválidos" })
    }
}

async function signIn(req: Request, res: Response) {

    const signInBodySchema = z.object({ email: z.string().email(), password: z.string() })

    const bodyParams = { email: req.body.email, password: req.body.senha }

    
    try {
        const { email, password } = signInBodySchema.parse(bodyParams)
        const user = await prisma.user.findUnique({ where: { email } })

        if (user == null) { return res.status(404).send({ mensagem: "Usuário e/ou senha inválidos" }) }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) return res.status(401).send({ mensagem: "Usuário e/ou senha inválidos" })

        else {
            const payload: IPayload = { id: user.id, nome: user.name }
            const token = jwt.sign(payload, SECRET, { expiresIn: "30m" })
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    lastLogin: new Date(),
                },
            })
            const data = {
                id: user.id,
                data_criacao: user.createdAt,
                data_atualização: user.updatedAt,
                ultimo_login: user.lastLogin,
                token
            }

            return res.send(data)
        }

    } catch (error) {
        return res.status(401).send({mensagem:"Parâmetros inválidos"})
    }
}

async function getUserById(req: Request, res: Response) {
    const id = req.params.id
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader == 'undefined') {
        return res.status(401).send({ "mensagem": "Não autorizado" })
    }
    const bearerToken = bearerHeader?.split(' ')[1]
    jwt.verify(bearerToken, SECRET, async (error) => {
        if (error) {
            if (error.name == 'TokenExpiredError') return res.status(401).send({ "mensagem": "Sessão Inválida" })
            if (error.name == 'JsonWebTokenError') return res.status(401).send({ "mensagem": "Não autorizado" })
            else return res.status(401).send({ "mensagem": "Não autorizado" })
        } else {
            const user = await prisma.user.findUnique({ where: { id }, include: { phoneNumbers: true } })
            
            if (user == null) return res.status(401).send({ "mensagem": "Sessão Inválida" })
            else return res.send({
                nome: user!.name, email: user!.email,
                data_criacao: user!.createdAt,
                data_atualizacao: user!.updatedAt,
                ultimo_login: user!.lastLogin,
                telefones: user?.phoneNumbers.map(phone => ({ "numero": phone.number, "ddd": phone.ddd }))
            })
        }
    })

}

export default { signUp, signIn, getUserById }