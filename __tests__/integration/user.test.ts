/* eslint-disable @typescript-eslint/no-explicit-any */
import req from 'supertest'
import bcrypt from 'bcryptjs'

import User from '../../src/app/models/User'

import Server from '../../src/server'
import truncate from '../util/truncate'
import factory from '../factorie'

describe('User', ():void => {
  const srv = new Server()

  beforeEach(async (): Promise<void> => {
    await truncate()
  })

  it('should be able to rediter user', async (): Promise<void> => {
    const usr: User = await factory.attrs('User')
    const response = await req(srv.app)
      .post('/users')
      .send(usr)

    expect(response.body).toHaveProperty('id')
  })

  it('should not be able to rediter user', async (): Promise<void> => {
    const usr: any = await factory.attrs('User', { name: undefined })
    const response = await req(srv.app)
      .post('/users')
      .send(usr)

    expect(response.status).toBe(400)
  })

  it('should not be able to rediter user without a password', async (): Promise<void> => {
    const usr: any = await factory.attrs('User', { password: undefined })
    const response = await req(srv.app)
      .post('/users')
      .send(usr)

    expect(response.status).toBe(400)
  })

  it('should encrypt user password when new user created', async (): Promise<void> => {
    const user: any = await factory.create('User', { password: '123465' })
    const compareHash = await bcrypt.compare('123465', user.passwordHash)
    expect(compareHash).toBe(true)
  })

  it('should not be able to register with duplicated email', async (): Promise<void> => {
    const usr: User = await factory.attrs('User')

    // save first
    await req(srv.app)
      .post('/users')
      .send(usr)
    // save second
    const response = await req(srv.app)
      .post('/users')
      .send(usr)

    expect(response.status).toBe(400)
  })

  // it('should be able to change user information', async (): Promise<void> => {
  //   const user: User = await factory.create('User')

  //   const response = await req(srv.app)
  //     .put(`/users/${user.id}`)
  //     .set('Authorization', 'Bearer abcd')
  //     .send({
  //       name: 'Tiago Soares',
  //       email: 'tisoares@outlook.com'
  //     })

  //   expect(response.status).toBe(200)
  // })
})
