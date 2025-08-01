// === 🧠 Auto Answer Logic ===
document.getElementById("answerBtn").addEventListener("click", () => {
  const statusDiv = document.getElementById("status");
  const button = document.getElementById("answerBtn");
  const overlay = document.getElementById("processingOverlay");

  // Update button and status with smooth animations
  button.disabled = true;
  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 3a9 9 0 0 1 9 9"/>
    </svg>
    Processing...
  `;
  overlay.style.display = "flex";

  setStatus("Starting FormSage...", "info");

  // Execute the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];

    // Check if we're on a Google Form
    if (!currentTab.url.includes("docs.google.com/forms")) {
      setStatus("Please navigate to a Google Form first!", "warning");
      resetButton();
      return;
    }

    // Trigger the existing content script button click
    chrome.tabs.sendMessage(currentTab.id, { action: "triggerAutoAnswer" }, (response) => {
      setTimeout(() => {
        resetButton();
        if (chrome.runtime.lastError) {
          setStatus("Please refresh the Google Form page first!", "warning");
        } else {
          setStatus("Quiz completed! Check the form for results.", "success");
        }
      }, 2000);
    });
  });

  function resetButton() {
    button.disabled = false;
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
      </svg>
      Auto Answer Quiz
    `;
    overlay.style.display = "none";
  }
});

// === 🔐 Gemini API Key Save/Clear Logic ===
document.getElementById("saveBtn").addEventListener("click", () => {
  const key = document.getElementById("keyInput").value.trim();
  if (!key) {
    setStatus("Please enter an API key!", "error");
    return;
  }

  chrome.storage.local.set({ gemini_api_key: key }, () => {
    setStatus("API key saved successfully!", "success");
    document.getElementById("keyInput").value = ""; // Clear input after saving
  });
});

document.getElementById("clearBtn").addEventListener("click", () => {
  chrome.storage.local.remove("gemini_api_key", () => {
    setStatus("API key cleared!", "warning");
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
        if (chrome.runtime.lastError) {
          setStatus("Please refresh the Google Form page first!", "warning");
        } else {
          if (isEnabled) {
            setStatus("Auto Answer button is now visible on forms!", "success");
          } else {
            setStatus("Auto Answer button is now hidden from forms.", "info");
          }
        }
      });
    }
  });
});

// === 🎨 Status Helper Function ===
function setStatus(message, type) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status status-${type}`;

  // Add fade-in animation
  status.style.opacity = "0";
  setTimeout(() => {
    status.style.opacity = "1";
  }, 50);
}

// === 🚀 Initialize popup on load ===
document.addEventListener("DOMContentLoaded", () => {
  // Add staggered fade-in animations
  const sections = document.querySelectorAll('.section');
  sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(10px)';
    setTimeout(() => {
      section.style.transition = 'all 0.3s ease';
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, index * 100);
  });

  // Load saved switch state on popup open
  chrome.storage.local.get("buttonEnabled", (data) => {
    const toggleSwitch = document.getElementById("toggleSwitch");
    if (toggleSwitch) {
      toggleSwitch.checked = data.buttonEnabled !== false; // Default to true
    }
  });

  // Check if API key exists and show status
  chrome.storage.local.get("gemini_api_key", (data) => {
    if (data.gemini_api_key) {
      setStatus("API key configured - Ready to use!", "success");
    } else {
      setStatus("Please configure your Gemini API key to get started.", "warning");
    }
  });
});