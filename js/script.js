// Глобальные переменные
let currentLine = 0;
let isTyping = false;
let commandMode = false;
let currentCommand = '';
let wakeLock = null;
let userScrolling = false;
let lastScrollTop = 0;
let autoScrollEnabled = true;

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

// Функция обработки команд
function processCommand(cmd) {
    const command = cmd.toLowerCase().trim();
    if (commands[command]) {
        typeText('> ' + commands[command], () => {
            scrollToBottom();
        });
    } else {
        typeText('> Command not found: ' + command, () => {
            scrollToBottom();
        });
    }
}

// Функция для печати следующей строки
function printNextLine() {
    if (currentLine < lines.length) {
        typeText(lines[currentLine], () => {
            currentLine++;
            if (currentLine < lines.length) {
                setTimeout(printNextLine, 1000);
            } else {
                commandMode = true;
                $('#terminal-content').append('<br>> ');
            }
        });
    }
}

// Инициализация при загрузке страницы
$(document).ready(function() {
    const tg = window.Telegram.WebApp;
    
    // Предотвращаем сворачивание через скролл
    document.body.style.position = 'fixed';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Расширяем приложение
    tg.expand();
    
    // Активируем Wake Lock
    requestWakeLock();
    
    // Запускаем анимацию
    setTimeout(printNextLine, 1000);
    
    // Обработчики скролла
    const terminal = document.getElementById('terminal-content');
    
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
    
    // Предотвращаем сворачивание при достижении верха
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

// Обработка ввода команд
$(document).on('keypress', function(e) {
    if (commandMode && !isTyping) {
        if (e.which === 13) { // Enter
            processCommand(currentCommand);
            currentCommand = '';
            setTimeout(() => {
                $('#terminal-content').append('<br>> ');
            }, 500);
        } else {
            currentCommand += String.fromCharCode(e.which);
            $('#terminal-content').append(String.fromCharCode(e.which));
        }
    }
});

// Обработчик изменения размера окна
window.addEventListener('resize', scrollToBottom);
