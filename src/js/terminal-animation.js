class TerminalScrollManager {
    constructor(terminalContent) {
        this.terminal = terminalContent;
        this.autoScrollEnabled = true;
        this.savedScrollTop = 0;

        this.resizeObserver = new ResizeObserver(() => {
            this.scrollToBottom();
        });

        this.observeLastPrompt();
    }

    observeLastPrompt() {
        const lastPrompt = this.terminal.querySelector('.terminal__prompt:last-child');
        if (lastPrompt) {
            this.resizeObserver.disconnect();
            this.resizeObserver.observe(lastPrompt);
        }
    }

    disableScroll() {
        this.terminal.style.overflowY = 'hidden';
        this.savedScrollTop = this.terminal.scrollTop;
        this.terminal.addEventListener('scroll', this.preventScroll);
    }

    enableScroll() {
        this.terminal.style.overflowY = 'auto';
        this.terminal.removeEventListener('scroll', this.preventScroll);
    }

    preventScroll = () => {
        if (this.autoScrollEnabled) {
            this.terminal.scrollTop = this.savedScrollTop;
        }
    };

    disableAutoScroll() {
        this.autoScrollEnabled = false;
        this.savedScrollTop = this.terminal.scrollTop;
    }

    enableAutoScroll() {
        this.autoScrollEnabled = true;
    }

    scrollToBottom() {
        if (this.autoScrollEnabled) {
            this.savedScrollTop = this.terminal.scrollHeight - this.terminal.clientHeight;
            this.terminal.scrollTop = this.savedScrollTop;
        }
    }

    smoothScrollToBottom() {
        if (this.autoScrollEnabled) {
            this.terminal.scrollTo({
                top: this.terminal.scrollHeight,
                behavior: 'smooth',
            });
        }
    }

    restoreScroll() {
        this.terminal.scrollTop = this.savedScrollTop;
    }
}

class TerminalAnimation {
    commandDelay = 50;
    commandPause = 1000;

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
        'help - список всех команд',
    ];

    hintDelay = 1500;
    typeDelay = 60;
    eraseDelay = 30;
    pauseDelay = 1000;
    betweenHintsDelay = 300;
    hintIndex = 0;
    hintTimeout = null;
    isShowingHint = false;
    isInitializing = true;
    isAnimating = true;

    hasAISupport = 'userAgentData' in navigator && 'speechRecognition' in window;
    HF_API_TOKEN = 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    MODEL_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

    constructor() {
        this.container = document.querySelector('.terminal__history');
        this.terminalContent = document.querySelector('.terminal__content');
        this.scrollManager = new TerminalScrollManager(this.terminalContent);

        this.initialize();
        this.startHintCycle();
    }

    async initialize() {
        this.loadCommands();
        this.scrollManager.disableScroll();
        await this.simulateCommand('welcome');

        const initialCommands = ['about', 'skills', 'projects'];
        for (const cmd of initialCommands) {
            await this.sleep(this.commandPause);
            await this.simulateCommand(cmd);
        }

        await this.sleep(this.commandPause);
        this.isAnimating = false;
        this.isInitializing = false;
        this.scrollManager.enableScroll();
        this.setupEventListeners();

        this.handlePrompt({
            showCursor: document.activeElement === this.terminalContent,
            action: 'append',
        });

        setTimeout(() => {
            if (!this.currentInput) {
                this.startHintCycle();
            }
        }, 1000);
    }

    loadCommands() {
        const commands = {};
        document.querySelectorAll('.terminal__command').forEach((cmd) => {
            const commandName = cmd.dataset.command;
            commands[commandName] = {
                description: cmd.dataset.description || '',
                directory: cmd.dataset.directory || '',
                branch: cmd.dataset.branch || '',
                command: cmd.dataset.command || commandName,
                execute: () => {
                    const template = cmd.querySelector('template');
                    return template.innerHTML.trim();
                },
            };
        });

        this.commands = commands;
    }

    handlePrompt({ command = '', showCursor = false, action = 'create', isHint = false } = {}) {
        const shouldShowCursor =
            showCursor && (document.activeElement === this.terminalContent || this.isInitializing);

        const promptHTML = `
            <span class="terminal__prompt">
                ${this.currentDirectory ? `<span class="terminal__prompt-path">${this.currentDirectory}</span>` : ''}
                ${this.currentBranch ? `<span class="terminal__prompt-branch">(${this.currentBranch})</span>` : ''}
                <span class="terminal__prompt-symbol">$</span> 
                <span class="terminal__prompt-input ${isHint ? 'hint' : ''}">${command}${shouldShowCursor ? '<span class="terminal__prompt-cursor">█</span>' : ''}</span>
            </span>`;

        switch (action) {
            case 'create':
                const promptElement = document.createElement('p');
                promptElement.innerHTML = promptHTML;
                return promptElement;

            case 'update':
                const lastPrompt = this.container.lastElementChild;
                lastPrompt.innerHTML = promptHTML;

                if (!isHint) {
                    this.container.appendChild(lastPrompt);
                    this.scrollManager.observeLastPrompt();
                    this.scrollManager.scrollToBottom();
                }

                return lastPrompt;

            case 'append':
                const newPrompt = document.createElement('p');
                newPrompt.innerHTML = promptHTML;
                if (!isHint) {
                    this.container.appendChild(newPrompt);
                    this.scrollManager.observeLastPrompt();
                    this.scrollManager.scrollToBottom();
                }
                return newPrompt;
        }
    }

    sendAnalytics(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, {
                event_category: 'Terminal',
                ...params,
            });
        } else {
            console.debug('Google Analytics not available');
        }
    }

    async runCommand(command) {
        if (command.command === 'clear') {
            this.container.innerHTML = '';
            return;
        }

        const output = command.execute();
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = output;

        const outputs = Array.from(tempContainer.children);

        for (let i = 0; i < outputs.length; i++) {
            const outputContent = outputs[i];
            const outputElement = document.createElement('div');
            outputElement.classList.add('terminal__output');
            outputElement.appendChild(outputContent);
            this.container.appendChild(outputElement);
            this.scrollManager.scrollToBottom();

            if (i < outputs.length - 1) {
                await this.sleep(500);
            }
        }

        if (command.directory) {
            this.currentDirectory = command.directory;
        }

        if (command.branch) {
            this.currentBranch = command.branch;
        }
    }

    async simulateCommand(commandName) {
        const command = this.commands[commandName];
        const text = command.command || commandName;

        let promptElement = this.handlePrompt({ action: 'append' });

        let currentText = '';
        for (const char of text) {
            await this.sleep(this.commandDelay);
            currentText += char;
            promptElement.innerHTML = this.handlePrompt({
                command: currentText,
                action: 'create',
            }).innerHTML;
            this.scrollManager.scrollToBottom();
        }

        await this.sleep(500);
        await this.runCommand(command);
    }

    async executeCommand() {
        const command = this.currentInput.trim().toLowerCase();

        if (command) {
            this.sendAnalytics('terminal_command', {
                event_label: command,
                value: 1,
            });

            this.isAnimating = true;
            this.commandHistory.unshift(command);
            this.historyIndex = -1;

            const promptElement = this.container.lastElementChild;
            promptElement.innerHTML = this.handlePrompt({
                command: this.currentInput,
                action: 'update',
            }).innerHTML;

            if (this.commands[command]) {
                await this.runCommand(this.commands[command]);
            } else {
                const output = await this.tryAIResponse(command);
                if (output) {
                    const tempContainer = document.createElement('div');
                    tempContainer.innerHTML = output;
                    this.container.appendChild(tempContainer.firstElementChild);
                    this.scrollManager.scrollToBottom();
                }
            }

            this.isAnimating = false;
        }

        this.currentInput = '';
        this.handlePrompt({ showCursor: true, action: 'append' });
        this.startHintCycle();
    }

    async tryAIResponse(command) {
        try {
            // Используем шаблон для создания элемента загрузки
            const loadingTemplate = document.getElementById('loading-template');
            const loadingElement = loadingTemplate.content.cloneNode(true).firstElementChild;
            this.container.appendChild(loadingElement);
            this.scrollManager.scrollToBottom();

            await this.sleep(2000);

            const response = await fetch(this.MODEL_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.HF_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: {
                        text: `Context: You are a helpful assistant for Sergey Andreev's personal website. 
                               He is a CTO with experience in educational projects.
                               Current question: ${command}`,
                        max_length: 100,
                    },
                }),
            });

            loadingElement.remove();

            if (!response.ok) {
                throw new Error('API Error');
            }

            const data = await response.json();
            const aiResponse = data.generated_text || data[0].generated_text;

            // Используем новую функцию для отправки события
            sendAnalytics('ai_response', {
                event_label: command,
                value: 1,
                response_type: 'huggingface',
                response_text: truncateText(aiResponse),
            });

            return `<div class="terminal__output terminal__output--ai">
                <div class="terminal__output-header">🤖 AI Response:</div>
                <div class="terminal__output-content">${aiResponse}</div>
            </div>`;
        } catch (error) {
            console.error('AI Error:', error);

            const localAI = new LocalAI();
            const fallbackResponse = localAI.generateResponse(command);

            // Используем новую функцию для отправки события
            this.sendAnalytics('ai_response', {
                event_label: command,
                value: 1,
                response_type: 'local',
                response_text: truncateText(fallbackResponse),
            });

            return `<div class="terminal__output terminal__output--ai">
                <div class="terminal__output-header">🤖 Local AI:</div>
                <div class="terminal__output-content">${fallbackResponse}</div>
            </div>`;
        }
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    setupEventListeners() {
        this.terminalContent.addEventListener('click', () => {
            this.terminalContent.focus();
        });

        this.terminalContent.setAttribute('tabindex', '0');

        this.terminalContent.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
            }
            this.handleKeyPress(e);
        });

        this.terminalContent.addEventListener('focus', () => {
            if (this.isShowingHint) {
                this.isShowingHint = false;
                clearTimeout(this.hintTimeout);
                this.handlePrompt({ command: '', showCursor: true, action: 'update' });
            }
        });

        this.terminalContent.addEventListener('blur', () => {
            if (!this.currentInput && !this.isAnimating) {
                this.startHintCycle();
            }
        });

        document.removeEventListener('keydown', this.handleKeyPress);
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
            Math.min(this.commandHistory.length - 1, this.historyIndex + direction)
        );

        if (this.historyIndex === -1) {
            this.currentInput = '';
        } else {
            this.currentInput = this.commandHistory[this.historyIndex];
        }

        this.handlePrompt({ command: this.currentInput, showCursor: true, action: 'update' });
    }

    startHintCycle() {
        if (
            !this.currentInput &&
            !this.isAnimating &&
            document.activeElement !== this.terminalContent
        ) {
            this.hintTimeout = setTimeout(() => this.showNextHint(), this.hintDelay);
        }
    }

    async showNextHint() {
        if (
            this.currentInput ||
            this.isAnimating ||
            document.activeElement === this.terminalContent
        )
            return;

        this.isShowingHint = true;
        const hint = this.hints[this.hintIndex];

        let currentText = '';
        for (const char of hint) {
            if (
                this.currentInput ||
                !this.isShowingHint ||
                document.activeElement === this.terminalContent
            )
                break;
            currentText += char;
            this.handlePrompt({
                command: currentText,
                showCursor: true,
                action: 'update',
                isHint: true,
            });
            await this.sleep(this.typeDelay);
        }

        if (
            !this.currentInput &&
            this.isShowingHint &&
            document.activeElement !== this.terminalContent
        ) {
            await this.sleep(this.pauseDelay);
        }

        while (
            currentText.length > 0 &&
            this.isShowingHint &&
            !this.currentInput &&
            document.activeElement !== this.terminalContent
        ) {
            currentText = currentText.slice(0, -1);
            this.handlePrompt({
                command: currentText,
                showCursor: true,
                action: 'update',
                isHint: true,
            });
            await this.sleep(this.eraseDelay);
        }

        if (!this.currentInput && document.activeElement !== this.terminalContent) {
            this.hintIndex = (this.hintIndex + 1) % this.hints.length;
            await this.sleep(this.betweenHintsDelay);
            this.startHintCycle();
        }
        this.isShowingHint = false;
    }
}

class LocalAI {
    constructor() {
        this.keywords = {
            'опыт|работа|карьера': [
                'Более 10 лет опыта в разработке. Сейчас работаю CTO в Ultimate Education.',
                'Руковожу IT-стратегией образовательного холдинга из 7 компаний.',
                'Специализируюсь на масштабировании образовательных проектов.',
            ],
            'проект|достижени': [
                'Разработал LMS систму для 100k+ пользователей.',
                'Создал комплексную аналитическую платформу для образовательного холдинга.',
                'Оптимизировал производительность DevOps-системы в 10 раз.',
            ],
            'технолог|стек|язык': [
                'Основной стек: React, TypeScript, Python, Kubernetes.',
                'Опыт работы с Java, Kotlin, Node.js.',
                'Активно использую современные облачные технологии.',
            ],
            'образовани|обучени': [
                'Постоянно развиваюсь в сфре технологий.',
                'Особый интерес к AI и масштабированию систем.',
                'Делюсь опытом через менторство и технические статьи.',
            ],
            'контакт|связ|найти': [
                'Email: dragorww@gmail.com',
                'Telegram: @dragorww',
                'GitHub: github.com/dragorww',
            ],
        };

        this.defaultResponses = [
            'Извините, не совсем понял вопрос. Попробуйте спросить о моем опыте работы, проектах или технологиях.',
            'Может быть, вас интересует мой опыт работы в образовательных проектах?',
            'Я могу рассказать о технологиях, которые использую, или о своих проектах.',
        ];
    }

    generateResponse(input) {
        const normalizedInput = input.toLowerCase();

        // Ищем совпадения по ключевым словам
        for (const [keywordPattern, responses] of Object.entries(this.keywords)) {
            const regex = new RegExp(keywordPattern, 'i');
            if (regex.test(normalizedInput)) {
                // Выбираем случайный ответ из подходящей категории
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }

        // Если не нашли совпадений, возвращаем случайный дефолтный ответ
        return this.defaultResponses[Math.floor(Math.random() * this.defaultResponses.length)];
    }
}

const truncateText = (text, maxLength = 500) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

window.initTerminalAnimation = () => {
    new TerminalAnimation();
};
