/* eslint-disable @typescript-eslint/no-explicit-any */
import req from 'supertest'
import bcrypt from 'bcryptjs'

import User from '../../src/app/models/User'

import Server from '../../src/server'
import truncate from '../util/truncate'
import mockAccessToken from '../util/mockAccessToken'
import factory from '../factorie'

describe('User', ():void => {
  const srv = new Server()

  beforeEach(async (): Promise<void> => {
    await truncate()
  })

  // #region Store User tests
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
    expect(response.body.error).toBe('requestFailed')
  })

  it('should not be able to rediter user without a password', async (): Promise<void> => {
    const usr: any = await factory.attrs('User', { password: undefined })
    const response = await req(srv.app)
      .post('/users')
      .send(usr)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('requestFailed')
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
    expect(response.body.error).toBe('duplicatedEmail')
  })
  // #endregion

  // #region Udtade User tests
  it('should be able to change all user information', async (): Promise<void> => {
    const token = await mockAccessToken()
    const user: User = await factory.create('User')

    const response = await req(srv.app)
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Tiago Soares',
        email: 'tisoares@outlook.com'
      })

    expect(response.status).toBe(200)
  })

  it('should be able to change user information', async (): Promise<void> => {
    const token = await mockAccessToken()
    const user: User = await factory.create('User')

    const response = await req(srv.app)
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Tiago Soares'
      })

    expect(response.status).toBe(200)
  })

  it('should no be able to change user information, duplicated email', async (): Promise<void> => {
    const token = await mockAccessToken()
    const defaultEmail = 'tisoares@outlook.com'

    const user: User = await factory.create('User')
    const user2: any = await factory.create('User', { email: defaultEmail })

    const response = await req(srv.app)
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Tiago Soares',
        email: user2.email
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('duplicatedEmail')
  })

  it('should no be able to change user information', async (): Promise<void> => {
    const token = await mockAccessToken()
    const response = await req(srv.app)
      .put(`/users/${'A'}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Tiago Soares',
        email: 'tisoares@outlook.com'
      })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('requestFailed')
  })
  // #endregion

  // #region Delete User tests
  it('should be able to delete user', async (): Promise<void> => {
    const token = await mockAccessToken()
    const user: User = await factory.create('User')
    const response = await req(srv.app)
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })

  it('should no be able to delete user', async (): Promise<void> => {
    const token = await mockAccessToken()
    const response = await req(srv.app)
      .delete(`/users/A`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('requestFailed')
  })
  // #endregion

  // #region Show One User tests
  it('should be able to get a user', async (): Promise<void> => {
    const token = await mockAccessToken()
    const user: User = await factory.create('User')
    const response = await req(srv.app)
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
  })

  it('should no be able to get a user', async (): Promise<void> => {
    const token = await mockAccessToken()
    const response = await req(srv.app)
      .get(`/users/A`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('requestFailed')
  })
  // #endregion

  // #region Show User tests
  it('should be able to get user by name', async (): Promise<void> => {
    const token = await mockAccessToken()
    for (let i = 0; i < 4; i++) {
      await factory.create('User')
    }
    const { name } = await factory.create('User', { name: 'Tiago Soares' })
    const response = await req(srv.app)
      .get(`/users`)
      .set('Authorization', `Bearer ${token}`)
      .query({ name })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.arrayContaining([ expect.objectContaining({ name: 'Tiago Soares' }) ]))
  })

  it('should be able to get user by email', async (): Promise<void> => {
    const token = await mockAccessToken()
    for (let i = 0; i < 4; i++) {
      await factory.create('User')
    }
    const { email } = await factory.create('User', { email: 'tisoares@outlook.com' })
    const response = await req(srv.app)
      .get(`/users`)
      .set('Authorization', `Bearer ${token}`)
      .query({ email })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.arrayContaining([ expect.objectContaining({ email: 'tisoares@outlook.com' }) ]))
  })

  it('should be able to get user', async (): Promise<void> => {
    const token = await mockAccessToken()
    for (let i = 0; i < 4; i++) {
      await factory.create('User')
    }
    const response = await req(srv.app)
      .get(`/users`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
  })

  it('must be able to get no user', async (): Promise<void> => {
    const token = await mockAccessToken()
    for (let i = 0; i < 4; i++) {
      await factory.create('User')
    }
    // const { name } = await factory.create('User', { name: 'Tiago Soares' })
    const response = await req(srv.app)
      .get(`/users`)
      .set('Authorization', `Bearer ${token}`)
      .query({ name: 'alaasa' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.arrayContaining([]))
  })
  // #endregion
})
