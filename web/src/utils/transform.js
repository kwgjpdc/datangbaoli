/**
 * id名称转换工具类
 **/
import { listInfo } from "@/api/customer/index"

// 客户id转换获取客户名称
export function getCusName (id) {
  return new Promise((resolve, reject) => {
    listInfo({ customerId: id }).then(res => {
      resolve(res.rows)
    }).catch(err => {
      reject(err.data)
    })
  })
} 