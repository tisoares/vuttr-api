import User from '../../src/app/models/User'

import AuthenticationController from '../../src/app/controllers/AuthenticationController'

import factory from '../factorie'

export default async function mockAccessToken (): Promise<string> {
  const user: User = await factory.create('User')
  return AuthenticationController.generateAccessToken(user)
}
