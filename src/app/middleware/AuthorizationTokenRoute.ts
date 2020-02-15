/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken'

import ResponseError from '../../error/responseError'
import authConfig from '../../config/authConfig'

export default class AuthorizationTokenRoute {
  public static midTokenAuth = (req: any, res: any, next: any): any => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.json(ResponseError.getErrorResponse(req, res, 'noTokenProvided'))
    }

    const parts = authHeader.split(' ')

    if (!(parts.length === 2)) {
      return res.json(ResponseError.getErrorResponse(req, res, 'tokenError'))
    }

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) {
      return res.json(ResponseError.getErrorResponse(req, res, 'tokenMalformatted'))
    }

    jwt.verify(token, authConfig.secret, (err: Error, decoded: any): void => {
      if (err) {
        return res.json(ResponseError.getErrorResponse(req, res, 'tokenInvalid'))
      }

      req.id = decoded.id
      req.name = decoded.name
      req.email = decoded.email
      return next()
    })
  }
}
