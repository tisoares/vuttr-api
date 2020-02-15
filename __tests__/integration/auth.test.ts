import req from 'supertest'

import Server from '../../src/server'

import truncate from '../util/truncate'
import mockAccessToken from '../util/mockAccessToken'

describe('Authorization', ():void => {
  const srv = new Server()

  beforeEach(async (): Promise<void> => {
    await truncate()
  })

  it('should no be able continue, no token provided', async (): Promise<void> => {
    const response = await req(srv.app)
      .get('/')

    expect(response.body.error).toBe('noTokenProvided')
  })

  it('should no be able continue, token error', async (): Promise<void> => {
    const response = await req(srv.app)
      .get('/')
      .set('Authorization', 'Bearer')

    expect(response.body.error).toBe('tokenError')
  })

  it('should no be able continue, token mal formatted', async (): Promise<void> => {
    const response = await req(srv.app)
      .get('/')
      .set('Authorization', 'Beare abc')

    expect(response.body.error).toBe('tokenMalformatted')
  })

  it('should no be able continue, invalid token', async (): Promise<void> => {
    const response = await req(srv.app)
      .get('/')
      .set('Authorization', 'Bearer abcd')

    expect(response.body.error).toBe('tokenInvalid')
  })

  it('should be able continue', async (): Promise<void> => {
    const token = await mockAccessToken()
    const response = await req(srv.app)
      .get('/')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
  })
})
