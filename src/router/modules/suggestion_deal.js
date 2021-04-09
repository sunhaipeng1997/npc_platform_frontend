const suggestion_deal = {
    path: 'suggestionDeal',
    component: () => import('@/layout'),
    name: 'suggestionDeal',
    meta: {
        title: '建议办理',
        icon: 'suggestion_deal'
    },
    redirect: '/suggestion_deal/gov/govDealIndex',
    children: [
        {
            path: '/suggestion_deal/gov/govDealIndex',
            component: resolve => void require(['@/views/suggestion_deal/gov/govDealIndex.vue'], resolve),
            name: 'govDealIndex',
            meta: {
                title: '首页',
                icon: 'sug-dealIndex',
            },
          },
      {
        path: '/suggestion_deal/npc/npcDealIndex',
        component: resolve => void require(['@/views/suggestion_deal/npc/npcDealIndex.vue'], resolve),
        name: 'npcDealIndex',
        meta: {
          title: '首页',
          icon: 'sug-dealIndex',
        },
      },{
            path: '/suggestion_deal/unit/unitDealIndex',
            component: resolve => void require(['@/views/suggestion_deal/unit/unitDealIndex.vue'], resolve),
            name: 'unitDealIndex',
            meta: {
                title: '首页',
                icon: 'sug-dealIndex',
            },
        },
        {
            path: '/suggestion_deal/govManage',
            component: resolve => void require(['@/views/suggestion_deal/npc/govManage/govManage.vue'], resolve),
            name: 'govManage',
            meta: {
                title: '政府管理',
                icon: 'sug-unitManage',
            },
          }, {
            path: '/suggestion_deal/npc/suggestion',
            component: resolve => void require(['@/views/suggestion_deal/npc/suggestion/suggestion.vue'], resolve),
            name: 'suggestionManage',
            meta: {
                title: '代表建议管理',
                icon: 'sug-suggestionManage',
            },
        }, {
            path: '/suggestion_deal/npc/sugNpcStatistic',
            component: resolve => void require(['@/views/suggestion_deal/npc/sugNpcStatistic/sugNpcStatistic.vue'], resolve),
            name: 'sugNpcStatistic',
            meta: {
                title: '建议办理统计',
                icon: 'sug-sugDealStatistic',
            },
        },
        {
            component: () => import('@/views/suggestion_deal/npc/suggestion/suggestionBusiness.vue'),
            path: '/suggestion_deal/suggestionBusiness',
            name: 'suggestionBusinessDeal',
            meta: {
                title: '建议类型管理',
                icon: 'menu-suggestionType'
            },
        },
        {
            path: '/suggestion_deal/npc/sugReceiver',
            component: resolve => void require(['@/views/suggestion_deal/sugReceiver/sugReceiver.vue'], resolve),
            name: 'sugReceiver',
            meta: {
                title: '建议接收人设置',
                icon: 'sug-toBeDoneSug',
            },
        },



    {
      component: resolve => void require(['@/views/suggestion_deal/gov/applyAdjustSug/applyAdjustSug.vue'], resolve),
      path: '/suggestion_deal/gov/applyAdjustSug',
      name: 'applyAdjustSug',
      meta: {
        title: '申请调整的建议',
        icon: 'sug-applyAdjustSug'
      }
    },

    {
      path: '/suggestion_deal/gov/applyDelaySug',
      component: resolve => void require(['@/views/suggestion_deal/gov/applyDelaySug/applyDelaySug.vue'], resolve),
      name: 'applyDelaySug',
      meta: {
        title: '申请延期的建议',
        icon: 'sug-applyDelaySug'
      }
    },

    {
      path: '/suggestion_deal/gov/sugDealSetting',
      component: resolve => void require(['@/views/suggestion_deal/gov/sugDealSetting/sugDealSetting.vue'], resolve),
      name: 'sugDealSetting',
      meta: {
        title: '建议办理设置',
        icon: 'sug-sugDealSetting'
      }
    },

    {
      path: '/suggestion_deal/gov/sugDealStatistic',
      component: resolve => void require(['@/views/suggestion_deal/gov/sugDealStatistic/sugDealStatistic.vue'], resolve),
      name: 'sugDealStatistic',
      meta: {
        title: '建议办理统计',
        icon: 'sug-sugDealStatistic'
      }
    },

    {
      path: '/suggestion_deal/gov/toBeTransSug',
      component: resolve => void require(['@/views/suggestion_deal/gov/toBeTransSug/toBeTransSug.vue'], resolve),
      name: 'toBeTransSug',
      meta: {
        title: '待转办的建议',
        icon: 'sug-toBeTransSug'
      }
    },

    {
      component: resolve => void require(['@/views/suggestion_deal/gov/dealingSug/dealingSug.vue'], resolve),
      path: '/suggestion_deal/gov/dealingSug',
      name: 'govDealingSug',
      meta: {
        title: '办理中的建议',
        icon: 'sug-inDoingSug'
      }
    },

    {
      component: resolve => void require(['@/views/suggestion_deal/gov/finishedSug/finishedSug.vue'], resolve),
      path: '/suggestion_deal/gov/finishedSug',
      name: 'govFinishedSug',
      meta: {
        title: '办理完成的建议',
        icon: 'sug-doneSug'
      }
    },

    {
      component: resolve => void require(['@/views/suggestion_deal/gov/completedSug/completedSug.vue'], resolve),
      path: '/suggestion_deal/gov/completedSug',
      name: 'govCompletedSug',
      meta: {
        title: '办结的建议',
        icon: 'sug-completedSug'
      }
    },

    {
      path: '/suggestion_deal/gov/unitManage',
      component: resolve => void require(['@/views/suggestion_deal/gov/unitManage/unitManage.vue'], resolve),
      name: 'unitManage',
      meta: {
        title: '办理单位管理',
        icon: 'sug-unitManage'
      }
    },

    {
      path: '/suggestion_deal/gov/addOrUpdateUnit',
      component: resolve => void require(['@/views/suggestion_deal/gov/unitManage/addOrUpdateUnit.vue'], resolve),
      name: 'addOrUpdateUnit',
      meta: {
        title: '添加/修改单位',
        icon: 'table'
      }
    },

    {
      path: '/suggestion_deal/unit/completedSug',
      component: resolve => void require(['@/views/suggestion_deal/unit/completedSug/completedSug.vue'], resolve),
      name: 'completedSug',
      meta: {
        title: '办结的建议',
        icon: 'sug-completedSug'
      }
    },

    {
      path: '/suggestion_deal/unit/doneSug',
      component: resolve => void require(['@/views/suggestion_deal/unit/doneSug/doneSug.vue'], resolve),
      name: 'doneSug',
      meta: {
        title: '办完的建议',
        icon: 'sug-doneSug'
      }
    },

    {
      path: '/suggestion_deal/unit/inDoingSug',
      component: resolve => void require(['@/views/suggestion_deal/unit/inDoingSug/inDoingSug.vue'], resolve),
      name: 'inDoingSug',
      meta: {
        title: '办理中的建议',
        icon: 'sug-inDoingSug'
      }
    },

    {
      path: '/suggestion_deal/unit/toBeDoneSug',
      component: resolve => void require(['@/views/suggestion_deal/unit/toBeDoneSug/toBeDoneSug.vue'], resolve),
      name: 'toBeDoneSug',
      meta: {
        title: '待办建议',
        icon: 'sug-toBeDoneSug'
      }
    }
  ]
}
export default suggestion_deal
