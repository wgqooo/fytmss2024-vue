export function formatISO(isoDateString) {
  // 创建一个 Date 对象
  const date = new Date(isoDateString)
  // 使用 Date 对象的方法获取所需的日期部分
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1，并且保证两位数
  const day = String(date.getDate()).padStart(2, '0') // 保证两位数的日期
  // 拼接日期字符串
  const formattedDate = `${year}-${month}-${day}`
  return formattedDate
}

export function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // 加1是因为月份从0开始，padStart用来补0
  const day = String(now.getDate()).padStart(2, '0') // 获取日期并补0
  return `${year}-${month}-${day}`
}

export function getCurrentTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0') // 获取小时并补0
  const minutes = String(now.getMinutes()).padStart(2, '0') // 获取分钟并补0
  const seconds = String(now.getSeconds()).padStart(2, '0') // 获取秒钟并补0
  return `${hours}:${minutes}:${seconds}`
}

export function getCurrentDateTimeString() {
  const now = new Date()
  // 获取年、月、日、时、分、秒
  const year = now.getFullYear()
  const month = ('0' + (now.getMonth() + 1)).slice(-2) // 月份从0开始，需要加1并确保两位数格式
  const day = ('0' + now.getDate()).slice(-2) // 获取日并确保两位数格式
  const hours = ('0' + now.getHours()).slice(-2) // 获取小时并确保两位数格式
  const minutes = ('0' + now.getMinutes()).slice(-2) // 获取分钟并确保两位数格式
  const seconds = ('0' + now.getSeconds()).slice(-2) // 获取秒钟并确保两位数格式
  // 组合成所需的字符串格式
  const result = `${year}${month}${day}${hours}${minutes}${seconds}`
  return result
}
