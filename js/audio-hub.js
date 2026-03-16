class AudioHub {

    static music_piano = new Audio ('audio/background/noncopyright-music-pianos-295174.mp3');
    static music_8bit = new Audio('audio/background/8-bit-loop-189494.mp3');
    static music_western = new Audio('audio/background/casualwesternrythym-67060.mp3');
    static music_cowboy = new Audio('audio/background/lonely-cowboy-74482.mp3');
    static walking_sound = new Audio('audio/effects/sand-walk.mp3');
    static chicken_sound = new Audio('audio/effects/chicken-noise.mp3');
    static chicken_baby_sound = new Audio ('audio/effects/chicken-little-sound.mp3');
    static endboss_sound = new Audio('audio/effects/chicken-endboss-sound.mp3');
    static bottle_break_sound = new Audio('audio/effects/smashing-glass.mp3');
    static win_sound = new Audio('audio/effects/win-panel.mp3');
    static lost_sound = new Audio('audio/effects/lost-panel.mp3');
    static coin_sound = new Audio('audio/effects/coins-clinking-sound.mp3');
    static jump_sound = new Audio('audio/effects/jump.mp3');
    static hurt_sound = new Audio('audio/effects/ouch-sound.mp3');
    static danger_music = new Audio('audio/background/drone-sound.mp3');
    static currentVolume = 0.2;
    static isMuted = false;
    static savedVolume = 0.2;

    /**
     * Preloads an audio object
     * @param {Audio} audio - The audio object to preload
     */
    static preloadAudio(audio) {
        audio.preload = 'auto';
        audio.load();
    }

    /**
     * Preloads an audio object with volume
     * @param {Audio} audio - The audio object to preload
     * @param {number} volume - Initial volume level
     */
    static preloadAudioWithVolume(audio, volume) {
        audio.preload = 'auto';
        audio.load();
        audio.volume = volume;
    }

    /**
     * Preloads all background music tracks
     */
    static preloadBackgroundMusic() {
        [AudioHub.music_piano, AudioHub.music_8bit, AudioHub.music_western, AudioHub.music_cowboy].forEach(audio => {
            AudioHub.preloadAudioWithVolume(audio, AudioHub.currentVolume);
        });
    }

    /**
     * Preloads all sound effects
     */
    static preloadSoundEffects() {
        AudioHub.preloadAudio(AudioHub.walking_sound);
        AudioHub.preloadAudio(AudioHub.chicken_sound);
        AudioHub.preloadAudio(AudioHub.chicken_baby_sound);
        AudioHub.preloadAudio(AudioHub.endboss_sound);
        AudioHub.preloadAudio(AudioHub.bottle_break_sound);
        AudioHub.preloadAudio(AudioHub.win_sound);
        AudioHub.preloadAudio(AudioHub.lost_sound);
        AudioHub.preloadAudio(AudioHub.coin_sound);
        AudioHub.preloadAudio(AudioHub.jump_sound);
        AudioHub.preloadAudio(AudioHub.hurt_sound);
        AudioHub.preloadAudio(AudioHub.danger_music);
    }

    static {
        AudioHub.preloadBackgroundMusic();
        AudioHub.preloadSoundEffects();
    }

    static allBackgroundMusic = [
        AudioHub.music_piano,
        AudioHub.music_8bit,
        AudioHub.music_western,
        AudioHub.music_cowboy     
    ];
    static currentMusic = null;
    

    /**
     * Sets the volume of background music
     * @param {number} volume - Volume value
     */
    static setBackgroundMusicVolume(volume) {
        AudioHub.allBackgroundMusic.forEach(music => {
            music.volume = volume;
        });
    }

    /**
     * Sets the volume of all sound effects
     * @param {number} volume - Volume value
     */
    static setSoundEffectsVolume(volume) {
        AudioHub.walking_sound.volume = volume;
        AudioHub.chicken_sound.volume = volume;
        AudioHub.chicken_baby_sound.volume = volume;
        AudioHub.endboss_sound.volume = volume;
        AudioHub.bottle_break_sound.volume = volume;
        AudioHub.lost_sound.volume = volume;
        AudioHub.coin_sound.volume = volume;
        AudioHub.jump_sound.volume = volume;
        AudioHub.hurt_sound.volume = volume;
        AudioHub.danger_music.volume = volume;
    }


    /**
     * Sets the game volume
     * Called by HTML slider
     * @param {number} value - Volume value (0.0 = mute, 1.0 = maximum)
     */
    static setVolume(value) {
        AudioHub.currentVolume = parseFloat(value);
        
        if (AudioHub.currentMusic) {
            AudioHub.currentMusic.volume = AudioHub.currentVolume;
        }

        AudioHub.setBackgroundMusicVolume(AudioHub.currentVolume);
        AudioHub.setSoundEffectsVolume(AudioHub.currentVolume);

        // İki slider'ı da senkronize et
        AudioHub.syncSliders();
        
        // localStorage'a kaydet
        AudioHub.saveSettings();
    }

    /**
     * Syncs both volume sliders (home and game)
     * Ensures both sliders show the same value
     */
    static syncSliders() {
        let volumeHome = document.getElementById('volumeHome');
        let volumeGame = document.getElementById('volumeGame');
        
        if(volumeHome) {
            volumeHome.value = AudioHub.currentVolume;
        }
        if(volumeGame) {
            volumeGame.value = AudioHub.currentVolume;
        }
    }


    /**
     * Plays a background music track
     * @param {number} index - Index of the music in the array (0-3)
     */
    static playMusic(index) {
        if(AudioHub.currentMusic === AudioHub.allBackgroundMusic[index] && !AudioHub.currentMusic.paused) {
            return;
        }

        if(AudioHub.currentMusic) {
            AudioHub.currentMusic.pause();
            AudioHub.currentMusic.currentTime = 0;
        }

        AudioHub.currentMusic = AudioHub.allBackgroundMusic[index];
        AudioHub.currentMusic.loop = true;
        AudioHub.currentMusic.volume = AudioHub.currentVolume;
        
        if(!AudioHub.isMuted) {
            AudioHub.currentMusic.play().catch(e => {
                console.warn("Music could not be played automatically:", e);
            });
        }
    }


    /**
     * Pauses the current music
     */
    static pauseMusic() {
        if(AudioHub.currentMusic) {
            AudioHub.currentMusic.pause();
        }
    }


    /**
     * Resumes the music
     */
    static resumeMusic(){
        if(AudioHub.currentMusic && !AudioHub.isMuted) {
            AudioHub.currentMusic.play().catch(e => {
                console.warn("Music could not be resumed:", e);
            });
        }
    }

 
    /**
     * Stops the music completely
     */
    static stopMusic() {
        if(AudioHub.currentMusic) {
            AudioHub.currentMusic.pause();
            AudioHub.currentMusic.currentTime = 0;
            AudioHub.currentMusic = null;
        }
    }


    /**
     * Plays the danger music (boss battle)
     */
    static playDangerMusic() {
        if(AudioHub.isMuted) return;
        
        if(AudioHub.currentMusic) {
            AudioHub.currentMusic.pause();
            AudioHub.currentMusic.currentTime = 0;
        }

        AudioHub.currentMusic = AudioHub.danger_music;
        AudioHub.currentMusic.loop = true;
        AudioHub.currentMusic.volume = AudioHub.currentVolume;
        AudioHub.currentMusic.play().catch((e) => {
            console.warn("Danger music could not be played:", e);
        });
    }


    /**
     * Stops the danger music
     */
    static stopDangerMusic() {
        if(AudioHub.currentMusic === AudioHub.danger_music) {
            AudioHub.danger_music.pause();
            AudioHub.danger_music.currentTime = 0;
            AudioHub.currentMusic = null;
        }
    }


    /**
     * Mutes all sounds (music + effects)
     */
    static muteAll() {
        AudioHub.isMuted = true;
        AudioHub.savedVolume = AudioHub.currentVolume;
        
        // Müziği durdur
        if(AudioHub.currentMusic && !AudioHub.currentMusic.paused) {
            AudioHub.currentMusic.pause();
        }
        
        // Tüm volume'leri 0 yap
        AudioHub.allBackgroundMusic.forEach(music => {
            music.volume = 0;
        });
        
        AudioHub.walking_sound.volume = 0;
        AudioHub.chicken_sound.volume = 0;
        AudioHub.chicken_baby_sound.volume = 0;
        AudioHub.endboss_sound.volume = 0;
        AudioHub.bottle_break_sound.volume = 0;
        AudioHub.win_sound.volume = 0;
        AudioHub.lost_sound.volume = 0;
        AudioHub.coin_sound.volume = 0;
        AudioHub.jump_sound.volume = 0;
        AudioHub.hurt_sound.volume = 0;
        AudioHub.danger_music.volume = 0;
    }


    /**
     * Unmutes all sounds
     */
    static unmuteAll() {
        AudioHub.isMuted = false;
        AudioHub.currentVolume = AudioHub.savedVolume;
        
        // Volume'leri geri yükle
        AudioHub.setBackgroundMusicVolume(AudioHub.currentVolume);
        AudioHub.setSoundEffectsVolume(AudioHub.currentVolume);
        
        // Müziği tekrar başlat
        if(AudioHub.currentMusic) {
            AudioHub.currentMusic.play().catch(e => {
                console.warn("Music could not be resumed after unmute:", e);
            });
        }
    }


    /**
     * Toggles mute on/off
     * @returns {boolean} New mute state
     */
    static toggleMute() {
        if(AudioHub.isMuted) {
            AudioHub.unmuteAll();
        } else {
            AudioHub.muteAll();
        }

        AudioHub.saveSettings();
        return AudioHub.isMuted;
    }


    /**
     * Plays a sound effect only if not muted
     * @param {Audio} sound - The sound to play
     * @param {number} volume - Volume level (optional)
     */
    static playSound(sound, volume = null) {
        if(AudioHub.isMuted) {
            return;
        }
        
        sound.currentTime = 0;
        if(volume !== null) {
            sound.volume = volume;
        } else {
            sound.volume = AudioHub.currentVolume;
        }
        sound.play().catch(e => {
            console.warn("Sound could not be played:", e);
        });
    }


    /**
     * Saves audio settings to LocalStorage
     * Saves: volume, mute state
     */
    static saveSettings() {
        localStorage.setItem('audioVolume', AudioHub.currentVolume.toString());
        localStorage.setItem('audioMuted', AudioHub.isMuted.toString());
    }


    /**
     * Loads audio settings from LocalStorage
     * Loads: volume, mute state
     */
    static loadSettings() {
        // Volume yükle
        let savedVolume = localStorage.getItem('audioVolume');
        if(savedVolume !== null) {
            AudioHub.currentVolume = parseFloat(savedVolume);
            AudioHub.savedVolume = AudioHub.currentVolume;
            AudioHub.setBackgroundMusicVolume(AudioHub.currentVolume);
            AudioHub.setSoundEffectsVolume(AudioHub.currentVolume);
        }

        // Mute durumunu yükle
        let savedMuted = localStorage.getItem('audioMuted');
        if(savedMuted === 'true') {
            AudioHub.isMuted = true;
            AudioHub.muteAll();
        } else {
            AudioHub.isMuted = false;
        }
        
        // Slider'ları güncelle
        AudioHub.syncSliders();
    }
}