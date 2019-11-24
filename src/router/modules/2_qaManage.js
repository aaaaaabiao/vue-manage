const userManage = {
  path: 'qaManage',
  component: () => import('@/layout'),
  redirect: '/qa/question',
  name: 'qaManage',
  meta: {
    title: '问答库管理'
  },
  children: [
    {
      path: '/qa/question',
      name: 'question',
      component: resolve => void require(['@/views/qaManage/question'], resolve),
      meta: {
        title: '问题管理'
      }
    },
    {
      path: '/qa/answer',
      name: 'answer',
      component: resolve => void require(['@/views/qaManage/answer'], resolve),
      meta: {
        title: '答案管理'
      }
    },
    {
      path: '/qa/course',
      name: 'course',
      component: resolve => void require(['@/views/qaManage/course'], resolve),
      meta: {
        title: '课程管理'
      }
    },
    {
      path: '/qa/knowledge',
      name: 'knowledge',
      component: resolve => void require(['@/views/qaManage/knowledge'], resolve),
      meta: {
        title: '知识点管理'
      }
    }
  ]
}

export default userManage
