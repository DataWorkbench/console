import enFiLogo from 'assets/logo_enfi.svg'
import tw, { css } from 'twin.macro'
import { Link } from 'react-router-dom'
import { Root } from './styled'

export const EnFiHeader = () => (
  <Root tw="z-[100] h-[52px] bg-green-11 text-white items-center">
    <Link to="/overview">
      <div
        css={[
          tw`w-28 h-7 bg-no-repeat bg-contain bg-center ml-4`,
          css`
            background-image: url(${enFiLogo as any});
          `
        ]}
      >
        &nbsp;
      </div>
    </Link>
  </Root>
)
export default EnFiHeader
