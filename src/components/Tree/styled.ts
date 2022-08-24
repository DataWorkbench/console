import tw, { css } from 'twin.macro'

const rcTreeStyle = css`
  .rc-tree {
    margin: 0;
    border: 0;
    &-focused:not(.rc-tree-active-focused) {
    }
    .rc-tree-treenode {
      margin: 0;
      padding: 0;
      padding-left: 8px;
      line-height: 28px;
      white-space: nowrap;
      list-style: none;
      outline: 0;
      ${tw`flex items-center w-full hover:bg-neut-15`}
      .draggable {
        ${tw`select-none`}
      }
      &.dragging {
        ${tw`bg-neut-13`}
      }
      &.drop-container {
        > .draggable::after {
        }
        & ~ .rc-tree-treenode {
          ${tw`border-l border-solid border-l-red-10`}
        }
      }

      &.drop-target {
        background-color: yellowgreen;
        ${tw`bg-green-11`}
        & ~ .rc-tree-treenode {
          ${tw`border-l-0`}
        }
      }
      &.filter-node {
      }

      &.rc-tree-treenode-selected {
        ${tw`bg-green-11 bg-opacity-30`}
      }
      .rc-tree-node-content-wrapper {
        ${tw`relative h-7 m-0 p-0 no-underline cursor-pointer inline-flex items-center flex-1`}
        .rc-tree-title {
          ${tw`flex-1`}
        }
      }

      span.rc-tree-switcher {
        ${tw`flex-none`}
      }
      span {
        &.rc-tree-switcher,
        &.rc-tree-checkbox,
        &.rc-tree-iconEle {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 4px;
          line-height: 16px;
          vertical-align: 2px;
          border: 0 none;
          outline: none;
          cursor: pointer;
        }
        &.rc-tree-icon_loading {
        }
        &.rc-tree-switcher {
          &.rc-tree-switcher-noop {
            cursor: auto;
          }
          &.rc-tree-switcher_open {
          }
          &.rc-tree-switcher_close {
          }
        }
        &.rc-tree-checkbox {
        }
      }
    }
    &:not(.rc-tree-show-line) {
      .rc-tree-treenode {
        .rc-tree-switcher-noop {
        }
      }
    }
    &.rc-tree-show-line {
    }
    &-child-tree {
      display: none;
      &-open {
        display: block;
      }
    }
    &-treenode-disabled {
      > span:not(.rc-tree-switcher),
      > a,
      > a span {
        color: #767676;
        cursor: not-allowed;
      }
    }
    &-treenode-active {
      background: rgba(0, 0, 0, 0.1);
    }
    &-node-selected {
    }
    &-node__open {
      margin-right: 2px;
    }
    &-icon__close {
    }
    &-icon__docu {
      margin-right: 2px;
      vertical-align: top;
    }
    &-icon__customize {
      margin-right: 2px;
      vertical-align: top;
    }
    &-title {
    }
    &-indent {
      display: inline-block;
      height: 0;
      vertical-align: bottom;
    }
    &-indent-unit {
      ${tw`w-3 inline-block`}
    }
    &-draggable-icon {
      display: inline-flex;
      justify-content: center;
      width: 16px;
    }
  }
`

export default rcTreeStyle
