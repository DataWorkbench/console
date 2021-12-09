import { useStore } from 'stores'
import { Link, useParams } from 'react-router-dom'
import tw, { styled, css, theme } from 'twin.macro'
import { useDarkMode } from 'hooks'

interface NavsProps {
  mod?: string
}

const FuncWrapper = styled('div')(({ current }: { current: boolean }) => [
  tw`relative text-sm hover:(dark:text-white) px-1`,
  current
    ? tw`font-semibold relative dark:text-white text-neut-19`
    : tw`text-neut-13 dark:text-neut-8 `,

  current &&
    css`
      &::after {
        position: absolute;
        content: ' ';
        width: 24px;
        height: 0.125rem;
        left: calc(50% - 12px);
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
    <div tw="flex gap-6">
      {funcList.map(({ title, name }) => (
        <FuncWrapper key={name} current={mod === name}>
          <Link
            tw="inline-block py-3 hover:text-neut-19 hover:dark:text-white hover:font-medium"
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
