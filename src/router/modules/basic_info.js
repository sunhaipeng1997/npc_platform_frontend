const member_house = {
    path: 'basic_info',
    component: () => import('@/layout'),
    name: 'basicInfo',
    meta: {
        title: '基本信息管理',
        icon: 'table',
    },
    redirect:"/basic_info/account",
    children: [
        {
            path: '/basic_info/account',
            component: resolve => void require(['@/views/basic_info/account/account.vue'], resolve),
            name: 'account',
            meta: {
                title: '账号管理',
                icon: 'menu-account',
            },
        },
        {
            path: '/basic_info/newsType',
            component: () => import('@/views/basic_info/news/newsType.vue'),
            name: 'newsType',
            meta: {
                title: '新闻类型管理',
                icon: 'menu-news'
            },
        },
        {
            path: '/basic_info/news',
            component: () => import('@/views/basic_info/news/news.vue'),
            name: 'news',
            meta: {
                title: '新闻管理',
                icon: 'menu-news'
            },
        },
        //编辑/查看新闻-隐藏该菜单
        {
            path: '/basic_info/editNews',
            component: () => import('@/views/basic_info/news/editNews.vue'),
            name: 'editNews',
            hidden: true
        },

        {
            component: () => import('@/views/basic_info/member/NpcMember.vue'),
            path: '/basic_info/members',
            name: 'members',
            meta: {
                title: '代表管理',
                icon: 'menu-performance'
            },
        },
        {
            component: () => import('@/views/basic_info/group/group.vue'),
            path: '/basic_info/groups',
            name: 'groups',
            meta: {
                title: '代表小组管理',
                icon: 'menu-group'
            },
        },

        {
            component: () => import('@/views/basic_info/study/studyCate.vue'),
            path: '/basic_info/studyCate',
            name: 'studyCate',
            meta: {
                title: '学习类型',
                icon: 'menu-studyType'
            },
        },
        {
            component: () => import('@/views/basic_info/study/studyFile.vue'),
            path: '/basic_info/studyFile',
            name: 'studyFile',
            meta: {
                title: '学习文件',
                icon: 'menu-studyFile'
            },
        },

        {
            component: () => import('@/views/basic_info/special/newsAuditor.vue'),
            path: '/basic_info/newsAuditor',
            name: 'newsAuditor',
            meta: {
                title: '新闻审核人设置',
                icon: 'menu-special'
            },
        },
        {
            component: () => import('@/views/basic_info/session/session.vue'),
            path: '/basic_info/sessions',
            name: 'sessions',
            meta: {
                title: '届期管理',
                icon: 'menu-worktime'
            }
        },
        {
            component: () => import('@/views/basic_info/town/town.vue'),
            path: '/basic_info/towns',
            name: 'towns',
            meta: {
                title: '镇/街道管理',
                icon: 'menu-town'
            }
        },
        {
            component: () => import('@/views/basic_info/village/village.vue'),
            path: '/basic_info/villages',
            name: 'villages',
            meta: {
                title: '村/社区管理',
                icon: 'menu-village'
            },
        }]
    };
export default member_house
