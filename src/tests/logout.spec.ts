import request from 'supertest'
import app from '@/server'

describe('Logout', () => {
  it('should revoke refresh token', async () => {
    const login = await request(app)
      .post('/sessions')
      .send({
        email: 'lucas@test.com',
        password: '123456'
      })

    const cookies = login.headers['set-cookies']

    const response = await request(app)
      .post('/logout')
      .set('Cookie', cookies)

    expect(response.status).toBe(204)

    const refresh = await request(app)
      .post('/refresh-token')
      .set('Cookie', cookies)

    expect(refresh.status).toBe(401)
  })
})