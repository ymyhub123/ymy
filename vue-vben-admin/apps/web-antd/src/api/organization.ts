import { requestClient } from '#/api/request';

export interface OrganizationItem {
  code?: string;
  createTime?: string;
  id: number;
  isDel?: boolean;
  level?: number;
  name?: string;
  parentId?: number;
  path?: number[];
  updateTime?: string;
}

export interface OrganizationTreeNode extends OrganizationItem {
  children?: OrganizationTreeNode[];
}

/** 获取所有组织架构 */
export function getAllOrganizationstructure() {
  return requestClient.get<OrganizationItem[]>(
    '/v1/Organizationstructure/GetAllOrganizationstructure',
    { params: { isGetToken: false } },
  );
}

/** 添加组织架构 */
export function addOrganizationstructure(data: Partial<OrganizationItem>) {
  return requestClient.post(
    '/v1/Organizationstructure/AddOrganizationstructure',
    data,
  );
}

/** 修改组织架构 */
export function updateOrganizationstructure(data: Partial<OrganizationItem>) {
  return requestClient.post(
    '/v1/Organizationstructure/UpdateOrganizationstructure',
    data,
  );
}

/** 删除组织架构 */
export function deleteOrganizationstructure(orgId: number) {
  return requestClient.get(
    '/v1/Organizationstructure/DeleteOrganizationstructure',
    { params: { orgId } },
  );
}
