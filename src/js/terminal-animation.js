const AVAILABLE_COMMANDS = {
    'welcome': {
        description: 'Приветственное сообщение',
        directory: '~/digital-garden',
        branch: 'main',
        command: 'cd ~/digital-garden',
        execute: () => `
            <div class="output log-output">
                <div class="terminal-welcome">    
                    Добро пожаловать в мой цифровой сад! 🌱
                    <br><br>
                    Здесь растут идеи, проекты и знания...
                    <br>
                    Исследуйте с помощью <span class="terminal-welcome__cmd">help</span>
                </div>
            </div>`
    },
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
    currentInput = '';
    commandHistory = [];
    historyIndex = -1;
    commandDelay = 50;
    commandPause = 1000;
    isAnimating = false;

    directory = '';
    branch = '';

    constructor() {
        this.container = document.querySelector('.terminal-history');
        this.terminalContent = document.querySelector('.terminal__content');

        this.initialize();
    }

    handlePrompt({
        command = '',
        showCursor = false,
        action = 'create', // 'create', 'update', 'append'
    } = {}) {
        const promptHTML = `
            <span class="terminal-prompt">
                ${this.directory ? `<span class="terminal-prompt__path">${this.directory}</span>` : ''}
                ${this.branch ? `<span class="terminal-prompt__branch">(${this.branch})</span>` : ''}
                <span class="terminal-prompt__symbol">$</span> 
                ${command ? `<span class="terminal-prompt__command">${command}</span>` : ''}
                ${showCursor ? '<span class="terminal-prompt__cursor">█</span>' : ''}
            </span>`;

        switch (action) {
            case 'create':
                const promptElement = document.createElement('p');
                promptElement.innerHTML = promptHTML;
                return promptElement;
            
            case 'update':
                const lastPrompt = this.container.lastElementChild;
                lastPrompt.innerHTML = promptHTML;
                return lastPrompt;
            
            case 'append':
                const newPrompt = document.createElement('p');
                newPrompt.innerHTML = promptHTML;
                this.container.appendChild(newPrompt);
                this.scrollToBottom();
                return newPrompt;
        }
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
        this.handlePrompt({ showCursor: true, action: 'append' });
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


    async simulateCommand(commandName) {
        let promptElement = this.handlePrompt({ action: 'append' });
        
        const command = AVAILABLE_COMMANDS[commandName.split(' ')[0]];

        const text = command?.command || commandName;


        let currentText = '';
        for (const char of text) {
            await this.sleep(this.commandDelay);
            currentText += char;
            promptElement.innerHTML = this.handlePrompt({ 
                command: currentText, 
                action: 'create' 
            }).innerHTML;
            this.scrollToBottom();
        }

        await this.sleep(500);

        if (command) {
            const output = command.execute();
            const outputElement = document.createElement('div');
            outputElement.classList.add('terminal-output');
            outputElement.innerHTML = output;
            this.container.appendChild(outputElement);
            this.scrollToBottom();
        }

        if (command?.directory) {
            this.directory = command.directory;
        }

        if (command?.branch) {
            this.branch = command.branch;
        }
    }

    async showWelcomeMessage() {
        await this.simulateCommand('welcome');
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
            this.handlePrompt({ command: this.currentInput, showCursor: true, action: 'update' });
        } else if (e.key === 'ArrowUp') {
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            this.navigateHistory(1);
        } else if (e.key.length === 1) {
            this.currentInput += e.key;
            this.handlePrompt({ command: this.currentInput, showCursor: true, action: 'update' });
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
        
        this.handlePrompt({ command: this.currentInput, showCursor: true, action: 'update' });
    }

    async executeCommand() {
        const command = this.currentInput.trim().toLowerCase();
        
        if (command) {
            this.commandHistory.unshift(command);
            this.historyIndex = -1;
            
            const promptElement = this.container.lastElementChild;
            
            promptElement.innerHTML = this.handlePrompt({ 
                command: this.currentInput, 
                action: 'update' 
            }).innerHTML;

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
        this.handlePrompt({ showCursor: true, action: 'append' });
    }
}

// Инициализация
const initTerminalAnimation = () => {
    const terminal = new TerminalAnimation();
};

window.initTerminalAnimation = initTerminalAnimation; 