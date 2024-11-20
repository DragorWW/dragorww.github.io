const commands = [
    {
        command: './dragorww.me --info',
        output: `<div class="output">
            <span class="highlight">Name:</span> Сергей Андреев
            <span class="highlight">Role:</span> Head of Engineering
            <span class="highlight">Status:</span> Developing awesome things...
        </div>`
    },
    {
        command: './skills --list-top',
        output: `<div class="output">
            <div class="skill-tag">React.js <span class="version">v18</span></div>
            <div class="skill-tag">Node.js <span class="version">v18</span></div>
            <div class="skill-tag">TypeScript <span class="version">v5</span></div>
            <div class="skill-tag">Python <span class="version">v3.11</span></div>
        </div>`
    },
    {
        command: 'cat latest_project.log',
        output: `<div class="output log-output">
            <span class="log-date">[2024]</span> Scaling educational platform
            <span class="log-details">• 7 companies integration</span>
            <span class="log-details">• 100k+ users</span>
            <span class="log-details">• 99.9% uptime</span>
        </div>`
    }
];

class TerminalAnimation {
    constructor(containerId) {
        this.container = document.querySelector('.command-history');
        this.commandDelay = 50;
        this.commandPause = 200;
        this.cursor = '<span class="cursor">█</span>';
    }

    async typeCommand(command) {
        const commandLine = document.createElement('p');
        commandLine.innerHTML = '<span class="prompt">$</span> ';
        this.container.appendChild(commandLine);

        let currentCommand = '';
        for (let char of command) {
            currentCommand += char;
            commandLine.innerHTML = `<span class="prompt">$</span> ${currentCommand}${this.cursor}`;
            await this.sleep(this.commandDelay);
        }
        
        commandLine.innerHTML = `<span class="prompt">$</span> ${command}`;
        return commandLine;
    }

    async showOutput(output) {
        const outputElement = document.createElement('div');
        outputElement.innerHTML = output;
        outputElement.classList.add('output');
        this.container.appendChild(outputElement);
        
        await this.sleep(300);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async start() {
        for (let i = 0; i < commands.length; i++) {
            await this.typeCommand(commands[i].command);
            await this.sleep(100);
            await this.showOutput(commands[i].output);
            await this.sleep(this.commandPause);
        }
        
        const finalLine = document.createElement('p');
        finalLine.innerHTML = `<span class="prompt">$</span> ${this.cursor}`;
        this.container.appendChild(finalLine);
    }
}

// Инициализация анимации при появлении терминала в поле зрения
const initTerminalAnimation = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const terminal = new TerminalAnimation();
                terminal.start();
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.terminal-window'));
};

// Экспортируем функцию инициализации
window.initTerminalAnimation = initTerminalAnimation; 