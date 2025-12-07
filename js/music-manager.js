
 let selectedMusicIndex = -1; //Kullanicinin sectigi  müzik indexi ya da -1 yani secim yok
 let previewAudio = null; //Önizleme icin kullanilan gecici müzik nesnesi
 

 //RASTGELE MÜZIK BASLAT
function startRandomMusic() {
   let randomMusicIndex = Math.floor(Math.random() * 4);//Rastgele bir müzik seç ve çalmaya başla
    AudioHub.playMusic(randomMusicIndex);  // Rastgele seçilen müziği çal
    document.getElementById('musicDropdown').value = randomMusicIndex.toString(); // Dropdown'daki seçimi güncelle (kullanıcı hangisi çaldığını görsün)
    document.getElementById('previewBtn').disabled = false; // HÖREN butonunu aktif et (müzik seçili olduğu için)
    selectedMusicIndex = randomMusicIndex; // Secili müzigi güncelle
}


//Dropdown`dan müzik secildiginde cagirilir. Kullanici farikli bir müzik sectiginde tetiklenir.
function onMusicChange() {
    let dropdown = document.getElementById('musicDropdown'); //Dropdown elementini al.
    selectedMusicIndex = parseInt(dropdown.value); //secilen degeri sayiya cevir
    
    if(selectedMusicIndex >= 0) { //Eger gecerli bir müzik secildiyse
        document.getElementById('previewBtn').disabled = false; //HÖREN butonunu aktif et  
    } else {
        document.getElementById('previewBtn').disabled = true;//Gecersiz secimse hören butonunu pasif et
    }
    stopPreview();//Eger önizleme caliyorsa durdur
}


//SECILEN MÜZIGI ÖNIZLE (Hören butonu)
function previewSelectedMusic() {
    stopPreview(); //önce önceki önizlemeyi durdur

    //Eger gecerli bir müzik secildiyse
    if(selectedMusicIndex >= 0 && selectedMusicIndex < AudioHub.allBackgroundMusic.length) {
        previewAudio = AudioHub.allBackgroundMusic[selectedMusicIndex]; //Secilen müzigi al
        previewAudio.volume = 0.2; //Ses seviyesi %20(arka plan müziginden daha yüksek, daha iyi duyulsun)
        previewAudio.loop = true; //sürekli tekrar et
        previewAudio.currentTime = 0; //Bastan baslat
        previewAudio.play(); //Önizlemeyi cal
    }
}


 //DINLEMEYI (ÖNIZLEMEYI) DURDUR
function stopPreview() {
    if(previewAudio) { // Eğer önizleme çalıyorsa
        previewAudio.pause(); // Müziği durdur
        previewAudio.currentTime = 0;  // Başa sar
        previewAudio = null; // Referansı temizle
    }
}


// OYUN MÜZIGINI BASLAT (SPIELEN butonuna basıldığında)
function startBackgroundMusic() {
    stopPreview(); // Önce önizlemeyi durdur (çakışmasın)
        
    if(selectedMusicIndex >= 0) { // Eğer geçerli bir müzik seçildiyse
         AudioHub.playMusic(selectedMusicIndex); // AudioHub üzerinden müziği çal
        } else {
            startRandomMusic();
        }
}


//MÜZIGI DURDUR (OYUN BITTIGINDE YA DA ANA MENÜYE DÖNÜLDÜGÜNDE)
function stopBackgroundMusic() {
    AudioHub.stopMusic(); // AudioHub'daki müzigi durdur
}



 //MÜZIGI DURAKLAT (PAUSE butonu).
function pauseBackgroundMusic() {
    AudioHub.pauseMusic();// Müzigi durdur
}


// MÜZIGI DEVAM ETTIR (RESUME/START butonu).
function resumeBackgroundMusic() {
    AudioHub.resumeMusic(); // Müzigi devam ettir
}


// SES SEVIYESI AYARI
// @param {number} volume - Ses seviyesi (0.0 ile 1.0 arası)
function setMusicVolume(volume) {
    volume = Math.max(0.0, Math.min(1.0, volume));

    if(AudioHub && AudioHub.currentMusic) {  // Eğer müzik çalıyorsa
        AudioHub.currentMusic.volume = volume; // Ses seviyesini ayarla
        }
}