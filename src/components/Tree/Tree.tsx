import { useCallback } from 'react'
import RCtree, { TreeNodeProps, TreeProps } from 'rc-tree'
import { Global } from '@emotion/react'
import { styled } from 'twin.macro'
import { Icon } from '@QCFE/lego-ui'
import { Loading } from '@QCFE/qingcloud-portal-ui'
import rcStyled from './styled'

const TreeWrapper = styled('div')(() => [])

export const Tree = (props: TreeProps) => {
  const renderIcon = useCallback((node) => {
    const { isLeaf, loading } = node
    if (loading) {
      return <Loading size={16} />
    }
    return <Icon name={isLeaf ? 'file' : 'folder'} type="light" />
  }, [])
  const renderSwitcherIcon = useCallback((node: TreeNodeProps) => {
    const { expanded, isLeaf } = node
    if (!isLeaf) {
      return (
        <Icon name={expanded ? 'caret-down' : 'caret-right'} type="light" />
      )
    }
    return null
  }, [])
  return (
    <TreeWrapper>
      <Global styles={rcStyled} />
      <RCtree icon={renderIcon} switcherIcon={renderSwitcherIcon} {...props} />
    </TreeWrapper>
  )
}

export default Tree
