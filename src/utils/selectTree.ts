/* eslint-disable @typescript-eslint/no-unused-expressions,no-nested-ternary */
import { omit } from 'lodash-es'

interface TreeNode {
  value: any
  key: string | Symbol
  children?: TreeNode[]
}

type State = {
  selectedAll?: Set<string | Symbol>
  map: Map<string | Symbol, Set<string | Symbol>>
  openedAll?: Set<string | Symbol>
}

type TreeKeyChildrenMap = Map<
  string | Symbol,
  { pid: string | Symbol; children: Set<string | Symbol> }
>

export const rootSy = Symbol('root')
export const outSy = Symbol('out')

export function isRoot(tree: TreeNode): boolean {
  return tree.key === rootSy
}

function renderTreeNode(tree: TreeNode) {
  const map: TreeKeyChildrenMap = new Map()
  const getItem = (t: TreeNode) => {
    return omit(t, 'children')
    // {
    //   t
    // value: t.value,
    // key: t.key, // isOpen: s.openedAll.has(t.key as string),
    // isSelected: s.selectedAll.has(t.key as string)
    // }
  }

  map.set(tree.key, {
    pid: outSy,
    children: new Set(tree?.children?.map((t) => t.key) || []),
  })
  const list = [getItem(tree)]
  let children = (tree.children || []).map((n) => ({
    ...n,
    pid: tree.key,
    level: 1,
  }))
  while (Array.isArray(children) && children.length > 0) {
    const child = children[0]
    map.set(child.key, {
      pid: child.pid,
      children: new Set(child?.children?.map((c) => c.key) || []),
    })
    list.push(getItem(child))
    children = children.slice(1)
    if (Array.isArray(child.children) && child.children.length > 0) {
      children = (child.children || [])
        .map((n) => ({ ...n, pid: child.key, level: (child.level ?? 0) + 1 }))
        .concat(children)
    }
  }
  return { list, map }
}

class SelectTreeData {
  static rootKey = rootSy

  state: State

  root: TreeNode

  keyChildrenMap: TreeKeyChildrenMap

  list: Record<string, any>[] = []

  constructor(
    root: TreeNode,
    state: State = {
      selectedAll: new Set(),
      map: new Map(),
      openedAll: new Set(),
    }
  ) {
    this.state = state
    this.root = root
    this.keyChildrenMap = new Map()
    this.init()
  }

  // 设置节点列表
  init() {
    const { list, map } = renderTreeNode(this.root)
    new Set([
      ...Array.from(this.state?.map?.keys()),
      ...Array.from(this.state?.openedAll ?? []),
      ...Array.from(this.state?.selectedAll ?? []),
    ]).forEach((key) => {
      if (!map.has(key)) {
        this.state.map.delete(key)
        this.state?.openedAll?.delete(key)
        this.state?.selectedAll?.delete(key)
      }
    })

    this.keyChildrenMap = map
    this.list = list
  }

  // 选中节点
  onAdd(key: string | Symbol, withChildren = true, type: 1 | 2 = 1) {
    if (!this.keyChildrenMap.has(key)) {
      return
    }
    const { pid, children } = this.keyChildrenMap.get(key) || {}
    type === 1 && this.state.selectedAll?.add(key)
    if (pid) {
      this.state.map.has(pid)
        ? this.state.map.get(pid)?.add(key)
        : this.state.map.set(pid, new Set([key]))
      if (
        type === 1 &&
        this.keyChildrenMap.get(pid)?.children?.size ===
          this.state.map.get(pid)?.size
      ) {
        this.onAdd(pid, false)
      } else {
        this.onAdd(pid, false, 2)
      }
    }
    withChildren &&
      (children || []).forEach((c) => {
        if (!this.state.selectedAll?.has(c)) {
          this.onAdd(c)
        }
      })
  }

  onRemoveC = (key: string | Symbol, type: 1 | 2) => {
    if (!this.keyChildrenMap.has(key)) {
      return
    }
    const { pid, children } = this.keyChildrenMap.get(key) || {}
    this.state.selectedAll?.delete(key)

    if (type === 1) {
      this.state.map.delete(key)
      pid && this.state.map.has(pid) && this.state.map?.get(pid)?.delete(key)
    }
    ;(children || []).forEach((c) => {
      this.onRemove(c, 1)
    })
  }

  onRemoveP = (key: string | Symbol, type: 1 | 2) => {
    if (key === outSy || !this.keyChildrenMap.has(key)) {
      return
    }
    const { pid } = this.keyChildrenMap.get(key) || {}

    if (!pid || pid === outSy) {
      return
    }
    this.state.selectedAll?.delete(key)

    if (type === 1) {
      this.state.map.delete(key)
      this.state.map.has(pid) && this.state.map?.get(pid)?.delete(key)
    }
    this.onRemoveP(pid, this.state.map.get(pid)?.size !== 0 ? 2 : 1)
  }

  // 取消节点
  onRemove(key: string | Symbol, type: 1 | 2 = 1) {
    this.onRemoveP(key, type)
    this.onRemoveC(key, type)
  }

  // 添加节点
  setChildren(nodeKey: string, children: TreeNode[]) {
    // console.log(1111, nodeKey, children)
    let list = [this.root]
    while (Array.isArray(list) && list.length > 0) {
      const node = list[0]
      if (node.key === nodeKey) {
        node.children = children
        this.keyChildrenMap.set(nodeKey, {
          pid: this.keyChildrenMap.get(nodeKey)?.pid!,
          children: new Set(children.map((c) => c.key)),
        })
        children.forEach((c) => {
          this.keyChildrenMap.set(c.key, { pid: nodeKey, children: new Set() })
        })
        const index = this.list.findIndex((n) => n.key === nodeKey)
        this.list = [
          ...this.list.slice(0, index + 1),
          ...children.map((i) => ({
            ...i,
            level: (this.list[index].level ?? 0) + 1,
          })),
          ...this.list.slice(index + 1),
        ]

        if (this.state.selectedAll?.has(nodeKey)) {
          children.forEach((c) => {
            this.state.selectedAll?.add(c.key)
            this.state.map?.has(nodeKey)
              ? this.state.map?.get(nodeKey)?.add(c.key)
              : this.state.map.set(nodeKey, new Set([c.key]))
          })
        }
        return
      }
      if (Array.isArray(node.children) && node.children.length > 0) {
        list = node.children.concat(list.slice(1))
      } else {
        list = list.slice(1)
      }
    }
  }

  // 获取节点列表
  getList(cb: (node: Record<string, any>) => any = (d) => d) {
    return this.list
      .filter((i) => i.key !== rootSy)
      .map((item) =>
        cb({
          ...item,
          isOpened: this.state.openedAll?.has(item.key),
          isSelected: this.state.selectedAll?.has(item.key)
            ? 1
            : this.state.map.get(item.key)?.size
            ? 2
            : 0,
        })
      )
  }

  getSelectedKeys() {
    return Array.from(this.state.selectedAll ?? [])
  }

  setSelectedKeys(keys: string[]) {
    this.onRemove(rootSy)
    keys.forEach((key) => {
      this.onAdd(key)
    })
  }

  onOpen(key: string) {
    // 关闭
    // 后续子节点全关
    if (this.state.openedAll?.has(key)) {
      this.state.openedAll?.delete(key)
      let node: Record<string, any> | undefined
      let flag = false
      for (let i = 0; i < this.list.length; i += 1) {
        if (node && node.level >= this.list[i].level) {
          break
        }
        if (this.list[i].key === key) {
          node = this.list[i]
          flag = true
        }
        if (flag) {
          this.state.openedAll?.delete(this.list[i].key)
        }
      }
    } else {
      // 开启
      ;[key, ...(this.keyChildrenMap?.get(key)?.children || [])].map((i) =>
        this.state.openedAll?.add(i)
      )
    }
  }
}

export default SelectTreeData
