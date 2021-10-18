import { useStore } from 'stores'
import { Link, useParams } from 'react-router-dom'
import tw, { styled, css, theme } from 'twin.macro'
import { useDarkMode } from 'hooks'

interface NavsProps {
  mod?: string
}

const FuncWrapper = styled('div')(({ current }: { current: boolean }) => [
  tw`relative inline-block mr-6 text-sm hover:(dark:text-white)`,
  current && tw`font-semibold relative dark:text-white`,

  current &&
    css`
      &::after {
        position: absolute;
        content: ' ';
        width: 60%;
        height: 0.125rem;
        left: 20%;
        bottom: 1px;
        background-color: ${theme('colors.green.11')};
      }
    `,
])

export const Navs = ({ mod }: NavsProps) => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  const {
    workSpaceStore: { funcList },
    globalStore,
  } = useStore()
  const setDarkMode = useDarkMode()
  const handNavClick = (name: string) => {
    const darkMode = ['dm', 'ops'].includes(name)
    setDarkMode(darkMode)
    globalStore.set({ darkMode })
  }
  return (
    <div>
      {funcList.map(({ title, name }) => (
        <FuncWrapper key={name} current={mod === name}>
          <Link
            tw="inline-block py-3 "
            onClick={() => handNavClick(name)}
            to={`/${regionId}/workspace/${spaceId}/${name}`}
          >
            {title}
          </Link>
        </FuncWrapper>
      ))}
    </div>
  )
}

export default Navs
