let isSpeaking = false;
let isPaused = false;
let lastSpokenText = "";
let textQueue = [];
let currentChunk = 0;

function speakNextChunk(voice, speed){
    if(currentChunk < textQueue.length){
        chrome.tts.speak(textQueue[currentChunk], {
            voiceName: voice,
            rate: speed,
            pitch: 1.0,
            volume: 1.0,
            lang: "en-US",
            onEvent: (event) => {
                if(event.type === "end"){
                    currentChunk++;
                    speakNextChunk(voice, speed);
                }
            }
        });
    }
    else{
        isSpeaking = false;
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "play") {
        chrome.storage.local.get("selectedText", (data) => {
            if (data.selectedText && !isSpeaking) {
                lastSpokenText = data.selectedText;
                isPaused = false;
                isSpeaking = true;

                textQueue = lastSpokenText.match(/.{1,300}(\s|$)/g);
                currentChunk = 0;

                speakNextChunk(message.voice, message.speed);
            } else if (isPaused) {
                chrome.tts.resume();
                isPaused = false;
            } else{
                console.warn("No text selected to read.")
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
        textQueue = [];
        currentChunk = 0;
    }
});

