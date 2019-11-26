/* eslint-disable no-unused-vars */

// 引入mockjs
import Mock from 'mockjs'
// import util from './util'
// 获取 mock.Random 对象
import questionList from './data/questionList.json'
const Random = Mock.Random
const result = {
  data: {},
  resultCode: 1,
  resultMessage: 'success'
}
const questionListData = () => {
  // json文件数据
  const data = {
    totalCount: questionList.size,
    currentPage: 1,
    data: questionList
  }

  //   // 随机数据
  //   const length = Random.integer(1, 20)
  //   const data = {
  //     totalCount: length,
  //     currentPage: 1,
  //     data: []
  //   }
  //   for (let i = 0; i < length; i++) {
  //     data.data[i] = {
  //       id: Random.id(),
  //       name: Random.cname(),
  //       createTime: '2019-6-6',
  //       email: `736813089@qq.com`
  //     }
  //   }
  result.data = data
  return result
}
Mock.mock('/apiReplace/questionListData', 'post', questionListData)

