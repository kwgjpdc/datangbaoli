/**
 * 判断url是否是http或https 
 * @param {string} path
 * @returns {Boolean}
 */
 export function isHttp(url) {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}

/**
 * 判断path是否为外链
 * @param {string} path
 * @returns {Boolean}
 */
 export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @param {String} idcard
 * @returns {Boolean}
 */
export function validIdCard(idcard) {
  const reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[X])$)$/;
  return reg.test(idcard)
}

/**
 * @param {String} idcard
 * @returns {Boolean}
 */
export function validMoney(money) {
  const reg =  /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/;
  return reg.test(money)
}

/** 通过身份证号获取性别
 * @param {String} idcard
 * @returns {string}
 */
export function getIDSex(idcard) {
  let sex = ""
  if (validIdCard(idcard)) {
    const idLen = idcard.length
    if (idLen === 18) {
      sex = idcard.substring(16, 17)
    } else if (idLen === 15) {
      sex = idcard.substring(13, 14)
    }
    if (sex%2 === 0) {
      sex = "0"
    } else {
      sex = "1"
    }
  }
  return sex
}

/** 通过身份证号获取出生日期以及年龄
 * @param {String} idcard
 * @returns {string}
 */
export function getIDBirth(idcard) {
  let result = { age: "", birth: ""}
  if (validIdCard(idcard)) {
    const idLen = idcard.length
    const nowDate = new Date(), nowMonth = nowDate.getMonth() + 1, nowDay = nowDate.getDate()
    let birthY = "", birthM = "", birthD = ""
    if (idLen === 18) {
      result.age = nowDate.getFullYear() - idcard.substring(6, 10) -1
      birthY = idcard.substring(6, 10)
      birthM = idcard.substring(10, 12)
      birthD = idcard.substring(12, 14)
    } else if (idLen === 15) {
      result.age = nowDate.getFullYear() - idcard.substring(6, 8) - 1901
      birthY = "19" + idcard.substring(6, 8)
      birthM = idcard.substring(8, 10)
      birthD = idcard.substring(10, 12)
    }
    result.birth = birthY + "-" + birthM + "-" + birthD
    if (birthM < nowMonth || (birthM == nowMonth && birthD <= nowDay)) 
    result.age ++
  }
  return result
}