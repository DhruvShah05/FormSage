# FormSage

**FormSage** is a minimal Chrome extension that uses **Gemini AI** to automatically solve and fill out answers in Google Forms quizzes.

> Just click. Sit back. Let the AI handle it.

---

## Features

- Automatically scans and extracts questions and options from Google Forms  
- Sends them to **Gemini AI** to determine the best answers  
- Clicks the correct answer choices with natural timing and flow  
- Secure, one-time API key storage (via `chrome.storage.local`)  
- Works seamlessly on both macOS and Windows

---

## Demo 🚀  
*Coming soon*

---

## Setup Instructions

### 1. Clone or Download the Extension

```bash
git clone https://github.com/DhruvShah05/FormSage.git
````

Or download the ZIP and extract it.

---

### 2. Start the Backend (Gemini API)

Ensure you have Python 3 installed.

Install dependencies:

```bash
pip install flask flask-cors google-generativeai
```

Then run the backend:

```bash
python backend.py
```

The server will start at `http://localhost:5000`.

---

### 3. Load the Extension in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the folder containing the extension files (with `manifest.json`)

---

### 4. Enter Your Gemini API Key 🔑

1. Click the **FormSage** extension icon in your browser
2. Paste your [Gemini API key](https://aistudio.google.com/apikey)
3. Save it — you only need to do this once

---

## Usage

1. Navigate to a multiple-choice Google Form quiz
2. Click the floating **Auto Answer** button on the bottom right
3. Watch as FormSage fills in the answers using Gemini AI

---

## File Structure

```
FormSage/
├── backend.py         # Flask backend to call Gemini API
├── content.js         # Injected script that scrapes and clicks answers
├── popup.html         # Simple UI for entering API key
├── popup.js           # Logic to store key and trigger answering
├── manifest.json      # Chrome extension metadata
└── README.md
```

---

## Security

* Your Gemini API key is stored locally using Chrome's secure extension storage
* No key or form data is sent anywhere except Gemini (via your machine)

---

## Roadmap 🛣️

* Support for short/long answer fields
* Gemini Pro model selection toggle
* Deployable version with hosted backend (no Python setup)


```
