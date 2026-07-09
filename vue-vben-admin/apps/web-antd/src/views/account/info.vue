<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Menu,
  MenuItem,
  message,
  Modal,
  Upload,
} from 'ant-design-vue';

import {
  changePwdApi,
  rebindAccountApi,
  sendBindingCodeApi,
  unbindAccountApi,
  verifyPasswordApi,
} from '#/api/core/auth';

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

const activeMenu = ref('profile');

const formState = ref({
  companyName: '',
  companyRegion: '',
  email: userInfo.value?.email || '',
  org: '',
  phone: userInfo.value?.phone || '',
  username: userInfo.value?.realName || '',
});

// 当前绑定的邮箱（脱敏显示），换绑/解绑后实时更新
const boundEmail = ref(userInfo.value?.email || '');
const maskedEmail = computed(() => {
  if (!boundEmail.value) return '';
  const [local, domain] = boundEmail.value.split('@');
  if (!domain) return boundEmail.value;
  const masked = `${local.slice(0, 2)}***`;
  return `${masked}@${domain}`;
});
const isEmailBound = computed(() => !!boundEmail.value);

const handleMenuClick = (e: { key: number | string }) => {
  activeMenu.value = String(e.key);
};

// ==================== 修改密码 ====================
const passwordModalVisible = ref(false);
const passwordLoading = ref(false);
const passwordForm = reactive({
  confirmNewPassword: '',
  newPassword: '',
  oldPassword: '',
});
const passwordErrors = reactive({
  confirmNewPassword: '',
  newPassword: '',
  oldPassword: '',
});

function openPasswordModal() {
  passwordForm.oldPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmNewPassword = '';
  passwordErrors.oldPassword = '';
  passwordErrors.newPassword = '';
  passwordErrors.confirmNewPassword = '';
  passwordModalVisible.value = true;
}

function validatePasswordForm(): boolean {
  let valid = true;
  passwordErrors.oldPassword = '';
  passwordErrors.newPassword = '';
  passwordErrors.confirmNewPassword = '';

  if (!passwordForm.oldPassword) {
    passwordErrors.oldPassword = '请输入原密码';
    valid = false;
  }
  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = '请输入新密码';
    valid = false;
  } else if (passwordForm.newPassword.length < 6) {
    passwordErrors.newPassword = '密码至少6位';
    valid = false;
  }
  if (!passwordForm.confirmNewPassword) {
    passwordErrors.confirmNewPassword = '请再次输入新密码';
    valid = false;
  } else if (passwordForm.confirmNewPassword !== passwordForm.newPassword) {
    passwordErrors.confirmNewPassword = '两次输入的密码不一致';
    valid = false;
  }
  return valid;
}

async function handleChangePassword() {
  if (!validatePasswordForm()) return;
  passwordLoading.value = true;
  try {
    await changePwdApi({
      confirmNewPassword: passwordForm.confirmNewPassword,
      newPassword: passwordForm.newPassword,
      oldPassword: passwordForm.oldPassword,
    });
    message.success('密码修改成功');
    passwordModalVisible.value = false;
  } catch {
    message.error('密码修改失败，请检查原密码是否正确');
  } finally {
    passwordLoading.value = false;
  }
}

// ==================== 邮箱换绑 ====================
const rebindModalVisible = ref(false);
const rebindStep = ref(1);
const rebindLoading = ref(false);
const rebindPassword = ref('');
const rebindPasswordError = ref('');
const rebindNewEmail = ref('');
const rebindNewEmailError = ref('');
const rebindCode = ref('');
const rebindCodeError = ref('');
const rebindVerifyToken = ref('');
const rebindCountdown = ref(0);
let rebindCountdownTimer: null | ReturnType<typeof setInterval> = null;

function openRebindModal() {
  rebindStep.value = 1;
  rebindPassword.value = '';
  rebindNewEmail.value = '';
  rebindCode.value = '';
  rebindPasswordError.value = '';
  rebindNewEmailError.value = '';
  rebindCodeError.value = '';
  rebindVerifyToken.value = '';
  rebindCountdown.value = 0;
  if (rebindCountdownTimer) {
    clearInterval(rebindCountdownTimer);
    rebindCountdownTimer = null;
  }
  rebindModalVisible.value = true;
}

async function handleRebindVerifyPassword() {
  if (!rebindPassword.value) {
    rebindPasswordError.value = '请输入登录密码';
    return;
  }
  rebindPasswordError.value = '';
  rebindLoading.value = true;
  try {
    const res = await verifyPasswordApi({ password: rebindPassword.value });
    const data = (res as any)?.data || res;
    const token = data?.verifyToken || data?.token || data || '';
    rebindVerifyToken.value =
      typeof token === 'string' ? token : JSON.stringify(token);
    rebindStep.value = 2;
  } catch (error: any) {
    message.error(error?.message || '密码验证失败，请重试');
  } finally {
    rebindLoading.value = false;
  }
}

async function handleRebindSendCode() {
  if (!rebindNewEmail.value) {
    rebindNewEmailError.value = '请输入新邮箱';
    return;
  }
  if (!rebindNewEmail.value.includes('@')) {
    rebindNewEmailError.value = '邮箱格式不正确';
    return;
  }
  rebindNewEmailError.value = '';
  rebindLoading.value = true;
  try {
    await sendBindingCodeApi({
      account: rebindNewEmail.value,
      purpose: 'rebind',
      type: 'email',
    });
    message.success('验证码已发送');
    rebindCountdown.value = 60;
    rebindCountdownTimer = setInterval(() => {
      rebindCountdown.value -= 1;
      if (rebindCountdown.value <= 0 && rebindCountdownTimer) {
        clearInterval(rebindCountdownTimer);
        rebindCountdownTimer = null;
      }
    }, 1000);
  } catch (error: any) {
    message.error(error?.message || '验证码发送失败');
  } finally {
    rebindLoading.value = false;
  }
}

async function handleRebindSubmit() {
  if (!rebindCode.value) {
    rebindCodeError.value = '请输入验证码';
    return;
  }
  rebindCodeError.value = '';
  rebindLoading.value = true;
  try {
    await rebindAccountApi({
      account: rebindNewEmail.value,
      code: rebindCode.value,
      type: 'email',
      verifyToken: rebindVerifyToken.value,
    });
    message.success('邮箱换绑成功');
    boundEmail.value = rebindNewEmail.value;
    rebindModalVisible.value = false;
  } catch {
    message.error('换绑失败，请检查验证码是否正确');
  } finally {
    rebindLoading.value = false;
  }
}

// ==================== 邮箱解绑 ====================
const unbindModalVisible = ref(false);
const unbindLoading = ref(false);
const unbindPassword = ref('');
const unbindPasswordError = ref('');

function openUnbindModal() {
  unbindPassword.value = '';
  unbindPasswordError.value = '';
  unbindModalVisible.value = true;
}

async function handleUnbind() {
  if (!unbindPassword.value) {
    unbindPasswordError.value = '请输入登录密码以确认解绑';
    return;
  }
  unbindPasswordError.value = '';
  unbindLoading.value = true;
  try {
    const res = await verifyPasswordApi({ password: unbindPassword.value });
    const token =
      (res as any)?.data?.verifyToken ||
      (res as any)?.verifyToken ||
      (res as any)?.data ||
      '';
    await unbindAccountApi({ type: 'email', verifyToken: token });
    message.success('邮箱已解绑');
    boundEmail.value = '';
    unbindModalVisible.value = false;
  } catch {
    message.error('解绑失败，请检查密码是否正确');
  } finally {
    unbindLoading.value = false;
  }
}
</script>

<template>
  <div class="account-page flex h-full">
    <!-- 左侧菜单 -->
    <div class="account-sidebar w-48 border-r border-gray-200 bg-white p-4">
      <Menu
        :selected-keys="[activeMenu]"
        mode="inline"
        @click="handleMenuClick"
      >
        <MenuItem key="profile">
          <template #icon>
            <span class="i-lucide-user"></span>
          </template>
          个人资料
        </MenuItem>
        <MenuItem key="settings">
          <template #icon>
            <span class="i-lucide-settings"></span>
          </template>
          账号设置
        </MenuItem>
      </Menu>
    </div>

    <!-- 右侧内容 -->
    <div class="account-content flex-1 p-6">
      <!-- 个人资料 -->
      <div v-if="activeMenu === 'profile'">
        <Card title="个人资料">
          <div class="flex gap-8">
            <!-- 表单区域 -->
            <div class="flex-1">
              <Form
                :label-col="{ span: 4 }"
                :model="formState"
                :wrapper-col="{ span: 16 }"
                layout="horizontal"
              >
                <FormItem label="用户名">
                  <Input
                    v-model:value="formState.username"
                    placeholder="请输入用户名"
                  />
                </FormItem>
                <FormItem label="手机号">
                  <Input v-model:value="formState.phone" placeholder="请输入" />
                </FormItem>
                <FormItem label="邮箱">
                  <Input
                    v-model:value="formState.email"
                    placeholder="请输入邮箱"
                  />
                </FormItem>
                <FormItem label="所属组织">
                  <Input
                    v-model:value="formState.org"
                    placeholder="请选择上级组织"
                  />
                </FormItem>
                <FormItem label="公司名称">
                  <Input
                    v-model:value="formState.companyName"
                    placeholder="请输入公司名称"
                  />
                </FormItem>
                <FormItem label="公司地区">
                  <Input
                    v-model:value="formState.companyRegion"
                    placeholder="请选择公司地区"
                  />
                </FormItem>
                <FormItem :wrapper-col="{ offset: 4, span: 16 }">
                  <Button type="primary">保存</Button>
                </FormItem>
              </Form>
            </div>

            <!-- 头像区域 -->
            <div class="w-40">
              <div class="mb-2 text-center text-sm text-gray-500">上传头像</div>
              <div class="flex justify-center">
                <Upload
                  :before-upload="() => false"
                  :show-upload-list="false"
                  list-type="picture-card"
                >
                  <img
                    v-if="userInfo?.avatar"
                    :src="userInfo.avatar"
                    class="h-24 w-24 rounded-lg object-cover"
                  />
                  <div
                    v-else
                    class="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100"
                  >
                    <span class="i-lucide-camera text-2xl text-gray-400"></span>
                  </div>
                </Upload>
              </div>
              <div class="mt-2 text-center text-xs text-gray-400">
                <div>格式：JPG、PNG</div>
                <div>大小：5M以内</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- 账号设置 -->
      <div v-if="activeMenu === 'settings'">
        <Card title="账号设置">
          <!-- 手机号 -->
          <div
            class="flex items-center justify-between border-b border-gray-100 py-4"
          >
            <div>
              <div class="font-medium">手机号</div>
              <div class="text-sm text-gray-500">未绑定</div>
            </div>
            <Button type="link">绑定</Button>
          </div>

          <!-- 邮箱 -->
          <div
            class="flex items-center justify-between border-b border-gray-100 py-4"
          >
            <div>
              <div class="font-medium">邮箱</div>
              <div v-if="isEmailBound" class="text-sm text-gray-500">
                {{ maskedEmail }}
              </div>
              <div v-else class="text-sm text-gray-500">未绑定</div>
            </div>
            <div v-if="isEmailBound" class="flex gap-2">
              <Button type="link" @click="openRebindModal">换绑</Button>
              <Button danger type="link" @click="openUnbindModal">解绑</Button>
            </div>
            <Button v-else type="link">绑定</Button>
          </div>

          <!-- 微信号 -->
          <div
            class="flex items-center justify-between border-b border-gray-100 py-4"
          >
            <div class="flex items-center gap-3">
              <img
                class="h-10 w-10 rounded-full"
                src="https://avatar.vercel.sh/1"
              />
              <div>
                <div class="font-medium">微信号</div>
                <div class="text-sm text-gray-500">
                  烧电焊的小黄鸭 · 绑定于 2026-07-06T14:23:03
                </div>
              </div>
            </div>
            <Button danger type="link">解绑</Button>
          </div>

          <!-- 密码 -->
          <div class="flex items-center justify-between py-4">
            <div>
              <div class="font-medium">密码</div>
            </div>
            <Button type="link" @click="openPasswordModal">修改密码</Button>
          </div>
        </Card>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <Modal
      v-model:open="passwordModalVisible"
      :confirm-loading="passwordLoading"
      title="修改密码"
      @cancel="passwordModalVisible = false"
      @ok="handleChangePassword"
    >
      <div class="flex flex-col gap-4 py-4">
        <!-- 原密码 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            <span class="text-red-500">*</span> 原密码：
          </label>
          <Input
            v-model:value="passwordForm.oldPassword"
            :class="[
              passwordErrors.oldPassword ? 'ant-input-status-error' : '',
            ]"
            placeholder="请输入原密码"
            type="password"
          />
          <p
            v-if="passwordErrors.oldPassword"
            class="mt-1 text-xs text-red-500"
          >
            {{ passwordErrors.oldPassword }}
          </p>
        </div>
        <!-- 新密码 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            <span class="text-red-500">*</span> 新密码：
          </label>
          <Input
            v-model:value="passwordForm.newPassword"
            :class="[
              passwordErrors.newPassword ? 'ant-input-status-error' : '',
            ]"
            placeholder="请输入新密码"
            type="password"
          />
          <p
            v-if="passwordErrors.newPassword"
            class="mt-1 text-xs text-red-500"
          >
            {{ passwordErrors.newPassword }}
          </p>
        </div>
        <!-- 确认密码 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            <span class="text-red-500">*</span> 确认密码：
          </label>
          <Input
            v-model:value="passwordForm.confirmNewPassword"
            :class="[
              passwordErrors.confirmNewPassword ? 'ant-input-status-error' : '',
            ]"
            placeholder="请再次输入新密码"
            type="password"
          />
          <p
            v-if="passwordErrors.confirmNewPassword"
            class="mt-1 text-xs text-red-500"
          >
            {{ passwordErrors.confirmNewPassword }}
          </p>
        </div>
      </div>
    </Modal>

    <!-- 邮箱换绑弹窗 -->
    <Modal
      v-model:open="rebindModalVisible"
      :confirm-loading="rebindLoading"
      :title="rebindStep === 1 ? '验证身份' : '换绑邮箱'"
      @cancel="rebindModalVisible = false"
      @ok="
        rebindStep === 1 ? handleRebindVerifyPassword() : handleRebindSubmit()
      "
    >
      <div class="flex flex-col gap-4 py-4">
        <!-- Step 1: 验证密码 -->
        <template v-if="rebindStep === 1">
          <div>
            <label class="mb-1.5 block text-sm font-medium">
              <span class="text-red-500">*</span> 登录密码：
            </label>
            <Input
              v-model:value="rebindPassword"
              :class="[rebindPasswordError ? 'ant-input-status-error' : '']"
              placeholder="请输入当前登录密码以验证身份"
              type="password"
            />
            <p v-if="rebindPasswordError" class="mt-1 text-xs text-red-500">
              {{ rebindPasswordError }}
            </p>
          </div>
        </template>
        <!-- Step 2: 输入新邮箱和验证码 -->
        <template v-if="rebindStep === 2">
          <div>
            <label class="mb-1.5 block text-sm font-medium">
              <span class="text-red-500">*</span> 新邮箱：
            </label>
            <Input
              v-model:value="rebindNewEmail"
              :class="[rebindNewEmailError ? 'ant-input-status-error' : '']"
              placeholder="请输入新邮箱地址"
              type="email"
            />
            <p v-if="rebindNewEmailError" class="mt-1 text-xs text-red-500">
              {{ rebindNewEmailError }}
            </p>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium">
              <span class="text-red-500">*</span> 验证码：
            </label>
            <div class="flex gap-2">
              <Input
                v-model:value="rebindCode"
                :class="[rebindCodeError ? 'ant-input-status-error' : '']"
                class="flex-1"
                placeholder="请输入验证码"
              />
              <Button
                :disabled="rebindCountdown > 0"
                @click="handleRebindSendCode"
              >
                {{
                  rebindCountdown > 0
                    ? `${rebindCountdown}s后重发`
                    : '发送验证码'
                }}
              </Button>
            </div>
            <p v-if="rebindCodeError" class="mt-1 text-xs text-red-500">
              {{ rebindCodeError }}
            </p>
          </div>
        </template>
      </div>
    </Modal>

    <!-- 邮箱解绑弹窗 -->
    <Modal
      v-model:open="unbindModalVisible"
      :confirm-loading="unbindLoading"
      title="解绑邮箱"
      @cancel="unbindModalVisible = false"
      @ok="handleUnbind"
    >
      <div class="flex flex-col gap-4 py-4">
        <div>
          <p class="mb-2 text-sm text-gray-500">
            解绑后将无法通过邮箱登录，请输入当前登录密码以确认操作。
          </p>
          <label class="mb-1.5 block text-sm font-medium">
            <span class="text-red-500">*</span> 登录密码：
          </label>
          <Input
            v-model:value="unbindPassword"
            :class="[unbindPasswordError ? 'ant-input-status-error' : '']"
            placeholder="请输入当前登录密码"
            type="password"
          />
          <p v-if="unbindPasswordError" class="mt-1 text-xs text-red-500">
            {{ unbindPasswordError }}
          </p>
        </div>
      </div>
    </Modal>
  </div>
</template>
