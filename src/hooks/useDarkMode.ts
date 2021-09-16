import { useCallback } from 'react'

const useDarkMode = (): ((darkMode: boolean) => void) => {
  const setDM = useCallback((dm: boolean) => {
    const htm = document.documentElement
    if (dm) {
      htm.classList.add('dark')
    } else {
      htm.classList.remove('dark')
    }
  }, [])
  return setDM
}

export default useDarkMode
