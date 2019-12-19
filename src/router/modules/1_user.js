const userManage = {
  path: 'userManage',
  component: () => import('@/layout'),
  redirect: '/user/student',
  name: 'userManage',
  meta: {
    title: '用户管理'
  },
  children: [
    {
      path: '/user/student',
      name: 'studentUser',
      component: resolve => void require(['@/views/userManage/user'], resolve),
      meta: {
        title: '学生用户'
      }
    },
    {
      path: '/user/admin',
      name: 'adminUser',
      component: resolve => void require(['@/views/userManage/admin'], resolve),
      meta: {
        title: '其他用户'
      }
    }
  ]
}

export default userManage
