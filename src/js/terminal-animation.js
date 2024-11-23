class TerminalAnimation {
    // settings
    commandDelay = 50;
    commandPause = 1000;

    // state
    currentDirectory = '';
    currentBranch = '';
    currentInput = '';
    commandHistory = [];
    historyIndex = -1;
    isAnimating = false;

    hints = [
        'где ты работаешь?',
        'какие проекты делал?',
        'расскажи про опыт работы',
        'как с тобой связаться?',
        'какие технологии используешь?',
        'где тебя найти в соцсетях?',
        'help - список всех команд'
    ];

    hintDelay = 3000;        // Уменьшили с 5000 до 3000 мс
    typeDelay = 80;          // Немного ускорили печать
    eraseDelay = 40;         // Немного ускорили стирание
    pauseDelay = 1500;       // Уменьшили паузу с 2000 до 1500 мс
    betweenHintsDelay = 500; // Добавили небольшую паузу между подсказками
    hintIndex = 0;
    hintTimeout = null;
    isShowingHint = false;

    constructor() {
        this.container = document.querySelector('.terminal__history');
        this.terminalContent = document.querySelector('.terminal__content');
        this.loadCommands();
        this.initialize();
        this.startHintCycle();
    }

    loadCommands() {
        const commands = {};
        document.querySelectorAll('.terminal__command').forEach(cmd => {
            const commandName = cmd.dataset.command;
            commands[commandName] = {
                description: cmd.dataset.description || '',
                directory: cmd.dataset.directory || '',
                branch: cmd.dataset.branch || '',
                command: cmd.dataset.command || commandName,
                execute: () => {
                    const template = cmd.querySelector('template');
                    return template.innerHTML.trim();
                }
            };
        });

        this.commands = commands;
    }

    handlePrompt({
        command = '',
        showCursor = false,
        action = 'create',
        isHint = false
    } = {}) {
        const promptHTML = `
            <span class="terminal__prompt">
                ${this.currentDirectory ? `<span class="terminal__prompt-path">${this.currentDirectory}</span>` : ''}
                ${this.currentBranch ? `<span class="terminal__prompt-branch">(${this.currentBranch})</span>` : ''}
                <span class="terminal__prompt-symbol">$</span> 
                <span class="terminal__prompt-input ${isHint ? 'hint' : ''}">${command}${showCursor ? '<span class="terminal__prompt-cursor">█</span>' : ''}</span>
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
                const output = this.commands[command]
                    ? this.commands[command].execute()
                    : `<div class="terminal__output terminal__output--error">Command not found: ${command}. Type 'help' for available commands.</div>`;
                
                if (output) {
                    const outputElement = document.createElement('div');
                    outputElement.classList.add('terminal__output');
                    outputElement.innerHTML = output;
                    this.container.appendChild(outputElement);
                    
                    await this.sleep(10);
                    this.scrollToBottom();
                }
            }
        }

        this.currentInput = '';
        this.handlePrompt({ showCursor: true, action: 'append' });
        this.startHintCycle();
    }

    async simulateCommand(commandName) {
        let promptElement = this.handlePrompt({ action: 'append' });
        const command = this.commands[commandName.split(' ')[0]];
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
            outputElement.classList.add('terminal__output');
            outputElement.innerHTML = output;
            this.container.appendChild(outputElement);
            this.scrollToBottom();
        }

        if (command?.directory) {
            this.currentDirectory = command.directory;
        }

        if (command?.branch) {
            this.currentBranch = command.branch;
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
        
        setTimeout(() => {
            if (!this.currentInput) {
                this.startHintCycle();
            }
        }, 1000);
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
        if (this.isShowingHint) {
            this.isShowingHint = false;
            clearTimeout(this.hintTimeout);
            this.currentInput = '';
            this.handlePrompt({ command: '', showCursor: true, action: 'update' });
        }

        if (e.key === 'Enter') {
            this.executeCommand();
            this.startHintCycle();
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

    startHintCycle() {
        if (!this.currentInput && !this.isAnimating) {
            this.hintTimeout = setTimeout(() => this.showNextHint(), this.hintDelay);
        }
    }

    async showNextHint() {
        if (this.currentInput || this.isAnimating) return;

        this.isShowingHint = true;
        const hint = this.hints[this.hintIndex];
        
        // Печатаем подсказку
        let currentText = '';
        for (const char of hint) {
            if (this.currentInput || !this.isShowingHint) break;
            currentText += char;
            this.handlePrompt({ 
                command: currentText, 
                showCursor: true, 
                action: 'update',
                isHint: true // Добавили флаг для подсказок
            });
            await this.sleep(this.typeDelay);
        }

        // Ждем перед стиранием
        if (!this.currentInput && this.isShowingHint) {
            await this.sleep(this.pauseDelay);
        }

        // Стираем подсказку
        while (currentText.length > 0 && this.isShowingHint && !this.currentInput) {
            currentText = currentText.slice(0, -1);
            this.handlePrompt({ 
                command: currentText, 
                showCursor: true, 
                action: 'update' 
            });
            await this.sleep(this.eraseDelay);
        }

        if (!this.currentInput) {
            this.hintIndex = (this.hintIndex + 1) % this.hints.length;
            await this.sleep(this.betweenHintsDelay); // Добавили паузу между подсказками
            this.startHintCycle();
        }
        this.isShowingHint = false;
    }
}

// Инициализация
window.initTerminalAnimation = () => {
    new TerminalAnimation();
}; 