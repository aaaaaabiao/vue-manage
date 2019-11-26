/* eslint-disable no-unused-vars */

// 引入mockjs
import Mock from 'mockjs'
// import util from './util'
// 获取 mock.Random 对象
import userJson from './data/user.json'
import adminListJson from './data/adminList.json'
const Random = Mock.Random
const result = {
  data: {},
  resultCode: 1,
  resultMessage: 'success'
}
const userData = () => {
//   // json文件数据
//   const data = {
//     totalCount: length,
//     currentPage: 1,
//     data: userJson
//   }

  // 随机数据
  const length = Random.integer(1, 20)
  const data = {
    totalCount: length,
    currentPage: 1,
    data: []
  }
  for (let i = 0; i < length; i++) {
    data.data[i] = {
      id: Random.id(),
      name: Random.cname(),
      createdTime: '2019-6-6',
      email: `736813089@qq.com`
    }
  }
  result.data = data
  return result
}

const adminData = () => {
//   // json文件数据
//   const data = {
//     totalCount: length,
//     currentPage: 1,
//     data: adminListJson
//   }
  const length = Random.integer(1, 20)
  const data = {
    totalCount: length,
    currentPage: 1,
    data: []
  }
  for (let i = 0; i < length; i++) {
    data.data[i] = {
      id: Random.id(),
      name: Random.cname(),
      role: '课程负责人',
      courseType: '操作系统',
      createdTime: '2019-9-10'
    }
  }
  result.data = data
  return result
}

Mock.mock('/apiReplace/userData', 'post', userData)
Mock.mock('/apiReplace/adminData', 'post', adminData)
