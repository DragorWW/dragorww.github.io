(() => {
    function updateFavicon(theme) {
        const favicon = document.querySelector('link[rel="icon"]');
        const newFavicon = favicon.cloneNode();
        // Используем разные файлы для разных тем
        newFavicon.href = `/assets/favicon-${theme}.svg?v=${Date.now()}`;
        favicon.remove();
        document.head.appendChild(newFavicon);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Обновляем favicon с новой темой
        updateFavicon(newTheme);
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        // Инициализируем favicon с сохраненной темой
        updateFavicon(savedTheme);
    }

    document.addEventListener('DOMContentLoaded', initTheme);
    window.toggleTheme = toggleTheme;
})(); 