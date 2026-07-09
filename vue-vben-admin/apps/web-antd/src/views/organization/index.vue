<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Form,
  FormItem,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  TreeSelect,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import type { OrganizationItem, OrganizationTreeNode } from '#/api/organization';

import {
  addOrganizationstructure,
  deleteOrganizationstructure,
  getAllOrganizationstructure,
  updateOrganizationstructure,
} from '#/api/organization';

const loading = ref(false);
const treeData = ref<OrganizationTreeNode[]>([]);
const allData = ref<OrganizationItem[]>([]);

const modalVisible = ref(false);
const modalTitle = ref('添加组织');
const confirmLoading = ref(false);

const formState = reactive({
  code: '',
  id: undefined as number | undefined,
  name: '',
  parentId: undefined as number | undefined,
});

function buildTree(list: OrganizationItem[]): OrganizationTreeNode[] {
  const map = new Map<number, OrganizationTreeNode>();
  const roots: OrganizationTreeNode[] = [];
  for (const item of list) {
    map.set(item.id, { ...item, children: [] });
  }
  for (const item of list) {
    const node = map.get(item.id)!;
    if (item.parentId && item.parentId !== 0 && map.has(item.parentId)) {
      map.get(item.parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

const treeSelectData = computed(() => {
  const items = allData.value.map((d) => ({
    id: d.id,
    name: d.name,
    parentId: d.parentId,
  }));
  return buildTree(items);
});

const treeSelectTreeData = computed(() => {
  function toTreeSelect(nodes: OrganizationTreeNode[]): any[] {
    return nodes.map((n) => ({
      title: n.name,
      value: n.id,
      children: n.children ? toTreeSelect(n.children) : [],
    }));
  }
  return toTreeSelect(treeSelectData.value);
});

async function fetchData() {
  loading.value = true;
  try {
    const res = await getAllOrganizationstructure();
    allData.value = res as any;
    treeData.value = buildTree(res as any);
  } catch {
    message.error('获取组织数据失败');
  } finally {
    loading.value = false;
  }
}

function handleAdd(parentId?: number) {
  modalTitle.value = '添加组织';
  formState.id = undefined;
  formState.name = '';
  formState.code = '';
  formState.parentId = parentId;
  modalVisible.value = true;
}

function handleEdit(row: OrganizationItem) {
  modalTitle.value = '编辑组织';
  formState.id = row.id;
  formState.name = row.name || '';
  formState.code = row.code || '';
  formState.parentId = row.parentId || undefined;
  modalVisible.value = true;
}

async function handleDelete(row: OrganizationItem) {
  try {
    await deleteOrganizationstructure(row.id);
    message.success('删除成功');
    await fetchData();
  } catch {
    message.error('删除失败');
  }
}

async function handleConfirm() {
  if (!formState.name) {
    message.warning('请输入组织名称');
    return;
  }
  confirmLoading.value = true;
  try {
    const payload: Partial<OrganizationItem> = {
      code: formState.code,
      id: formState.id,
      name: formState.name,
      parentId: formState.parentId || 0,
    };
    if (formState.id) {
      await updateOrganizationstructure(payload);
      message.success('修改成功');
    } else {
      await addOrganizationstructure(payload);
      message.success('添加成功');
    }
    modalVisible.value = false;
    await fetchData();
  } catch {
    message.error(formState.id ? '修改失败' : '添加失败');
  } finally {
    confirmLoading.value = false;
  }
}

function formatTime(val?: string) {
  if (!val) return '-';
  return val.replace('T', ' ').replace(/\.\d{3}Z?$/, '');
}

const gridOptions = computed(() => ({
  columns: [
    { type: 'seq', title: '序号', width: 80 },
    { field: 'name', title: '组织名称', minWidth: 250, treeNode: true },
    {
      field: 'createTime',
      title: '创建时间',
      width: 200,
      formatter: ({ row }: any) => formatTime(row.createTime),
    },
    {
      field: 'updateTime',
      title: '更新时间',
      width: 200,
      formatter: ({ row }: any) => formatTime(row.updateTime),
    },
    { field: 'code', title: '操作人', width: 120 },
    {
      field: 'actions',
      title: '操作',
      width: 180,
      slots: { default: 'actions' },
    },
  ],
  data: flatData.value,
  height: 'auto',
  pagerConfig: { enabled: false },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: true,
  },
}));

function flattenTree(nodes: OrganizationTreeNode[]): any[] {
  const result: any[] = [];
  function walk(list: OrganizationTreeNode[]) {
    for (const node of list) {
      result.push({ ...node });
      if (node.children && node.children.length > 0) {
        walk(node.children);
      }
    }
  }
  walk(nodes);
  return result;
}

const flatData = computed(() => flattenTree(treeData.value));

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

const expandAll = () => {
  gridApi.grid?.setAllTreeExpand(true);
};

const collapseAll = () => {
  gridApi.grid?.setAllTreeExpand(false);
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <Page content-class="h-full">
    <Grid table-title="组织管理">
      <template #toolbar-tools>
        <Space>
          <Button type="primary" @click="handleAdd()">添加组织</Button>
          <Button @click="expandAll">全部展开</Button>
          <Button @click="collapseAll">全部收起</Button>
        </Space>
      </template>
      <template #actions="{ row }">
        <Space>
          <Button size="small" type="primary" @click="handleEdit(row)">
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该组织吗？"
            @confirm="handleDelete(row)"
          >
            <Button danger size="small" type="primary">删除</Button>
          </Popconfirm>
        </Space>
      </template>
    </Grid>

    <Modal
      v-model:open="modalVisible"
      :confirm-loading="confirmLoading"
      :title="modalTitle"
      @cancel="modalVisible = false"
      @ok="handleConfirm"
    >
      <Form
        :label-col="{ span: 5 }"
        :model="formState"
        :wrapper-col="{ span: 18 }"
        layout="horizontal"
      >
        <FormItem label="组织名称" required>
          <Input v-model:value="formState.name" placeholder="请输入组织名称" />
        </FormItem>
        <FormItem label="组织编码">
          <Input v-model:value="formState.code" placeholder="请输入组织编码" />
        </FormItem>
        <FormItem label="上级组织">
          <TreeSelect
            v-model:value="formState.parentId"
            :allow-clear="true"
            :tree-data="treeSelectTreeData"
            placeholder="无上级则不选"
            tree-default-expand-all
          />
        </FormItem>
      </Form>
    </Modal>
  </Page>
</template>
