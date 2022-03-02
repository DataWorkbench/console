import tw, { css } from 'twin.macro'

const rcTreeStyle = css`
  .rc-tree {
    margin: 0;
    border: 0;
    .rc-tree-treenode {
      margin: 0;
      padding: 0;
      line-height: 28px;
      white-space: nowrap;
      list-style: none;
      ${tw`flex items-center w-full`}
      outline: 0;
      &:hover {
        ${tw`bg-neut-15`}
      }
      &.dragging {
        background: rgba(100, 100, 255, 0.1);
        ${tw`bg-neut-13`}
      }
      &.rc-tree-treenode-selected {
        ${tw`bg-green-11 bg-opacity-30`}
      }
      span.rc-tree-node-content-wrapper {
        &.rc-tree-node-content-wrapper-open,
        &.rc-tree-node-content-wrapper-close {
          ${tw`font-semibold`}
        }
        &.rc-tree-node-content-wrapper-normal {
          ${tw`text-white text-opacity-80`}
        }
      }

      &.drop-target {
        background-color: yellowgreen;
        ${tw`bg-green-11`}
      }

      span.rc-tree-switcher,
      span.rc-tree-checkbox,
      span.rc-tree-iconEle {
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

      .rc-tree-node-content-wrapper {
        position: relative;
        ${tw`inline-flex items-center flex-1`}
        height: 28px;
        margin: 0;
        padding: 0;
        text-decoration: none;
        cursor: pointer;
        .rc-tree-title {
          ${tw`flex-1`}
        }
      }
    }
  }
  .rc-tree-focused:not(.rc-tree-active-focused) {
    border-color: cyan;
  }

  .rc-tree .rc-tree-treenode.drop-container ~ .rc-tree-treenode {
    ${tw`border-l border-solid border-l-red-10`}
  }

  .rc-tree .rc-tree-treenode.drop-target ~ .rc-tree-treenode {
    border-left: none;
  }
  .rc-tree .rc-tree-treenode.filter-node > .rc-tree-node-content-wrapper {
    color: #a60000 !important;
    font-weight: bold !important;
  }
  .rc-tree .rc-tree-treenode ul {
    margin: 0;
    padding: 0 0 0 18px;
  }

  .rc-tree .rc-tree-treenode span.rc-tree-icon_loading {
  }
  .rc-tree .rc-tree-treenode span.rc-tree-switcher.rc-tree-switcher-noop {
    cursor: auto;
  }

  .rc-tree
    .rc-tree-treenode
    span.rc-tree-checkbox.rc-tree-checkbox-indeterminate.rc-tree-checkbox-disabled::after {
    position: absolute;
    top: 5px;
    left: 3px;
    width: 5px;
    height: 0;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
    content: ' ';
  }
  .rc-tree:not(.rc-tree-show-line) .rc-tree-treenode .rc-tree-switcher-noop {
    background: none;
  }
  .rc-tree.rc-tree-show-line .rc-tree-treenode:not(:last-child) > ul {
    background: url('data:image/gif;base64,R0lGODlhCQACAIAAAMzMzP///yH5BAEAAAEALAAAAAAJAAIAAAIEjI9pUAA7')
      0 0 repeat-y;
  }

  .rc-tree-child-tree {
    display: none;
  }
  .rc-tree-child-tree-open {
    display: block;
  }

  .rc-tree-treenode-active {
    background: rgba(0, 0, 0, 0.1);
  }
  .rc-tree-icon__open {
    margin-right: 2px;
  }

  .rc-tree-icon__docu {
    margin-right: 2px;
    vertical-align: top;
  }
  .rc-tree-icon__customize {
    margin-right: 2px;
    vertical-align: top;
  }

  .rc-tree-indent {
    display: inline-block;
    height: 0;
    vertical-align: bottom;
  }
  .rc-tree-indent-unit {
    ${tw`w-3 inline-block`}
  }
  .rc-tree-draggable-icon {
    display: inline-flex;
    justify-content: center;
    width: 16px;
  }
`

export default rcTreeStyle
