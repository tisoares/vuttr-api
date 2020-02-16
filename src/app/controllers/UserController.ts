import { Request, Response } from 'express'
import { Sequelize } from 'sequelize'

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

  /**
   * Altera as informções do usuário
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   * @memberof UserController
   */
  public async update (req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body

      const user = await User.findByPk(req.params.id)

      if (!user) {
        throw new Error('User not found')
      }

      if (email && email !== user.email) {
        // consulta usuário pelo email
        const checkEmail = await User.findOne({ where: { email } })

        // Verifica se existe um usuário com o mesmo email
        if (checkEmail) {
          return res.json(ResponseError.getErrorResponse(req, res, 'duplicatedEmail'))
        }
      }

      const userUp = await user.update(req.body)

      return res.json(userUp)
    } catch (e) {
      return res.json(ResponseError.getErrorResponse(req, res, 'requestFailed'))
    }
  }

  /**
   * Deleta usuário do banco de dados
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   * @memberof UserController
   */
  public async destroy (req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findByPk(req.params.id)

      if (!user) {
        throw new Error('User not found')
      }

      await user.destroy()

      return res.json({ success: true })
    } catch (e) {
      return res.json(ResponseError.getErrorResponse(req, res, 'requestFailed'))
    }
  }

  public async indexOne (req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findByPk(req.params.id)

      if (!user) {
        throw new Error('User not found')
      }

      return res.json(user)
    } catch (e) {
      return res.json(ResponseError.getErrorResponse(req, res, 'requestFailed'))
    }
  }

  public async indexAll (req: Request, res: Response): Promise<Response> {
    const { name, email } = req.query
    // try {
    const users = await User.findAll({
      where: Sequelize.or(
        { name: name || '' },
        { email: email || '' }
      )
    })

    return res.json(users)
    // } catch (e) {
    //   return res.json(ResponseError.getErrorResponse(req, res, 'requestFailed'))
    // }
  }
}

export default new UserController()
