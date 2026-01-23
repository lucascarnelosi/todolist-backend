import app from "@/server"
import request from "supertest"

describe('Refresh token', () => {
  it('should refresh token using cookie', async () => {
    const login = await request(app)
      .post('/sessions')
      .send({
        email: 'lucas@test.com',
        password: '123456'
      })

    const cookies = login.headers['set-cookie']

    const response = await request(app)
      .post('/refresh')
      .set('Cookie', cookies)

    expect(response.status).toBe(200)
    expect(response.body.token).toBeTruthy()
  })
})