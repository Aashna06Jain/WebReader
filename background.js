let isSpeaking = false;
let isPaused = false;
let lastSpokenText = "";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "play") {
        chrome.storage.local.get("selectedText", (data) => {
            if (data.selectedText && !isSpeaking) {
                lastSpokenText = data.selectedText;
                isPaused = false;
                isSpeaking = true;

                chrome.tts.speak(lastSpokenText, {
                    voiceName: message.voice,
                    rate: message.speed,
                    pitch: 1.0,
                    volume: 1.0,
                    lang: "en-US",
                    onEvent: (event) => {
                        if (event.type === "end" || event.type === "error") {
                            isSpeaking = false;
                            isPaused = false;
                        }
                    }
                });
            } else if (isPaused) {
                chrome.tts.resume();
                isPaused = false;
            }
        });
    } else if (message.action === "pause") {
        if (isSpeaking) {
            chrome.tts.pause();
            isPaused = true;
        }
    } else if (message.action === "stop") {
        chrome.tts.stop();
        isSpeaking = false;
        isPaused = false;
    }
});

