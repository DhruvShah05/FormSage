# FormSage

**FormSage** is a Chrome extension that uses **Gemini AI** to automatically solve and fill out answers in Google Forms quizzes with a single click.

> Just click. Sit back. Let the AI handle it.

---

## Features

- 🤖 **AI-Powered**: Uses Gemini AI to intelligently answer quiz questions
- ⚡ **One-Click Solution**: Automatically scans, processes, and fills Google Forms
- 🔒 **Secure**: Your API key is stored locally and encrypted
- 🎯 **Smart Matching**: Advanced text normalization for accurate answer selection
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- ⚙️ **Customizable**: Toggle button visibility and control when to use the extension

---

## Demo 🚀

[![FormSage Demo](https://img.youtube.com/vi/g3jgnS58Mho/maxresdefault.jpg)](https://youtu.be/g3jgnS58Mho)

🎥 **[Watch Full Demo on YouTube](https://youtu.be/g3jgnS58Mho)**

---

## Quick Setup (No Backend Required!)

### 1. Download the Extension

```bash
git clone https://github.com/DhruvShah05/FormSage.git
```

Or download the ZIP and extract it.

---

### 2. Load the Extension in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the FormSage folder containing `manifest.json`
5. The FormSage icon should now appear in your extensions toolbar

---

### 3. Configure Your Gemini API Key 🔑

1. Get your free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Click the **FormSage** extension icon in your browser
3. Paste your API key in the configuration section
4. Click **Save** — you only need to do this once!

---

## Usage

### Method 1: Using the Floating Button
1. Navigate to any Google Forms quiz
2. The **Auto Answer** button appears automatically in the bottom right
3. Click it and watch FormSage solve the quiz instantly

### Method 2: Using the Extension Popup
1. Open any Google Forms quiz
2. Click the FormSage extension icon
3. Hit the **Auto Answer Quiz** button
4. Enjoy as the AI fills out your answers

---

## Settings & Customization

- **Toggle Button Visibility**: Hide/show the floating Auto Answer button
- **API Key Management**: Easily save or clear your Gemini API key
- **Real-time Status**: Get instant feedback on the extension's status

---

## File Structure

```
FormSage/
├── content.js         # Main script that handles form detection and answering
├── popup.html         # Extension popup interface
├── popup.js           # Popup logic and API key management
├── manifest.json      # Chrome extension configuration
├── icons/             # Extension icons
└── README.md          # This file
```

---

## How It Works

1. **Detection**: FormSage automatically detects Google Forms on the page
2. **Extraction**: Scrapes questions and multiple-choice options
3. **AI Processing**: Sends quiz data to Gemini AI for intelligent analysis
4. **Auto-Fill**: Automatically selects and clicks the best answers
5. **Completion**: Provides visual feedback when finished

---

## Security & Privacy

- 🔐 Your Gemini API key is stored securely using Chrome's local storage
- 🛡️ No form data is logged or stored permanently
- 🌐 All AI processing happens through official Google Gemini APIs
- 🔒 Extension only activates on Google Forms domains

---

## Browser Compatibility

- ✅ Chrome (Recommended)
- ✅ Chromium-based browsers (Edge, Brave, etc.)
- ❌ Firefox (Manifest V3 required)

---

## Troubleshooting

**Extension not working?**
- Refresh the Google Forms page and try again
- Make sure your API key is correctly configured
- Check that you're on a supported Google Forms URL

**Button not appearing?**
- Ensure the toggle switch is enabled in the extension popup
- Verify you're on a Google Forms quiz (not just a regular form)

---

## Roadmap 🛣️

- [ ] Support for text input and short answer fields
- [ ] Multiple AI model options (Gemini Pro, Claude, etc.)
- [ ] Batch processing for multiple forms
- [ ] Enhanced answer confidence scoring
- [ ] Custom answer preferences and learning

---

## Contributing

Feel free to submit issues, feature requests, or pull requests to help improve FormSage!

---

## License

This project is open source and available under the MIT License.
