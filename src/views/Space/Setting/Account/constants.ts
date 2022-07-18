export const pageTabsData = [
  {
    title: '账户设置',
    description:
      '账户设置提供全局的账户信息管理，包含查看、完善账户信息，账户认证操作，通知列表设置等。',
    icon: 'cogwheel'
  }
]

export const accountSettings = [
  {
    label: '账户名:',
    dataIndex: 'name',
    disabled: true
  },
  {
    label: '账户 ID:',
    dataIndex: 'user_id',
    disabled: true
  },
  {
    dataIndex: 'email',
    label: '邮箱:',
    disabled: false
  },
  {
    dataIndex: 'password',
    label: '密码:',
    disabled: true
  }
]
