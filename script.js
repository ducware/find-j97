(function() {
    const gameArea = document.getElementById('game-area');
    const targetEl = document.getElementById('target');
    const proximitySound = document.getElementById('proximity-sound');
    const successSound = document.getElementById('success-sound');
    const resetBtn = document.getElementById('reset-btn');

    let targetX = 0;
    let targetY = 0;
    let targetFound = false;

    const clickThreshold = 50;

    function initGame() {
        targetFound = false;
        const areaWidth = window.innerWidth;
        const areaHeight = window.innerHeight;
        targetX = Math.floor(Math.random() * (areaWidth - 80));
        targetY = Math.floor(Math.random() * (areaHeight - 80));

        targetEl.style.display = 'none';
        targetEl.style.left = targetX + 'px';
        targetEl.style.top = targetY + 'px';

        proximitySound.volume = 0;
        proximitySound.play().catch(err => {
            console.warn('Trình duyệt có thể chặn tự động phát âm thanh. Hãy click vào trang trước.');
        });
    }

    function distance(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx*dx + dy*dy);
    }

    function updateVolume(mouseX, mouseY) {
        const dist = distance(mouseX, mouseY, targetX + 40, targetY + 40);
        const maxDist = Math.sqrt(window.innerWidth**2 + window.innerHeight**2);
        let vol = 1 - (dist / maxDist);
        vol = Math.max(0, Math.min(1, vol));
        proximitySound.volume = vol;
    }

    document.addEventListener('mousemove', (e) => {
        if (!targetFound) {
            updateVolume(e.clientX, e.clientY);
        }
    });

    document.addEventListener('click', (e) => {
        if (targetFound) return;
        const dist = distance(e.clientX, e.clientY, targetX + 40, targetY + 40);
        if (dist < clickThreshold) {
            targetFound = true;
            targetEl.style.display = 'block';
            proximitySound.pause();
            proximitySound.currentTime = 0;
            successSound.play();
        }
    });

    resetBtn.addEventListener('click', () => {
        initGame();
    });

    initGame();
})();
