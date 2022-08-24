import { getHelpCenterLink } from 'utils/index'

export const memberTabs = [
  {
    title: '成员管理',
    description:
      '工作空间为您提供了拥有不同功能权限的角色，您可以根据业务需求，添加目标成员至工作空间，并授予其相应的角色，实现细粒度的权限管控。每位成员可以拥有一到多个角色。',
    icon: 'user-profile',
    helpLink: getHelpCenterLink('/manual/mgt_workspace/member/add_member/')
  }
]

export enum RoleType {
  SpaceAdmin = 1,
  SpaceDeveloper,
  SpaceOperator,
  SpaceVisitor
}

// export enum MemberOpType {
//   LIST = 1 << 0,
//   Create = 1 << 1,
//   Update = 1 << 2,
//   UpdatePending = 1 << 3,
//   Delete = 1 << 4,
// }

export const columnSettingsKey = 'member-table-bar-columns'
