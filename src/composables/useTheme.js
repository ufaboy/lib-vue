export default function useTheme(){
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

    const userPrefersNothing = window.matchMedia && window.matchMedia('(prefers-color-scheme: no-preference)').matches;

    const userPreferTheme = userPrefersDark ? 'theme-light' : 'theme-light'

    return {userPrefersDark, userPrefersLight, userPrefersNothing, userPreferTheme}
}