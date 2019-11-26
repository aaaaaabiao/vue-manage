/* eslint-disable no-unused-vars */

// 引入mockjs
import Mock from 'mockjs'
// import util from './util'
// 获取 mock.Random 对象
import courseChapterList from './data/courseChapterList.json'
import courseChapterTree from './data/courseChapterTree.json'
import knowledgeList from './data/knowledgeList.json'
const Random = Mock.Random
const result = {
  data: {},
  resultCode: 1,
  resultMessage: 'success'
}

const courseChapterData = () => {
  // json文件数据
  const data = {
    data: courseChapterList
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

const courseChapterTreeData = () => {
  // json文件数据
  const data = {
    data: courseChapterTree
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

const knowledgeListData = () => {
  // json文件数据
  const data = {
    data: courseChapterTree
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
Mock.mock('/apiReplace/courseChapterData', 'post', courseChapterData)
Mock.mock('/apiReplace/courseChapterTreeData', 'post', courseChapterTreeData)
Mock.mock('/apiReplace/knowledgeListData', 'post', knowledgeListData)
