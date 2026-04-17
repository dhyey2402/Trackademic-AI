# 🚀 Trackademic AI

> An intelligent classroom system that not only tracks attendance but verifies **continuous student presence** and structures academic learning.

---

## 🧠 Overview

**Trackademic AI** is a next-generation smart classroom system that combines:

* 🎯 Face Recognition-based Attendance
* ⏱️ Continuous Presence Verification (15-min rule)
* 📚 Structured Curriculum Generator
* 🤖 AI-ready modular architecture

Unlike traditional attendance systems that only record entry, Trackademic AI ensures that **students are actually present throughout the session**.

---

## ✨ Key Features

### 🎥 Smart Attendance System

* Face recognition-based student identification
* Real-time attendance marking using computer vision
* High accuracy using deep learning models
* Eliminates proxy attendance

---

### ⏱️ Continuous Presence Verification (Core Feature 🚀)

* **Automated State Tracking**: Tracks each student using real-time `last_seen` timestamps
* **15-Minute Absence Rule**:

  * If a student is not detected for **15 consecutive minutes**, they are automatically marked **Absent**
* **Re-entry Handling**:

  * If a student reappears before the 15-minute threshold, their status remains **Present**
* Ensures attendance reflects **actual classroom presence**, not just entry

> 💡 This transforms the system from basic attendance tracking into a **behavior-aware intelligent monitoring system**

---

### 📚 Curriculum Generator (Structured Engine)

* Generates B.Tech curriculum (year-wise & semester-wise)
* Branch-specific subject mapping
* Includes trending and emerging technologies
* Inspired by real academic curriculum formats

> ⚠️ Note: The current curriculum generator is **rule-based** (not LLM-powered yet)

---

### 🧩 Modular Architecture

* Clean separation of:

  * Computer Vision module
  * Attendance logic engine
  * Curriculum generator
* Easily extensible to integrate LLMs or advanced AI

---

## 🏗️ Tech Stack

### 👨‍💻 Backend

* Python
* FastAPI (if applicable)

### 🧠 AI / ML

* Face Recognition using Deep Learning
* Computer Vision with OpenCV
* DeepFace library

### 📦 Data Handling

* JSON-based structured datasets

---

## 📂 Project Structure

```bash
Trackademic-AI/
│
├── Attendance-system/
│   └── backend/
│       ├── cv_engine.py          # Face detection & recognition
│       ├── recognition.py       # Face matching logic
│       ├── state_engine.py      # Attendance + 15-min rule logic
│       ├── database.py          # Data handling
│       └── main.py              # Entry point
│
├── Curriculum-generator/
│   └── btech-curriculum/
│       ├── curriculum.js        # Core curriculum logic
│       ├── data.js              # Subject dataset
│       └── BTech Booklet/       # Reference format
│
└── requirements.txt
```

---

## ⚙️ How It Works

### 🎯 Attendance Flow

1. Capture student face via camera
2. Detect & encode face using DeepFace
3. Match with stored database
4. Mark attendance (Present)
5. Continuously update `last_seen` timestamps

---

### ⏱️ Presence Tracking Logic

* System continuously monitors each student
* Updates `last_seen` whenever a face is detected
* If:

  ```python
  current_time - last_seen >= 15 minutes
  ```

  → student is marked **Absent**

---

### 📚 Curriculum Generation Flow

1. Select branch / specialization
2. Load predefined dataset
3. Apply structuring logic
4. Generate:

   * Year-wise breakdown
   * Semester-wise subjects
   * Trending technologies

---

## 🚀 Future Enhancements

* 🤖 LLM-powered dynamic curriculum generation
* 📊 Personalized learning paths
* 🧠 Student engagement analytics
* 💬 AI chatbot for academic queries
* 📅 Smart timetable with AI-based substitution

---

## 🔥 Vision

> “Not just tracking attendance — but ensuring real presence and meaningful learning.”

Trackademic AI aims to evolve into a **complete AI-driven academic intelligence system**.

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/Trackademic-AI.git
cd Trackademic-AI
```

### 2️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Run the system

```bash
python main.py
```

---

## 🤝 Contribution

Contributions are welcome!

* Fork the repository
* Create a feature branch
* Submit a pull request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed by **Dhyey Patel**
💡 Passionate about AI, intelligent systems, and impactful innovation

---

## ⭐ Support

If you found this project useful:

* ⭐ Star the repository
* 🍴 Fork it
* 📢 Share it

---
