class PomodoroTimer {
    constructor() {
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.modeButtons = document.querySelectorAll('.mode-button');
        this.themeToggle = document.getElementById('theme-toggle');
        this.tomatoContainer = document.getElementById('tomato-container');
        this.activeTomatoes = [];

        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.timerId = null;
        this.isRunning = false;

        // Initialize theme
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.updateTheme();

        this.initializeEventListeners();

        this.saladContainer = document.createElement('div');
        this.saladContainer.id = 'salad-container';
        this.saladContainer.className = 'tomato-container'; // Reuse the same container styles
        document.body.appendChild(this.saladContainer);
        this.activeSalads = [];

        this.currentMode = 'pomodoro'; // Track current mode

        // Create containers for different modes
        this.breakContainer = document.createElement('div');
        this.breakContainer.id = 'break-container';
        this.breakContainer.className = 'tomato-container';
        document.body.appendChild(this.breakContainer);
        this.activeBreakEmojis = [];
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        this.modeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.modeButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                const minutes = parseInt(e.target.dataset.time);
                this.setTime(minutes);
            });
        });
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        this.updateTheme();
    }

    updateTheme() {
        document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }

    setTime(minutes) {
        this.timeLeft = minutes * 60;
        this.updateDisplay();

        // Update current mode based on time
        if (minutes === 25) {
            this.currentMode = 'pomodoro';
        } else if (minutes === 5) {
            this.currentMode = 'short-break';
        } else if (minutes === 15) {
            this.currentMode = 'long-break';
        }

        this.stopTimer(); // Stop timer without salads

        // Immediately show appropriate emojis for the new mode
        for (let i = 0; i < 10; i++) {
            if (this.currentMode === 'pomodoro') {
                this.createTomato();
            } else {
                this.createBreakEmoji(this.currentMode);
            }
        }
    }

    stopTimer() {
        this.isRunning = false;
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.clearAllEmojis();
    }

    createTomato() {
        const tomato = document.createElement('div');
        tomato.className = 'bouncing-tomato';
        tomato.textContent = '🍅';

        // Random starting position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;

        // Random movement values
        const xMove = (Math.random() - 0.5) * 300;
        const yMove = (Math.random() - 0.5) * 300;

        tomato.style.left = `${startX}px`;
        tomato.style.top = `${startY}px`;
        tomato.style.setProperty('--x-move', `${xMove}px`);
        tomato.style.setProperty('--x-move-rev', `${-xMove}px`);
        tomato.style.setProperty('--y-move', `${yMove}px`);
        tomato.style.setProperty('--y-move-rev', `${-yMove}px`);

        // Random animation duration between 3 and 6 seconds
        tomato.style.animationDuration = `${3 + Math.random() * 3}s`;

        this.tomatoContainer.appendChild(tomato);
        this.activeTomatoes.push(tomato);
    }

    createSalad() {
        const salad = document.createElement('div');
        salad.className = 'bouncing-tomato'; // Reuse the same animation
        salad.textContent = '🥗';

        // Random starting position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;

        // Random movement values
        const xMove = (Math.random() - 0.5) * 300;
        const yMove = (Math.random() - 0.5) * 300;

        salad.style.left = `${startX}px`;
        salad.style.top = `${startY}px`;
        salad.style.setProperty('--x-move', `${xMove}px`);
        salad.style.setProperty('--x-move-rev', `${-xMove}px`);
        salad.style.setProperty('--y-move', `${yMove}px`);
        salad.style.setProperty('--y-move-rev', `${-yMove}px`);

        // Random animation duration between 3 and 6 seconds
        salad.style.animationDuration = `${3 + Math.random() * 3}s`;

        this.saladContainer.appendChild(salad);
        this.activeSalads.push(salad);

        // Remove the salad after animation
        setTimeout(() => {
            salad.remove();
            this.activeSalads = this.activeSalads.filter(s => s !== salad);
        }, 3000);
    }

    createBreakEmoji(mode) {
        const emoji = document.createElement('div');
        emoji.className = 'bouncing-tomato';

        // Set emoji based on mode
        if (mode === 'short-break') {
            emoji.textContent = '💤';
        } else if (mode === 'long-break') {
            emoji.textContent = '🏖️';
        } else {
            emoji.textContent = '🍅';
        }

        // Random starting position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;

        // Random movement values
        const xMove = (Math.random() - 0.5) * 300;
        const yMove = (Math.random() - 0.5) * 300;

        emoji.style.left = `${startX}px`;
        emoji.style.top = `${startY}px`;
        emoji.style.setProperty('--x-move', `${xMove}px`);
        emoji.style.setProperty('--x-move-rev', `${-xMove}px`);
        emoji.style.setProperty('--y-move', `${yMove}px`);
        emoji.style.setProperty('--y-move-rev', `${-yMove}px`);
        emoji.style.animationDuration = `${3 + Math.random() * 3}s`;

        this.breakContainer.appendChild(emoji);
        this.activeBreakEmojis.push(emoji);
    }

    clearAllEmojis() {
        // Clear all types of emojis
        this.activeTomatoes.forEach(tomato => tomato.remove());
        this.activeTomatoes = [];
        this.activeSalads.forEach(salad => salad.remove());
        this.activeSalads = [];
        this.activeBreakEmojis.forEach(emoji => emoji.remove());
        this.activeBreakEmojis = [];
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => {
                this.timeLeft--;
                if (this.timeLeft < 0) {
                    this.timeUp();
                } else {
                    this.updateDisplay();
                }
            }, 1000);

            this.clearAllEmojis();
            // Always create tomatoes when starting
            for (let i = 0; i < 10; i++) {
                this.createTomato();
            }
        }
    }

    pause() {
        this.stopTimer();
        // Only show salads when explicitly pausing
        for (let i = 0; i < 10; i++) {
            this.createSalad();
        }
    }

    reset() {
        const activeButton = document.querySelector('.mode-button.active');
        const minutes = parseInt(activeButton.dataset.time);
        this.setTime(minutes);
    }

    timeUp() {
        this.pause();
        this.playNotification();
        this.reset();
    }

    playNotification() {
        // Play notification sound
        const audio = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');
        audio.play();
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 