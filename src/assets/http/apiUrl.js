/* 全局定义接口url */

// host头，这里我们要使用代理，所以定义的字符串apiReplace是用来进行反向代理时的标记字符串。
const apiHost = '/apiReplace/'
// 密码登录
const Login = `${apiHost}login`
// 短信登录
const LoginByVin = `${apiHost}loginByVin`
// 发送短信
const SendSms = `${apiHost}sendSms`
// 表格模拟数据
const GetPermissionData = `${apiHost}permission`
// 表格模拟数据
const GetTableData = `${apiHost}table`


// 用户数据
const userData = `${apiHost}userData`
// 删除学生用户
const deleteUser = `${apiHost}deleteStudent`
 
// 管理员数据
const adminData = `${apiHost}adminData`
// 添加管理员
const addAdmin = `${apiHost}addAdmin`
// 修改管理员
const updateAdmin = `${apiHost}updateAdmin`
// 删除管理员
const deleteAdmin = `${apiHost}deleteAdmin`


// 根据Id查询
const selectAdminByID = `${apiHost}selectAdminByID`
// 问题数据
const questionListData = `${apiHost}questionListData`
const deleteQuestion = `${apiHost}deleteQuestion`
const answerListData = `${apiHost}answerListData`
const deleteAnswer = `${apiHost}deleteAnswer`

const selectAnswer = `${apiHost}selectAnswer`
// 课程章节数据
const courseChapterData = `${apiHost}courseChapterData`
// 课程章节树形结构
const courseChapterTreeData = `${apiHost}courseChapterTreeData`
const knowledgeListData = `${apiHost}knowledgeListData`
const getAllCourseInfo = `${apiHost}getAllCourseInfo`
const addCourse = `${apiHost}addCourse`
const addChapter = `${apiHost}addChapter`
const updateChapter = `${apiHost}updateChapter`
const selectChapter = `${apiHost}selectChapter`
const deleteChapter = `${apiHost}deleteChapter`

//待完善
const getCqaQuestion = `${apiHost}getCqaQuestion`
const getCqaQuestionDetail = `${apiHost}getCqaQuestionDetail`
const addQa = `${apiHost}addQa`
const getUnsolveQuestion = `${apiHost}getUnsolveQuestion`
const getUnsloveQuestionDetail = `${apiHost}getUnsloveQuestionDetail`
const QaList = `${apiHost}QaList`
export default {
  Login,
  LoginByVin,
  SendSms,
  GetPermissionData,
  GetTableData,
  userData,
  deleteUser,
  adminData,
  questionListData,
  courseChapterData,
  courseChapterTreeData,
  knowledgeListData,
  selectAdminByID,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  getAllCourseInfo,
  addCourse,
  addChapter,
  updateChapter,
  selectChapter,
  deleteChapter,
  deleteQuestion,
  answerListData,
  deleteAnswer,
  selectAnswer,
  getCqaQuestion,
  getCqaQuestionDetail,
  addQa,
  getUnsolveQuestion,
  getUnsloveQuestionDetail,
  QaList
}
