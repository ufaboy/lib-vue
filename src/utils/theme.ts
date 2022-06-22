function initTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}
function toggleTheme() {
    if (localStorage.theme === 'light') {
        localStorage.theme = 'dark'
    } else localStorage.setItem('theme', 'light')
    initTheme();
}

export {initTheme, toggleTheme}