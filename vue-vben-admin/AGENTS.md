# 项目信息

## 业务 API 文档

后端地址: `http://gxcah.com:8077` Swagger UI: `http://gxcah.com:8077/swagger/index.html` Swagger JSON: `http://gxcah.com:8077/swagger/v1/swagger.json`

认证方式: Bearer JWT Token

### API 分组总览

#### 1. 认证 (Login)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/v1/auth/login` | 登录 (LoginUser: username, password) |
| POST | `/v1/auth/VerifyCodeLogin` | 验证码登录 (VerifyCodeLoginRequest: phoneNumber, code) |
| GET | `/v1/auth/userinfo` | 获取当前用户信息 |
| GET | `/v1/auth/codes` | 获取用户权限码 |
| POST | `/v1/auth/logout` | 退出登录 (query: token) |
| GET | `/v1/auth/getstaff_organizationstructure` | 获取用户组织机构 |

#### 2. 账号绑定 (AccountBinding)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/v1/account-binding/send-code` | 发送绑定验证码 |
| POST | `/v1/account-binding/verify-password` | 验证登录密码，获取一次性身份Token |
| POST | `/v1/account-binding/bind` | 首次绑定手机/邮箱 |
| POST | `/v1/account-binding/rebind` | 换绑手机/邮箱 |
| POST | `/v1/account-binding/unbind` | 解绑手机/邮箱 |

#### 3. 验收单 (Acceptance)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/v1/Acceptance/Getacceptance_sheets` | 查询验收单列表 (分页) |
| POST | `/v1/Acceptance/add` | 添加验收单 (AcceptanceData) |
| GET | `/v1/Acceptance/detail/{sheetId}` | 获取验收单详情 |
| PATCH | `/v1/Acceptance/status/{sheetId}` | 更新验收单状态 |
| POST | `/v1/Acceptance/batch-delete` | 批量删除验收单 |
| GET | `/v1/Acceptance/GetStorebyStatus` | 获取待验收的门店下拉 |
| GET | `/v1/Acceptance/GetStorebyId` | 根据门店编号获取门店地址、安装时间 |
| GET | `/v1/Acceptance/GetEquipmentbyId` | 根据门店编号获取设备信息 |
| GET | `/v1/Acceptance/GetMaterials` | 查询辅材信息 (分页) |
| POST | `/v1/Acceptance/AddMaterial` | 添加辅材 |
| POST | `/v1/Acceptance/UpdateMaterial` | 修改辅材 |
| GET | `/v1/Acceptance/DeleteMaterial` | 删除辅材 |
| POST | `/v1/Acceptance/BatchDeleteMaterials` | 批量删除辅材 |

#### 4. 报警信息 (AlarmInformation)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/v1/AlarmInformation/GetAlarmDetails` | 获取报警详情 (支持device_code/store_id/时间/级别筛选) |
| GET | `/v1/AlarmInformation/GetStoreAlarmDetails` | 获取门店报警详情 |
| GET | `/v1/AlarmInformation/ResolveTheAlarm` | 解决报警 |
| GET | `/v1/AlarmInformation/storelist` | 获取报警门店列表 |

#### 5. 报警推送 (Alarminformationpush)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/v1/Alarminformationpush/GetAlarminformationpush` | 查询报警推送 (分页) |
| POST | `/v1/Alarminformationpush/AddAlarminformationpush` | 新增报警推送 |
| POST | `/v1/Alarminformationpush/UpdateAlarminformationpush` | 修改报警推送 |
| GET | `/v1/Alarminformationpush/DeleteAlarminformationpush` | 删除报警推送 |

#### 6. 报警规则 (AlarmRuleDetails)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/v1/AlarmRuleDetails/GetAlarmRuleDetails` | 查询报警规则列表 (分页) |
| POST | `/v1/AlarmRuleDetails/AddAlarmruledetails` | 添加报警规则 |
| GET | `/v1/AlarmRuleDetails/GetAlarmruledetailsByid` | 获取报警规则详情 |
| POST | `/v1/AlarmRuleDetails/updateAAlarmruledetails` | 修改报警规则 (存在更新/不存在新增) |
| GET | `/v1/AlarmRuleDetails/deleteAlarmruledetails` | 删除报警规则 |

#### 7. 地区信息 (CompanyRegional)

| 方法 | 路径                                      | 说明                 |
| ---- | ----------------------------------------- | -------------------- |
| GET  | `/v1/company-regional`                    | 查询地区信息         |
| GET  | `/v1/company-regional/lazy/{id}`          | 懒加载查询地区信息   |
| GET  | `/v1/company-regional/by-level`           | 根据等级查询地区信息 |
| GET  | `/v1/company-regional/GetCompanyRegional` | 根据父类编号获取子集 |

#### 8. 设备分类 (Device)

| 方法   | 路径                       | 说明         |
| ------ | -------------------------- | ------------ |
| GET    | `/v1/device/category/list` | 设备分类列表 |
| POST   | `/v1/device/category`      | 新增设备分类 |
| PUT    | `/v1/device/category/{id}` | 编辑设备分类 |
| DELETE | `/v1/device/category/{id}` | 删除设备分类 |

#### 9. 新机安装 (DeviceInstallation)

| 方法   | 路径                           | 说明                     |
| ------ | ------------------------------ | ------------------------ |
| POST   | `/v1/device-installation`      | 发起新机安装             |
| GET    | `/v1/device-installation/list` | 查询新机安装记录分页列表 |
| PUT    | `/v1/device-installation/{id}` | 编辑新机安装记录         |
| DELETE | `/v1/device-installation/{id}` | 软删除安装记录           |

#### 10. 设备参数 (DeviceParameter)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/v1/device-parameter/tree` | 获取完整设备参数树 |
| GET | `/v1/device-parameter/GetParameterTreeByvariable` | 获取变量属性树 |
| GET | `/v1/device-parameter/children/{parentId}` | 获取子节点 |
| GET | `/v1/device-parameter/tree-by-device/{deviceType}` | 按设备类型获取参数树 |
| GET | `/v1/device-parameter/detail/{id}` | 获取参数详情 |
| GET | `/v1/device-parameter/role-attributes/{rid}` | 按角色查询绑定属性 |

#### 11. 能耗 (Energy)

| 方法 | 路径                      | 说明     |
| ---- | ------------------------- | -------- |
| GET  | `/api/energy/test-recalc` | 测试重算 |

#### 12. 设备 (Equipment)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/v1/device-parameter/GetAllEquipment` | 设备查询 (分页) |
| POST | `/v1/device-parameter/AddEquipment` | 新增设备 |
| POST | `/v1/device-parameter/UpdateEquipment` | 更新设备 |
| GET | `/v1/device-parameter/DeleteEquipment/{device_code}` | 删除设备 |

#### 13. 设备数据 (EquipmentData)

| 方法 | 路径                                 | 说明     |
| ---- | ------------------------------------ | -------- |
| GET  | `/v1/EquipmentData/calculate-memory` | 计算存储 |

#### 14. 文件上传 (FileUploadPDF)

| 方法 | 路径                       | 说明        |
| ---- | -------------------------- | ----------- |
| POST | `/v1/FileUploadPDF/upload` | PDF文件上传 |

#### 15. 历史数据 (HistoryList)

| 方法 | 路径                                   | 说明             |
| ---- | -------------------------------------- | ---------------- |
| GET  | `/v1/HistoryList/GetHistoryData`       | 获取历史数据     |
| GET  | `/v1/HistoryList/Get7DaysDataByStore`  | 获取7天数据      |
| GET  | `/v1/HistoryList/GetHistoryOnlineData` | 获取历史在线数据 |
| GET  | `/v1/HistoryList/GetTempVariable`      | 获取温度变量     |
| GET  | `/v1/HistoryList/GetStoreTempInfo`     | 获取门店温度信息 |

#### 16. 图片 (Image)

| 方法 | 路径                         | 说明                     |
| ---- | ---------------------------- | ------------------------ |
| POST | `/v1/image/upload`           | 上传图片到本地服务器     |
| POST | `/v1/image/UploadLocalFiles` | 上传多张图片（自动压缩） |

#### 17. 菜单 (Menu2)

| 方法 | 路径                            | 说明           |
| ---- | ------------------------------- | -------------- |
| GET  | `/v1/Menu2/GetFullMenuTree`     | 获取完整菜单树 |
| GET  | `/v1/Menu2/getmenubystaff`      | 获取员工菜单   |
| GET  | `/v1/Menu2/GetRoleFullMenuTree` | 获取角色菜单树 |

#### 18. 国际化 (Messages)

| 方法   | 路径                          | 说明                         |
| ------ | ----------------------------- | ---------------------------- |
| GET    | `/v1/locale/messages`         | 获取指定语言的国际化文案     |
| POST   | `/v1/locale`                  | 新增多语言文案               |
| PUT    | `/v1/locale/{key}`            | 编辑多语言文案               |
| DELETE | `/v1/locale/{key}`            | 删除国际化文案               |
| GET    | `/{key}`                      | 根据Key查询多语言文案        |
| GET    | `/v1/locale/list`             | 多语言列表                   |
| GET    | `/v1/locale/check-key-exists` | 判断指定语言+FullKey是否存在 |

#### 19. MQTT (Mqtt)

| 方法 | 路径                           | 说明                           |
| ---- | ------------------------------ | ------------------------------ |
| POST | `/v1/Mqtt/publish`             | 连接MQTT并发布消息             |
| POST | `/v1/Mqtt/publishAll`          | 批量发布消息                   |
| POST | `/v1/Mqtt/batch-publish`       | 批量发布MQTT消息               |
| POST | `/v1/Mqtt/batch-publishmysql`  | 批量发布MQTT消息               |
| POST | `/v1/Mqtt/disconnect`          | 断开MQTT连接                   |
| POST | `/v1/Mqtt/publish-single-mqtt` | 单个设备发布MQTT消息           |
| GET  | `/v1/Mqtt/status`              | 获取连接状态                   |
| GET  | `/v1/Mqtt/GetpPublish`         | 查询发布记录                   |
| GET  | `/v1/Mqtt/get-device-data`     | 根据设备编号从MQTT获取实时数据 |

#### 20. 在线设备 (OnlineDevice)

| 方法 | 路径                                      | 说明             |
| ---- | ----------------------------------------- | ---------------- |
| GET  | `/v1/OnlineDevice`                        | 在线设备列表     |
| GET  | `/v1/OnlineDevice/GetOnlineDeviceCount`   | 获取在线设备数量 |
| GET  | `/v1/OnlineDevice/GetDevicemodels`        | 获取设备型号     |
| GET  | `/v1/OnlineDevice/GetAlarmStatistics`     | 获取报警统计     |
| POST | `/v1/OnlineDevice/GetStoreCountWithTotal` | 获取门店统计     |
| GET  | `/v1/OnlineDevice/all-status`             | 获取所有设备状态 |

#### 21. 组织架构 (Organizationstructure)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/v1/Organizationstructure/GetAllOrganizationstructure` | 获取所有组织架构 |
| GET | `/v1/Organizationstructure/GetOrganizationstructureTree` | 根据组织机构编号获取组织机构树 |
| POST | `/v1/Organizationstructure/AddOrganizationstructure` | 添加组织架构 |
| POST | `/v1/Organizationstructure/GetOrganizationstructureByName` | 判断组织机构是否存在 |
| POST | `/v1/Organizationstructure/UpdateOrganizationstructure` | 修改组织架构 |
| GET | `/v1/Organizationstructure/DeleteOrganizationstructure` | 删除组织架构 |
| GET | `/v1/Organizationstructure/GetOrganizationstructureTreeByToken` | 根据当前登录用户Token获取组织机构树 |

#### 22. 设备权限组 (PermissionGroup)

| 方法   | 路径                                      | 说明             |
| ------ | ----------------------------------------- | ---------------- |
| GET    | `/v1/system/device-permission-group/list` | 设备权限组列表   |
| POST   | `/v1/system/device-permission-group`      | 创建设备权限分组 |
| PUT    | `/v1/system/device-permission-group/{id}` | 更新设备权限分组 |
| DELETE | `/v1/system/device-permission-group/{id}` | 删除设备权限分组 |

#### 23. 实时数据 (RealtimeTest)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/v1/RealtimeTest/GetDeviceByStoreId` | 根据门店获取设备 |
| GET | `/v1/RealtimeTest/GetDeviceInfoBySN` | 根据SN获取设备信息 |
| GET | `/v1/RealtimeTest/GetAlarmlevel` | 获取报警级别 |
| GET | `/v1/RealtimeTest/GetAlarmlevelBydevice_code` | 根据设备获取报警级别 |
| GET | `/v1/RealtimeTest/GetTodayAlarmRecords` | 获取今日报警记录 |
| GET | `/v1/RealtimeTest/GetAlarmRecordsAll` | 获取全部报警记录 |
| GET | `/v1/RealtimeTest/GetUserUnreadAlarmCount` | 获取当前用户未读报警通知总数 |
| GET | `/v1/RealtimeTest/test` | 测试接口 |

#### 24. 角色 (Role)

| 方法 | 路径                                        | 说明           |
| ---- | ------------------------------------------- | -------------- |
| GET  | `/v1/RoleController/GetAllRole`             | 获取所有角色   |
| GET  | `/v1/RoleController/GetRoleByName`          | 按名称获取角色 |
| GET  | `/v1/RoleController/GetAllRoleByName`       | 按名称模糊查询 |
| POST | `/v1/RoleController/AddRole`                | 添加角色       |
| POST | `/v1/RoleController/UpdateRole`             | 修改角色       |
| GET  | `/v1/RoleController/DeleteRole`             | 删除角色       |
| POST | `/v1/RoleController/setRolePermissions`     | 设置角色权限   |
| GET  | `/v1/RoleController/GetRoleResourceWithOrg` | 获取角色资源   |

#### 25. 系统角色 (Role_Menu)

| 方法   | 路径                   | 说明         |
| ------ | ---------------------- | ------------ |
| GET    | `/v1/system/role/list` | 系统角色列表 |
| POST   | `/v1/system/role`      | 创建系统角色 |
| PUT    | `/v1/system/role/{id}` | 更新系统角色 |
| DELETE | `/v1/system/role/{id}` | 删除系统角色 |

#### 26. 员工 (Satff)

| 方法 | 路径                                           | 说明             |
| ---- | ---------------------------------------------- | ---------------- |
| GET  | `/v1/Satff/GetStaffByOrganizationstructure`    | 按组织获取员工   |
| GET  | `/v1/Satff/GetStaffByRealName`                 | 按姓名获取员工   |
| POST | `/v1/Satff/GetStaddbyPhoneNum`                 | 按手机号获取     |
| GET  | `/v1/Satff/GetApprovedByAccount`               | 审批查询         |
| GET  | `/v1/Satff/GetStaffAllByOrganizationstructure` | 获取组织所有员工 |
| POST | `/v1/Satff/Register`                           | 注册             |
| GET  | `/v1/Satff/Emailcode`                          | 邮箱验证码       |
| GET  | `/v1/Satff/CheckEmailCode`                     | 校验邮箱验证码   |
| POST | `/v1/Satff/AddStaff`                           | 添加员工         |
| POST | `/v1/Satff/UpdateStaff`                        | 修改员工         |
| POST | `/v1/Satff/SetDisable`                         | 禁用/启用员工    |
| GET  | `/v1/Satff/verifyCurrentUserPassword`          | 验证当前密码     |
| POST | `/v1/Satff/setStaffRole`                       | 设置员工角色     |
| GET  | `/v1/Satff/DeleteStaff`                        | 删除员工         |
| POST | `/v1/Satff/ChangePwd`                          | 修改登录密码     |
| POST | `/v1/Satff/ResetPwd`                           | 密码重置         |

#### 27. SSE 实时推送 (Sse)

| 方法 | 路径                               | 说明           |
| ---- | ---------------------------------- | -------------- |
| GET  | `/v1/Sse/connect`                  | SSE 连接       |
| GET  | `/v1/Sse/count`                    | 连接数         |
| GET  | `/v1/Sse/cleanup-dead-connections` | 清理死连接     |
| POST | `/v1/Sse/test-broadcast`           | 测试广播       |
| POST | `/v1/Sse/test-store`               | 测试门店消息   |
| POST | `/v1/Sse/test-admin`               | 测试管理员消息 |
| POST | `/v1/Sse/mark-as-read`             | 标记已读       |
| GET  | `/v1/Sse/unread-count`             | 未读数量       |
| GET  | `/v1/Sse/message-history`          | 消息历史       |

#### 28. 门店 (store)

| 方法 | 路径                       | 说明             |
| ---- | -------------------------- | ---------------- |
| POST | `/v1/store/Getstore`       | 获取门店列表     |
| GET  | `/v1/store/GetStoreByName` | 根据名称获取门店 |
| GET  | `/v1/store/GetByStoreId`   | 根据ID获取门店   |
| POST | `/v1/store/Addstore`       | 添加门店         |
| POST | `/v1/store/UpdateStore`    | 修改门店         |
| GET  | `/v1/store/Deletestore`    | 删除门店         |
| GET  | `/v1/store/GetstoreById`   | 根据ID获取门店   |

#### 29. 门店标注 (StoreAnnotation)

| 方法 | 路径                                     | 说明         |
| ---- | ---------------------------------------- | ------------ |
| POST | `/v1/StoreAnnotation/save`               | 保存标注     |
| GET  | `/v1/StoreAnnotation/get`                | 获取标注     |
| POST | `/v1/StoreAnnotation/delete`             | 删除标注     |
| GET  | `/v1/StoreAnnotation/getStoreAnnotation` | 获取门店标注 |

#### 30. 门店安装 (StoreInstallation)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/v1/StoreInstallation/AddStoreInstallation` | 添加安装信息 |
| GET | `/v1/StoreInstallation/GetStoreInstallationList` | 获取安装列表 |
| GET | `/v1/StoreInstallation/GetStoreInstallationDetail` | 获取安装详情 |
| POST | `/v1/StoreInstallation/UpdateStoreInstallation` | 更新安装信息 |
| POST | `/v1/StoreInstallation/DeleteStoreInstallation` | 删除安装信息 |
| GET | `/v1/StoreInstallation/GetInstallers` | 获取安装人员 |
| GET | `/v1/StoreInstallation/GetEquipmentById` | 获取设备详情 |
| GET | `/v1/StoreInstallation/GetEquipments` | 获取设备列表 |
| POST | `/v1/StoreInstallation/UploadEquipmentImageByUrls` | 上传设备图片 |
| GET | `/v1/StoreInstallation/GetImagesByinstallationId` | 获取安装图片 |
| POST | `/v1/StoreInstallation/DeleteImageById` | 删除图片 |
| POST | `/v1/StoreInstallation/EditEquipmentImagesByEquipmentId` | 编辑设备图片 |
| GET | `/v1/StoreInstallation/GetDeviceInfoBySN` | 根据SN获取设备信息 |

#### 31. 门店树 (StoreTree)

| 方法 | 路径                            | 说明           |
| ---- | ------------------------------- | -------------- |
| GET  | `/v1/StoreTree/StaffStoreTree`  | 员工门店树     |
| GET  | `/v1/StoreTree/GetStoreTreeAll` | 获取完整门店树 |
| GET  | `/v1/StoreTree/GetStoreTreeA`   | 获取门店树A    |
| POST | `/v1/StoreTree/GetAll`          | 获取全部       |

#### 32. 系统菜单 (sys_menu)

| 方法 | 路径                           | 说明       |
| ---- | ------------------------------ | ---------- |
| GET  | `/v1/sys_menu/GetMenuTreeList` | 菜单树列表 |
| GET  | `/v1/sys_menu/getmenubystaff`  | 员工菜单   |
| POST | `/v1/sys_menu/add`             | 添加菜单   |
| POST | `/v1/sys_menu/update/{id}`     | 更新菜单   |
| GET  | `/v1/sys_menu/delete/{id}`     | 删除菜单   |
| GET  | `/v1/sys_menu/detail/{id}`     | 菜单详情   |

#### 33. 新菜单 (SystemMenu)

| 方法 | 路径                                    | 说明     |
| ---- | --------------------------------------- | -------- |
| POST | `/v1/SystemMenu/AddMenu`                | 添加菜单 |
| POST | `/v1/SystemMenu/UpdateMenu`             | 更新菜单 |
| GET  | `/v1/SystemMenu/DeleteMenu/{menuId}`    | 删除菜单 |
| GET  | `/v1/SystemMenu/GetMenuDetail/{menuId}` | 菜单详情 |
| GET  | `/v1/SystemMenu/GetMenuTree`            | 菜单树   |
| GET  | `/v1/SystemMenu/GetMenuList`            | 菜单列表 |

#### 34. 系统菜单备份 (SystemMenuBackup)

| 方法   | 路径                              | 说明                     |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/v1/system/menu/list`            | 系统菜单列表             |
| GET    | `/v1/system/menu/{id}`            | 系统菜单详情             |
| POST   | `/v1/system/menu`                 | 创建系统菜单             |
| PUT    | `/v1/system/menu/{id}`            | 更新系统菜单             |
| DELETE | `/v1/system/menu/{id}`            | 删除系统菜单             |
| GET    | `/v1/system/menu/GetMenuByRoleId` | 根据角色编号获取菜单权限 |
| GET    | `/v1/system/menu/name-exists`     | 校验菜单名称是否存在     |
| GET    | `/v1/system/menu/path-exists`     | 校验菜单路径是否存在     |

#### 35. 系统资源模块 (systemresourcemodule)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/v1/systemresourcemoduleController/GetAllsystemresourcemodule` | 获取所有资源模块 |
| POST | `/v1/systemresourcemoduleController/Addsystemresourcemodule` | 添加资源模块 |
| POST | `/v1/systemresourcemoduleController/Updatesystemresourcemodule` | 修改资源模块 |
| GET | `/v1/systemresourcemoduleController/Deletesystemresourcemodule` | 删除资源模块 |

#### 36. 设备模板 (Template)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/v1/template/GetTemplateList` | 获取模板列表 |
| GET | `/v1/template/GettemplatedeviceparameterbyTemplate` | 获取模板设备参数 |
| POST | `/v1/template/AddTemplate` | 添加模板 |
| POST | `/v1/template/deleteTemplate` | 删除模板 |
| GET | `/v1/template/getTempateBytId` | 根据ID获取模板 |
| POST | `/v1/template/UpdateTemplate` | 修改模板 |
| POST | `/v1/template/updateTemplate_device_parameter` | 更新模板设备参数 |
| POST | `/v1/template/AddSecondaryMenuforTemplateProperties` | 添加二级菜单属性 |
| POST | `/v1/template/AddTemplate_device_parameter` | 添加模板设备参数 |
| POST | `/v1/template/DeleteTemplate_device_parameter` | 删除设备属性 |
| GET | `/v1/template/GetTemplateDeviceParameterTreeByTemplate` | 获取模板参数树 |
| POST | `/v1/template/pinTemplate_device_parameter` | 修改设备参数置顶状态 |
| POST | `/v1/template/setCardVisible` | 设置设备参数卡片是否显示 |

#### 37. 用户菜单 (UserMenu)

| 方法 | 路径                 | 说明                     |
| ---- | -------------------- | ------------------------ |
| POST | `/v1/user/menu/list` | 获取当前登录用户的菜单树 |

#### 38. 验证码 (VerificationCode)

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/v1/VerificationCode/send-verification-code` | 发送验证码短信 |
| POST | `/v1/VerificationCode/verify` | 验证手机验证码是否正确 |

#### 39. 微信 (WeChat)

| 方法 | 路径                        | 说明                  |
| ---- | --------------------------- | --------------------- |
| POST | `/v1/wechat/bind/qrcode`    | 微信绑定二维码        |
| GET  | `/v1/wechat/bind/callback`  | 微信绑定回调          |
| POST | `/v1/wechat/unbind`         | 微信解绑              |
| GET  | `/v1/wechat/bind/info`      | 微信绑定信息          |
| POST | `/v1/wechat/login/qrcode`   | 微信登录二维码        |
| GET  | `/v1/wechat/login/callback` | 微信OAuth扫码授权回调 |

#### 40. 工作流 (Workflow)

| 方法 | 路径                             | 说明           |
| ---- | -------------------------------- | -------------- |
| GET  | `/v1/workflow/definition/list`   | 工作流定义列表 |
| POST | `/v1/workflow/instance/create`   | 创建工作流实例 |
| GET  | `/v1/workflow/instance/{id}`     | 获取实例详情   |
| GET  | `/v1/workflow/instance/my-tasks` | 我的任务列表   |
| POST | `/v1/workflow/node/complete`     | 完成节点       |
| POST | `/v1/workflow/node/reject`       | 驳回节点       |
| POST | `/v1/workflow/instance/cancel`   | 取消实例       |
| GET  | `/v1/workflow/GetTokenStaff`     | 获取Token员工  |

#### 41. DeepSeek AI

| 方法 | 路径              | 说明                 |
| ---- | ----------------- | -------------------- |
| POST | `/Generate`       | DeepSeek AI 生成     |
| POST | `/GenerateStream` | DeepSeek AI 流式生成 |

### 通用响应格式

```json
{
  "code": 0, // 0成功，非0失败
  "data": {},
  "error": "",
  "message": ""
}
```

### 前后端对接说明

当前 mock API 路径:

- `/api/auth/login` → 需要改为 `/v1/auth/login`
- `/api/auth/codes` → 需要改为 `/v1/auth/codes`
- `/api/menu/all` → 需要改为 `/v1/Menu2/getmenubystaff`
- `/api/user/info` → 需要改为 `/v1/auth/userinfo`

配置文件: `apps/web-antd/src/api/request.ts` 中 `apiURL` 通过 `useAppConfig` 获取。环境变量需配置 `VITE_API_URL=http://gxcah.com:8077`
