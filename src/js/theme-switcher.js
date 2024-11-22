(() => {
    const THEMES = {
        light: {
            '--bg-color': '#ffffff',
            '--text-color': '#111111',
            '--primary-color': '#E2C08D',
            '--secondary-color': '#61AFEF'
        },
        dark: {
            '--bg-color': '#111111',
            '--text-color': '#ffffff',
            '--primary-color': '#E2C08D',
            '--secondary-color': '#98C379'
        }
    };

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        Object.entries(THEMES[newTheme]).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        Object.entries(THEMES[savedTheme]).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
    }

    document.addEventListener('DOMContentLoaded', initTheme);
    
    // Экспортируем toggleTheme в глобальную область видимости
    window.toggleTheme = toggleTheme;
})(); 