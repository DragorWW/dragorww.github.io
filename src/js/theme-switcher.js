(() => {
    function updateFavicon(theme) {
        // Находим все иконки
        const favicons = document.querySelectorAll('link[rel="icon"]');
        
        // Скрываем все иконки
        favicons.forEach(icon => {
            icon.setAttribute('media', 'none');
            icon.setAttribute('rel', 'icon');
        });
        
        // Показываем нужную иконку
        const activeIcon = document.querySelector(`link[rel="icon"][data-theme="${theme}"]`);
        if (activeIcon) {
            activeIcon.removeAttribute('media');
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Обновляем favicon используя существующие теги
        updateFavicon(newTheme);
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        // Инициализируем favicon с сохраненной темой
        updateFavicon(savedTheme);
    }

    document.addEventListener('DOMContentLoaded', initTheme);
    window.toggleTheme = toggleTheme;
})(); 