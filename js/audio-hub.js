class AudioHub {

    static music_piano = new Audio ('audio/background/noncopyright-music-pianos-295174.mp3');
    static music_8bit = new Audio('audio/background/8-bit-loop-189494.mp3');
    static music_western = new Audio('audio/background/casualwesternrythym-67060.mp3');
    static music_cowboy = new Audio('audio/background/lonely-cowboy-74482.mp3');
    
        //KARAKTER YÜRÜME SESI
    static walking_sound = new Audio('audio/effects/sand-walk.mp3');

        //TAVUK, CIVCIV VE ENDBOSS SESLERI
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

        //SES SEVIYESI ICIN YENI EKLEME
    static currentVolume = 0.2; //Baslangic ses seviyesi 

        //TÜM MÜZİKLERİ ÖN YÜKLEME
    static {
            // Statik blok - class yüklendiğinde çalışır
        [AudioHub.music_piano, AudioHub.music_8bit, AudioHub.music_western, AudioHub.music_cowboy].forEach(audio => {
            audio.preload = 'auto'; // Otomatik ön yükleme
            audio.load(); // Hemen yükle
            audio.volume = AudioHub.currentVolume; //Baslangic ses seviyesini ayarla
        });

        //SESLERI ÖNDEN YÜKLEME
        AudioHub.walking_sound.preload = 'auto';
        AudioHub.walking_sound.load();


        AudioHub.chicken_sound.preload = 'auto';
        AudioHub.chicken_sound.load();

        AudioHub.chicken_baby_sound.preload = 'auto';
        AudioHub.chicken_baby_sound.load();

        AudioHub.endboss_sound.preload = 'auto';
        AudioHub.endboss_sound.load();

        AudioHub.bottle_break_sound.preload = 'auto';
        AudioHub.bottle_break_sound.load();

        AudioHub.win_sound.preload = 'auto';
        AudioHub.win_sound.load();

        AudioHub.lost_sound.preload = 'auto';
        AudioHub.lost_sound.load();

        AudioHub.coin_sound.preload = 'auto';
        AudioHub.coin_sound.load();

        AudioHub.jump_sound.preload = 'auto';
        AudioHub.jump_sound.load();

        AudioHub.hurt_sound.preload = 'auto';
        AudioHub.hurt_sound.load();

        AudioHub.danger_music.preload = 'auto';
        AudioHub.danger_music.load();
    }


    static allBackgroundMusic = [ //Müzikleri bir array`de topladik
        AudioHub.music_piano,
        AudioHub.music_8bit,
        AudioHub.music_western,
        AudioHub.music_cowboy     
    ];

    static currentMusic = null;
    

    /**
    * Stellt die Lautstärke des Spiels ein
    * Wird vom HTML-Slider aufgerufen
    * @param {number} value - Lautstärkewert (0.0 = stumm, 1.0 = maximal)
    */

    static setVolume(value) {
        AudioHub.currentVolume = parseFloat(value); //Gelen degeri sayiya cevir ve kaydet
        if (AudioHub.currentMusic) { //Suan calan müzigin sesini ayarla
            AudioHub.currentMusic.volume = AudioHub.currentVolume;
        }

        //Tüm müziklerin sesini ayarla (Bir sonraki calinca dogru ses seviyesinde olsun)
        AudioHub.allBackgroundMusic.forEach(music => {
            music.volume = AudioHub.currentVolume;
        });

        //SES EFEKTLERININ DE SESINI AYARLA
        AudioHub.walking_sound.volume = AudioHub.currentVolume;
        AudioHub.chicken_sound.volume = AudioHub.currentVolume;
        AudioHub.chicken_baby_sound.volume = AudioHub.currentVolume;
        AudioHub.endboss_sound.volume = AudioHub.currentVolume;
        AudioHub.bottle_break_sound.volume = AudioHub.currentVolume;
        AudioHub.lost_sound.volume = AudioHub.currentVolume;
        AudioHub.coin_sound.volume = AudioHub.currentVolume;
        AudioHub.jump_sound.volume = AudioHub.currentVolume;
        AudioHub.hurt_sound.volume = AudioHub.currentVolume;
        AudioHub.danger_music.volume = AudioHub.currentVolume;
    }


        //Belirli bir müzigi cal (index= 0, 1, 2 veya 3)
    static playMusic(index) { //Eger zaten ayni müzik caliyorsa, hicbir sey yapma (devam etsin)
        if(AudioHub.currentMusic === AudioHub.allBackgroundMusic[index] && !AudioHub.currentMusic.paused) {
            return; //Fonksiyondan cik müzigi calmaya devam eder
        }

        if(AudioHub.currentMusic) { //Farkli bir müzik caliyorsa, onu durdur
            AudioHub.currentMusic.pause();
            AudioHub.currentMusic.currentTime = 0;
        }

        //Yeni müzigi baslat
        AudioHub.currentMusic = AudioHub.allBackgroundMusic[index];
        AudioHub.currentMusic.loop = true;
        AudioHub.currentMusic.volume = 0.1;
        
        AudioHub.currentMusic.play().catch(e => {
            console.warn("Müzik otomatik oynatilmaya çalisirken bir hata oluştu:", e);
        });
    }

    //Calan müzigi durdur//
    static pauseMusic() {
        if(AudioHub.currentMusic) {
            AudioHub.currentMusic.pause();
        }
    }

    //Durdurulan müzigi devam ettir
    static resumeMusic(){
        if(AudioHub.currentMusic) {
            AudioHub.currentMusic.play().catch (e => {
                console.warn("Müzik devam ettirilmeye çalisirken bir hata oluştu:", e);
            });
        }
    }

    //müzigi durdur
    static stopMusic() {
        if(AudioHub.currentMusic) {
            AudioHub.currentMusic.pause();
            AudioHub.currentMusic.currentTime = 0;
            AudioHub.currentMusic = null;
        }
    }

    //Tehlike müzigini cal
    static playDangerMusic() {
        if(AudioHub.currentMusic) {
            AudioHub.currentMusic.pause();
            AudioHub.currentMusic.currentTime = 0;
        }

        AudioHub.currentMusic = AudioHub.danger_music;
        AudioHub.currentMusic.loop = true;
        AudioHub.currentMusic.volume = 0.7;
        AudioHub.currentMusic.play().catch((e) => {
            console.warn("Gefahr-Musik konnte nicht abgespielt werden:", e);
        });
    }

    //Tehlike müzigini durdur
    static stopDangerMusic() {
        if(AudioHub.currentMusic === AudioHub.danger_music) {
            AudioHub.danger_music.pause();
            AudioHub.danger_music.currentTime = 0;
            AudioHub.currentMusic = null;
        }
    }

}