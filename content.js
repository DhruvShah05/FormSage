(async function () {
  function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  function normalize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]|_/g, "") // remove punctuation/symbols
      .replace(/\s+/g, " ")      // collapse whitespace
      .trim();
  }

  const button = document.createElement("button");
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
    Auto Answer
  `;

  // Modern, clean styling to match the popup theme
  button.style.position = "fixed";
  button.style.bottom = "24px";
  button.style.right = "24px";
  button.style.zIndex = "9999";
  button.style.padding = "12px 20px";
  button.style.border = "none";
  button.style.borderRadius = "12px";
  button.style.background = "linear-gradient(45deg, #10b981, #059669)";
  button.style.color = "white";
  button.style.fontWeight = "600";
  button.style.fontSize = "14px";
  button.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif";
  button.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)";
  button.style.cursor = "pointer";
  button.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.backdropFilter = "blur(10px)";
  button.style.border = "1px solid rgba(255, 255, 255, 0.1)";
  button.style.userSelect = "none";

  // Add hover and active states
  button.addEventListener("mouseenter", () => {
    if (!button.disabled) {
      button.style.transform = "translateY(-2px) scale(1.02)";
      button.style.boxShadow = "0 8px 25px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)";
      button.style.background = "linear-gradient(45deg, #059669, #047857)";
    }
  });

  button.addEventListener("mouseleave", () => {
    if (!button.disabled) {
      button.style.transform = "translateY(0) scale(1)";
      button.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)";
      button.style.background = "linear-gradient(45deg, #10b981, #059669)";
    }
  });

  button.addEventListener("mousedown", () => {
    if (!button.disabled) {
      button.style.transform = "translateY(0) scale(0.98)";
    }
  });

  button.addEventListener("mouseup", () => {
    if (!button.disabled) {
      button.style.transform = "translateY(-2px) scale(1.02)";
    }
  });

  document.body.appendChild(button);

  // Check saved state and apply it
  chrome.storage.local.get("buttonEnabled", (data) => {
    if (data.buttonEnabled === false) {
      button.style.display = "none";
    }
  });

  // Helper function to update button state
  function updateButton(content, disabled = false, isError = false) {
    button.innerHTML = content;
    button.disabled = disabled;

    if (disabled) {
      button.style.opacity = "0.7";
      button.style.cursor = "not-allowed";
      button.style.transform = "translateY(0) scale(1)";
    } else {
      button.style.opacity = "1";
      button.style.cursor = "pointer";
    }

    if (isError) {
      button.style.background = "linear-gradient(45deg, #ef4444, #dc2626)";
      button.style.boxShadow = "0 4px 20px rgba(239, 68, 68, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)";
    } else if (!disabled) {
      button.style.background = "linear-gradient(45deg, #10b981, #059669)";
      button.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)";
    }
  }

  // Auto answer function
  async function performAutoAnswer() {
    const questions = Array.from(document.querySelectorAll(".Qr7Oae"));
    const quiz = [];

    const questionBlocks = []; // stores optionBlocks per question

    for (const q of questions) {
      const questionText = q.querySelector(".M7eMe")?.innerText.trim();
      const optionBlocks = Array.from(q.querySelectorAll("div.bzfPab.wFGF8"));

      const options = optionBlocks
        .map(block => {
          const span = block.querySelector("span.aDTYNe.snByac.OvPDhc.OIC90c");
          return span?.innerText.trim() || "";
        })
        .filter(opt => opt.length > 0);

      if (!questionText || options.length === 0) {
        console.warn("⚠️ Skipping question due to missing content:", questionText, options);
        continue;
      }

      quiz.push({ question: questionText, options });
      questionBlocks.push(optionBlocks);
    }

    console.log("🧠 Sending full quiz to Gemini:", quiz);

    // ✅ Get the stored API key
    chrome.storage.local.get("gemini_api_key", async (data) => {
      const apiKey = data.gemini_api_key;
      if (!apiKey) {
        alert("⚠️ Gemini API key not set. Click extension icon to set it.");
        return;
      }

      let answers = [];
      try {
        const res = await fetch("https://formsage-bfemfzcwegg0a2bn.malaysiawest-01.azurewebsites.net/solve_all", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey
          },
          body: JSON.stringify({ quiz })
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error("❌ Server error:", res.status, errText);
          updateButton(`
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Error
          `, true, true);
          setTimeout(() => {
            updateButton(`
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Auto Answer
            `);
          }, 2000);
          return;
        }

        const data = await res.json();
        answers = data.answers || [];
        console.log("🤖 Gemini Answers:", answers);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        updateButton(`
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          Network Error
        `, true, true);
        setTimeout(() => {
          updateButton(`
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Auto Answer
          `);
        }, 2000);
        return;
      }

      // Now map answers back to each question
      for (let i = 0; i < answers.length; i++) {
        const answerText = normalize(answers[i]);
        const optionBlocks = questionBlocks[i];

        let clicked = false;
        for (const block of optionBlocks) {
          const span = block.querySelector("span.aDTYNe.snByac.OvPDhc.OIC90c");
          const optionText = span?.innerText.trim() || "";
          const normalizedOption = normalize(optionText);

          console.log(`🧪 Q${i + 1}: Matching "${normalizedOption}" with "${answerText}"`);

          if (normalizedOption.includes(answerText)) {
            const input = block.querySelector("input[type='radio']");
            if (input) {
              input.scrollIntoView({ behavior: "smooth", block: "center" });
              await delay(200);
              input.click();
              input.dispatchEvent(new Event("change", { bubbles: true }));
              console.log(`🎯 Selected via input: ${optionText}`);
            } else {
              block.scrollIntoView({ behavior: "smooth", block: "center" });
              await delay(200);
              block.click();
              console.log(`🎯 Selected via block: ${optionText}`);
            }
            clicked = true;
            break;
          }
        }

        if (!clicked) {
          console.warn(`⚠️ No match found for Q${i + 1}:`, answers[i]);
        }

        await delay(500); // Wait before next question
      }

      updateButton(`
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
          <path d="m9 12 2 2 4-4"></path>
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
        </svg>
        Completed!
      `);
      setTimeout(() => {
        updateButton(`
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Auto Answer
        `);
      }, 3000);
    });
  }

  // Listen for messages from popup to show/hide button or trigger auto answer
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "hideButton") {
      button.style.display = "none";
      sendResponse({ success: true });
    } else if (message.action === "showButton") {
      button.style.display = "block";
      sendResponse({ success: true });
    } else if (message.action === "triggerAutoAnswer") {
      updateButton(`
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; animation: spin 1s linear infinite;">
          <path d="M21 12a9 9 0 11-6.219-8.56"></path>
        </svg>
        Processing...
      `, true);

      // Add CSS for spin animation
      if (!document.getElementById('formsage-spin-style')) {
        const style = document.createElement('style');
        style.id = 'formsage-spin-style';
        style.textContent = `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }

      performAutoAnswer().then(() => {
        sendResponse({ success: true });
      }).catch((error) => {
        console.error("Error in auto answer:", error);
        updateButton(`
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          Error
        `, true, true);
        setTimeout(() => {
          updateButton(`
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Auto Answer
          `);
        }, 2000);
        sendResponse({ success: false, error: error.message });
      });
      return true; // Keep message channel open for async response
    }
    return true; // Keep message channel open for async response
  });

  // Button click handler
  button.onclick = async () => {
    updateButton(`
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; animation: spin 1s linear infinite;">
        <path d="M21 12a9 9 0 11-6.219-8.56"></path>
      </svg>
      Processing...
    `, true);

    // Add CSS for spin animation
    if (!document.getElementById('formsage-spin-style')) {
      const style = document.createElement('style');
      style.id = 'formsage-spin-style';
      style.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    await performAutoAnswer();
  };
})();