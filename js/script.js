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
    
    // Функция печати текста
    function typeText(text, callback) {
        let index = 0;
        isTyping = true;
        
        function type() {
            if (index < text.length) {
                $('#terminal-content').append(text.charAt(index));
                index++;
                setTimeout(type, Math.random() * 50 + 30);
            } else {
                $('#terminal-content').append('<br>');
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
            typeText('> ' + commands[command]);
        } else {
            typeText('> Command not found: ' + command);
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

// Функция для прокрутки к нижней части терминала
function scrollToBottom() {
    const terminal = document.getElementById('terminal-content');
    terminal.scrollTop = terminal.scrollHeight;
}

// Модифицированная функция печати текста
function typeText(text, callback) {
    let index = 0;
    isTyping = true;
    
    function type() {
        if (index < text.length) {
            $('#terminal-content').append(text.charAt(index));
            scrollToBottom(); // прокручиваем при каждом новом символе
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

// Добавляем обработчик изменения размера окна
window.addEventListener('resize', function() {
    scrollToBottom();
});

let tg = window.Telegram.WebApp;

tg.expand();

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
