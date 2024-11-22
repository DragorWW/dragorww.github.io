(() => {
    const ANIMATION_CONFIG = {
        MAX_FPS: 60,
        MIN_FRAME_TIME: 1000 / 60,
        FONT_SIZE: 30,
        FONT_FAMILY: 'Fira Code, monospace',
        COLUMN_SPACING: 0.1,
        MAX_ACTIVE_COLUMNS_RATIO: 5.55,
        SPAWN_RATE: 0.5,
        DESPAWN_RATE: 0.1,
        TRAIL_OPACITY: 0.15,
        MIN_SCROLL_OPACITY: 0.2,
        SYMBOL_UPDATE_RATE: 0.2
    };

    const SYMBOL_CONFIG = {
        COLORS: {
            OPERATORS: '229, 192, 123',     // #E5C07B - желтый
            KEYWORDS: '198, 120, 221',      // #C678DD - фиолетовый
            FUNCTIONS: '97, 175, 239',      // #61AFEF - синий
            STRINGS: '152, 195, 121',       // #98C379 - зеленый
            COMMENTS: '92, 99, 112',        // #5C636F - серый
            CONSTANTS: '224, 108, 117',     // #E06C75 - красный
            BRACKETS: '209, 154, 102',      // #D19A66 - оранжевый
        },
        MIN_OPACITY: 0.4,
        MAX_OPACITY: 0.8,
        MIN_SPEED: 0.01,
        MAX_SPEED: 0.1
    };

    const SYMBOLS = {
        OPERATORS: ['>=', '<=', '=>', '->', '<>', '===', '!==', '||', '&&', '++', '--'],
        KEYWORDS: ['import', 'export', 'default', 'class', 'const', 'let', 'var', 'function', 'return', 'await', 'async'],
        FUNCTIONS: ['try', 'catch', 'finally', 'break', 'continue', 'for', 'while', 'if', 'else', 'switch', 'case', 'do'],
        STRINGS: ['...', '?.', '::'],
        COMMENTS: ['<!--', '-->', '/**', '*/', '//', '/*', '*/'],
        CONSTANTS: ['=>==', '#!/'],
        BRACKETS: ['[]', '{}', '()', '<>', '</>']
    };

    const BACKGROUND_CONFIG = {
        PIXEL_SIZE: 8,
        MIN_OPACITY: 0.02,
        MAX_OPACITY: 0.15,
        FADE_SPEED: 0.001,
        MAX_PIXELS: 300,
        MOUSE_INFLUENCE_RADIUS: 150,
        MOUSE_REPEL_STRENGTH: 1,
        RETURN_SPEED: 0.05
    };

    const THEMES = {
        light: {
            background: 'rgba(255, 255, 255, 1)',
            pixelColor: '0, 0, 0',
            minOpacity: 0.05,
            maxOpacity: 0.25
        },
        dark: {
            background: 'rgba(17, 17, 17, 1)',
            pixelColor: '255, 255, 255',
            minOpacity: 0.02,
            maxOpacity: 0.15
        }
    };

    class MatrixAnimation {
        constructor(canvasId, startDelay = 1000) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.startDelay = startDelay;
            
            this.mousePosition = { x: -1000, y: -1000 };
            this.currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            
            this.setupCanvas();
            this.ctx.fillStyle = THEMES[this.currentTheme].background;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.isInitialized = false;
            this.pixels = [];
            this.setupBackground();
            this.bindEvents();
            
            this.themeObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'data-theme') {
                        this.currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                    }
                });
            });
            
            this.themeObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['data-theme']
            });
        }

        initialize() {
            if (this.isInitialized) return;
            
            this.setupMeasureCanvas();
            this.initializeArrays();
            this.bindEvents();
            this.lastTime = 0;
            this.isInitialized = true;
        }

        setupCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        setupMeasureCanvas() {
            this.measureCanvas = document.createElement('canvas');
            this.measureCtx = this.measureCanvas.getContext('2d');
            this.measureCtx.font = `${ANIMATION_CONFIG.FONT_SIZE}px ${ANIMATION_CONFIG.FONT_FAMILY}`;
            
            const allSymbols = Object.values(SYMBOLS).flat();
            
            this.maxCharWidth = Math.max(...allSymbols.map(char => 
                this.measureCtx.measureText(char).width
            ));
            this.columnWidth = this.maxCharWidth + ANIMATION_CONFIG.FONT_SIZE * ANIMATION_CONFIG.COLUMN_SPACING;
        }

        initializeArrays() {
            this.columns = Math.floor(this.canvas.width / this.columnWidth);
            this.drops = Array(this.columns).fill(1);
            this.activeColumns = new Set();
            this.opacities = Array(this.columns).fill(SYMBOL_CONFIG.MAX_OPACITY);
            this.speeds = Array(this.columns).fill(1);
            this.currentSymbols = new Map();
            this.symbolUpdateCounters = new Map();
        }

        bindEvents() {
            window.addEventListener('resize', () => this.handleResize());
            window.addEventListener('scroll', () => this.handleScroll());
            
            document.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mousePosition = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top + window.scrollY
                };
            });

            document.addEventListener('mouseleave', () => {
                this.mousePosition = { x: -1000, y: -1000 };
            });
        }

        handleResize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.setupBackground();
            const newColumns = Math.floor(this.canvas.width / this.columnWidth);
            this.drops.length = newColumns;
            this.opacities.length = newColumns;
            this.speeds.length = newColumns;
            this.drops.fill(1);
            this.opacities.fill(SYMBOL_CONFIG.MAX_OPACITY);
            this.speeds.fill(1);
            this.activeColumns.clear();
            this.currentSymbols.clear();
            this.symbolUpdateCounters.clear();
        }

        handleScroll() {
            const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            this.canvas.style.opacity = Math.max(ANIMATION_CONFIG.MIN_SCROLL_OPACITY, 1 - scrolled);
        }

        draw(currentTime) {
            requestAnimationFrame((time) => this.draw(time));

            const deltaTime = currentTime - this.lastTime;
            if (deltaTime < ANIMATION_CONFIG.MIN_FRAME_TIME) return;

            this.lastTime = currentTime;

            this.ctx.fillStyle = THEMES[this.currentTheme].background;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.updatePixels();

            this.spawnNewColumns();
            this.updateActiveColumns();
        }

        isColumnAvailable(column) {
            const MIN_DISTANCE = 3;
            
            for (const activeColumn of this.activeColumns) {
                if (Math.abs(activeColumn - column) < MIN_DISTANCE) {
                    return false;
                }
            }
            return true;
        }

        spawnNewColumns() {
            if (this.activeColumns.size < this.columns * ANIMATION_CONFIG.MAX_ACTIVE_COLUMNS_RATIO && 
                Math.random() > ANIMATION_CONFIG.SPAWN_RATE) {
                
                let attempts = 10;
                let newColumn;
                
                do {
                    newColumn = Math.floor(Math.random() * this.columns);
                    attempts--;
                } while ((this.activeColumns.has(newColumn) || !this.isColumnAvailable(newColumn)) && attempts > 0);
                
                if (attempts > 0 && !this.activeColumns.has(newColumn) && this.isColumnAvailable(newColumn)) {
                    this.activeColumns.add(newColumn);
                    this.drops[newColumn] = 1;
                    this.speeds[newColumn] = SYMBOL_CONFIG.MIN_SPEED + 
                        Math.random() * (SYMBOL_CONFIG.MAX_SPEED - SYMBOL_CONFIG.MIN_SPEED);
                    this.opacities[newColumn] = SYMBOL_CONFIG.MIN_OPACITY + 
                        Math.random() * (SYMBOL_CONFIG.MAX_OPACITY - SYMBOL_CONFIG.MIN_OPACITY);
                }
            }
        }

        updateActiveColumns() {
            for (const i of this.activeColumns) {
                if (!this.currentSymbols.has(i) || 
                    !this.symbolUpdateCounters.has(i) ||
                    Math.random() < ANIMATION_CONFIG.SYMBOL_UPDATE_RATE) {
                    
                    const categories = Object.keys(SYMBOLS);
                    const category = categories[Math.floor(Math.random() * categories.length)];
                    const symbolsArray = SYMBOLS[category];
                    const text = symbolsArray[Math.floor(Math.random() * symbolsArray.length)];
                    
                    this.currentSymbols.set(i, {
                        text,
                        category
                    });
                    this.symbolUpdateCounters.set(i, 0);
                }

                const { text, category } = this.currentSymbols.get(i);
                const x = i * this.columnWidth + 
                    (this.columnWidth - this.measureCtx.measureText(text).width) / 2;
                
                this.ctx.fillStyle = `rgba(${SYMBOL_CONFIG.COLORS[category]}, ${this.opacities[i]})`;
                this.ctx.font = `${ANIMATION_CONFIG.FONT_SIZE}px ${ANIMATION_CONFIG.FONT_FAMILY}`;
                this.ctx.fillText(text, x, this.drops[i] * ANIMATION_CONFIG.FONT_SIZE);

                this.symbolUpdateCounters.set(i, (this.symbolUpdateCounters.get(i) || 0) + 1);

                if (this.drops[i] * ANIMATION_CONFIG.FONT_SIZE > this.canvas.height) {
                    if (Math.random() > ANIMATION_CONFIG.DESPAWN_RATE) {
                        this.activeColumns.delete(i);
                        this.drops[i] = 1;
                        this.speeds[i] = 1;
                        this.opacities[i] = SYMBOL_CONFIG.MAX_OPACITY;
                        this.currentSymbols.delete(i);
                        this.symbolUpdateCounters.delete(i);
                    } else {
                        this.drops[i] = 0;
                    }
                }
                this.drops[i] += this.speeds[i];
            }
        }

        setupBackground() {
            const theme = THEMES[this.currentTheme];
            this.pixels = Array(BACKGROUND_CONFIG.MAX_PIXELS).fill(null).map(() => ({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                originalX: Math.random() * this.canvas.width,
                originalY: Math.random() * this.canvas.height,
                size: BACKGROUND_CONFIG.PIXEL_SIZE + Math.random() * BACKGROUND_CONFIG.PIXEL_SIZE * 2,
                opacity: theme.minOpacity + 
                    Math.random() * (theme.maxOpacity - theme.minOpacity),
                fadeDirection: Math.random() > 0.5 ? 1 : -1
            }));
        }

        updatePixels() {
            const theme = THEMES[this.currentTheme];
            this.pixels.forEach(pixel => {
                pixel.opacity += BACKGROUND_CONFIG.FADE_SPEED * pixel.fadeDirection;
                
                if (pixel.opacity <= theme.minOpacity || 
                    pixel.opacity >= theme.maxOpacity) {
                    pixel.fadeDirection *= -1;
                }

                if (this.mousePosition) {
                    const dx = pixel.x - this.mousePosition.x;
                    const dy = pixel.y - this.mousePosition.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < BACKGROUND_CONFIG.MOUSE_INFLUENCE_RADIUS) {
                        const force = (BACKGROUND_CONFIG.MOUSE_INFLUENCE_RADIUS - distance) / BACKGROUND_CONFIG.MOUSE_INFLUENCE_RADIUS;
                        pixel.x += (dx / distance) * force * BACKGROUND_CONFIG.MOUSE_REPEL_STRENGTH;
                        pixel.y += (dy / distance) * force * BACKGROUND_CONFIG.MOUSE_REPEL_STRENGTH;
                    }
                }

                pixel.x += (pixel.originalX - pixel.x) * BACKGROUND_CONFIG.RETURN_SPEED;
                pixel.y += (pixel.originalY - pixel.y) * BACKGROUND_CONFIG.RETURN_SPEED;

                this.ctx.fillStyle = `rgba(${THEMES[this.currentTheme].pixelColor}, ${pixel.opacity})`;
                this.ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
            });
        }

        start() {
            setTimeout(() => {
                this.initialize();
                requestAnimationFrame((time) => this.draw(time));
            }, this.startDelay);
        }

        destroy() {
            this.themeObserver.disconnect();
        }
    }

    const initMatrixAnimation = (canvasId, delay = 1000) => {
        const matrixAnimation = new MatrixAnimation(canvasId, delay);
        matrixAnimation.start();
        return matrixAnimation;
    };

    window.initMatrixAnimation = initMatrixAnimation;
})(); 