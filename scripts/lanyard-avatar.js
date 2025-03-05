(function lanyard() {
    const userID = "1194456715614240799"; // معرف المستخدم الخاص بك

    function getAvatarURL(userID, avatarID) {
        if (!avatarID) {
            return "https://cdn.discordapp.com/embed/avatars/0.png"; // ✅ صورة افتراضية
        }

        // ✅ تحديد امتداد الصورة بناءً على نوع الصورة
        const extension = avatarID.startsWith("a_") ? "gif" : "png";
        return `https://cdn.discordapp.com/avatars/${userID}/${avatarID}.${extension}?size=1024`;
    }

    const elements = {
        statusDot: document.querySelector("#dot"),
        dotRpc: document.querySelector("#color-dot"),
        ping: document.querySelector("#ping"),
        statusText: document.querySelector("#status p"),
        freeText: document.querySelector("#free"),
        avatar: document.querySelector("#avatar"), // ✅ التأكد من العنصر الصحيح
    };

    const statusColorMap = {
        online: { color: "#23a55a", text: "Online", glow: "0 0 5px 2px #23a55a" },
        dnd: { color: "#f23f43", text: "Do Not Disturb", glow: "0 0 5px 2px #f23f43" },
        idle: { color: "#f0b232", text: "Idle / AFK", glow: "0 0 5px 2px #f0b232" },
        offline: { color: "#7e828c", text: "Offline", glow: "none" },
        streaming: { color: "#593695", text: "Streaming", glow: "0 0 5px 2px #593695" },
    };

    function updateStatus(status) {
        console.log("Received status update:", status); // ✅ فحص البيانات القادمة

        if (!status || !status.discord_user) {
            console.error("Invalid status data received.");
            return;
        }

        let { color, text, glow } = statusColorMap[status.discord_status] || { color: "#7e828c", text: "Unknown", glow: "none" };

        if (status.activities.some(activity => activity.type === 1 && (activity.url.includes("twitch.tv") || activity.url.includes("youtube.com")))) {
            color = "#593695";
            text = "Streaming";
            glow = "0 0 5px 2px #593695";
        }

        if (elements.statusDot) elements.statusDot.style.backgroundColor = color;
        if (elements.dotRpc) elements.dotRpc.style.backgroundColor = color;
        if (elements.ping) {
            elements.ping.style.backgroundColor = color;
            elements.ping.style.boxShadow = glow;
        }
        if (elements.statusText) elements.statusText.textContent = text;
        if (document.querySelector("#name")) document.querySelector("#name").textContent = status.discord_user.display_name;

        // ✅ تحديث الصورة الشخصية مع دعم الصور المتحركة
        if (elements.avatar) {
            const avatarURL = getAvatarURL(status.discord_user.id, status.discord_user.avatar);
            console.log("Updating avatar to:", avatarURL); // ✅ فحص رابط الصورة
            elements.avatar.src = avatarURL;
        } else {
            console.error("Avatar element not found.");
        }
    }

    function startWebSocket() {
        const ws = new WebSocket("wss://api.lanyard.rest/socket");
        ws.onopen = () => {
            ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userID } }));
        };
        ws.onmessage = (event) => {
            const { t, d } = JSON.parse(event.data);
            if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") {
                updateStatus(d);
            }
        };
        ws.onerror = () => {
            console.error("WebSocket error occurred.");
            ws.close();
        };
        ws.onclose = () => {
            setTimeout(startWebSocket, 1000);
        };
    }

    startWebSocket();
})();
