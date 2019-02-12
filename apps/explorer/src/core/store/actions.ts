import { Events, SocketRooms, SocketEvent } from 'ethvm-common'
import { Block, PendingTx } from '@app/core/models'

const socket_socketNewblock = function({ commit }, raw: SocketEvent | SocketEvent[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    commit(Events.NEW_BLOCK, ev.value)
    this._vm.$eventHub.$emit(Events.NEW_BLOCK, new Block(ev.value))
  })
}

const socket_socketNewptx = function({ commit }, raw: SocketEvent | SocketEvent[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    commit(Events.NEW_PENDING_TX, ev.value)
    this._vm.$eventHub.$emit(Events.NEW_PENDING_TX, new PendingTx(ev.value))
  })
}

const socket_socketNewblockmetrics = function({ commit }, raw: SocketEvent | SocketEvent[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    commit(Events.NEW_BLOCK_METRIC, ev.value)
    this._vm.$eventHub.$emit(Events.NEW_BLOCK_METRIC, ev.value)
  })
}

// eslint-disable-next-line
const socket_socketConnect = function({}) {
  this._vm.$socket.emit(Events.join, { rooms: SocketRooms.DefaultRooms })
}

export default {
  socket_socketNewblock,
  socket_socketNewptx,
  socket_socketNewblockmetrics,
  socket_socketConnect
}
