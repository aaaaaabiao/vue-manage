const qaPairManage = {
  path: 'qabaseManage',
  component: () => import('@/layout'),
  redirect: '/qabase/question',
  name: 'qabaseManage',
  meta: {
    title: '问答库管理'
  },
  children: [
    {
      path: '/qabase/question',
      name: 'qaManage',
      component: resolve => void require(['@/views/qaManage/qaManage'], resolve),
      meta: {
        title: '问答对管理'
      }
    }
  ]
}

export default qaPairManage
