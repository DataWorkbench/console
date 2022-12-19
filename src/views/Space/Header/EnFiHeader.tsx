import { Link } from 'react-router-dom'
import { FlexBox } from 'components/Box'
// import { Settings } from 'views/Space/Header/Settings'
import icons from 'views/Space/Header/icons'
import { Root } from './styled'
import useIcon from '../../../hooks/useHooks/useIcon'

export const EnFiHeader = () => {
  useIcon(icons)
  return (
    <Root tw="z-[100] h-[56px] bg-white text-white items-center">
      <FlexBox tw="justify-between w-full">
        <Link to="/overview">
          <div
          // css={[
          //   tw`w-28 h-7 bg-no-repeat bg-contain bg-center ml-4`,
          //   css`
          //     background-image: url(${enFiLogo as any});
          //   `
          // ]}
          >
            &nbsp;
          </div>
        </Link>
        {/* <Settings darkMode={false} overview /> */}
      </FlexBox>
    </Root>
  )
}
export default EnFiHeader
