(function() {
    const gameArea = document.getElementById('game-area');
    const targetEl = document.getElementById('target');
    const successSound = document.getElementById('success-sound');
    const resetBtn = document.getElementById('reset-btn');

    let proximitySound; // Variable to save current audio
    let targetX = 0;
    let targetY = 0;
    let targetFound = false;

    const clickThreshold = 50;

    // List proximity sound
    const soundFiles = [
        './sounds/sound1.mp3',
        './sounds/sound2.mp3',
        './sounds/sound4.mp3',
        './sounds/sound5.mp3',
        './sounds/sound6.mp3',
    ];

    // Function to generate random audio from a list
    function getRandomSound() {
        const randomIndex = Math.floor(Math.random() * soundFiles.length);
        const audio = new Audio(soundFiles[randomIndex]);
        audio.loop = true;
        return audio;
    }

    function initGame() {
        targetFound = false;
        const areaWidth = window.innerWidth;
        const areaHeight = window.innerHeight;
        targetX = Math.floor(Math.random() * (areaWidth - 80));
        targetY = Math.floor(Math.random() * (areaHeight - 80));

        targetEl.style.display = 'none';
        targetEl.style.left = targetX + 'px';
        targetEl.style.top = targetY + 'px';

        // Reset proximity sound
        if (proximitySound) {
            proximitySound.pause();
            proximitySound.currentTime = 0;
        }
        proximitySound = getRandomSound();
        proximitySound.volume = 0;
        proximitySound.play().catch(err => {
            console.warn('Trình duyệt có thể chặn tự động phát âm thanh. Hãy click vào trang trước.');
        });
    }

    function distance(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function updateVolume(mouseX, mouseY) {
        const dist = distance(mouseX, mouseY, targetX + 40, targetY + 40);
        const maxDist = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
        let ratio = dist / maxDist;
        let vol = Math.pow(1 - ratio, 4); // Exponentiate to increase volume
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
