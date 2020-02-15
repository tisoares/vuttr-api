import req from 'supertest'

import User from '../../src/app/models/User'
import Server from '../../src/server'
import truncate from '../util/truncate'
import factory from '../factorie'

describe('Authentication', ():void => {
  const srv = new Server()

  beforeEach(async (): Promise<void> => {
    await truncate()
  })

  it('should be able to authentication', async (): Promise<void> => {
    const user: User = await factory.create('User')

    const response = await req(srv.app)
      .post('/login')
      .send({
        email: user.email,
        password: user.password
      })

    expect(response.body).toHaveProperty('token')
  })

  it('should no be able to authentication, email inválid', async (): Promise<void> => {
    // const user: User = await factory.create('User')

    const response = await req(srv.app)
      .post('/login')
      .send({
        email: 'abc@abc.com',
        password: '123456'
      })

    expect(response.body.error).toBe('userNotFound')
  })

  it('should no be able to authentication, password inválid', async (): Promise<void> => {
    const user: User = await factory.create('User')

    const response = await req(srv.app)
      .post('/login')
      .send({
        email: user.email,
        password: `1${user.password}5`
      })

    expect(response.body.error).toBe('userInvalidPassword')
  })

  it('should no be able to authentication', async (): Promise<void> => {
    const response = await req(srv.app)
      .post('/login')
      .send({})

    expect(response.body.error).toBe('loginFailed')
  })
})
