import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react-lite'
import { Layout, Menu } from 'antd'
import React, { useState } from 'react'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { EnFiHeader } from 'views/Space/Header/EnFiHeader'
import tw, { styled } from 'twin.macro'
import { Center } from 'components'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { flattenDeep } from 'lodash-es'
import { MenuType } from 'stores/GlobalStore'
import logo from 'assets/enfi/logo.png'

const { Sider, Content } = Layout

const Root = styled.div`
  .ant-layout {
    background-color: #f0f2f5;
  }
  &.antd-layout {
    background-color: #fff !important;
    .ant-layout-content {
      height: calc(100vh - 54px);
      overflow: auto;
    }
    .ant-menu-item {
      .icon .qicon {
        fill: #333333;
      }
    }
    .ant-menu-title-content {
      font-weight: 400;
      color: #666666;
    }
    .ant-menu-item-selected {
      background: #024d8e !important;
      // border-left: 2px solid #024d8e !important;
      &::after {
        opacity: 0 !important;
      }
      .icon .qicon {
        color: #fff !important;
      }
      .ant-menu-title-content {
        font-weight: 400;
        color: #fff !important;
      }
    }
    .ant-menu-item:hover {
      color: #024d8e !important;
      // .icon .qicon {
      //   color: #024d8e !important;
      //   fill: #b6c2cd !important;
      // }
    }
    .ant-menu-inline-collapsed {
      .ant-menu-item-icon {
        vertical-align: middle !important;
      }
    }
  }
`

const items = [
  {
    name: 'overview',
    label: '概览',
    icon: <Icon name="enfi-overview" size={20} />,
    key: 'overview'
  },
  {
    name: 'workspace',
    label: '工作空间',
    icon: <Icon name="enfi-workspace" size={18} />,
    key: 'workspace'
  }
]

const getLinks = (items1: MenuType[]): any =>
  items1.map((item) => (item.items ? getLinks(item.items) : `/${item.name}`))

const EnfiLayout = observer(({ children }) => {
  const match = useRouteMatch(flattenDeep(getLinks(items as any)))
  const [collapsed, setCollapsed] = useState(false)
  const history = useHistory()
  return (
    <Root className="antd-layout">
      <Layout style={{ height: '100vh' }}>
        <Layout className="site-layout">
          {match && (
            <Sider
              tw="bg-[#f5faff]"
              collapsible
              collapsed={collapsed}
              trigger={null}
              onCollapse={(value) => setCollapsed(value)}
            >
              <div className="logo">
                <Center
                  tw="bg-[#F5FAFF] pl-3 pt-4 pr-3 pb-3 text-[16px] font-medium h-[56px]"
                  css={!collapsed ? tw`justify-between` : tw`justify-center`}
                >
                  {!collapsed && (
                    <div>
                      <img src={logo} alt="" />
                    </div>
                  )}
                  {false &&
                    React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                      className: 'trigger',
                      style: {
                        fontSize: 18
                      },
                      onClick: () => setCollapsed(!collapsed)
                    })}
                </Center>
              </div>
              <Menu
                theme="light"
                tw="bg-[#f5faff]"
                defaultSelectedKeys={[match.path.slice(1)]}
                mode="inline"
                items={items}
                onClick={(e) => {
                  history.push(`/${e.key}`)
                }}
              />
            </Sider>
          )}
          <Layout>
            <EnFiHeader />
            <Content>{children}</Content>
          </Layout>
        </Layout>
      </Layout>
    </Root>
  )
})

export default EnfiLayout
