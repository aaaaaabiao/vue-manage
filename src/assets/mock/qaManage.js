/* eslint-disable no-unused-vars */

// 引入mockjs
import Mock from 'mockjs'
// import util from './util'
// 获取 mock.Random 对象
import questionList from './data/questionList.json'
import answerList from './data/answerList.json'
import answerDetail from './data/answerDetail.json'
const Random = Mock.Random
const result = {
  data: {},
  status: 1,
  message: 'success'
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



const getAllCourseInfo = () => {
  result.data = [
    { courseName: '数据结构', id: 1 },
    { courseName: '计算机组成原理', id: 2 },
    { courseName: '操作系统', id: 3 },
    { courseName: '计算机网络', id: 4 }
  ]
  return result
}
const selectAnswer = () => {
  result.data = answerDetail
  return result
}

const deleteQuestion = () => {
  result.data = {}
  return result
}
const answerListData = () => {
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

const deleteAnswer = () => {
  result.data = {}
  return result
}

Mock.mock('/apiReplace/questionListData', 'post', questionListData)
Mock.mock('/apiReplace/getAllCourseInfo', 'post', getAllCourseInfo)
Mock.mock('/apiReplace/deleteQuestion', 'post', deleteQuestion)
Mock.mock('/apiReplace/answerListData', 'post', answerListData)
Mock.mock('/apiReplace/deleteAnswer', 'post', deleteAnswer)
Mock.mock('/apiReplace/selectAnswer', 'post', selectAnswer)


