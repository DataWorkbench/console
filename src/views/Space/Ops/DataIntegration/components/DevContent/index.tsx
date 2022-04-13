import DevContentJSON from './DevContentJSON'
import DevContentUI from './DevContentUI'

interface IProps {
  data: Record<string, any>
}

const DevContent = (props: IProps) => {
  const {
    data: { job_type: jobType = 1 },
  } = props

  if (jobType === 2) {
    return <DevContentJSON {...props} />
  }
  return <DevContentUI {...props} />
}
export default DevContent
