import request from 'supertest'
import app from '@/server';

describe('Tasks', () => {
  it('should create task with auth', async () => {
    const login = await request(app)
      .post('/sessions')
      .send({
        email: 'lucas@test.com',
        password: '123456',
      });

    const token = login.body.token

    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New task' })

    expect(response.status).toBe(201)
  });
});