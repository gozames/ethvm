import { removePrefix } from '@app/server/core/utils'
import { genericPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, TokenExchangeRate } from 'ethvm-common'

const getTokenExchangeRatesByAddress: SocketEvent = {
  id: Events.getTokenExchangeRateByAddress,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = genericPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<TokenExchangeRate | null> =>
    server.exchangesService.getTokenExchangeRateByAddress(removePrefix(payload.address))
}

export default getTokenExchangeRatesByAddress
