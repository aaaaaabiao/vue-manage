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
  status: 1,
  message: 'success'
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
    data: knowledgeList
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
// 添加课程
const addCourse = () => {
  result.data = {}
  return result
}
// 添加章节
const addChapter = () => {
  result.data = {}
  return result
}
// 更新章节
const updateChapter = () => {
  result.data = {}
  return result
}
// 根据chapterId选择章节
const selectChapter = () => {
  result.data = {
    chapterId: 123,
    chapterName: '第二章',
    orderNum: 1,
    weight: 0.5,
    parentId: 100
  }
  return result
}

// 删除章节
const deleteChapter = () => {
  result.data = {}
  return result
}
Mock.mock('/apiReplace/courseChapterData', 'post', courseChapterData)
Mock.mock('/apiReplace/courseChapterTreeData', 'post', courseChapterTreeData)
Mock.mock('/apiReplace/knowledgeListData', 'post', knowledgeListData)
Mock.mock('/apiReplace/addCourse', 'post', addCourse)

Mock.mock('/apiReplace/addChapter', 'post', addChapter)
Mock.mock('/apiReplace/updateChapter', 'post', updateChapter)
Mock.mock('/apiReplace/selectChapter', 'post', selectChapter)
Mock.mock('/apiReplace/deleteChapter', 'post', deleteChapter)
