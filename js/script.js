// Глобальные переменные
let currentLine = 0;
let isTyping = false;
let commandMode = false;
let currentCommand = '';
let wakeLock = null;
let userScrolling = false;
let lastScrollTop = 0;
let autoScrollEnabled = true;

// Добавляем переменную для отслеживания состояния ввода
let inputActive = false;

// Массив строк для вывода
const lines = [
    'INITIALIZING BIRTHDAY PROTOCOL...',
    'LOADING FRIENDSHIP DATA...',
    'ACCESSING MEMORY BANKS...',
    '> Happy Birthday, [Friend\'s Name]!',
    '> EXECUTING celebration.exe',
    '> STATUS: Best_Friend_Found',
    '> RUNNING memory_compilation.sh',
    '> LOADING best_moments.dat',
    '##########################################',
    '> You\'ve been an amazing friend and colleague',
    '> Years of coding together: MAXIMUM_VALUE',
    '> Bugs fixed together: INFINITY',
    '> Coffee consumed: OVERFLOW_ERROR',
    '> Friendship level: LEGENDARY',
    '##########################################',
    '> SYSTEM NOTIFICATION:',
    '> Special person detected!',
    '> Initiating birthday celebration sequence...',
    '> Желаю тебе успешной компиляции всех жизненных проектов!',
    '> Happy debugging of all your dreams!',
    '##########################################',
    'Type "help" for available commands...'
];

// Команды терминала
const commands = {
    'help': 'Available commands: help, about, memories, secret, party',
    'about': 'Best friend and awesome developer detected! Status: Birthday mode activated!',
    'memories': 'Loading shared memories... [Вставьте ваши общие воспоминания]',
    'secret': 'Access granted! Special birthday message unlocked! 🎉',
    'party': `
    🎉 🎂 🎈 🎁 
    HAPPY BIRTHDAY!
    🎉 🎂 🎈 🎁
    `
};

// Функция для запроса Wake Lock
async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock активирован');
        
        document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === 'visible') {
                wakeLock = await navigator.wakeLock.request('screen');
            }
        });
    } catch (err) {
        console.log(`Ошибка Wake Lock: ${err.name}, ${err.message}`);
    }
}

// Функция прокрутки
function scrollToBottom() {
    if (autoScrollEnabled && !userScrolling) {
        const terminal = document.getElementById('terminal-content');
        terminal.scrollTop = terminal.scrollHeight;
    }
}

// Функция печати текста
function typeText(text, callback) {
    let index = 0;
    isTyping = true;
    
    function type() {
        if (index < text.length) {
            $('#terminal-content').append(text.charAt(index));
            scrollToBottom();
            index++;
            setTimeout(type, Math.random() * 50 + 30);
        } else {
            $('#terminal-content').append('<br>');
            scrollToBottom();
            isTyping = false;
            if (callback) callback();
        }
    }
    
    type();
}

// Обновляем функцию обработки команд
function processCommand(cmd) {
    const command = cmd.toLowerCase().trim();
    
    // Добавляем новую строку с введенной командой
    $('#terminal-content').append(`\n> ${command}\n`);
    
    if (commands[command]) {
        typeText(commands[command], () => {
            scrollToBottom();
            createNewInputLine();
        });
    } else {
        typeText(`Command not found: ${command}`, () => {
            scrollToBottom();
            createNewInputLine();
        });
    }
}

// Создаем новую строку ввода
function createNewInputLine() {
    const terminal = document.getElementById('terminal-content');
    const inputLine = document.createElement('div');
    inputLine.className = 'input-line';
    inputLine.innerHTML = '> <span class="input-text"></span><span class="cursor blink">&nbsp;</span>';
    terminal.appendChild(inputLine);
    scrollToBottom();
}

// Модифицируем функцию показа курсора
function showCursor() {
    createNewInputLine();
}

// Обновляем функцию активации ввода
function activateInput() {
    if (!inputActive && commandMode && !isTyping) {
        inputActive = true;
        
        // Создаем скрытое поле ввода
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'text';
        hiddenInput.id = 'hidden-input';
        hiddenInput.style.position = 'absolute';
        hiddenInput.style.opacity = '0';
        hiddenInput.style.left = '-9999px';
        document.body.appendChild(hiddenInput);
        
        hiddenInput.focus();
        
        // Обработчик ввода текста
        hiddenInput.addEventListener('input', function(e) {
            currentCommand = this.value;
            updateTerminalLine(currentCommand);
        });
        
        // Обработчик нажатия Enter
        hiddenInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (currentCommand.trim()) {
                    // Сохраняем текущее значение
                    const commandToProcess = currentCommand;
                    currentCommand = '';
                    this.value = '';
                    
                    // Удаляем скрытое поле ввода
                    if (document.body.contains(this)) {
                        document.body.removeChild(this);
                    }
                    inputActive = false;
                    
                    // Обрабатываем команду
                    processCommand(commandToProcess);
                }
            }
        });
        
        // Обработчик потери фокуса
        hiddenInput.addEventListener('blur', function() {
            if (document.body.contains(this)) {
                document.body.removeChild(this);
                inputActive = false;
            }
        });
    }
}

// Обновляем функцию обновления строки терминала
function updateTerminalLine(text) {
    const terminal = document.getElementById('terminal-content');
    const currentInputLine = terminal.querySelector('.input-line:last-child');
    
    if (currentInputLine) {
        const inputText = currentInputLine.querySelector('.input-text');
        if (inputText) {
            inputText.textContent = text;
        }
    }
    scrollToBottom();
}

// Обработчик клика по терминалу
document.getElementById('terminal-content').addEventListener('click', function(e) {
    if (commandMode && !isTyping) {
        const hiddenInput = document.getElementById('hidden-input');
        if (!hiddenInput) {
            activateInput();
        }
        e.preventDefault();
    }
});

// Модифицируем функцию печати следующей строки
function printNextLine() {
    if (currentLine < lines.length) {
        typeText(lines[currentLine], () => {
            currentLine++;
            if (currentLine < lines.length) {
                setTimeout(printNextLine, 1000);
            } else {
                commandMode = true;
                showCursor(); // Показываем курсор после завершения вывода
            }
        });
    }
}

// Обновляем инициализацию при загрузке страницы
$(document).ready(function() {
    const tg = window.Telegram.WebApp;
    
    document.body.style.position = 'fixed';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    tg.expand();
    requestWakeLock();
    
    setTimeout(printNextLine, 1000);
});

// Обновляем обработчик клавиатуры для десктопа
$(document).on('keypress', function(e) {
    if (commandMode && !isTyping && !inputActive) {
        if (e.which === 13) { // Enter
            if (currentCommand.trim()) {
                processCommand(currentCommand);
                currentCommand = '';
            }
        } else {
            currentCommand += String.fromCharCode(e.which).toLowerCase();
            updateTerminalLine(currentCommand);
        }
    }
});

// Обработчик изменения размера окна
window.addEventListener('resize', scrollToBottom);
