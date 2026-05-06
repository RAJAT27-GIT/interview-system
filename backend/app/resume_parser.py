import re
import io
import pdfplumber
import spacy
from typing import Dict, List, Set
import pytesseract
import os

# Load SpaCy model for Entity Recognition
try:
    nlp = spacy.load("en_core_web_sm")
except Exception:
    # If not installed, this might fail in some environments without internet
    # But usually it's pre-installed in these workflows
    nlp = None

EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
PHONE_RE = re.compile(r"\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}")

# Define key sections to look for
SECTION_KEYWORDS = {
    "Experience": ["experience", "employment", "work history", "professional background"],
    "Education": ["education", "academic", "degree", "university", "college"],
    "Skills": ["skills", "technical skills", "technologies", "proficiencies"],
    "Projects": ["projects", "personal projects", "academic projects"],
    "Summary": ["summary", "objective", "profile", "about me"]
}

# Load skills list from local data folder
SKILLS_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "skills.txt")
try:
    with open(SKILLS_FILE, "r", encoding="utf-8") as f:
        # Lowercase and strip for matching
        SKILLS_DB = [line.strip().lower() for line in f if line.strip()]
except Exception:
    SKILLS_DB = []


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """Extracts text from PDF bytes, with OCR fallback."""
    text = []
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                text.append(page_text)
        full_text = "\n".join(text)
        if len(full_text.strip()) > 50:
            return full_text
    except Exception:
        pass

    # OCR Fallback using pytesseract if text extraction yields little/no results
    try:
        from PIL import Image
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            ocr_text = []
            for page in pdf.pages:
                img = page.to_image(resolution=300).original
                ocr_text.append(pytesseract.image_to_string(img))
            return "\n".join(ocr_text)
    except Exception:
        return ""


def extract_contact_info(text: str) -> Dict:
    """Extracts name, email, and phone from text."""
    emails = list(set(EMAIL_RE.findall(text)))
    phones = list(set(PHONE_RE.findall(text)))
    
    name = ""
    if nlp:
        doc = nlp(text[:1500]) # Scan beginning for name
        persons = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
        if persons:
            name = persons[0]
            
    if not name:
        # Fallback: grab first non-empty line
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        if lines:
            name = lines[0]
            
    return {"name": name, "emails": emails, "phones": phones}


def identify_sections(text: str) -> Dict[str, bool]:
    """Checks for presence of standard resume sections."""
    text_lower = text.lower()
    found_sections = {}
    for section, keywords in SECTION_KEYWORDS.items():
        found = False
        for kw in keywords:
            if kw in text_lower:
                found = True
                break
        found_sections[section] = found
    return found_sections


def extract_skills_robust(text: str) -> List[str]:
    """Matches text against skills database using precise boundary matching."""
    text_lower = " " + re.sub(r"[^a-z0-9#+.]", " ", text.lower()) + " "
    found_skills = []
    for skill in SKILLS_DB:
        skill_lower = skill.lower()
        # Ensure we match whole words to avoid 'C' matching 'React'
        pattern = r"\b" + re.escape(skill_lower) + r"\b"
        if re.search(pattern, text_lower):
            found_skills.append(skill)
    return list(dict.fromkeys(found_skills))


def calculate_ats_score(data: Dict) -> Dict:
    """Calculates ATS score and generates feedback."""
    score = 0
    recommendations = []
    
    # 1. Contact Info (20 pts)
    if data["name"]: score += 5
    else: recommendations.append("Add your full name clearly at the top.")
    
    if data["emails"]: score += 10
    else: recommendations.append("Missing contact email address.")
    
    if data["phones"]: score += 5
    else: recommendations.append("Add a professional phone number.")
    
    # 2. Sections (40 pts)
    sections = data["sections"]
    for section, found in sections.items():
        if found:
            score += 8 # 5 sections * 8 = 40
        else:
            recommendations.append(f"Add a dedicated '{section}' section to help recruiters scan your profile.")
            
    # 3. Skills (30 pts)
    skill_count = len(data["skills"])
    if skill_count >= 15:
        score += 30
    elif skill_count >= 8:
        score += 20
        recommendations.append("Good start! Add 5-7 more technical skills to higher your ATS ranking.")
    elif skill_count >= 1:
        score += 10
        recommendations.append("List more technical tools and frameworks you have worked with.")
    else:
        recommendations.append("Critical: No recognized skills found. List tools like Python, React, SQL, etc.")
        
    # 4. Length/Depth (10 pts)
    word_count = len(re.findall(r"\w+", data["raw_text"]))
    if word_count > 600:
        score += 10
    elif word_count > 300:
        score += 5
    else:
        recommendations.append("Your resume seems short. Elaborate on your projects or experience details.")
        
    return {
        "score": min(score, 100),
        "recommendations": recommendations[:5] # Top 5 tips
    }


def parse_resume(pdf_bytes: bytes) -> Dict:
    """Main entry point for parsing and analyzing a resume."""
    text = extract_text_from_pdf_bytes(pdf_bytes)
    contact = extract_contact_info(text)
    sections = identify_sections(text)
    skills = extract_skills_robust(text)
    
    analysis_data = {
        "name": contact["name"],
        "emails": contact["emails"],
        "phones": contact["phones"],
        "sections": sections,
        "skills": skills,
        "raw_text": text
    }
    
    scoring = calculate_ats_score(analysis_data)
    
    return {
        "name": analysis_data["name"],
        "emails": analysis_data["emails"],
        "phones": analysis_data["phones"],
        "skills": analysis_data["skills"],
        "sections": analysis_data["sections"],
        "ats_score": scoring["score"],
        "recommendations": scoring["recommendations"],
        "raw_text_snippet": text[:1000]
    }
