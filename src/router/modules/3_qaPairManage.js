const qaPairManage = {
  path: 'qaPairManage',
  component: () => import('@/layout'),
  redirect: '/qa/question',
  name: 'qaPairManage',
  meta: {
    title: '问答对管理'
  },
  children: [
    {
      path: '/qaPair/check',
      name: 'checkQa',
      component: resolve => void require(['@/views/teacher/checkQa'], resolve),
      meta: {
        title: '审核问答对'
      }
    },
    {
      path: '/qaPair/add',
      name: 'manageQa',
      component: resolve => void require(['@/views/teacher/qaManage'], resolve),
      meta: {
        title: '管理问答对'
      }
    }
  ]
}

export default qaPairManage
