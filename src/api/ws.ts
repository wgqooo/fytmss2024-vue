/**
 * setTimeout 类型
 */
type Timeout = ReturnType<typeof setTimeout>
/**
 * setInterval 类型
 */
type Interval = ReturnType<typeof setInterval>
/**
 * 允许null的泛型
 */
type Nullable<T> = T | null
/**
 * 默认url
 */
const baseURL = 'ws://test/api'
/**
 * 默认重连次数
 */
const reconnectMaxCount = 3
/**
 * 默认心跳信息
 */
const message = 'ping'
/**
 * 默认心跳间隔
 */
const interval = 3000
/**
 * 默认延时时间
 */
const timeout = 1000
/** 统计连接数？ */
//const onlineNumber = 0
type AutoReconnect = {
  /**
   *重连尝试次数 默认 3
   */
  reconnectMaxCount?: number
}
type Heartbeat = {
  /**
   * 心跳信息 默认`ping`
   */
  message: string
  /**
   * 心跳间隔时间 默认 `3000` 毫秒
   */
  interval: number
}
export interface IWSOptions {
  /**
   * 是否自动重连 默认`true`
   */
  autoReconnect: boolean | AutoReconnect
  /**
   * 心跳 默认 `false`
   */
  heartbeat: boolean | Heartbeat
  /**
   * url 携带的参数
   */
  query: Record<string, string>
}
class WS {
  url: string
  socket: WebSocket | null = null
  reconnectCount = 0
  delay: Nullable<Timeout> = null
  timer: Nullable<Interval> = null
  autoReconnect: IWSOptions['autoReconnect']
  heartbeat: IWSOptions['heartbeat']
  query: IWSOptions['query']
  constructor(url?: string, options?: IWSOptions) {
    const { autoReconnect = true, query = {}, heartbeat = false } = options || {}
    this.autoReconnect = autoReconnect
    this.heartbeat = heartbeat
    this.query = query
    // 处理url
    this.url = url
    // this.url =
    //   url ||
    //   baseURL +
    //     qs.stringify(
    //       { token: store.getters.token, ...this.query },
    //       { addQueryPrefix: true }
    //     )
    // 开启连接
    this.connect()
  }
  /**
   * 连接
   */
  connect(): void {
    this.close()
    this.socket = new WebSocket(this.url)
    this.onError()
    this.onOpen()
  }
  /**
   * 监听连接
   */
  onOpen(): void {
    if (this.socket) {
      this.socket.onopen = () => {
        console.log('websocket 启动新连接')
        // 开启心跳
        this.heartbeat && this.startHeartbeat()
      }
    }
  }
  /**
   * 开启心跳
   */
  startHeartbeat(): void {
    const msg = (this.heartbeat as Heartbeat)?.message || message
    const int = (this.heartbeat as Heartbeat)?.interval || interval
    this.timer = setInterval(() => {
      this.send(msg)
    }, int)
  }
  /**
   * 监听错误
   */
  onError(): void {
    if (this.socket) {
      this.socket.onerror = () => {
        const count = (this.autoReconnect as AutoReconnect)?.reconnectMaxCount || reconnectMaxCount
        if (this.autoReconnect && this.reconnectCount < count) {
          this.reconnectCount++
          this.connect()
        }
      }
    }
  }
  /**
   * 关闭连接
   */
  close(): void {
    this.socket && this.socket.close()
    this.delay && clearTimeout(this.delay)
    this.timer && clearInterval(this.timer)
    this.socket = null
    ws = null
    console.log('websocket 关闭上次连接')
  }
  /**
   *  监听消息
   * @param callback
   */
  onMessage(callback: (...data: any[]) => any): void {
    if (this.socket) {
      /*
      JSON.parse('12') 成功，因为 '12' 是合法的 JSON 格式，可以直接解析为数字。
      JSON.parse('timeout') 报错，因为 'timeout' 不是合法的 JSON 字符串格式，它应该是 `"timeout"` 才能正确解析。
      */
      this.socket.onmessage = (data) => {
        // try {
        //   const res = JSON.parse(data.data)
        //   callback(res)
        // } catch (err) {
        //   callback(data)
        // }
        return callback(data)
      }
    }
  }
  /**
   * 发送消息
   * @param data
   */
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    if (!this.socket) return
    // 状态为 `1-开启状态` 直接发送
    if (this.socket.readyState === this.socket.OPEN) {
      this.socket.send(JSON.stringify({ data: data }))
      // 状态为 `0-开启状态` 则延后调用
    } else if (this.socket.readyState === this.socket.CONNECTING) {
      this.delay = setTimeout(() => {
        this.socket?.send(JSON.stringify({ data: data }))
      }, timeout)
      // 状态为 `2-关闭中 3-关闭状态` 则重新连接
    } else {
      this.connect()
      this.delay = setTimeout(() => {
        this.socket?.send(JSON.stringify({ data: data }))
      }, timeout)
    }
  }

  // getOnlineNumber():void{

  // }
}
let ws: WS | null = null
//const ws = new WS('ws://localhost:9091/api/webSocket/' + sessionStorage.getItem('sessionId'))
export default function getWebSocket(sessionId): WS {
  if (!ws) {
    ws = new WS('ws://localhost:9091/api/webSocket/' + sessionId)
  }
  return ws
}
