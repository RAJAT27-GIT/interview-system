# AI-POWERED MULTI-ROUND INTERVIEW SYSTEM
## FULL PROJECT DOCUMENTATION (TECHNICAL THEORY & WORKING)

---

### **1. FRONT PAGE**

**Project Title:** AI-Powered Multi-Round Interview System  
**Frameworks Used:** MERN Stack (React, Node, Express, MongoDB) + Python (FastAPI)  
**AI Integration:** Groq (Llama 3 & Whisper), Google gTTS  
**Developed By:** [Your Name]  
**Roll No:** [Your Roll No]  
**Session:** 2025-2026  
**Department:** Computer Science & Engineering  

---

### **2. CERTIFICATE**

**TO WHOMSOEVER IT MAY CONCERN**

This is to certify that the project titled **"AI-Powered Multi-Round Interview System"** is a bonafide work carried out by **[Your Name]** in partial fulfillment of the requirements for the degree of Bachelor of Technology (B.Tech) in Computer Science.

The project incorporates modern full-stack development practices, AI-driven automation, and real-time proctoring systems. It has been successfully tested and implemented.

**Date:** 05 May 2026  
**Place:** [Your City/Institute]  

---

### **3. ACKNOWLEDGEMENT**

First and foremost, I would like to express my sincere gratitude to my teachers and mentors for their invaluable guidance and support throughout the development of this complex project. Their insights were crucial in understanding AI models and complex backend architectures.

The journey of building this project was intellectually challenging, particularly the integration of Llama 3 and Whisper AI models and the development of a real-time code evaluation system. I am also deeply thankful to my friends and family for their constant motivation and moral support.

Special thanks to the Open Source community, whose tools and libraries—including FastAPI, Groq, and React—made it possible to transform this concept into a functional reality.

---

### **4. INTRODUCTION**

The traditional recruitment process is increasingly becoming slow and inefficient in the modern era. Companies receive thousands of resumes daily, making it physically impossible for human recruiters to conduct comprehensive interviews for every applicant. Furthermore, manual interviews are often susceptible to unconscious biases and human error.

The primary objective of this system is to develop an 'Autonomous AI Interviewer' capable of analyzing resumes and challenging candidates based on their specific skill sets. By leveraging modern Artificial Intelligence techniques, the system does not merely ask questions but performs a deep analysis of candidate responses to provide accurate assessments.

**Main Objectives:**
1. **Efficiency:** Reducing hiring time by up to 70%.
2. **Scalability:** Conducting thousands of interviews simultaneously.
3. **Accuracy:** Precise skill matching and automated code evaluation.

---

### **5. LITERATURE REVIEW**

Legacy Applicant Tracking Systems (ATS) primarily rely on 'Keyword Matching' algorithms. If a resume contains the word 'Python', it is flagged as relevant, regardless of whether the candidate possesses fundamental logical skills.

In contrast, our system is built on the principle of 'Semantic Understanding'. By utilizing the Llama 3.3 model, the system understands context rather than just searching for keywords. For instance, if a candidate mentions 'Machine Learning', the AI does not simply request a definition but conducts a deep-dive into the candidate's specific projects and implementations.

---

### **6. TECHNOLOGY STACK**

#### **Frontend (User Interface):**
- **React.js (Vite):** Used for building a fast and interactive user interface.
- **Tailwind CSS:** Employed for modern and premium styling.
- **Lucide React:** Integrated for high-quality iconography.
- **Framer Motion:** Used for smooth animations and transitions.
- **Context API:** Managed global state (Authentication, Interview state).

#### **Backend (Logic & Processing):**
- **FastAPI (Python):** A high-performance backend handling AI logic and resume parsing.
- **MongoDB:** A NoSQL database storing logs, questions, and user data.
- **Groq API:** Utilized for high-speed Llama 3.3 model inference.
- **Whisper API:** Implemented for highly accurate Speech-to-Text transcription.
- **gTTS:** Used for Text-to-Speech synthesis.

---

### **7. SYSTEM ARCHITECTURE & WORKING**

1. **Resume Upload:** The candidate uploads a resume in PDF format.
2. **Parsing:** The Backend Resume Parser extracts skills and contact information using NLP.
3. **AI Generation:** The Interview Engine sends extracted skills and difficulty level to the AI to generate rounds.
4. **Interview Session:** The Frontend monitors the session, including time limits and proctoring events.
5. **Evaluation:** Coding and voice responses are evaluated by the backend in real-time using similarity scoring and test cases.
6. **Reporting:** Final results are stored in the database, and comprehensive feedback is provided to the candidate.

---

### **8. CORE MODULES DESCRIPTION**

#### **8.1 Resume Parser**
This module utilizes the 'pdfplumber' library for text extraction and the 'SpaCy' NLP model to identify entities such as names and technical skills. An internal 'ATS Scoring' algorithm evaluates the resume's quality.

#### **8.2 Voice Integration (STT & TTS)**
To provide a realistic interview experience, the system incorporates STT and TTS. gTTS is used for AI speech, while the Groq Whisper API handles candidate voice transcription with high precision.

#### **8.3 Code Evaluator**
The system features an integrated compiler environment supporting Python and JavaScript. The backend executes code in a secure sandbox, validating outputs against predefined test cases.

#### **8.4 Proctoring System**
To ensure fairness, a Tab-switching detection mechanism is implemented. The system monitors browser focus events and triggers warnings if a candidate attempts to navigate away from the interview window.

---

### **9. API ENDPOINTS & RESPONSE LOGIC**

- **POST `/parse_resume`:** Analyzes PDF resumes and returns extracted skills and ATS scores.
- **POST `/start_interview`:** Generates a complete interview session structure based on the candidate profile.
- **POST `/evaluate_code`:** Executes user code and returns validation results against test cases.
- **POST `/feedback`:** Provides AI-generated personalized advice based on the final performance score.

---

### **10. FUTURE SCOPE & CONCLUSION**

**Conclusion:** This project demonstrates the potential of AI in transforming recruitment. By automating screening and assessments, it ensures efficiency, fairness, and scalability.

**Future Scope:**
- Integration of Eye-tracking proctoring via webcam.
- Emotional and confidence analysis using computer vision.
- Support for multiple natural languages (Multi-lingual AI).
- Automated shortlisting notifications for recruiters.

---
**THE END**
