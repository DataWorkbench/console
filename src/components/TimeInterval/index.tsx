import React, { useEffect, useReducer } from 'react'
import { now } from 'lodash-es'

export const TimeInterval = (props: {
  startTime: number
  consuming?: number
  className?: string
}) => {
  const { startTime, consuming, className } = props
  const getConsuming = () => Math.ceil(now() / 1000 - startTime)
  const [step, setStep] = useReducer(getConsuming, getConsuming())

  useEffect(() => {
    if (!consuming && startTime) {
      const timer = setInterval(setStep, 1000)
      return () => clearInterval(timer)
    }
    return () => {}
  }, [consuming, startTime])
  return <span tw="" className={className}>{`${consuming ?? step} 秒`}</span>
}

export default TimeInterval
