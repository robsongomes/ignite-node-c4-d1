import request from 'supertest'
import { app } from '../../../../app'

describe("Create User Controller", async () => {

    it("Deve conseguir fazer um post e criar um usuário", async () => {
        const response = await request(app).post("/users")
            .send({
                name: "User Name",
                password: "123456",
                email: "user@email.com"
            })
        expect(response.status).toBe(201)
    })
})