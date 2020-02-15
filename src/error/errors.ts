/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Classe estatica com os erros do sistema já com as mensagens tratadas
 *
 * @export
 * @class Errors
 */
export class Errors {
  /**
   * Metodo que retorna todos os erros do sistema
   *
   * @static
   * @returns {*}
   * @memberof Errors
   */
  public static getError (): any {
    return {
      invalidRequest: {
        statusCode: 404,
        message: 'Requisição inválida.'
      },
      requestFailed: {
        statusCode: 400,
        message: 'Falha na requisição.'
      },
      duplicateParameters: {
        statusCode: 400,
        message: 'Parametros duplicados.'
      },
      fieldsErrors: {
        statusCode: 400,
        message: 'Campos inválidos.'
      },
      updateFailed: {
        statusCode: 400,
        message: 'Falha ao alterar registro.'
      },
      deleteFailed: {
        statusCode: 400,
        message: 'Falha ao excluir registro.'
      },
      userNotFound: {
        statusCode: 400,
        message: 'Usuário inválido.'
      },
      userInactive: {
        statusCode: 400,
        message: 'Usuário inativo.'
      },
      userInvalidPassword: {
        statusCode: 400,
        message: 'Senha inválida.'
      },
      loginFailed: {
        statusCode: 400,
        message: 'Falha ao fazer login.'
      },
      noTokenProvided: {
        statusCode: 400,
        message: 'Nenhum token fornecido.'
      },
      tokenError: {
        statusCode: 400,
        message: 'Token errado.'
      },
      tokenMalFormatted: {
        statusCode: 400,
        message: 'Token mal formatado.'
      },
      tokenInvalid: {
        statusCode: 400,
        message: 'Token inválido.'
      },
      userTypeInvalid: {
        statusCode: 400,
        message: 'Tipo de operador inválido.'
      },
      accessDenied: {
        statusCode: 400,
        message: 'Acesso Negado.'
      },
      invalidValues: {
        statusCode: 400,
        message: 'Valores inválidos.'
      },
      invalidSalesType: {
        statusCode: 400,
        message: 'Tipo de venda inválido.'
      },
      invalidPark: {
        statusCode: 400,
        message: 'Park não cadastrado.'
      },
      duplicatedEmail: {
        statusCode: 400,
        message: 'Email duplicado'
      }
    }
  }
}
