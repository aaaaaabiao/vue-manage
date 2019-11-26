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
// 管理员数据
const adminData = `${apiHost}adminData`
// 问题数据
const questionListData = `${apiHost}questionListData`
// 课程章节数据
const courseChapterData = `${apiHost}courseChapterData`
// 课程章节树形结构
const courseChapterTreeData = `${apiHost}courseChapterTreeData`
// 课程章节树形结构
const knowledgeListData = `${apiHost}knowledgeListData`
export default {
  Login,
  LoginByVin,
  SendSms,
  GetPermissionData,
  GetTableData,
  userData,
  adminData,
  questionListData,
  courseChapterData,
  courseChapterTreeData,
  knowledgeListData
}
