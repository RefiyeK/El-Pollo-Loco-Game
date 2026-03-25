Object.assign(World.prototype, {

    /**
     * Checks win/lose conditions — guarded against repeated calls
     * Uses else-if to prevent win + lose triggering on same frame
     */
    checkGameState() {
        if (gameState.paused) return;
        const endboss = this.level.enemies.find((e) => e instanceof Endboss);
        if (endboss && endboss.isDead()) {
            gameState.won = true;
            this.showGameOver();
        } else if (gameState.gameOver) {
            this.showGameOver();
        }
    },


    /**
     * Shows the lose screen and plays lose sound
     */
    showLoseScreen() {
        document.getElementById('gameOverImage').src = 'img/You%20won%2C%20you%20lost/You%20lost%20b.png';
        document.getElementById('gameOverText').textContent = 'YOU LOST!';
        stopBackgroundMusic();
        AudioHub.playSound(AudioHub.lost_sound, 0.4);
    },


    /**
     * Shows the win screen and plays win sound
     */
    showWinScreen() {
        document.getElementById('winImage').src = 'img/You%20won%2C%20you%20lost/You%20Win%20A.png';
        document.getElementById('winText').textContent = 'YOU WON!';
        stopBackgroundMusic();
        AudioHub.playSound(AudioHub.win_sound, 0.4);
    },


    /**
     * Decides and shows game over or win panel
     * endScreenShown flag prevents audio/DOM calls from firing multiple times
     */
    showGameOver() {
        if (this.endScreenShown) return;
        this.endScreenShown = true;

        if (gameState.gameOver && this.character.isDead()) {
            document.getElementById('gameOverPanel').style.display = 'flex';
            this.showLoseScreen();
        } else if (gameState.won) {
            document.getElementById('winPanel').style.display = 'flex';
            this.showWinScreen();
        }
        gameState.paused = true;
    }

});