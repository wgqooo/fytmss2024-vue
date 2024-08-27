// @ts-nocheck
export default class Socket {
  constructor(url, protocols) {
    this.url = url
    this.protocols = protocols
    this.ws = null
    this.reconnectTimeout = 1000
    this.maxReconnectTimes = 5
  }

  connect() {
    this.ws = new WebSocket(this.url, this.protocols)
    this.ws.onopen = () => {
      console.log('WebSocket连接成功')
      this.reconnectTimes = 0
    }
    this.ws.onclose = () => {
      console.log('WebSocket断开连接')
      this.reconnect()
    }
    this.ws.onerror = (err) => {
      console.log('WebSocket连接出错', err)
    }
  }

  reconnect() {
    if (this.reconnectTimes < this.maxReconnectTimes) {
      setTimeout(() => {
        this.connect()
        this.reconnectTimes++
      }, this.reconnectTimeout)
      this.reconnectTimeout *= 2
    } else {
      console.log('WebSocket重连超过最大次数,放弃重连')
    }
  }

  // 消息发送
  msg(param) {
    if (param === 'heartbeat') {
      this.ws.send(param)
    } else {
      this.ws.send(JSON.stringify(param))
    }
  }

  // 延迟发送
  timeout(param) {
    setTimeout(() => {
      this.msg(param)
    }, 2000)
  }

  send(param) {
    if (this.ws.readyState === this.ws.OPEN) {
      this.msg(param)
    } else if (this.ws.readyState === this.ws.CONNECTING) {
      this.timeout(param)
    } else {
      this.timeout(param)
    }
  }
}
