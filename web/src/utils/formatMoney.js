/**
 * 格式化金额
 * @param money {String / Number} 金额
 * @param decimals {Number} 小数位数，默认为两位数
 * @returns {String / 0.00}
 */
export const formatMoney = (money, decimals) => {
  let decimalNum = decimals ? decimals : 2
  if (typeof money === 'number') {
    money = money.toString()
  }
  if (money === '-' || !money) return '0.00'
  const moneyArr = money.split('.')
  if (!moneyArr[1] || moneyArr[1].length < decimalNum) {
    let moneyDecimal = moneyArr[1] ? moneyArr[1] : ''
    moneyArr[1] = moneyDecimal.padEnd(decimalNum, '0')
  } else {
    moneyArr[1] = moneyArr[1].substring(0, decimalNum)
  }
  money = moneyArr.join('.')
  const isNegativeNum = money.startsWith('-')
  const pointPosition = money.indexOf('.')
  const decimal = pointPosition !== -1 ? money.substring(pointPosition) : ''
  const integer = Math.abs(parseInt(money).toString()).toString()
  const integerArrReverse = integer.split('').reverse().join('')
  const moneyStringify = `${isNegativeNum ? '-':''}${integerArrReverse.replace(/(\d{3})(?=\d)/g, '$1,').split('').reverse().join('')}${decimal}`
  return moneyStringify
}

/**
 * 百分值格式转换
 * @param val {String / Number} 数值
 * @returns {String / 0.00}
 */
export const formatPercent = (val) => {
  if (typeof val === 'number') {
    val = val.toString()
  }
  if (val === '-' || !val) return '0.00'
  const valArr = val.split('.')
  if (!valArr[1]) {
    let valDecimal = valArr[1] ? valArr[1] : ''
    valArr[1] = valDecimal.padEnd(2, '0')
  }
  val = valArr.join('.')
  let percentVal = val + ' %'
  return percentVal
}