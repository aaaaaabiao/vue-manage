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
  status: 1,
  message: 'success'
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

const deleteUser = () => {
  result.data = {}
  return result
}

const selectAdminByID = () => {
  result.data = {
    userId: '123',
    username: '小明',
    password: '123456',
    role: 3,
    courseId: 1
  }
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

const addAdmin = data => {
  result.data = {}
  return result
}

const deleteAdmin = () => {
  result.data = {}
  return result
}

const updateAdmin = () => {
  result.data = {}
  return result
}

Mock.mock('/apiReplace/userData', 'post', userData)
Mock.mock('/apiReplace/adminData', 'post', adminData)
Mock.mock('/apiReplace/deleteUser', 'post', deleteUser)
Mock.mock('/apiReplace/selectAdminByID', 'post', selectAdminByID)

Mock.mock('/apiReplace/addAdmin', 'post', addAdmin)
Mock.mock('/apiReplace/deleteAdmin', 'post', deleteAdmin)
Mock.mock('/apiReplace/updateAdmin', 'post', updateAdmin)

