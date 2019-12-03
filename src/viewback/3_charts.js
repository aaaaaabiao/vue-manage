const userManage = {
  path: 'dataAnalyze',
  component: () => import('@/layout'),
  redirect: '/data/question',
  name: 'dataAnalyze',
  meta: {
    title: '数据分析'
  },
  children: [
    {
      path: '/data/question',
      name: 'dataQuestion',
      component: resolve => void require(['@/views/dataAnalyze/question'], resolve),
      meta: {
        title: '问题统计'
      }
    },
    {
      path: '/data/answer',
      name: 'dataAnswer',
      component: resolve => void require(['@/views/dataAnalyze/answer'], resolve),
      meta: {
        title: '答案统计'
      }
    }
  ]
}

export default userManage
