import { prisma } from '../src/lib/prisma'
const userOne = {
    name: "User One",
    email: "user1@test.com",
    password: "passtest1",
    phoneNumbers: [
        { ddd: "10", number: "123456789" },
        { ddd: "11", number: "113456799" }]
}
const userTwo = {
    name: "User One",
    email: "user2@test.com",
    password: "passtest2",
    phoneNumbers: [
        { ddd: "12", number: "123456789" },
        { ddd: "13", number: "133456799" }]
}

async function main() {
    let count = await prisma.user.count({ where: { email: userOne.email } })
    if (count == 0) {

        await prisma.user.create({
            data: {
                name: userOne.name,
                email: userOne.email,
                password: userOne.password,
                phoneNumbers: { create: [...userOne.phoneNumbers] }

            }
        })
    }
    count = await prisma.user.count({ where: { email: userTwo.email } })
    if (count == 0) {
        await prisma.user.create({
            data: {
                name: userTwo.name,
                email: userTwo.email,
                password: userTwo.password,
                phoneNumbers: { create: [...userTwo.phoneNumbers] }

            }
        })
    }
}