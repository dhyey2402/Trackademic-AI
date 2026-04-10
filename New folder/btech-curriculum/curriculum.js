class CurriculumArchitect {
  constructor(branch, focusArea) {
    this.branch = branch;
    this.focusArea = focusArea;
    this.program = {
      program: branch,
      focus: focusArea,
      years: []
    };
    
    // Define trending market subjects
    this.trendingPool = [
      "Generative AI & LLM Orchestration",
      "Prompt Engineering & AI Agents",
      "Cyber-Resilience & Threat Hunting",
      "Sustainable Computing & ESG",
      "Low-Code/No-Code Platform Engineering",
      "Explainable AI (XAI) & Ethics"
    ];
  }

  generate() {
    // Determine the mapped branch string for the dataset
    const branchMapping = {
      "Computer Science Engineering": "Computer Science Engg",
      "Information Technology": "Computer Science Engg",
      "Electronics & Communication Engineering": "Electronics & Comm Engg",
      "Electrical Engineering": "Electrical Engineering",
      "Mechanical Engineering": "Mechanical Engineering",
      "Civil Engineering": "Civil Engineering",
      "Artificial Intelligence & Machine Learning": "Computer Science Engg",
      "Data Science Engineering": "Computer Science Engg",
      "Cybersecurity Engineering": "Computer Science Engg",
      "Robotics & Automation": "Mechanical Engineering"
    };
    this.datasetBranch = branchMapping[this.branch] || "Computer Science Engg";
    
    // Dataset Specialization Fallback (Use 'Core' if none exists or if using a mapped computing branch)
    if (MASTER_DATASET[this.datasetBranch] && MASTER_DATASET[this.datasetBranch][this.focusArea]) {
         this.datasetSpec = this.focusArea;
    } else {
         this.datasetSpec = "Core";
    }

    // Generate years 1 to 4 dynamically
    for (let year = 1; year <= 4; year++) {
      const sem1Str = `Sem ${year * 2 - 1}`;
      const sem2Str = `Sem ${year * 2}`;
      
      this.program.years.push({
        year: year,
        semesters: [
          this.createSemester(year * 2 - 1, sem1Str),
          this.createSemester(year * 2, sem2Str)
        ]
      });
    }

    return this.program;
  }

  createSemester(semNum, theme) {
    const subjects = [];
    let count = 6;
    // Fetch subjects from dataset
    const datasetSubjects = this.getBranchMappings(semNum);
    
    if (datasetSubjects && datasetSubjects.length > 0) {
        count = Math.min(datasetSubjects.length, 8); // Display up to 8 real subjects from dataset
    }

    for (let i = 1; i <= count; i++) {
        let name = "Elective " + i;
        if (datasetSubjects && datasetSubjects.length >= i) {
            name = datasetSubjects[i - 1].name;
            if (datasetSubjects[i - 1].emerging) {
               name += " (Emerging Trend)";
            }
        }
        subjects.push(this.generateSubject(semNum, i, name));
    }

    return {
      semester: semNum,
      subjects: subjects
    };
  }

  generateSubject(sem, index, dsName) {
    let name = dsName;
    
    // Fallback if dataset returns generic "Elective X"
    if (name.startsWith("Elective ")) {
      // Inject Specialization
      if (sem >= 6) {
        name = `${this.focusArea} - Level ${index}`;
      }
      
      // Adapt to Market Trends for the final elective in Sem 8
      if (sem === 8 && index === 6) {
        const trendIndex = (sem + index) % this.trendingPool.length;
        name = this.trendingPool[trendIndex];
      }
    }

    return {
      name: name || "Elective",
      description: `In-depth exploration of ${name} aligned with the latest ${this.branch} industry standards and ${this.focusArea} focus.`,
      purpose: `To build foundational and advanced competencies in ${name} for real-world deployment.`,
      skills_gained: [
        "Theoretical Depth",
        `${(name || "Subject").split(' ')[0]} Proficiency`,
        "Professional Ethics"
      ],
      real_world_applications: [
        `Core application of ${name} principles`,
        `Advanced implementations of ${name}`
      ],
      modules: this.generateModules(name || "Subject")
    };
  }

  getBranchMappings(semNum) {
      if (typeof MASTER_DATASET === 'undefined') return null;
      
      const semKey = `Sem ${semNum}`;
      if (MASTER_DATASET[this.datasetBranch] && MASTER_DATASET[this.datasetBranch][this.datasetSpec]) {
          return MASTER_DATASET[this.datasetBranch][this.datasetSpec][semKey] || null;
      }
      
      return null;
  }

  generateModules(subjectName) {
    const modules = [];
    for (let m = 1; m <= 5; m++) { // Each subject should have 5 modules (Units)
      modules.push({
        module_name: `Unit ${m}: ${this.getModuleTheme(m)}`,
        description: `This unit covers the ${this.getModuleTheme(m).toLowerCase()} aspects of ${subjectName}, focusing on both theory and application.`,
        topics: [
          `Fundamental principles of ${subjectName} unit ${m}`,
          `Advanced logic in ${subjectName}`,
          `Industry case studies and modern frameworks`,
          `Practical implementation strategies`
        ],
        practicals: [
          `Lab experiment for ${subjectName}`,
          `Project prototype development`
        ],
        tools: this.getToolsForSubject(subjectName)
      });
    }
    return modules;
  }

  getModuleTheme(m) {
    const themes = ["Foundations & Intro", "Structural Components", "Advanced Techniques", "Integration & Optimization", "Deployment & Future Scope"];
    return themes[m - 1];
  }

  getToolsForSubject(name) {
    const toolsMap = {
      "Data Structures": ["C++", "Python", "Visualizer"],
      "Database": ["MySQL", "PostgreSQL", "NoSQL (MongoDB)"],
      "Operating Systems": ["Linux", "C", "Shell"],
      "AI": ["Python", "TensorFlow", "PyTorch"],
      "Cloud": ["AWS", "Terraform", "Docker"],
      "Generative AI": ["LangChain", "OpenAI API", "HuggingFace"],
      "Web": ["React", "Node.js", "MongoDB"],
      "Mobile": ["Flutter", "Kotlin", "Swift"],
      "CAD": ["AutoCAD", "SolidWorks", "Fusion 360"],
      "Thermodynamics": ["MATLAB", "ANSYS Fluent"],
      "Circuits": ["PSpice", "Multisim", "TINA"],
      "Structural": ["STAAD Pro", "ETABS", "AutoCAD Civil 3D"]
    };

    for (const [key, tools] of Object.entries(toolsMap)) {
      if (name.includes(key) || key.includes(name)) return tools;
    }
    return ["Standard Industry Tools", "GitHub", "LucidChart"];
  }
}
