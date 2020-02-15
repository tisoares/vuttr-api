import { Request, Response } from 'express'

import User from '../models/User'
import ResponseError from '../../error/responseError'

class UserController {
  /**
   * Salva um novo usuário no banco de dados
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   * @memberof UserController
   */
  public async store (req: Request, res: Response): Promise<Response> {
    const { email } = req.body

    try {
      // consulta usuário pelo email
      const checkEmail = await User.findOne({ where: { email } })

      // Verifica se existe um usuário com o mesmo email
      if (checkEmail) {
        return res.json(ResponseError.getErrorResponse(req, res, 'duplicatedEmail'))
      }

      const user = await User.create(req.body)
      return res.status(201).json(user)
    } catch (e) {
      return res.json(ResponseError.getErrorResponse(req, res, 'requestFailed'))
    }
  }
}

export default new UserController()
