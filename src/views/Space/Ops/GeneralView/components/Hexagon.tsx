import { css } from 'twin.macro'
import { Icon } from '@QCFE/lego-ui'

export const Hexagon = () => (
    <div
      css={css`
        width: 90px;
        height: 80px;
        position: relative;
        margin-right: 10px;
      `}
    >
      <div
        css={css`
          position: absolute;
          left: 25px;
          top: 0;
          width: 41px;
          height: 72px;
          transform: rotate(30deg);
          border-top: 1px solid #4c5e70;
          border-bottom: 1px solid #4c5e70;
        `}
      />
      <div
        css={css`
          position: absolute;
          width: 41px;
          height: 72px;
          left: 25px;
          top: 0;
          transform: rotate(90deg);
          border-top: 1px solid #4c5e70;
          border-bottom: 1px solid #4c5e70;
        `}
      >
        <Icon
          name="pod"
          size={42}
          color={{
            primary: '#fff',
            secondary: 'rgba(255, 255, 255, 0.4)'
          }}
          css={css`
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            transform: rotate(-90deg);
          `}
        />
      </div>
      <div
        css={css`
          position: absolute;
          width: 41px;
          height: 72px;
          left: 25px;
          top: 0;
          transform: rotate(150deg);
          border-top: 1px solid #4c5e70;
          border-bottom: 1px solid #4c5e70;
        `}
      />
    </div>
  )

export default Hexagon
