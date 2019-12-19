const courseManage = {
  path: 'courseManage',
  component: () => import('@/layout'),
  redirect: '/course/chapter',
  name: 'courseManage',
  meta: {
    title: '课程管理'
  },
  children: [
    // {
    //   path: '/course/chapter',
    //   name: 'chapter',
    //   component: resolve => void require(['@/views/courseManage/chapter'], resolve),
    //   meta: {
    //     title: '章节管理'
    //   }
    // },
    {
      path: '/course/knowledge',
      name: 'knowledge',
      component: resolve => void require(['@/views/courseManage/knowledge'], resolve),
      meta: {
        title: '知识点管理'
      }
    },
    {
      path: '/course/teacher',
      name: 'courseteacher',
      component: resolve => void require(['@/views/courseManage/teacher'], resolve),
      meta: {
        title: '任课教师管理'
      }
    }
  ]
}

export default courseManage
