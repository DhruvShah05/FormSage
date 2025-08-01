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
  button.textContent = "Auto Answer";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "9999";
  button.style.padding = "10px 15px";
  button.style.border = "none";
  button.style.borderRadius = "8px";
  button.style.background = "linear-gradient(45deg, #ff6b6b, #ee5a24)";
  button.style.color = "white";
  button.style.fontWeight = "bold";
  button.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
  button.style.cursor = "pointer";

  document.body.appendChild(button);

  // Check saved state and apply it
  chrome.storage.local.get("buttonEnabled", (data) => {
    if (data.buttonEnabled === false) {
      button.style.display = "none";
    }
  });

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
          button.textContent = "❌ Error!";
          setTimeout(() => {
            button.textContent = "Auto Answer";
          }, 2000);
          return;
        }

        const data = await res.json();
        answers = data.answers || [];
        console.log("🤖 Gemini Answers:", answers);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        button.textContent = "❌ Network Error!";
        setTimeout(() => {
          button.textContent = "Auto Answer";
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

      button.textContent = "✅ Answered!";
      setTimeout(() => {
        button.textContent = "Auto Answer";
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
      button.textContent = "🔄 Processing...";
      performAutoAnswer().then(() => {
        sendResponse({ success: true });
      }).catch((error) => {
        console.error("Error in auto answer:", error);
        button.textContent = "❌ Error!";
        setTimeout(() => {
          button.textContent = "Auto Answer";
        }, 2000);
        sendResponse({ success: false, error: error.message });
      });
      return true; // Keep message channel open for async response
    }
    return true; // Keep message channel open for async response
  });

  // Button click handler
  button.onclick = async () => {
    button.textContent = "🔄 Processing...";
    await performAutoAnswer();
  };
})();