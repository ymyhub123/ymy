import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      hideInMenu: true,
      icon: 'lucide:user',
      title: '个人中心',
    },
    name: 'Account',
    path: '/account',
    children: [
      {
        name: 'AccountInfo',
        path: 'info',
        component: () => import('#/views/account/info.vue'),
        meta: {
          icon: 'lucide:user',
          title: '账号信息',
        },
      },
    ],
  },
];

export default routes;
