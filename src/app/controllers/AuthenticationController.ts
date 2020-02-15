/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcryptjs'
import { Response, Request } from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/User'

import ResponseError from '../../error/responseError'
import authConfig from '../../config/authConfig'

/**
 * Classe estatica para autorização
 *
 * @export
 * @class OperadorAuth
 */
export default class AuthenticationController {
  /**
   * Metodo para fazer login no sistema
   *
   * @async
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   * @memberof OperadorAuth
   */
  public static async login (req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body

    try {
      // consulta o usuário pelo email
      const ope = await User.findOne({ where: { email } })

      if (!ope) {
        return res.json(
          ResponseError.getErrorResponse(req, res, 'userNotFound')
        )
      }

      // valida a senha criptografada
      const passOk = await bcrypt.compare(password, ope.passwordHash)
      if (!passOk) {
        return res.json(
          ResponseError.getErrorResponse(req, res, 'userInvalidPassword')
        )
      }

      // gera o token de acesso
      const token = AuthenticationController.generateAccessToken(ope)

      // Retorno o objeto user e o token de acesso
      return res.json({
        user: ope,
        token
      })
    } catch (err) {
      return res.json(ResponseError.getErrorResponse(req, res, 'loginFailed'))
    }
  }

  /**
   * Gera o token de acesso com ds dados do Usuario
   *
   * @static
   * @param {User} user
   * @returns {string}
   * @memberof AuthenticationController
   */
  public static generateAccessToken (user: User): string {
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      authConfig.secret,
      { expiresIn: '1h' }
    )
  }
}
