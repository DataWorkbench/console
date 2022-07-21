const isTheme = (type: 'dark' | 'light') => (): boolean => document.body.parentElement!.classList.contains(type)

export const isDarkTheme = isTheme('dark')
export const isLightTheme = () => !isDarkTheme()
