let tg = window.Telegram.WebApp;

tg.expand();

let username = document.getElementById('username');
username.textContent = tg.initDataUnsafe.user.first_name || 'пользователь';

document.getElementById('showAlert').addEventListener('click', () => {
    tg.showAlert('Это тестовое предупреждение!');
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
});
