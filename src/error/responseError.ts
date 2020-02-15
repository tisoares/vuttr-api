/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { Errors } from './errors'

/**
 * Classe estática para retornar erros da api
 *
 * @export
 * @class ResponseError
 */
export default class ResponseError {
  /**
   * Retorna o objeto de erro formatado
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @param {string} errorIndex Erro gerado
   * @param {string} [errorDetail] detalhes do erro
   * @param {any[]} [errorList] lista de erros quando erros multiplos
   * @returns {Response}
   * @memberof ResponseError
   */
  public static getErrorResponse (_req: Request, res: Response, errorIndex: string,
    errorDetail?: string, errorList?: any[]): Response {
    let result: any = {}
    // pega lista de erros salvos
    const erros = Errors.getError()

    // verifiaca se o erro está na lista salva
    if (erros[errorIndex]) {
      result = {
        error: errorIndex,
        message: erros[errorIndex].message,
        statusCode: erros[errorIndex].statusCode
      }
    } else {
      // caso o erro não esteja salvo, vai retorna o objeto com o errorIndex
      result = {
        error: errorIndex,
        message: errorIndex,
        statusCode: 505
      }
    }
    // Inclui os detalhes
    if (errorDetail) {
      result = { ...result, errorDetail: errorDetail }
    }
    // Inclui os erros adcionais
    if (errorList) {
      result = { ...result, errorList: errorList }
    }
    // Define o código no retorno do Response
    res.statusCode = result.statusCode
    return result
  }
}
