(function updateCustomStatus() {
    const userID = "1194456715614240799"; // ضع هنا معرف الديسكورد الخاص بك
    const statusElement = document.querySelector("#custom-status"); // عنصر HTML الذي سيعرض الحالة

    // استبدال الـ WebSocket بـ API للحصول على البيانات مباشرة
    fetch('https://api.lanyard.rest/v1/users/' + userID)
        .then(response => response.json())
        .then(data => {
            const activities = data.data.activities;
            // البحث في الأنشطة للحصول على حالة مخصصة
            const customStatus = activities.find(a => a.type === 4); // العثور على النشاط المخصص بنوع 4

            if (customStatus && customStatus.state) {
                let statusText = customStatus.state;

                // التحقق من وجود إيموجي في الحالة
                const emojiMatch = /<a?:\w+:(\d+)>/.exec(customStatus.state);
                if (emojiMatch) {
                    const emojiID = emojiMatch[1]; // معرف الإيموجي
                    const emojiURL = `https://cdn.discordapp.com/emojis/${emojiID}.png`; // رابط الإيموجي
                    statusText += ` <img src="${emojiURL}" alt="emoji" style="width: 20px; height: 20px;">`; // إضافة الإيموجي للنص
                }

                statusElement.innerHTML = statusText; // عرض النص مع الإيموجي إذا كان موجود
            } else {
                // إذا لم توجد حالة مخصصة، يتم عرض رسالة عيد الميلاد أو النص الافتراضي
                updateTime();
            }
        })
        .catch(error => {
            console.error("حدث خطأ في جلب البيانات من الـ API.", error);
            statusElement.textContent = "لا يمكن جلب الحالة.";
        });

})();

function updateTime() {
    const timeElement = document.getElementById("time");
    const dayElement = document.getElementById("day");
    const dateElement = document.getElementById("date");

    // تحديد التوقيت الخاص بالسعودية باستخدام UTC+3
    const now = new Date();
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const localTime = new Date(utcNow.getTime() + 3 * 3600000); // السعودية في UTC+3

    // تحديث الوقت
    const hours = String(localTime.getHours()).padStart(2, "0");
    const minutes = String(localTime.getMinutes()).padStart(2, "0");
    const timeString = `${hours}:${minutes}`;
    timeElement.textContent = timeString;

    // تحديث اليوم
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const dayString = days[localTime.getDay()];
    dayElement.textContent = dayString;

    // تحديث التاريخ
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const dateString = `${localTime.getDate()}, ${months[localTime.getMonth()]}`;
    dateElement.textContent = dateString;

    // تحقق من عيد الميلاد
    const todayString =
        (localTime.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        localTime.getDate().toString().padStart(2, "0");
    const birthdayPerson = birthdays.find(
        (birthday) => birthday.date === todayString
    );

    const statusContent = document.querySelector("#custom-status");

    if (birthdayPerson) {
        statusContent.textContent = `Happy Birthday, ${birthdayPerson.name}! 🎂`;
    } else {
        // عرض الحالة من الـ API
        statusContent.textContent = "لا توجد حالة مخصصة";
    }
}

function startFakeWebSocket() {
    setInterval(() => {
        updateTime();
    }, 1000);
}

startFakeWebSocket();
