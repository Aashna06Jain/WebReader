document.addEventListener("mouseup", () => {
    let selectedText = window.getSelection().toString().trim();

    if (selectedText.length > 0){
        chrome.storage.local.set({ selectedText});
    }
});