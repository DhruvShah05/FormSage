// === 🧠 Auto Answer Logic ===
document.getElementById("answerBtn").addEventListener("click", () => {
  const statusDiv = document.getElementById("status");
  const button = document.getElementById("answerBtn");

  // Update button and status
  button.disabled = true;
  button.textContent = "Processing...";
  statusDiv.textContent = "Starting QuizGemini...";
  statusDiv.style.background = "rgba(255, 193, 7, 0.2)";

  // Execute the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];

    // Check if we're on a Google Form
    if (!currentTab.url.includes("docs.google.com/forms")) {
      statusDiv.textContent = "Please navigate to a Google Form first!";
      statusDiv.style.background = "rgba(220, 53, 69, 0.2)";
      button.disabled = false;
      button.textContent = "Auto Answer Quiz";
      return;
    }

    // Trigger the existing content script button click
    chrome.tabs.sendMessage(currentTab.id, { action: "triggerAutoAnswer" }, (response) => {
      setTimeout(() => {
        button.disabled = false;
        button.textContent = "Auto Answer Quiz";
        if (chrome.runtime.lastError) {
          statusDiv.textContent = "Please refresh the Google Form page first!";
          statusDiv.style.background = "rgba(255, 193, 7, 0.2)";
        } else {
          statusDiv.textContent = "Check the form for results!";
          statusDiv.style.background = "rgba(40, 167, 69, 0.2)";
        }
      }, 2000);
    });
  });
});

// === 🔐 Gemini API Key Save/Clear Logic ===
document.getElementById("saveBtn").addEventListener("click", () => {
  const key = document.getElementById("keyInput").value.trim();
  if (!key) {
    const status = document.getElementById("status");
    status.textContent = "Please enter an API key!";
    status.style.background = "rgba(220, 53, 69, 0.2)";
    return;
  }

  chrome.storage.local.set({ gemini_api_key: key }, () => {
    const status = document.getElementById("status");
    status.textContent = "API key saved!";
    status.style.background = "rgba(40, 167, 69, 0.2)";
    document.getElementById("keyInput").value = ""; // Clear input after saving
  });
});

document.getElementById("clearBtn").addEventListener("click", () => {
  chrome.storage.local.remove("gemini_api_key", () => {
    const status = document.getElementById("status");
    status.textContent = "API key cleared!";
    status.style.background = "rgba(255, 193, 7, 0.2)";
    document.getElementById("keyInput").value = ""; // Clear input field too
  });
});

// === 🔧 Toggle Auto Answer Button Logic ===
document.getElementById("toggleSwitch").addEventListener("change", (event) => {
  const isEnabled = event.target.checked;

  // Save the state first
  chrome.storage.local.set({ buttonEnabled: isEnabled });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const action = isEnabled ? "showButton" : "hideButton";

      chrome.tabs.sendMessage(tabs[0].id, { action }, (response) => {
        const status = document.getElementById("status");
        if (chrome.runtime.lastError) {
          status.textContent = "Please refresh the Google Form page first!";
          status.style.background = "rgba(255, 193, 7, 0.2)";
        } else {
          if (isEnabled) {
            status.textContent = "Auto Answer button shown!";
            status.style.background = "rgba(40, 167, 69, 0.2)";
          } else {
            status.textContent = "Auto Answer button hidden!";
            status.style.background = "rgba(220, 53, 69, 0.2)";
          }
        }
      });
    }
  });
});

// === 🚀 Initialize popup on load ===
document.addEventListener("DOMContentLoaded", () => {
  // Load saved switch state on popup open
  chrome.storage.local.get("buttonEnabled", (data) => {
    const toggleSwitch = document.getElementById("toggleSwitch");
    if (toggleSwitch) {
      toggleSwitch.checked = data.buttonEnabled !== false; // Default to true
    }
  });

  // Check if API key exists and show status
  chrome.storage.local.get("gemini_api_key", (data) => {
    const status = document.getElementById("status");
    if (data.gemini_api_key) {
      status.textContent = "API key configured - Ready to use!";
      status.style.background = "rgba(40, 167, 69, 0.2)";
    } else {
      status.textContent = "Please set your Gemini API key first!";
      status.style.background = "rgba(255, 193, 7, 0.2)";
    }
  });
});