<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Cascader, TreeSelect } from 'ant-design-vue';

import { registerApi, sendEmailCodeApi } from '#/api/core/auth';
import { baseRequestClient } from '#/api/request';

defineOptions({ name: 'Register' });

const router = useRouter();
const loading = ref(false);
const currentStep = ref(0);

// ==================== Step 1: 基本信息 ====================
const step1Form = ref({
  username: '',
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
});

const step1Errors = ref<Record<string, string>>({});

// 密码强度
const passwordStrength = ref(0);
const passwordStrengthText = ref('');
const passwordStrengthColor = ref('');

function checkPasswordStrength(password: string) {
  if (!password) {
    passwordStrength.value = 0;
    passwordStrengthText.value = '';
    return;
  }
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  passwordStrength.value = score;
  const levels = ['', '弱', '一般', '较强', '强'];
  const colors = ['', '#ff4d4f', '#faad14', '#52c41a', '#1890ff'];
  passwordStrengthText.value = levels[score] || '';
  passwordStrengthColor.value = colors[score] || '';
}

function validateStep1(): boolean {
  const errors: Record<string, string> = {};

  if (!step1Form.value.username.trim()) {
    errors.username = '请输入用户名';
  }
  if (!step1Form.value.email.trim()) {
    errors.email = '请输入邮箱';
  } else if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(step1Form.value.email)) {
    errors.email = '请输入有效的邮箱地址';
  }
  if (!step1Form.value.code.trim()) {
    errors.code = '请输入验证码';
  }
  if (!step1Form.value.password) {
    errors.password = '请输入密码';
  } else if (step1Form.value.password.length < 8) {
    errors.password = '密码长度不能少于8位';
  }
  if (!step1Form.value.confirmPassword) {
    errors.confirmPassword = '请确认密码';
  } else if (step1Form.value.confirmPassword !== step1Form.value.password) {
    errors.confirmPassword = '两次输入的密码不一致';
  }

  step1Errors.value = errors;
  return Object.keys(errors).length === 0;
}

// ==================== 验证码倒计时 ====================
const countdown = ref(0);
const countdownTimer = ref<null | ReturnType<typeof setInterval>>(null);
const codeSending = ref(false);

async function handleSendCode() {
  if (countdown.value > 0 || codeSending.value) return;

  if (!step1Form.value.email.trim()) {
    step1Errors.value = { email: '请先输入邮箱' };
    return;
  }
  if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(step1Form.value.email)) {
    step1Errors.value = { email: '请输入有效的邮箱地址' };
    return;
  }

  step1Errors.value = {};
  codeSending.value = true;
  try {
    await sendEmailCodeApi(step1Form.value.email);
    countdown.value = 60;
    countdownTimer.value = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0 && countdownTimer.value) {
        clearInterval(countdownTimer.value);
        countdownTimer.value = null;
      }
    }, 1000);
  } catch {
    step1Errors.value = { email: '验证码发送失败，请稍后重试' };
  } finally {
    codeSending.value = false;
  }
}

// ==================== Step 2: 企业信息 ====================
const step2Form = ref({
  orgId: undefined as number | undefined,
  companyName: '',
  companyRegion: [] as number[],
});

const step2Errors = ref<Record<string, string>>({});

// 上级组织硬编码选项
const orgTreeData = [
  {
    title: '总部',
    value: 1,
    children: [
      {
        title: '华东区域',
        value: 11,
        children: [
          { title: '上海分公司', value: 111 },
          { title: '杭州分公司', value: 112 },
          { title: '南京分公司', value: 113 },
        ],
      },
      {
        title: '华南区域',
        value: 12,
        children: [
          { title: '广州分公司', value: 121 },
          { title: '深圳分公司', value: 122 },
        ],
      },
      {
        title: '华北区域',
        value: 13,
        children: [
          { title: '北京分公司', value: 131 },
          { title: '天津分公司', value: 132 },
        ],
      },
    ],
  },
];

// 地区数据
const regionOptions = ref<any[]>([]);
const regionLoaded = ref(false);
const regionLoading = ref(false);

async function loadRegionData() {
  if (regionLoaded.value) return;
  regionLoading.value = true;
  try {
    const res = await baseRequestClient.get('/v1/company-regional', {
      params: { id: 0 },
    });
    const data = (res as any)?.data || res;
    if (Array.isArray(data)) {
      regionOptions.value = data.map((item: any) => ({
        label: item.name || item.regionName,
        value: item.id || item.regionId,
        isLeaf: false,
      }));
      regionLoaded.value = true;
    }
  } catch {
    regionOptions.value = [];
  } finally {
    regionLoading.value = false;
  }
}

async function handleRegionDropdown(visible: boolean) {
  if (!visible) return;
  if (!regionLoaded.value) {
    await loadRegionData();
  }
}

async function handleRegionExpand(options: any) {
  const targetOption = options[options.length - 1];
  targetOption.loading = true;
  try {
    const res = await baseRequestClient.get(
      '/v1/company-regional/GetCompanyRegional',
      { params: { id: targetOption.value } },
    );
    const data = (res as any)?.data || res;
    if (Array.isArray(data) && data.length > 0) {
      targetOption.children = data.map((item: any) => ({
        label: item.name || item.regionName,
        value: item.id || item.regionId,
        isLeaf: false,
      }));
    } else {
      targetOption.isLeaf = true;
    }
  } catch {
    targetOption.isLeaf = true;
  } finally {
    targetOption.loading = false;
  }
}

function validateStep2(): boolean {
  const errors: Record<string, string> = {};
  if (!step2Form.value.orgId) {
    errors.orgId = '请选择上级组织';
  }
  step2Errors.value = errors;
  return Object.keys(errors).length === 0;
}

// ==================== 提交 ====================
async function handleNextStep() {
  if (!validateStep1()) return;
  currentStep.value = 1;
}

function handlePrevStep() {
  currentStep.value = 0;
}

async function handleRegister() {
  if (!validateStep2()) return;

  loading.value = true;
  try {
    await registerApi({
      account: step1Form.value.email,
      code: step1Form.value.code,
      password: step1Form.value.password,
      username: step1Form.value.username,
    });
    router.push('/auth/login');
  } catch {
    step2Errors.value = { orgId: '注册失败，请稍后重试' };
  } finally {
    loading.value = false;
  }
}

function goToLogin() {
  router.push('/auth/login');
}
</script>

<template>
  <div>
    <!-- 标题 -->
    <div class="mb-7 sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="text-foreground mb-3 text-3xl font-bold leading-9 tracking-tight lg:text-4xl"
      >
        创建一个账号 🚀
      </h2>
      <p class="text-muted-foreground lg:text-md text-sm">
        让您的应用程序管理变得简单而有趣
      </p>
    </div>

    <!-- 步骤条 -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <!-- Step 1 -->
        <div class="flex items-center gap-2">
          <div
            :class="[
              currentStep >= 0
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-500',
            ]"
            class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
          >
            <span v-if="currentStep > 0">✓</span>
            <span v-else>1</span>
          </div>
          <span
            :class="[
              currentStep >= 0 ? 'text-foreground' : 'text-muted-foreground',
            ]"
            class="text-sm font-medium"
          >
            基本信息
          </span>
        </div>

        <!-- 连接线 -->
        <div
          :class="[currentStep >= 1 ? 'bg-primary' : 'bg-gray-200']"
          class="mx-4 h-0.5 flex-1"
        ></div>

        <!-- Step 2 -->
        <div class="flex items-center gap-2">
          <div
            :class="[
              currentStep >= 1
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-500',
            ]"
            class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
          >
            2
          </div>
          <span
            :class="[
              currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground',
            ]"
            class="text-sm font-medium"
          >
            企业信息
          </span>
        </div>
      </div>
    </div>

    <!-- Step 1: 基本信息 -->
    <div v-if="currentStep === 0">
      <!-- 用户名 -->
      <div class="mb-4">
        <label class="mb-1.5 block text-sm font-medium">
          <span class="text-red-500">*</span> 用户名：
        </label>
        <input
          v-model="step1Form.username"
          :class="[step1Errors.username ? 'border-red-500' : '']"
          class="border-input bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm outline-none transition-colors"
          placeholder="请输入用户名"
          type="text"
        />
        <p v-if="step1Errors.username" class="mt-1 text-xs text-red-500">
          {{ step1Errors.username }}
        </p>
      </div>

      <!-- 邮箱 -->
      <div class="mb-4">
        <label class="mb-1.5 block text-sm font-medium">
          <span class="text-red-500">*</span> 邮箱：
        </label>
        <input
          v-model="step1Form.email"
          :class="[step1Errors.email ? 'border-red-500' : '']"
          class="border-input bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm outline-none transition-colors"
          placeholder="请输入邮箱"
          type="email"
        />
        <p v-if="step1Errors.email" class="mt-1 text-xs text-red-500">
          {{ step1Errors.email }}
        </p>
      </div>

      <!-- 验证码 -->
      <div class="mb-4">
        <label class="mb-1.5 block text-sm font-medium">
          <span class="text-red-500">*</span> 验证码：
        </label>
        <div class="flex gap-2">
          <input
            v-model="step1Form.code"
            :class="[step1Errors.code ? 'border-red-500' : '']"
            class="border-input bg-background focus:border-primary h-10 flex-1 rounded-md border px-3 text-sm outline-none transition-colors"
            placeholder="请输入验证码"
            type="text"
          />
          <button
            :class="[
              countdown > 0 || codeSending
                ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                : 'border-primary text-primary hover:bg-primary/5',
            ]"
            :disabled="countdown > 0 || codeSending"
            class="h-10 rounded-md border px-4 text-sm font-medium transition-colors"
            type="button"
            @click="handleSendCode"
          >
            {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
          </button>
        </div>
        <p v-if="step1Errors.code" class="mt-1 text-xs text-red-500">
          {{ step1Errors.code }}
        </p>
      </div>

      <!-- 密码 -->
      <div class="mb-4">
        <label class="mb-1.5 block text-sm font-medium">
          <span class="text-red-500">*</span> 密码：
        </label>
        <div class="relative">
          <input
            v-model="step1Form.password"
            :class="[step1Errors.password ? 'border-red-500' : '']"
            class="border-input bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm outline-none transition-colors"
            placeholder="密码"
            type="password"
            @input="checkPasswordStrength(step1Form.password)"
          />
        </div>
        <!-- 密码强度条 -->
        <div v-if="step1Form.password" class="mt-2">
          <div class="mb-1 flex gap-1">
            <div
              v-for="i in 4"
              :key="i"
              :style="{
                backgroundColor:
                  i <= passwordStrength ? passwordStrengthColor : '#e5e7eb',
              }"
              class="h-1 flex-1 rounded-full"
            ></div>
          </div>
          <p class="text-xs text-gray-500">
            使用 8 个或更多字符，混合字母、数字和符号
            <span
              v-if="passwordStrengthText"
              :style="{ color: passwordStrengthColor }"
            >
              （{{ passwordStrengthText }}）
            </span>
          </p>
        </div>
        <p v-else class="mt-1 text-xs text-gray-500">
          使用 8 个或更多字符，混合字母、数字和符号
        </p>
        <p v-if="step1Errors.password" class="mt-1 text-xs text-red-500">
          {{ step1Errors.password }}
        </p>
      </div>

      <!-- 确认密码 -->
      <div class="mb-6">
        <label class="mb-1.5 block text-sm font-medium">
          <span class="text-red-500">*</span> 确认密码：
        </label>
        <input
          v-model="step1Form.confirmPassword"
          :class="[step1Errors.confirmPassword ? 'border-red-500' : '']"
          class="border-input bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm outline-none transition-colors"
          placeholder="确认密码"
          type="password"
        />
        <p v-if="step1Errors.confirmPassword" class="mt-1 text-xs text-red-500">
          {{ step1Errors.confirmPassword }}
        </p>
      </div>

      <!-- 下一步按钮 -->
      <button
        :disabled="loading"
        class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        @click="handleNextStep"
      >
        {{ loading ? '验证中...' : '下一步' }}
      </button>
    </div>

    <!-- Step 2: 企业信息 -->
    <div v-if="currentStep === 1">
      <!-- 上级组织 -->
      <div class="mb-4">
        <label class="mb-1.5 block text-sm font-medium">
          <span class="text-red-500">*</span> 上级组织：
        </label>
        <TreeSelect
          v-model:value="step2Form.orgId"
          :class="[step2Errors.orgId ? 'ant-select-error' : '']"
          :field-names="{ label: 'title', value: 'value' }"
          :tree-data="orgTreeData"
          :tree-default-expand-all="true"
          placeholder="请选择上级组织"
        />
        <p v-if="step2Errors.orgId" class="mt-1 text-xs text-red-500">
          {{ step2Errors.orgId }}
        </p>
      </div>

      <!-- 公司名称 -->
      <div class="mb-4">
        <label class="mb-1.5 block text-sm font-medium"> 公司名称： </label>
        <input
          v-model="step2Form.companyName"
          class="border-input bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm outline-none transition-colors"
          placeholder="请输入公司名称"
          type="text"
        />
      </div>

      <!-- 公司地区 -->
      <div class="mb-6">
        <label class="mb-1.5 block text-sm font-medium"> 公司地区： </label>
        <Cascader
          v-model:value="step2Form.companyRegion"
          :load-data="handleRegionExpand"
          :loading="regionLoading"
          :options="regionOptions"
          change-on-select
          placeholder="请选择公司地区"
          @dropdown-visible-change="handleRegionDropdown"
        />
      </div>

      <!-- 按钮组 -->
      <div class="flex gap-3">
        <button
          :disabled="loading"
          class="border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 flex-1 rounded-md border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          @click="handlePrevStep"
        >
          上一步
        </button>
        <button
          :disabled="loading"
          class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 flex-1 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          @click="handleRegister"
        >
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </div>
    </div>

    <!-- 登录链接 -->
    <div class="mt-4 text-center text-sm">
      已经有账号了？
      <span class="vben-link text-sm font-normal" @click="goToLogin()">
        去登录
      </span>
    </div>
  </div>
</template>
