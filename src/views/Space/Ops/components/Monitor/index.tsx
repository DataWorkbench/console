import { RadioButton, RadioGroup } from '@QCFE/lego-ui'
import Strategies from 'views/Space/Ops/components/Monitor/Strategies'
import { useState } from 'react'
import MonitorHistory from 'views/Space/Ops/components/Monitor/MonitorHistory'

const Monitor = (props: { jobId?: string; showAdd: boolean; jobType: 1 | 2 }) => {
  const [value, setValue] = useState('0')
  return (
    <div tw="w-full mt-5">
      <RadioGroup value={value} onChange={setValue}>
        <RadioButton value="0"> 告警策略 </RadioButton>
        <RadioButton value="1"> 告警记录 </RadioButton>
      </RadioGroup>
      {value === '0' && <Strategies {...props} />}
      {value === '1' && <MonitorHistory {...props} />}
    </div>
  )
}

export default Monitor
