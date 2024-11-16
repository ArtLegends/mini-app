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
    // Удаляем текущий курсор
    const cursor = document.getElementById('terminal-cursor');
    if (cursor) {
        cursor.remove();
    }

    const command = cmd.toLowerCase().trim();
    
    // Добавляем новую строку перед выводом результата
    $('#terminal-content').append('\n');
    
    if (commands[command]) {
        typeText('> ' + commands[command], () => {
            scrollToBottom();
            setTimeout(() => {
                showCursor();
            }, 500);
        });
    } else {
        typeText('> Command not found: ' + command, () => {
            scrollToBottom();
            setTimeout(() => {
                showCursor();
            }, 500);
        });
    }
}

// Обновляем функцию показа курсора
function showCursor() {
    updateTerminalLine('');
}

// Обновляем функцию активации ввода
function activateInput() {
    if (!inputActive && commandMode && !isTyping) {
        inputActive = true;
        
        // Создаём скрытое поле ввода
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'text';
        hiddenInput.id = 'hidden-input';
        hiddenInput.style.position = 'fixed';
        hiddenInput.style.opacity = '0';
        hiddenInput.style.height = '0';
        hiddenInput.style.width = '0';
        hiddenInput.style.left = '-1000px'; // Прячем подальше от видимой области
        document.body.appendChild(hiddenInput);
        
        // Устанавливаем текущее значение
        hiddenInput.value = currentCommand;
        hiddenInput.focus();
        
        hiddenInput.addEventListener('input', function(e) {
            currentCommand = this.value;
            updateTerminalLine(currentCommand);
        });
        
        hiddenInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (currentCommand.trim()) {
                    // Удаляем текущую строку ввода
                    const terminal = document.getElementById('terminal-content');
                    const lines = terminal.innerHTML.split('\n');
                    lines.pop();
                    terminal.innerHTML = lines.join('\n');
                    
                    // Добавляем введенную команду как текст
                    terminal.appendChild(document.createElement('br'));
                    const commandLine = document.createElement('div');
                    commandLine.textContent = '> ' + currentCommand.toLowerCase();
                    terminal.appendChild(commandLine);
                    
                    // Обрабатываем команду
                    processCommand(currentCommand);
                    currentCommand = '';
                    this.value = '';
                    this.blur();
                    document.body.removeChild(this);
                    inputActive = false;
                }
            }
        });
        
        hiddenInput.addEventListener('blur', function() {
            if (document.getElementById('hidden-input')) {
                document.body.removeChild(this);
                inputActive = false;
            }
        });
    }
}

// Обновляем функцию обновления строки терминала
function updateTerminalLine(text) {
    const terminal = document.getElementById('terminal-content');
    // Получаем все строки до текущей
    const lines = terminal.innerHTML.split('\n');
    lines.pop(); // Удаляем последнюю строку, так как будем её обновлять
    
    // Создаём новую строку с текстом и курсором
    const newLine = document.createElement('div');
    newLine.className = 'input-line';
    
    const prompt = document.createElement('span');
    prompt.textContent = '> ';
    newLine.appendChild(prompt);
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text.toLowerCase();
    newLine.appendChild(textSpan);
    
    // Добавляем курсор
    const cursor = document.createElement('span');
    cursor.id = 'terminal-cursor';
    cursor.className = 'cursor blink';
    cursor.innerHTML = '&nbsp;';
    newLine.appendChild(cursor);
    
    // Обновляем содержимое терминала
    terminal.innerHTML = lines.join('\n');
    if (lines.length > 0) terminal.appendChild(document.createElement('br'));
    terminal.appendChild(newLine);
    
    scrollToBottom();
}

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
    
    const terminal = document.getElementById('terminal-content');
    
    // Обновляем обработчик клика
    terminal.addEventListener('click', function(e) {
        // Проверяем, не кликнули ли мы по уже существующей строке ввода
        const clickedElement = e.target;
        const inputLine = clickedElement.closest('.input-line');
        
        if (!inputLine && commandMode && !isTyping) {
            // Если клик не по строке ввода и разрешён ввод команд
            activateInput();
        }
    });
    
    // Оставляем существующие обработчики скролла
    terminal.addEventListener('scroll', function(e) {
        if (terminal.scrollTop < lastScrollTop) {
            userScrolling = true;
            autoScrollEnabled = false;
        } else if (terminal.scrollTop + terminal.clientHeight >= terminal.scrollHeight - 50) {
            userScrolling = false;
            autoScrollEnabled = true;
        }
        lastScrollTop = terminal.scrollTop;
    });
    
    terminal.addEventListener('touchstart', function(e) {
        if (terminal.scrollTop <= 0) {
            terminal.scrollTop = 1;
            e.preventDefault();
        }
    }, { passive: false });
    
    terminal.addEventListener('touchmove', function(e) {
        if (terminal.scrollTop <= 0) {
            e.preventDefault();
        }
    }, { passive: false });
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
