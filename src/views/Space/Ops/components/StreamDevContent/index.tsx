import { Loading } from '@QCFE/qingcloud-portal-ui'
import DevContentJSON from 'views/Space/Ops/components/DevContent/DevContentJSON'
import tw, { styled, css } from 'twin.macro'
import { Icon } from '@QCFE/lego-ui'

const GridItem = styled.div(({ labelWidth = 188 }: { labelWidth?: number }) => [
  css`
    & {
      ${tw`grid place-content-start gap-y-1`}
      grid-template-columns: ${labelWidth}px 1fr;

      & > span:nth-of-type(2n + 1) {
        ${tw`text-neut-8!`}
      }

      & > span:nth-of-type(2n) {
        ${tw`text-white!`}
      }
    }
  `,
])
export default function StreamDevContent({
  data,
}: {
  data?: Record<string, any>
}) {
  if (!data) {
    return <Loading size="large" />
  }
  if (data.type === 2) {
    return (
      <DevContentJSON data={{ job_content: data.sql.code }} showStep={false} />
    )
  }
  if (data.type === 4) {
    return (
      <DevContentJSON
        data={{ job_content: data.python.code }}
        showStep={false}
      />
    )
  }
  if (data.type === 3) {
    return (
      <div>
        <GridItem>
          <span>JAR 程序包</span>
          <span tw="flex">
            <Icon
              size={20}
              name="coding"
              type="light"
              color={{
                primary: '#219861',
                secondary: '#8EDABD',
              }}
            />
            <span>{`(ID:${data?.jar?.file_id})`}</span>
          </span>
          <span>入口类（Entry Class）</span>
          <span>{data?.jar?.jar_entry}</span>
          <span>程序参数（Program Arguments）</span>
          <span>{data?.jar?.jar_args}</span>
        </GridItem>
      </div>
    )
  }
  return null
}
