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
        title: '审核讨论区问答对'
      }
    },
    {
      path: '/qaPair/unSolveQuestion',
      name: 'unSolveQuestion',
      component: resolve => void require(['@/views/teacher/unSolveQuestion'], resolve),
      meta: {
        title: '待回答问题'
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
