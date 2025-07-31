from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os

# Flask App
app = Flask(__name__)
CORS(app, resources={r"/solve_all": {"origins": "*"}})

@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization,X-API-Key")
    response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
    return response

@app.route("/solve_all", methods=["POST", "OPTIONS"])
def solve_all():
    if request.method == "OPTIONS":
        return '', 204

    data = request.get_json()
    quiz = data.get("quiz", [])

    if not quiz:
        return jsonify({"error": "No quiz data received"}), 400

    # ✅ Get API key from custom header
    api_key = request.headers.get("X-API-Key")
    if not api_key:
        return jsonify({"error": "Missing Gemini API key"}), 401

    # ✅ Create Gemini client using the API key
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        return jsonify({"error": f"Invalid API key or client error: {str(e)}"}), 401

    # Build prompt
    prompt = "You're solving a multiple choice quiz. For each question, choose the best answer.\n\n"
    for i, item in enumerate(quiz, start=1):
        question = item.get("question", "")
        options = item.get("options", [])
        if question and options:
            prompt += f"Q{i}: {question}\nOptions:\n"
            prompt += "\n".join(f"{chr(65 + j)}. {opt}" for j, opt in enumerate(options)) + "\n\n"

    prompt += "Respond with just the correct answer text for each question, in order, like this:\nQ1: <answer text>\nQ2: <answer text>\n..."

    print("🧠 Sending batch prompt to Gemini...\n")
    print(prompt)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        answer_text = response.text.strip()
        print("📥 Gemini response:\n", answer_text)

        answers = []
        for line in answer_text.splitlines():
            if ":" in line:
                _, answer = line.split(":", 1)
                answers.append(answer.strip())

        return jsonify({"answers": answers})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
