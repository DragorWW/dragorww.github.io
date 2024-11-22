import '../css/main.css'

import './matrix-animation.js'
import './terminal-animation.js'
import './console-easter-egg.js'
import './theme-switcher.js'

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initMatrixAnimation('matrix', 1000);
    initTerminalAnimation();
}) 