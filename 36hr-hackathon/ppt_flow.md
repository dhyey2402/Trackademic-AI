# Pitch Deck Flow: Smart Classroom MVP

Here is a 10-slide structure designed to impress the judges by highlighting that this is a **production-ready architecture**, not just a simple prototype.

---

### Slide 1: Title Slide
*   **Title:** Smart Classroom ERP - AI-Powered Monitoring & Management
*   **Subtitle:** Revolutionizing Attendance and Curriculum Generation
*   **Visual:** Clean graphic of an AI camera focusing on a modern classroom.
*   **Footer:** Team Name & Member Names.

### Slide 2: The Problem
*   **Headline:** The Inefficiency of Traditional Classrooms
*   **Points:**
    *   Manual attendance consumes ~10% of total lecture time.
    *   High rates of proxy attendance and manual errors.
    *   Inability to track actual presence (e.g., leaving class mid-way).
    *   Curriculum design is static and slow to adapt to industry needs.

### Slide 3: Our Solution
*   **Headline:** A Unified Smart Ecosystem
*   **Concept:** A seamless pipeline that automates tracking and academic planning.
*   **Key Pillars:**
    1.  **Continuous Tracking:** Computer Vision for real-time presence validation.
    2.  **Intelligent States:** Logic engine that understands "Late", "Temporary Absence", and "Left Early".
    3.  **Agentic Curriculum:** AI to generate dynamically updated, industry-relevant syllabi (Built by team).

### Slide 4: System Architecture (The Engine)
*   **Headline:** Built for Production & Scale
*   **Visual Diagram (Flowchart):**
    *   `Video Feed` ➡️ `CV Engine (Face Embdeddings)` ➡️ `Stateful Tracker (Logic Auth)` ➡️ `PostgreSQL DB` ➡️ `Real-Time Dashboard (WebSockets)`.
*   **Talking Point:** Highlight that computation is decoupled from the database and UI, ensuring low latency.

### Slide 5: Core Feature 1 - Computer Vision Pipeline
*   **Headline:** High-Accuracy Face Embeddings
*   **Points:**
    *   **Not just detection:** We extract mathematical facial embeddings for ultra-fast matching.
    *   **Concurrency:** Capable of tracking multiple students per frame.
    *   **Privacy-First:** We discard raw images and only store numeric feature vectors in PostgreSQL.

### Slide 6: Core Feature 2 - Intelligent Stateful Tracking
*   **Headline:** Beyond Binary "Present/Absent"
*   **Points:**
    *   The system tracks both `entry_time` and `last_seen_time`.
    *   **The 15-Minute Rule:** If a student leaves for < 15 mins = *TEMPORARY ABSENCE*. 
    *   If a student leaves for > 15-20 mins = *ABSENT / LEFT EARLY*.
    *   Prevents students getting full attendance just by showing their face at the start of class.

### Slide 7: Core Feature 3 - AI Agentic Curriculum
*   **Headline:** Automated Academic Planning
*   **Points:** (Briefly touch on this as the other members are building it)
    *   LLM-driven workflow to generate 4-year B.Tech modules based on industry trends.
    *   Structured JSON outputs dynamically fed into the ERP database.

### Slide 8: The Tech Stack
*   **Headline:** Modern & Scalable Technologies
*   **Frontend:** React / Next.js (TailwindCSS for premium UI)
*   **Backend:** FastAPI (Python) - *Chosen for high-performance async requests.*
*   **Database:** PostgreSQL - *Chosen for robust relational logging and capability to handle embedding vectors.*
*   **AI/ML:** OpenCV, `face_recognition` (dlib), LangChain / LLM APIs.

### Slide 9: The Dashboard (UI Preview)
*   **Headline:** Command Center for Educators
*   **Points / Mockup:**
    *   Include a mockup or bullet points of the UI: Live Video overlay, Real-Time Student List, Live Alert Feed ("John Doe just left the premise").

### Slide 10: Why This Wins (Impact & Scalability)
*   **Headline:** Ready for the Real World
*   **Points:**
    *   **High Scalability:** API and DB structure allows scaling to 100+ classrooms easily.
    *   **Cost-Efficient:** Runs optimally on local edge devices.
    *   **Fail-Safe:** System won't crash on missed frames; tracker retains state gracefully.

### Slide 11: Q&A & Thank You
*   **Headline:** Questions?
*   **Footer:** Code repo link or contact info.
