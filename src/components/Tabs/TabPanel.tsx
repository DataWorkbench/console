import { FC } from 'react'

export interface TabPanelProps {
  name: string
  label: string
  className?: string
  children: React.ReactNode
}

export const TabPanel: FC<TabPanelProps> = ({ className, children }) => {
  return <div className={className}>{children}</div>
}
