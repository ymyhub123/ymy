import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
    client_platform?: string;
  }

  /** 登录接口返回值 - 后端返回的 token 字段名待确认 */
  export interface LoginResult {
    [key: string]: any;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/v1/auth/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi(token?: string) {
  return baseRequestClient.post('/v1/auth/logout', null, {
    params: { token },
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  const result = await requestClient.post<any>('/v1/auth/codes');
  // 后端返回 { resourceCodes: [...], deviceCodes: [...], orgCodes: [...] }
  // 前端需要 string[] 格式的权限码
  return result?.resourceCodes || result || [];
}

// ==================== 注册相关 ====================

export namespace RegisterApi {
  /** 注册参数 */
  export interface RegisterParams {
    account?: string;
    code?: string;
    password?: string;
    username?: string;
  }
}

/**
 * 发送邮箱验证码
 */
export async function sendEmailCodeApi(email: string) {
  return requestClient.get<any>('/v1/Satff/Emailcode', {
    params: { email },
  });
}

/**
 * 校验邮箱验证码
 */
export async function checkEmailCodeApi(
  email: string,
  inputCode: string,
  password: string,
) {
  return requestClient.get<any>('/v1/Satff/CheckEmailCode', {
    params: { email, inputCode, password },
  });
}

/**
 * 用户注册
 */
export async function registerApi(data: RegisterApi.RegisterParams) {
  return requestClient.post<any>('/v1/Satff/Register', data);
}

// ==================== 重置密码相关 ====================

/**
 * 重置密码（发送重置链接到邮箱/手机）
 */
export async function resetPwdApi(data: { account: string; type: string }) {
  return requestClient.post<any>('/v1/Satff/ResetPwd', data);
}

// ==================== 修改密码相关 ====================

/**
 * 修改登录密码
 */
export async function changePwdApi(data: {
  confirmNewPassword: string;
  newPassword: string;
  oldPassword: string;
}) {
  return requestClient.post<any>('/v1/Satff/ChangePwd', data);
}

// ==================== 账号绑定相关 ====================

/**
 * 发送绑定验证码
 */
export async function sendBindingCodeApi(data: {
  account: string;
  purpose: string;
  type: string;
}) {
  return requestClient.post<any>('/v1/account-binding/send-code', data);
}

/**
 * 验证登录密码，获取一次性身份Token
 */
export async function verifyPasswordApi(data: { password: string }) {
  return requestClient.post<any>('/v1/account-binding/verify-password', data);
}

/**
 * 首次绑定手机/邮箱
 */
export async function bindAccountApi(data: {
  account: string;
  code: string;
  type: string;
}) {
  return requestClient.post<any>('/v1/account-binding/bind', data);
}

/**
 * 换绑手机/邮箱
 */
export async function rebindAccountApi(data: {
  account: string;
  code: string;
  type: string;
  verifyToken: string;
}) {
  return requestClient.post<any>('/v1/account-binding/rebind', data);
}

/**
 * 解绑手机/邮箱
 */
export async function unbindAccountApi(data: {
  type: string;
  verifyToken: string;
}) {
  return requestClient.post<any>('/v1/account-binding/unbind', data);
}
