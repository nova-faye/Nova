const musicListElement = document.getElementById('music-list');
const audioPlayer = document.getElementById('audio-player');
const audioSource = document.getElementById('audio-source');
const audioRange = document.getElementById('audio-range');
const currentTimeElement = document.getElementById('current-time');
const durationTimeElement = document.getElementById('duration-time');

// قائمة الملفات الصوتية داخل مجلد "music"
const musicFiles = [
    'song1.mp3',
    'song2.mp3',
    'song3.mp3',
    'song4.mp3'
];

// دالة لتحميل الأغاني من المصفوفة
function loadMusic() {
    musicFiles.forEach(file => {
        const songElement = document.createElement('div');
        songElement.classList.add('song');
        songElement.textContent = file.replace('.mp3', ''); // إزالة .mp3 من الاسم
        songElement.onclick = () => playMusic(file);
        musicListElement.appendChild(songElement);
    });
}

// دالة لتشغيل الأغنية عند الضغط عليها
function playMusic(file) {
    const filePath = `music/${file}`; // المجلد الذي يحتوي على الأغاني
    audioSource.src = filePath;
    audioPlayer.load();
    audioPlayer.play();
}

// تحديث الوقت والعداد
audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;

    // تحديث الوقت الحالي
    currentTimeElement.textContent = formatTime(currentTime);
    
    // تحديث مدة الأغنية
    durationTimeElement.textContent = formatTime(duration);

    // تحديث شريط التقدم
    const progress = (currentTime / duration) * 100;
    audioRange.value = progress;
});

// تحديث الصوت حسب شريط التقدم
audioRange.addEventListener('input', () => {
    const progress = audioRange.value;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (progress / 100) * duration;
});

// دالة لتحويل الوقت إلى تنسيق (دقيقة:ثانية)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${secs < 10 ? '0' + secs : secs}`;
}

// تحميل قائمة الأغاني عند تحميل الصفحة
window.onload = loadMusic;
