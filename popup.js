// === 🧠 Your Existing Logic (unchanged) ===
document.getElementById("answerBtn").addEventListener("click", () => {
  const statusDiv = document.getElementById("status");
  const button = document.getElementById("answerBtn");

  // Update button and status
  button.disabled = true;
  button.textContent = "🔄 Processing...";
  statusDiv.textContent = "Starting QuizGemini...";
  statusDiv.style.background = "rgba(255, 193, 7, 0.2)";

  // Execute the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];

    // Check if we're on a Google Form
    if (!currentTab.url.includes("docs.google.com/forms")) {
      statusDiv.textContent = "⚠️ Please navigate to a Google Form first!";
      statusDiv.style.background = "rgba(220, 53, 69, 0.2)";
      button.disabled = false;
      button.textContent = "✨ Auto Answer Quiz";
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      function: autoAnswerForm
    }, (results) => {
      // Reset button state
      setTimeout(() => {
        button.disabled = false;
        button.textContent = "✨ Auto Answer Quiz";
        statusDiv.textContent = "Check the form for results!";
        statusDiv.style.background = "rgba(40, 167, 69, 0.2)";
      }, 2000);
    });
  });
});

function autoAnswerForm() {
  // This will run inside the tab and call your content.js function
  window.dispatchEvent(new CustomEvent("trigger-gemini-answer"));
}

// === 🔐 New Gemini API Key Save/Clear Logic ===
document.getElementById("saveBtn")?.addEventListener("click", () => {
  const key = document.getElementById("keyInput").value.trim();
  if (!key) return;

  chrome.storage.local.set({ gemini_api_key: key }, () => {
    const status = document.getElementById("status");
    status.textContent = "✅ API key saved!";
    status.style.background = "rgba(40, 167, 69, 0.2)";
  });
});

document.getElementById("clearBtn")?.addEventListener("click", () => {
  chrome.storage.local.remove("gemini_api_key", () => {
    const status = document.getElementById("status");
    status.textContent = "🧹 API key cleared!";
    status.style.background = "rgba(255, 193, 7, 0.2)";
  });
});
