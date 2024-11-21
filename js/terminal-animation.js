const AVAILABLE_COMMANDS = {
    'help': {
        description: 'Показать список доступных команд',
        execute: () => `
            <div class="output log-output">
                Доступные команды:
                <br>
                help             - Показать это сообщение<br>
                about            - Обо мне<br>
                skills           - Мои навыки<br>
                contact          - Контактная информация<br>
                projects         - Список проектов<br>
                clear            - Очистить терминал
            </div>`
    },
    'about': {
        description: 'Информация обо мне',
        execute: () => `
            <div class="output log-output">
                <span class="highlight">Name:</span> Сергей Андреев
                <span class="highlight">Role:</span> Head of Engineering
                <span class="highlight">Status:</span> Developing awesome things...
            </div>`
    },
    'skills': {
        description: 'Список навыков',
        execute: () => `
            <div class="output log-output">
                <div class="terminal-skill">React.js <span class="terminal-skill__version">v18</span></div>
                <div class="terminal-skill">Node.js <span class="terminal-skill__version">v18</span></div>
                <div class="terminal-skill">TypeScript <span class="terminal-skill__version">v5</span></div>
                <div class="terminal-skill">Python <span class="terminal-skill__version">v3.11</span></div>
            </div>`
    },
    'clear': {
        description: 'Очистить терминал',
        execute: () => ''
    },
    'contact': {
        description: 'Контактная информация',
        execute: () => `
            <div class="output log-output">
                <span class="highlight">Email:</span> dragorww@gmail.com
                <span class="highlight">Telegram:</span> @dragorww
                <span class="highlight">GitHub:</span> github.com/dragorww
            </div>`
    },
    'projects': {
        description: 'Список проектов',
        execute: () => `
            <div class="output log-output">

                <span class="log-date">[2024]</span> → Educational Platform
                <span class="log-details">• 7 companies integration</span>
                <span class="log-details">• 100k+ users</span>
                <span class="log-details">• 99.9% uptime</span>

                <span class="highlight">→ Educational Platform</span>
                Масштабируемая платформа для 7 компаний
                <br>
                <span class="highlight">→ DevOps Dashboard</span>
                Внутренний инструмент для SberTech
                <br>
                <span class="highlight">→ Cargo Management</span>
                Логистическая платформа cargomart.ru
            </div>`
    }
};

class TerminalAnimation {
    constructor() {
        this.container = document.querySelector('.terminal-history');
        this.terminalContent = document.querySelector('.terminal__content');
        this.currentInput = '';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.commandDelay = 50;
        this.commandPause = 1000;
        this.isAnimating = false;

        this.initialize();
    }

    async initialize() {
        this.disableScroll();
        this.isAnimating = true;
        
        await this.showWelcomeMessage();
        
        const initialCommands = ['about', 'skills', 'projects'];
        for (const cmd of initialCommands) {
            await this.sleep(this.commandPause);
            await this.simulateCommand(cmd);
        }

        await this.sleep(this.commandPause);
        this.isAnimating = false;
        this.enableScroll();
        this.setupEventListeners();
        this.createNewPrompt();
    }

    disableScroll() {
        this.terminalContent.style.overflowY = 'hidden';
        this.savedScrollTop = this.terminalContent.scrollTop;
        
        // Сохраняем позицию скролла и запрещаем прокрутку
        this.terminalContent.addEventListener('scroll', this.preventScroll);
    }

    enableScroll() {
        this.terminalContent.style.overflowY = 'auto';
        this.terminalContent.removeEventListener('scroll', this.preventScroll);
    }

    preventScroll = () => {
        if (this.isAnimating) {
            this.terminalContent.scrollTop = this.savedScrollTop;
        }
    }

    scrollToBottom() {
        this.savedScrollTop = this.terminalContent.scrollHeight - this.terminalContent.clientHeight;
        this.terminalContent.scrollTop = this.savedScrollTop;
    }


    async simulateCommand(command) {
        const commandLine = document.createElement('p');
        commandLine.innerHTML = '<span class="terminal-prompt">$</span> ';
        this.container.appendChild(commandLine);
        this.scrollToBottom();

        let currentText = '';
        for (const char of command) {
            await this.sleep(this.commandDelay);
            currentText += char;
            commandLine.innerHTML = `<span class="terminal-prompt">$</span> ${currentText}`;
            this.scrollToBottom();
        }

        await this.sleep(500);

        if (AVAILABLE_COMMANDS[command]) {
            const output = AVAILABLE_COMMANDS[command].execute();
            const outputElement = document.createElement('div');
            outputElement.classList.add('terminal-output');
            outputElement.innerHTML = output;
            this.container.appendChild(outputElement);
            this.scrollToBottom();
        }
    }

    async showWelcomeMessage() {
        const welcomeMessage = `
            <div class="terminal-output terminal-output--welcome">
                <div class="terminal-welcome">
                    <span class="terminal-welcome__highlight"><span class="terminal-prompt">$</span> cd ~/digital-garden</span>
                    <br>
                    Добро пожаловать в мой цифровой сад! 🌱
                    <br><br>
                    Здесь растут идеи, проекты и знания...
                    <br>
                    Исследуйте с помощью <span class="terminal-welcome__cmd">help</span>
                    <br>
                    <span class="terminal-welcome__path">~/digital-garden</span> 
                    <span class="terminal-welcome__branch">(main) </span>
                </div>
            </div>
        `;
        this.container.innerHTML = welcomeMessage;
        await this.sleep(1000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.terminalContent.contains(document.activeElement)) {
                this.handleKeyPress(e);
            }
        });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.executeCommand();
        } else if (e.key === 'Backspace') {
            this.currentInput = this.currentInput.slice(0, -1);
            this.updatePrompt();
        } else if (e.key === 'ArrowUp') {
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            this.navigateHistory(1);
        } else if (e.key.length === 1) {
            this.currentInput += e.key;
            this.updatePrompt();
        }
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex = Math.max(
            -1,
            Math.min(
                this.commandHistory.length - 1,
                this.historyIndex + direction
            )
        );

        if (this.historyIndex === -1) {
            this.currentInput = '';
        } else {
            this.currentInput = this.commandHistory[this.historyIndex];
        }
        
        this.updatePrompt();
    }

    updatePrompt() {
        const promptElement = this.container.lastElementChild;
        promptElement.innerHTML = `<span class="terminal-prompt">$</span> ${this.currentInput}<span class="terminal-prompt__cursor">█</span>`;
    }

    createNewPrompt() {
        const promptElement = document.createElement('p');
        promptElement.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-prompt__cursor">█</span>`;
        this.container.appendChild(promptElement);
        this.scrollToBottom();
    }

    async executeCommand() {
        const command = this.currentInput.trim().toLowerCase();
        
        if (command) {
            this.commandHistory.unshift(command);
            this.historyIndex = -1;
            
            const promptElement = this.container.lastElementChild;
            promptElement.innerHTML = `<span class="terminal-prompt">$</span> ${this.currentInput}`;

            if (command === 'clear') {
                this.container.innerHTML = '';
            } else {
                const output = AVAILABLE_COMMANDS[command]
                    ? AVAILABLE_COMMANDS[command].execute()
                    : `<div class="terminal-output terminal-output--error">Command not found: ${command}. Type 'help' for available commands.</div>`;
                
                if (output) {
                    const outputElement = document.createElement('div');
                    outputElement.innerHTML = output;
                    this.container.appendChild(outputElement);
                    
                    await this.sleep(10);
                    this.scrollToBottom();
                }
            }
        }

        this.currentInput = '';
        this.createNewPrompt();
    }
}

// Инициализация
const initTerminalAnimation = () => {
    const terminal = new TerminalAnimation();
};

window.initTerminalAnimation = initTerminalAnimation; 