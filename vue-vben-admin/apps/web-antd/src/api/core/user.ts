import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  const result = await requestClient.get<any>('/v1/auth/userinfo');

  // 适配后端返回格式，转换为前端 UserInfo 格式
  const userInfo: UserInfo = {
    avatar: result.avatar || '',
    desc: result.desc || '',
    email: result.email || '',
    homePath: '/analytics',
    phone: result.phoneNum || '',
    realName: result.realName || result.userName || '',
    roles: (result.roles || []).map(String),
    token: '',
    userId: result.userId || result.sId?.toString() || '',
    username: result.userName || result.userId || '',
  };

  return userInfo;
}
