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
    
    let currentLine = 0;
    let isTyping = false;
    let commandMode = false;
    let currentCommand = '';
    
// Добавляем глобальные переменные для отслеживания состояния скролла
let userScrolling = false;
let lastScrollTop = 0;
let autoScrollEnabled = true;

// Модифицированная функция прокрутки
function scrollToBottom() {
    const terminal = document.getElementById('terminal-content');
    if (autoScrollEnabled && !userScrolling) {
        terminal.scrollTop = terminal.scrollHeight;
    }
}

// Добавляем обработчики событий скролла
document.getElementById('terminal-content').addEventListener('scroll', function(e) {
    const terminal = e.target;
    
    // Определяем направление скролла
    if (terminal.scrollTop < lastScrollTop) {
        // Скролл вверх - пользователь читает
        userScrolling = true;
        autoScrollEnabled = false;
    } else if (terminal.scrollTop + terminal.clientHeight >= terminal.scrollHeight - 50) {
        // Скролл почти в самом низу - возобновляем автопрокрутку
        userScrolling = false;
        autoScrollEnabled = true;
    }
    
    lastScrollTop = terminal.scrollTop;
});

// Модифицированная функция печати текста
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

// Глобальная переменная для Wake Lock
let wakeLock = null;

// Функция для запроса Wake Lock
async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock активирован');
        
        // Добавляем обработчик для повторного получения Wake Lock при восстановлении видимости страницы
        document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === 'visible') {
                wakeLock = await navigator.wakeLock.request('screen');
            }
        });
    } catch (err) {
        console.log(`Ошибка Wake Lock: ${err.name}, ${err.message}`);
    }
}

// Инициализация Telegram WebApp
let tg = window.Telegram.WebApp;

// Предотвращаем сворачивание через скролл
document.addEventListener('touchstart', function(e) {
    const terminal = document.getElementById('terminal-content');
    if (terminal.scrollTop === 0) {
        terminal.scrollTop = 1;
    }
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    const terminal = document.getElementById('terminal-content');
    if (terminal.scrollTop <= 0) {
        e.preventDefault();
    }
}, { passive: false });

// Запускаем все инициализации при загрузке страницы
$(document).ready(function() {
    // Расширяем на весь экран
    tg.expand();
    
    // Активируем Wake Lock
    requestWakeLock();
    
    // Запускаем анимацию
    setTimeout(printNextLine, 1000);
});

// Обработка ошибок Wake Lock
window.addEventListener('unhandledrejection', function(event) {
    console.warn('Wake Lock ошибка:', event.reason);
});

// Отключаем pull-to-refresh
document.body.style.overscrollBehavior = 'none';

// Модифицированная функция обработки команд
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

    // Запуск анимации при загрузке страницы
    $(document).ready(function() {
        setTimeout(printNextLine, 1000);
    });

// Добавляем обработчик изменения размера окна
window.addEventListener('resize', function() {
    scrollToBottom();
});

/*let username = document.getElementById('username');
username.textContent = tg.initDataUnsafe.user.first_name || 'пользователь';

document.getElementById('showAlert').addEventListener('click', () => {
    tg.showAlert('hi!');
});

document.getElementById('sendMessage').addEventListener('click', () => {
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: tg.initDataUnsafe.user.id,
            text: 'Это сообщение отправлено из мини-приложения!',
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            tg.showAlert('Сообщение успешно отправлено!');
        } else {
            tg.showAlert('Ошибка при отправке сообщения.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        tg.showAlert('Произошла ошибка при отправке сообщения.');
    });
});

tg.MainButton.setText('Главная кнопка');
tg.MainButton.show();
tg.MainButton.onClick(() => {
    tg.showAlert('Вы нажали главную кнопку!');
}); */
