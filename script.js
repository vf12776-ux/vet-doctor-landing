let deferredPrompt;
const installBanner = document.getElementById('install-banner');
const installBtn = document.getElementById('install-pwa-btn');
const iosBtn = document.getElementById('ios-instructions-btn');
const iosModal = document.getElementById('ios-modal');
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Проверка, было ли уже установлено/закрыто
if (!localStorage.getItem('vet_app_installed')) {
    if (isIOS) {
        // Для iOS показываем инструкцию
        installBanner.style.display = 'block';
        installBtn.style.display = 'none';
        iosBtn.style.display = 'inline-block';
        
        iosBtn.addEventListener('click', () => {
            iosModal.style.display = 'flex';
        });
    } else {
        // Для остальных браузеров ждем события beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBanner.style.display = 'block';
            iosBtn.style.display = 'none';
            
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        installBanner.style.display = 'none';
                        localStorage.setItem('vet_app_installed', 'true');
                    }
                    deferredPrompt = null;
                }
            });
        });
    }
}

// Стандартная логика форм
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