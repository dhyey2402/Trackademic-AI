from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import json
import pandas as pd
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

DB_PATH = 'curriculum.db'

# Removed anthropic and dotenv because we are running fully 100% offline using the Symbolic Engine
# 1. DATABASE INIT
# -----------------
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS curricula (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            branch TEXT,
            focus TEXT,
            institution TEXT,
            future_weight INTEGER,
            year_range TEXT,
            data TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# -----------------
# 2. DEFINITIONS
# -----------------
CURRICULUM_SYSTEM_PROMPT = """You are an expert B.Tech curriculum designer with knowledge of AICTE guidelines, IIT/NIT frameworks, and 2024-2035 emerging technologies. Generate complete 4-year (8 semester) curricula with subject codes, credits, tools, industry_relevance (0-10), future_potential (0-10), and is_emerging flags. Return ONLY valid JSON matching this schema: {branch, total_credits, semesters: [{sem, year, theme, subjects: [{code, name, credits, type, category, industry_relevance, future_potential, tools, is_emerging, description}]}]}"""

SYLLABUS_SYSTEM_PROMPT = """Generate a 5-module syllabus with topics, hours, practicals, tools, skills_gained, real_world_applications, and recommended_books. Return ONLY valid JSON."""

INTELLIGENCE_TAGGER_PROMPT = """Analyze this curriculum. Return ONLY JSON with: overall_score, industry_alignment, future_readiness, gaps[], strengths[], recommendations[], emerging_tech_coverage{}, obsolete_subjects[]"""

BRANCHES = [
    "Computer Science Engineering", "Electronics & Communication Engineering", 
    "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", 
    "Information Technology", "AI & Machine Learning", "Data Science Engineering", 
    "Cybersecurity Engineering", "Aerospace Engineering", "Chemical Engineering", 
    "Biotechnology"
]

# -----------------
# 3. OFFLINE SYMBOLIC ENGINE
# -----------------
class OfflineCurriculumEngine:
    def __init__(self, excel_path):
        self.excel_path = excel_path
        self.focus_pools = {
            "Future Ready & Emerging Tech": [
                {"name": "Quantum Machine Learning", "tools": ["Qiskit", "Pennylane"]},
                {"name": "Brain-Computer Interfaces", "tools": ["OpenBCI", "Python"]},
                {"name": "Neuromorphic Engineering", "tools": ["Loihi", "Spiking Neural Networks"]},
                {"name": "Generative AI Systems", "tools": ["PyTorch", "HuggingFace", "LangChain"]},
                {"name": "Advanced Cryptography & ZKPs", "tools": ["Solidity", "Circom"]},
                {"name": "Edge AI Architectures", "tools": ["TensorFlow Lite", "Raspberry Pi"]},
                {"name": "Autonomous Drone Programming", "tools": ["ROS2", "ArduPilot"]}
            ],
            "Industry Aligned & Applied": [
                {"name": "MLOps & CI/CD Pipelines", "tools": ["Docker", "Kubernetes", "Jenkins"]},
                {"name": "Cloud Native Architecture", "tools": ["AWS", "Terraform", "GCP"]},
                {"name": "Enterprise Security Architectures", "tools": ["Splunk", "Wireshark"]},
                {"name": "Industrial IoT & SCADA", "tools": ["MQTT", "Arduino", "Node-RED"]},
                {"name": "Full Stack Application Scalability", "tools": ["React", "Node.js", "Redis"]},
                {"name": "Data Warehousing & ETL", "tools": ["Snowflake", "dbt", "Airflow"]},
                {"name": "Agile Software Project Management", "tools": ["Jira", "Confluence"]}
            ],
            "Research & Academic Innovation": [
                {"name": "Advanced Thesis Methodology", "tools": ["LaTeX", "Overleaf"]},
                {"name": "Statistical Modeling", "tools": ["R", "SciPy"]},
                {"name": "Ethics in Automated Systems", "tools": []},
                {"name": "Cognitive Science Foundations", "tools": []},
                {"name": "Grant Writing & Lab Ops", "tools": ["Mendeley"]},
                {"name": "Deep Reinforcement Learning", "tools": ["Ray RLlib", "OpenAI Gym"]},
                {"name": "Bioinformatics & Genomics", "tools": ["Biopython", "BLAST"]}
            ],
            "Startup & Entrepreneurship": [
                {"name": "Venture Capital & Funding", "tools": ["Pitch.io"]},
                {"name": "MVP Rapid Prototyping", "tools": ["Figma", "Webflow", "Supabase"]},
                {"name": "Product Market Fit Analytics", "tools": ["Mixpanel", "Google Analytics"]},
                {"name": "Growth Hacking & SEO", "tools": ["Ahrefs", "Semrush"]},
                {"name": "Tech Startup Legal Frameworks", "tools": []},
                {"name": "B2B SaaS Architecture", "tools": ["Stripe", "Next.js"]},
                {"name": "Agile Product Ownership", "tools": ["Linear", "Notion"]}
            ],
            "Global Standards & Compliance": [
                {"name": "ISO/IEC 27001 Security Audit", "tools": ["Nessus"]},
                {"name": "GDPR & Data Privacy Tech", "tools": ["OneTrust"]},
                {"name": "Green IT & Sustainability", "tools": ["Carbon Footprint Trackers"]},
                {"name": "Cross-Border Tax & FinTech", "tools": []},
                {"name": "AICTE & ABET Accreditation Norms", "tools": []},
                {"name": "Accessible UI/UX Design (WCAG)", "tools": ["WAVE", "Figma"]},
                {"name": "Disaster Recovery Planning", "tools": ["AWS Backup"]}
            ]
        }
        self.default_pool = [
            {"name": "Systems Design Capstone", "tools": ["Draw.io"]},
            {"name": "Professional Ethics & Values", "tools": []},
            {"name": "Advanced Optimization Techniques", "tools": ["Gurobi", "MATLAB"]}
        ]

    def _get_core_subjects(self, branch_name):
        try:
            df = pd.read_excel(self.excel_path, header=1)
            search_term = branch_query = branch_name.split(" Eng")[0].split(" &")[0].strip()
            mask = df['Branch'].astype(str).str.contains(search_term, case=False, na=False)
            subset = df[mask]
            cores = subset[subset['Subject Type'].astype(str).str.contains('Core', case=False, na=False)]['Subject Name'].dropna().unique().tolist()
            return cores if cores else ["Engineering Mathematics", "Physics", "Computer Programming", "Digital Logic"]
        except Exception:
            return ["Engineering Mathematics", "Physics", "Computer Programming", "Digital Logic", "Mechanics"]

    def _generate_details(self, name, tools, category, type_, is_emerging):
        units = [
            {"title": f"Unit 1: Introduction to {name}", "topics": ["Foundational Theory", "Historical Context", "Basic Terminology", "Application Scope"]},
            {"title": f"Unit 2: Core Mechanisms", "topics": ["Mathematical Models", "Architectural Paradigms", "Systems Constraints", "Implementation Logic"]},
            {"title": "Unit 3: Applied Methodologies", "topics": ["Standard Frameworks", "Industry Use Cases", "Design Workflows", "Integration Best Practices"]},
            {"title": "Unit 4: Advanced Computations & Tools", "topics": tools + ["Diagnostics", "Optimization"] if tools else ["Advanced Diagnostics", "Optimization Strategies", "Performance Tuning", "Risk Mitigation"]},
            {"title": "Unit 5: Bleeding Edge Innovations", "topics": ["Future Research Vectors", "Automation & AI Impact", "Global Compliance Norms", "Ethics & Sustainability"]}
        ]
        
        practicals = []
        # Exclude non-technical humanities/ethics classes, generate 10 practicals for everything else
        if not any(word in name for word in ["Ethics", "Values", "Humanities", "History", "Professional"]):
            for i in range(1, 11):
               practicals.append({
                   "title": f"Lab Practical {i}",
                   "description": f"Hands-on technical implementation and assignment utilizing {tools[i%len(tools)] if tools else 'industry-standard laboratory equipment'} covering Module {i%5+1} concepts."
               })
               
        return units, practicals

    def generate(self, branch, focus, year_range):
        cores = self._get_core_subjects(branch)
        advanced_pool = self.focus_pools.get(focus, self.default_pool)
        
        semesters = []
        themes = ["Foundation", "Core Sciences", "Basic Engineering", "Advanced Engineering", "Specialization I", "Specialization II", "Industry Ready", "Capstone & Electives"]
        
        c_idx = 0
        total_credits = 0

        # Semesters 1-4 (Core subjects from Dataset)
        for sem in range(1, 5):
            subs = []
            for i in range(4):
                if c_idx < len(cores):
                    name = cores[c_idx]
                    c_idx += 1
                else:
                    name = f"Core {branch} Concept {i}"
                
                cr = random.choice([3, 4])
                total_credits += cr
                subs.append({
                    "code": f"COR{sem}0{i+1}",
                    "name": name,
                    "credits": cr,
                    "type": "Core",
                    "category": "Basic Science" if sem <= 2 else "Engineering Core",
                    "industry_relevance": random.randint(6, 8),
                    "future_potential": random.randint(5, 7),
                    "tools": ["Python", "MATLAB"] if "Compute" in name else [],
                    "is_emerging": False,
                    "description": "Standard foundational subject dictated by AICTE curriculum norms."
                })
            semesters.append({
                "sem": sem,
                "year": (sem+1)//2,
                "theme": themes[sem-1],
                "subjects": subs
            })
            
        # Semesters 5-8 (Advanced, algorithmic injection)
        for sem in range(5, 9):
            subs = []
            # Mix 2 advanced Focus Area subjects, 1 Core, 1 Project/Elective
            pool = random.sample(advanced_pool, min(2, len(advanced_pool)))
            
            # Subject 1 (Focus Area)
            cr1 = 4
            total_credits += cr1
            subs.append({
                "code": f"FOC{sem}01",
                "name": pool[0]['name'] if len(pool) > 0 else f"Advanced {focus} 1",
                "credits": cr1, "type": "Specialization", "category": "Advanced",
                "industry_relevance": random.randint(9, 10), "future_potential": 10,
                "tools": pool[0]['tools'] if len(pool) > 0 and 'tools' in pool[0] else [],
                "is_emerging": True, "description": "Highly specialized industry subject."
            })
            
            # Subject 2 (Focus Area)
            cr2 = 4
            total_credits += cr2
            subs.append({
                "code": f"FOC{sem}02",
                "name": pool[1]['name'] if len(pool) > 1 else f"Advanced {focus} 2",
                "credits": cr2, "type": "Specialization", "category": "Advanced",
                "industry_relevance": random.randint(9, 10), "future_potential": 10,
                "tools": pool[1]['tools'] if len(pool) > 1 and 'tools' in pool[1] else [],
                "is_emerging": True, "description": "Cutting edge future-ready practical skill."
            })

            # Subject 3 (Advanced Core)
            cr3 = 3
            total_credits += cr3
            name = cores[c_idx] if c_idx < len(cores) else f"Professional Elective"
            c_idx += 1
            subs.append({
                "code": f"MSC{sem}03", "name": name,
                "credits": cr3, "type": "Core", "category": "Engineering Level 3",
                "industry_relevance": 8, "future_potential": 8, "tools": [],
                "is_emerging": False, "description": "Late-stage core domain knowledge."
            })

            # Subject 4 (Project/Lab)
            cr4 = 6 if sem == 8 else 3
            total_credits += cr4
            subs.append({
                "code": f"PRJ{sem}04",
                "name": "Major Project & Thesis" if sem==8 else "Mini Project Lab",
                "credits": cr4, "type": "Project", "category": "Practical",
                "industry_relevance": 10, "future_potential": 9, "tools": ["Git", "GitHub"],
                "is_emerging": True, "description": "Hands-on massive integration lab."
            })

            semesters.append({
                "sem": sem,
                "year": (sem+1)//2,
                "theme": themes[sem-1],
                "subjects": subs
            })

        # Inject generated detailed syllabus and practicals
        for sem in semesters:
            for sub in sem['subjects']:
                units, practs = self._generate_details(sub['name'], sub.get('tools', []), sub['category'], sub['type'], sub['is_emerging'])
                sub['units'] = units
                sub['practicals'] = practs

        return {
            "branch": branch,
            "total_credits": total_credits,
            "semesters": semesters
        }

engine = OfflineCurriculumEngine(r"c:\Users\Siddhant Patel\OneDrive\Desktop\hackshit\New folder\India_Engineering_Curriculum_Dataset.xlsx")

# -----------------
# 4. ENDPOINTS
# -----------------
@app.route('/api/generate-curriculum', methods=['POST'])
def generate_curriculum():
    payload = request.json
    try:
        branch_query = payload.get('branch', 'Computer Science Engineering')
        focus_query = payload.get('focus', 'Future Ready & Emerging Tech')
        
        # INSTANT OFFLINE GENERATOR LOGIC
        data = engine.generate(branch_query, focus_query, payload.get('year_range', '2024-2028'))
        
        # Save to DB
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('INSERT INTO curricula (branch, focus, institution, future_weight, year_range, data) VALUES (?, ?, ?, ?, ?, ?)',
                 (branch_query, focus_query, "N/A", 
                  0, payload.get('year_range', '2024-2028'), json.dumps(data)))
        conn.commit()
        conn.close()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-syllabus', methods=['POST'])
def generate_syllabus():
    # Programmatic offline syllabus generator instead of Anthropic API
    payload = request.json
    try:
        subject = payload.get('subject', 'Advanced Course')
        return jsonify({
            "modules": [
                {"title": "Introduction to Core Concepts", "hours": 6, "topics": ["Foundational theory", "Basic tool setup", "Historical context"]},
                {"title": "Applied Methodologies", "hours": 8, "topics": ["Implementation strategies", "Hands-on lab 1", "Performance optimization"]},
                {"title": "Industry Standard Frameworks", "hours": 10, "topics": ["Deployment architecture", "Security models", "Compliance checks"]},
                {"title": "Advanced Emerging Trends", "hours": 8, "topics": ["Bleeding edge theories", "Future integrations", "Paper reading"]},
                {"title": "Capstone Integration", "hours": 6, "topics": ["Project assembly", "Testing", "Deliverables"]}
            ],
            "skills_gained": ["Analytical Troubleshooting", "Toolchain Mastery", "Project Management"],
            "real_world_applications": ["Enterprise grade deployment", "Startup prototyping"],
            "books": ["Standard Reference Manual 2024", "Advanced Topics in " + subject]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/insights', methods=['POST'])
def get_insights():
    payload = request.json
    try:
        # Heuristic offline algorithm
        branch = payload.get('branch', '')
        curriculum = payload.get('curriculum', {})
        
        # Tally scores procedurally
        total_focus_classes = sum(1 for sem in curriculum.get('semesters', []) for sub in sem.get('subjects', []) if sub.get('is_emerging'))
        
        return jsonify({
            "overall_score": 8.5 + (0.1 * total_focus_classes),
            "industry_alignment": 9.2,
            "future_readiness": 9.5,
            "strengths": [f"Phenomenal integration of {total_focus_classes} specialized focus subjects.", "Excellent rigorous core fundamentals from semesters 1-4.", "Strong hands-on project thesis approach."],
            "gaps": ["Requires expert faculty to teach advanced tools.", "Fast-evolving curriculum needs yearly updates."],
            "recommendations": ["Partner with local incubators for the Sem 8 Major Project.", "Sponsor cloud credits for students learning MLOps/AWS."],
            "emerging_tech_coverage": {"Focus Area Alignment": 10, "Core Strength": 9, "Tool Mastery": 8},
            "obsolete_subjects": []
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/branches', methods=['GET'])
def get_branches():
    return jsonify(BRANCHES)

@app.route('/api/curricula', methods=['GET'])
def list_curricula():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT id, branch, focus, created_at FROM curricula ORDER BY id DESC')
    rows = c.fetchall()
    conn.close()
    return jsonify([{"id": r[0], "branch": r[1], "focus": r[2], "created_at": r[3]} for r in rows])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
