const member_house = {
    path: 'memberHouse',
    component: () => import('@/layout'),
    name: 'memberHouse',
    meta: {
        title: '代表之家',
        icon: 'table',
    },
    redirect:"/member_house/index",
    children: [
        {
            component: () => import('@/views/member_house/index.vue'),
            path: '/member_house/index',
            name: 'index',
            meta: {
                title: '首页',
                icon: 'menu-dashboard'
            }
        },
        {
            path: '/member_house/notification',
            component: () => import('@/views/member_house/notification/notification.vue'),
            name: 'notification',
            meta: {
                title: '通知管理',
                icon: 'menu-notify'
            },
        },
        //编辑/查看通知-隐藏该菜单
        {
            path: '/member_house/editNotification',
            component: () => import('@/views/member_house/notification/editNotification.vue'),
            name: 'editNotification',
            hidden: true
        },
        {
            component: () => import('@/views/member_house/work_station/workStation.vue'),
            path: '/member_house/workStation',
            name: 'workStation',
            meta: {
                title: '工作站管理',
                icon: 'menu-workstation'
            },
        },
        {
            component: () => import('@/views/member_house/opinion/opinion.vue'),
            path: '/member_house/opinions',
            name: 'opinions',
            meta: {
                title: '选民意见管理',
                icon: 'menu-opinion'
            },
        },
        {
            component: () => import('@/views/member_house/suggestion/suggestionBusiness.vue'),
            path: '/member_house/suggestionBusiness',
            name: 'suggestionBusiness',
            meta: {
              title: '建议类型管理',
              icon: 'menu-suggestionType'
            },
        },
        {
            component: () => import('@/views/member_house/suggestion/suggestion.vue'),
            path: '/member_house/suggestion',
            name: 'suggestion',
            meta: {
            title: '代表建议管理',
            icon: 'menu-suggestion'
            },
        },
      {
        component: () => import('@/views/member_house/suggestion/townSuggestion.vue'),
        path: '/member_house/town_suggestion',
        name: 'townSuggestion',
        meta: {
          title: '各镇代表建议管理',
          icon: 'menu-suggestion'
        },
      },
        {
            component: () => import('@/views/member_house/statistics/statisticSuggestion'),
            path: '/member_house/suggestion_count',
            name: 'suggestionCount',
            meta: {
              title: '代表建议统计',
              icon: 'menu-statistics'
            },
        },
        {
            component: () => import('@/views/member_house/performance/performanceType.vue'),
            path: '/member_house/performanceType',
            name: 'performanceType',
            meta: {
                title: '履职类型管理',
                icon: 'menu-performanceType'
            },
        },
        {
            component: () => import('@/views/member_house/performance/performance.vue'),
            path: '/member_house/performance',
            name: 'performance',
            meta: {
                title: '代表履职管理',
                icon: 'menu-performanceDuty'
            },
        },
      {
        component: () => import('@/views/member_house/performance/townPerformance.vue'),
        path: '/member_house/town_performance',
        name: 'townPerformance',
        meta: {
          title: '各镇代表履职管理',
          icon: 'menu-performanceDuty'
        },
      },
        {
            component: () => import('@/views/member_house/statistics/statisticPerformance.vue'),
            path: '/member_house/performance_count',
            name: 'performanceCount',
            meta: {
                title: '代表履职统计',
                icon: 'menu-statisics2'
            },
        },
        {
            component: () => import('@/views/member_house/demo.vue'),
            path: '/member_house/town_performance_count',
            name: 'townPerformanceCount',
            meta: {
                title: '各镇履职统计',
                icon: 'menu-statisics2'
            },
        },
        {
            component: () => import('@/views/member_house/special/special.vue'),
            path: '/member_house/special',
            name: 'special',
            meta: {
                title: '特殊职能设置',
                icon: 'menu-special'
            },
        },
        {
            component: () => import('@/views/member_house/system_setting/systemSetting.vue'),
            path: '/member_house/systemSetting',
            name: 'systemSetting',
            meta: {
                title: '系统设置',
                icon: 'menu-setting'
            }
        },
        {
            component: () => import('@/layout'),
            path: '/typeManage',
            name: 'typeManage',
            meta: {
                title: '类型管理',
                icon: 'menu-setting'
            },
        },
        {
            component: () => import('@/layout'),
            path: '/statisticsManage',
            name: 'statisticsManage',
            meta: {
                title: '统计',
                icon: 'menu-setting'
            },
        },]
    };
export default member_house
