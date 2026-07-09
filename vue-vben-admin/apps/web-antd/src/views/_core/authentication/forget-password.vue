<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { message } from 'ant-design-vue';

import { resetPwdApi } from '#/api/core/auth';

defineOptions({ name: 'ForgetPassword' });

const router = useRouter();
const loading = ref(false);
const activeTab = ref('email');

const email = ref('');
const phone = ref('');
const emailError = ref('');
const phoneError = ref('');

function validateEmail(): boolean {
  if (!email.value.trim()) {
    emailError.value = '请输入邮箱';
    return false;
  }
  if (!email.value.includes('@') || email.value.includes(' ')) {
    emailError.value = '邮箱格式不正确';
    return false;
  }
  emailError.value = '';
  return true;
}

function validatePhone(): boolean {
  if (!phone.value.trim()) {
    phoneError.value = '请输入手机号';
    return false;
  }
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    phoneError.value = '手机号格式不正确';
    return false;
  }
  phoneError.value = '';
  return true;
}

async function handleSubmit() {
  if (activeTab.value === 'email') {
    if (!validateEmail()) return;
    loading.value = true;
    try {
      await resetPwdApi({ type: 'email', account: email.value });
      message.success('重置链接已发送至您的邮箱，请查收');
    } catch {
      message.error('发送失败，请检查邮箱是否正确');
    } finally {
      loading.value = false;
    }
  } else {
    if (!validatePhone()) return;
    message.warning('手机号重置功能暂未开放');
  }
}

function goToLogin() {
  router.push('/auth/login');
}
</script>

<template>
  <div class="mx-auto w-full max-w-[400px]">
    <!-- 标题 -->
    <div class="mb-8 text-center">
      <h2 class="text-foreground mb-2 text-2xl font-bold">忘记密码？ 🤦🏻‍♂️</h2>
      <p class="text-muted-foreground lg:text-md text-sm">
        选择重置方式，我们将向您发送重置密码的连接
      </p>
    </div>

    <!-- Tab 切换 -->
    <div class="mb-6">
      <div class="border-border flex border-b">
        <button
          :class="[
            activeTab === 'email'
              ? 'border-primary text-primary border-b-2 font-medium'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          class="flex-1 pb-3 text-sm transition-colors"
          type="button"
          @click="activeTab = 'email'"
        >
          邮箱重置
        </button>
        <button
          :class="[
            activeTab === 'phone'
              ? 'border-primary text-primary border-b-2 font-medium'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          class="flex-1 pb-3 text-sm transition-colors"
          type="button"
          @click="activeTab = 'phone'"
        >
          手机号重置
        </button>
      </div>
    </div>

    <!-- 邮箱重置 -->
    <div v-if="activeTab === 'email'">
      <div class="mb-4">
        <label class="mb-1.5 block text-sm font-medium"> 邮箱地址： </label>
        <input
          v-model="email"
          :class="[emailError ? 'border-red-500' : '']"
          class="border-input bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm outline-none transition-colors"
          placeholder="example@example.com"
          type="email"
          @input="emailError = ''"
        />
        <p v-if="emailError" class="mt-1 text-xs text-red-500">
          {{ emailError }}
        </p>
      </div>
    </div>

    <!-- 手机号重置 -->
    <div v-if="activeTab === 'phone'">
      <div class="mb-4">
        <label class="mb-1.5 block text-sm font-medium"> 手机号码： </label>
        <input
          v-model="phone"
          :class="[phoneError ? 'border-red-500' : '']"
          class="border-input bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm outline-none transition-colors"
          placeholder="请输入手机号码"
          type="tel"
          @input="phoneError = ''"
        />
        <p v-if="phoneError" class="mt-1 text-xs text-red-500">
          {{ phoneError }}
        </p>
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="mt-6 flex flex-col gap-3">
      <button
        :disabled="loading"
        class="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-full rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        @click="handleSubmit"
      >
        {{ loading ? '发送中...' : '重置密码' }}
      </button>
      <button
        class="border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-full rounded-md border text-sm font-medium transition-colors"
        type="button"
        @click="goToLogin()"
      >
        返回
      </button>
    </div>
  </div>
</template>
