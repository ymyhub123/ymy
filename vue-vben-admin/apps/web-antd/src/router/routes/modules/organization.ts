import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:building-2',
      order: 10,
      title: '用户管理',
    },
    name: 'UserManagement',
    path: '/user-management',
    children: [
      {
        name: 'Organization',
        path: 'organization',
        component: () => import('#/views/organization/index.vue'),
        meta: {
          icon: 'lucide:network',
          title: '组织管理',
        },
      },
    ],
  },
];

export default routes;
