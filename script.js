const installBanner = document.getElementById('install-banner');
const installBtn = document.getElementById('install-pwa-btn');
const iosBtn = document.getElementById('ios-instructions-btn');
const iosModal = document.getElementById('ios-modal');

// Проверяем: запущено ли уже как приложение или пользователь уже завершил установку
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
const isAlreadyInstalled = localStorage.getItem('vet_app_installed') === 'true';
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (!isStandalone && !isAlreadyInstalled) {
    // 1. Показываем баннер, так как еще НЕ установлено
    if (installBanner) installBanner.style.display = 'block';

    if (isIOS) {
        // iOS: показываем только кнопку инструкции
        if (installBtn) installBtn.style.display = 'none';
        if (iosBtn) iosBtn.style.display = 'inline-block';
        
        if (iosBtn) {
            iosBtn.addEventListener('click', () => {
                if (iosModal) iosModal.style.display = 'flex';
            });
        }
    } else {
        // Android/Desktop: показываем кнопку установки
        if (iosBtn) iosBtn.style.display = 'none';
        if (installBtn) installBtn.style.display = 'inline-block';

        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
        });

        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    
                    if (outcome === 'accepted') {
                        // 2. УСТАНОВЛЕНО: скрываем баннер и запоминаем это
                        installBanner.style.display = 'none';
                        localStorage.setItem('vet_app_installed', 'true');
                    }
                    deferredPrompt = null;
                } else {
                    alert('Нажмите на иконку установки (плюсик или монитор) в правой части адресной строки браузера.');
                }
            });
        }
    }
} else {
    // 3. УЖЕ УСТАНОВЛЕНО: гарантированно скрываем баннер при загрузке
    if (installBanner) installBanner.style.display = 'none';
}

// Обработка форм
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Заявка отправлена! (Демо-режим)');
    this.reset();
});

document.getElementById('chatForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Сообщение отправлено врачу! (Демо-режим)');
    this.reset();
});