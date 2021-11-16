import tw, { css } from 'twin.macro'

const menuStyles = css`
  .menu {
    ${tw`text-xs`}
  }
  .dark {
    .menu {
      ${tw`bg-neut-17 text-white`}
      .menu-inline-submenu-title {
        svg {
          color: rgba(255, 255, 255, 0.9);
          fill: rgba(255, 255, 255, 0.4);
        }
      }
      .menu-item,
      .menu-inline-submenu-title {
        ${tw`text-white`};
        &:hover {
          ${tw`bg-neut-13`};
        }
      }
      .menu-item:active,
      .menu-item-selected,
      .menu-item-selected:hover {
        ${tw`bg-neut-13`}
      }
    }
  }
`

export default menuStyles
