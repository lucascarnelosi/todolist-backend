import request from 'supertest'
import app from '../server'
import bcrypt from 'bcrypt'
import { prisma } from '@/prisma'

describe('Session', () => {
  it('should authenticate user', async () => {
    const password = await bcrypt.hash('123456', 8)

    await prisma.user.create({
      data: {
        name: 'Lucas',
        email: 'lucas@test.com',
        password
      }
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'lucas@test.com',
        password: '123456'
      })

    expect(response.status).toBe(200)
    expect(response.body.token).toBeTruthy()
    expect(response.headers['set-cookie']).toBeDefined()
  })
})