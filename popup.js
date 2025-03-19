const voiceSelect = document.getElementById("voice");
const speedControl = document.getElementById("speed");

function loadVoices(){
    chrome.tts.getVoices((voices) => {
        voiceSelect.innerHTML = "";
        voices.forEach((voice) => {
            let option = document.createElement("option");
            option.value = voice.voiceName;
            option.textContent = voice.voiceName;
            voiceSelect.appendChild(option);
        });
    });
}

document.addEventListener("DOMContentLoaded", loadVoices);

function sendMessageToBackground(action, data = {}) {
    chrome.runtime.sendMessage({ action, ...data }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Background script is not responding.");
        } else {
            console.log("Message sent successfully:", response);
        }
    });
}

document.getElementById("play").addEventListener("click", () => {
    chrome.storage.local.get("selectedText", (data) => {
        if (data.selectedText) {
            sendMessageToBackground("play", {
                voice: voiceSelect.value || "Google US English",
                speed: parseFloat(speedControl.value) || 1.0,
                text: data.selectedText
            });
        } else {
            alert("Please highlight text before playing.");
        }
    });
});

document.getElementById("pause").addEventListener("click", () => {
    chrome.runtime.sendMessage({action: "pause"});
});

document.getElementById("stop").addEventListener("click", () => {
    chrome.runtime.sendMessage({action: "stop"});
});