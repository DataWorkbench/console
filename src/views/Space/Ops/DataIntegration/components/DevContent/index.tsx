import DevContentJSON from './DevContentJSON'
import DevContentUI from './DevContentUI'

interface IProps {
  data?: Record<string, any>
  curJob?: Record<string, any>
}

const DevContent = (props: IProps) => {
  const { data, curJob } = props
  if (curJob === undefined || data === undefined) {
    return null
  }
  const { job_mode: jobType = 1 } = data

  if (jobType !== 1) {
    return <DevContentJSON {...props} />
  }
  return <DevContentUI {...props} />
}
export default DevContent
