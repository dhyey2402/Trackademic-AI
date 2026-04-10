const BRANCH_OPTS = {
  "Computer Science Engineering": [
    "Artificial Intelligence",
    "Cybersecurity",
    "Cloud Computing",
    "Data Science",
    "Full Stack Development",
    "Internet of Things (IoT)",
    "BlockChain Technology"
  ],
  "Information Technology": [
    "Information Security",
    "Enterprise Systems",
    "Web Technologies",
    "Mobile Applications"
  ],
  "Electronics & Communication Engineering": [
    "VLSI Design",
    "Embedded Systems",
    "Wireless Communication",
    "Robotics"
  ],
  "Electrical Engineering": [
    "Power Systems & Control",
    "Renewable Energy",
    "Smart Grid Technology",
    "Electric Vehicles"
  ],
  "Mechanical Engineering": [
    "Thermal Engineering",
    "Automotive Engineering",
    "Robotics & Automation",
    "CAD/CAM/CAE"
  ],
  "Civil Engineering": [
    "Structural Engineering",
    "Construction Management",
    "Transportation Engineering",
    "Geotechnical Engineering"
  ],
  "Artificial Intelligence & Machine Learning": [
    "Natural Language Processing",
    "Computer Vision",
    "Deep Learning",
    "Generative AI & LLMs"
  ],
  "Data Science Engineering": [
    "Big Data Analytics",
    "Predictive Modeling",
    "Business Intelligence",
    "Cloud Data Warehousing"
  ],
  "Cybersecurity Engineering": [
    "Network Security",
    "Ethical Hacking & Forensics",
    "Cryptography",
    "Cloud Security"
  ],
  "Robotics & Automation": [
    "Industrial Robotics",
    "Mechatronics",
    "Autonomous Vehicles",
    "Drones & Aerial Vehicles"
  ]
};


const COMMON_FIRST_YEAR = {
  semesters: [
    {
      semester: 1,
      name: "Foundation Semester (July - Nov)",
      subjects: [
        {
          name: "Problem Solving & Programming",
          course_code: "24BTESCX11",
          description: "Introduction to logical thinking and procedural programming using the C language, focusing on algorithm development.",
          purpose: "Core logic building for all software engineering tasks.",
          skills_gained: ["C Programming", "Algorithm Design", "Memory Management", "File Handling"],
          real_world_applications: ["Operating Systems", "Embedded Firmware", "Game Engines"],
          modules: [
            {
              module_name: "Unit I: Overview of C",
              description: "Fundamentals of programming languages, compilers, and basic C structure.",
              topics: ["Algorithms & Flowcharts", "C Tokens & Keywords", "Variables & Data Types", "Operators & Expressions", "Type Conversions"],
              practicals: ["Standard I/O programs", "Arithmetic operations"],
              tools: ["GCC Compiler", "VS Code"]
            },
            {
              module_name: "Unit II: Decision Making & Branching",
              description: "Control flow structures that allow programs to make decisions and repeat actions.",
              topics: ["If-Else Ladder", "Switch Case", "While & Do-While Loops", "For Loops", "1D & 2D Arrays"],
              practicals: ["Matrix multiplication", "Finding Factorials"],
              tools: ["GDB Debugger"]
            },
            {
              module_name: "Unit III: Strings & Functions",
              description: "Modular programming through functions and handling character sequences.",
              topics: ["Function Prototypes", "Recursion", "Call by Value vs Reference", "String Library Functions", "Multi-function Programs"],
              practicals: ["Palindrome checks", "Recursive Fibonacci"],
              tools: ["Standard C Library"]
            },
            {
              module_name: "Unit IV: Structures & Unions",
              description: "Defining custom data types to store heterogeneous data points.",
              topics: ["Defining Structures", "Nested Structures", "Structure Arrays", "Union vs Structure", "Typedef"],
              practicals: ["Student Database implementation", "Payroll system snippet"],
              tools: ["Visual Studio"]
            },
            {
              module_name: "Unit V: I/O and File Management",
              description: "Persistent data storage and low-level character stream handling.",
              topics: ["Opening & Closing Files", "fseek, ftell, rewind", "Binary vs Text Files", "Error handling in I/O", "Command Line Arguments"],
              practicals: ["File-based record keeper", "Copying file content via script"],
              tools: ["OS File System"]
            }
          ]
        },
        {
          name: "Critical Thinking",
          course_code: "24KUCC102",
          description: "Enhancing analytical abilities, logical reasoning, and decision-making skills through structured observation.",
          purpose: "To develop systematic problem-solving mindsets required for engineering innovation.",
          skills_gained: ["Logical Reasoning", "Argumentation", "Cognitive Bias Identification", "Decision Analysis"],
          real_world_applications: ["System Architecture", "Security Auditing", "Executive Decision Making"],
          modules: [
            {
              module_name: "Unit I: Introduction to Critical Thinking",
              description: "Difference between creative and critical thinking; benefits in engineering.",
              topics: ["Observation & Interpretation", "Analysis & Inference", "Self-regulation", "Innovation in Engineering"],
              practicals: ["Case study analysis"],
              tools: ["LucidChart", "MindMaps"]
            },
            {
              module_name: "Unit II: Logical Reasoning",
              description: "Deductive vs inductive reasoning and constructing strong arguments.",
              topics: ["Premises & Conclusions", "Common Fallacies", "Deductive Proofs", "Argument Structure"],
              practicals: ["Debate sessions", "Fallacy detection in news"],
              tools: ["Logic Provers"]
            },
            {
              module_name: "Unit III: Problem Solving Tech",
              description: "Systematic approaches to identifying root causes and generating solutions.",
              topics: ["Brainstorming", "Root Cause Analysis", "SWOT Analysis", "Flowcharts", "Intuitive vs Rational models"],
              practicals: ["SWOT of a tech product"],
              tools: ["Miro", "FigJam"]
            },
            {
              module_name: "Unit IV: Thinking in CSE",
              description: "Applying critical skills to software design and testing.",
              topics: ["Algorithmic Thinking", "Code Review Logic", "Debugging Approaches", "Social Implications of Tech"],
              practicals: ["Peer code reviews"],
              tools: ["GitHub Code Review"]
            },
            {
              module_name: "Unit V: Communication of Ideas",
              description: "Effectively presenting analytical findings to diverse audiences.",
              topics: ["Technical Report Writing", "Visual Aids", "Presentation Skills", "Team Collaboration"],
              practicals: ["Technical seminar"],
              tools: ["Canva", "LaTeX"]
            }
          ]
        },
        {
          name: "Fundamentals of AI",
          course_code: "24KUCC101",
          description: "Introduction to the history, concepts, and primary branches of Artificial Intelligence.",
          purpose: "Establish a baseline understanding of AI technologies before entering advanced semesters.",
          skills_gained: ["AI History", "Logic Representation", "Basic ML understanding", "AI Ethics"],
          real_world_applications: ["Chatbots", "Recommender Systems", "Search Engines"],
          modules: [
            {
              module_name: "Unit I: Introduction & History",
              description: "Evolution of AI from symbolic systems to deep learning.",
              topics: ["Types of AI", "Symbolic vs Sub-symbolic", "Data & Models", "Turing Test"],
              practicals: ["Identifying AI in daily apps"],
              tools: ["ChatGPT", "WolframAlpha"]
            },
            {
              module_name: "Unit II: Search & Logic",
              description: "How agents solve problems using state-space exploration.",
              topics: ["BFS & DFS", "Knowledge Representation", "Heuristic Search Basics", "Rule-based Systems"],
              practicals: ["Water Jug problem implementation"],
              tools: ["Python"]
            },
            {
              module_name: "Unit III: ML Fundamentals",
              description: "The core engine of modern AI: learning from data.",
              topics: ["Supervised vs Unsupervised", "Linear Regression", "Decision Trees", "Dataset Preparation"],
              practicals: ["Teachable Machine projects"],
              tools: ["Google Teachable Machine", "Scikit"]
            },
            {
              module_name: "Unit IV: AI in Discipline",
              description: "How AI transforms specific fields like law, marketing, and engineering.",
              topics: ["Predictive Analytics", "Automated Document Review", "Network Security AI", "AI in Design"],
              practicals: ["Domain-specific AI report"],
              tools: ["Midjourney", "GitHub Copilot"]
            },
            {
              module_name: "Unit V: Future & Ethics",
              description: "Societal impact, job market changes, and the alignment problem.",
              topics: ["Bias & Fairness", "Transparency", "AI Safety", "Impact on Jobs"],
              practicals: ["Ethical dilemma discussion"],
              tools: ["Ethics Canvas"]
            }
          ]
        },
        {
          name: "Engineering Mathematics - I",
          course_code: "24BTBSCX11",
          description: "Advanced calculus and linear algebra required for modeling physical systems.",
          purpose: "Numerical foundation for all higher engineering courses.",
          skills_gained: ["Linear Transformation", "Vector Calculus", "Fourier Series", "Complex Analysis"],
          real_world_applications: ["Signal Processing", "Structural Mechanics", "Economic Modeling"],
          modules: [
            {
              module_name: "Unit I: Linear Algebra",
              description: "Vector spaces, transformations, and matrix canonical forms.",
              topics: ["Basis & Dimension", "Eigenvalues", "Bilinear forms", "Transpose & Adjoint"],
              practicals: ["Matrix transformations"],
              tools: ["MATLAB"]
            },
            {
              module_name: "Unit II: Calculus",
              description: "Mean value theorems and multi-variable integration.",
              topics: ["Lagrange Mean Value", "Double & Triple Integrals", "Change of Variables", "Areas & Volumes"],
              practicals: ["Calculating volume of revolution"],
              tools: ["Mathematica"]
            },
            {
              module_name: "Unit III: Vector Calculus",
              description: "Line and surface integrals applied to fields.",
              topics: ["Stoke's Formula", "Gauss-Ostrogradsky Theorem", "Green's Formula", "Path Independence"],
              practicals: ["Vector field visualization"],
              tools: ["GeoGebra"]
            },
            {
              module_name: "Unit IV: Differential Equations",
              description: "Solving equations that govern rates of change.",
              topics: ["Bernoulli Equations", "Integrating Factors", "Second Order Linear ODEs", "Constant Coefficients"],
              practicals: ["Modeling simple harmonic motion"],
              tools: ["Wolfram Mathematica"]
            },
            {
              module_name: "Unit V: Multivariate Calculus",
              description: "Optimization in higher dimensional spaces.",
              topics: ["Definite Integrals as Sums", "Mixed Partial Derivatives", "Lagrange Multipliers", "Local Maxima & Minima"],
              practicals: ["Function optimization"],
              tools: ["Standard Plotter"]
            }
          ]
        },
        {
          name: "Applied Physics",
          course_code: "24BTBSCX12",
          description: "Study of physical properties of wave optics, dielectric materials, and semiconductors.",
          purpose: "Understanding the underlying hardware and physical layer of modern computing.",
          skills_gained: ["Fiber Optic analysis", "Semiconductor physics", "Superconductivity theory", "Quantum mechanics"],
          real_world_applications: ["CPU Design", "Optical Fiber Networks", "Magnetic Resonance Imaging (MRI)"],
          modules: [
            {
              module_name: "Unit I: Waves & Optics",
              description: "Ultrasonic waves and Laser systems.",
              topics: ["Einstein Coefficient Relation", "Ruby Lasers", "Fiber Optics Construction", "Acoustic Grating"],
              practicals: ["Wavelength of Mercury Spectrum"],
              tools: ["Laser Bench", "Spectrometer"]
            },
            {
              module_name: "Unit II: Dielectric Materials",
              description: "Polarization and behavior of materials in electric fields.",
              topics: ["Dipole Moment", "Clausius-Mossotti Equation", "Langevin-Debye Equation", "Internal Fields"],
              practicals: ["Band Gap determination"],
              tools: ["Dielectric constant kit"]
            },
            {
              module_name: "Unit III: Electronic Materials",
              description: "Free electron theory and electrical conductivity.",
              topics: ["Wiedemann-Franz Law", "Quantum Free Electron Theory", "Fermi-Dirac Statistics", "Conductivity expression"],
              practicals: ["Specific resistance check"],
              tools: ["Four Probe Setup"]
            },
            {
              module_name: "Unit IV: Semiconductors",
              description: "Behavior of P-N junctions and carrier concentration.",
              topics: ["Fermi Level Variation", "Drift & Diffusion", "Hall Effect", "Carrier Mobility"],
              practicals: ["Hall Effect Experiment"],
              tools: ["Hall Effect Apparatus"]
            },
            {
              module_name: "Unit V: Superconductivity",
              description: "Materials with zero electrical resistance.",
              topics: ["Meissner Effect", "BCS Theory", "Josephson's Junction", "Penetration Depth"],
              practicals: ["Critical temperature analysis"],
              tools: ["Cryogenic Setup"]
            }
          ]
        },
        {
          name: "Unix and Shell Programming",
          course_code: "24BTPCCX11",
          description: "Mastering the command-line interface and automation via shell scripts.",
          purpose: "Essential for infrastructure management, DevOps, and high-level software development.",
          skills_gained: ["CLI Proficiency", "Shell Scripting", "Admin Tasks", "Process Management"],
          real_world_applications: ["Cloud Administration", "Automation Pipelines", "Backend Development"],
          modules: [
            {
              module_name: "Unit I: Introduction",
              description: "Unix history, components, and basic command usage.",
              topics: ["Unix Components", "Command Substitution", "Manual Pages", "System Calls Overview"],
              practicals: ["ls, mkdir, cd, cat usage"],
              tools: ["Ubuntu/Debian", "Bash"]
            },
            {
              module_name: "Unit II: File System",
              description: "Hierarchy and permission management in Unix.",
              topics: ["Inodes", "Chmod/Chown", "Hard vs Soft Links", "Directory Structures"],
              practicals: ["Permission management scripts"],
              tools: ["Linux"]
            },
            {
              module_name: "Unit III: Shell Structure",
              description: "Understanding variables, redirection, and pipes.",
              topics: ["Metacharacters", "Standard Streams (I/O Redirection)", "Shell Variables", "Exporting"],
              practicals: ["Piping commands (Grep | Sort)"],
              tools: ["Bash/Zsh"]
            },
            {
              module_name: "Unit IV: Filters & AWK",
              description: "Advanced text processing tools.",
              topics: ["Grep Family", "Sed (Stream Editor)", "AWK Programming", "Pattern Scanning"],
              practicals: ["Text parsing with AWK"],
              tools: ["AWK", "Sed"]
            },
            {
              module_name: "Unit V: Scripting",
              description: "Writing complex programs in shell.",
              topics: ["Branching & Loops", "Positional Parameters", "Expr Command", "Function definitions"],
              practicals: ["Prime number check script", "Automated backup script"],
              tools: ["Vi/Vim Editor"]
            }
          ]
        }
      ]
    },
    {
      semester: 2,
      name: "Core Advance Semester (Dec - April)",
      subjects: [
        {
          name: "Python Programming",
          course_code: "24BTPCCX21",
          description: "Comprehensive study of Python with focus on data structures, files, and functional programming.",
          purpose: "Primary language for Data Science, AI, and modern web backends.",
          skills_gained: ["Pythonic logic", "Data Manipulation", "NumPy & Pandas usage", "Exception Handling"],
          real_world_applications: ["Backend APIs", "Data Scraping", "AI Model scripts"],
          modules: [
            {
              module_name: "Unit I: Introduction",
              description: "Python features, indentation, and basic operations.",
              topics: ["Interpreted nature", "Dynamic Typing", "Input/Output operations", "Indentation Rules"],
              practicals: ["Basic arithmetic", "Unit conversions"],
              tools: ["Python 3", "IDLE"]
            },
            {
              module_name: "Unit II: Data & Expressions",
              description: "Numeric types, booleans, and list variables.",
              topics: ["Operator Precedence", "Tuple Assignment", "Distance calculation logic", "Expressions"],
              practicals: ["Swapping variables", "Distance between points"],
              tools: ["PyCharm"]
            },
            {
              module_name: "Unit III: Control Flow & Strings",
              description: "Loops, conditionals, and advanced string methods.",
              topics: ["Elif Ladder", "Break/Continue/Pass", "String Slicing", "Format Methods"],
              practicals: ["Palindrome checks", "Countdown scripts"],
              tools: ["Jupyter"]
            },
            {
              module_name: "Unit IV: Functions & Modules",
              description: "Encapsulation and code reuse.",
              topics: ["Recursion", "Global vs Local Scope", "Importing Modules", "Standard Libraries"],
              practicals: ["Recursive factorial", "Building custom modules"],
              tools: ["Standard Library"]
            },
            {
              module_name: "Unit V: Advanced Collections",
              description: "Lists, Sets, Tuples, and Dictionaries in depth.",
              topics: ["List Comprehensions", "Dictionary operations", "Intro to NumPy/Pandas", "Real-time Apps"],
              practicals: ["Dictionary-based record system", "Matrix math with lists"],
              tools: ["NumPy", "Pandas"]
            }
          ]
        },
        {
          name: "Data Structures",
          course_code: "24BTPCCX22",
          description: "Study of organized memory management and efficient algorithm implementation.",
          purpose: "Foundational to building fast and scalable software.",
          skills_gained: ["Memory Efficiency", "Time Complexity Analysis", "Tree & Graph Traversal", "Sorting Logic"],
          real_world_applications: ["Database indexing", "File systems", "GPS Pathfinding"],
          modules: [
            {
              module_name: "Unit I: Logic & Complexity",
              description: "Background on ADTs and performance measurement.",
              topics: ["Algorithm Analysis", "Big O, Omega, Theta", "Time-Space Tradeoff", "Memory Allocation"],
              practicals: ["Pointer basics project"],
              tools: ["C++", "GDB"]
            },
            {
              module_name: "Unit II: Sorting & Searching",
              description: "Classic algorithms for data organization.",
              topics: ["Binary Search", "Quick Sort & Merge Sort", "Heap Sort", "Hash Maps"],
              practicals: ["Implementation of Merge Sort"],
              tools: ["Linux G++"]
            },
            {
              module_name: "Unit III: Linear Structures",
              description: "Stacks, Queues, and Linked Lists.",
              topics: ["Polish Notation (Infix/Postfix)", "Circular Queues", "Doubly Linked Lists", "Singly Linked List ops"],
              practicals: ["Stack-based calculator"],
              tools: ["C"]
            },
            {
              module_name: "Unit IV: Non-Linear Structures",
              description: "Hierarchical data representation via Trees and Graphs.",
              topics: ["Binary Search Trees", "AVL Trees", "Dijkstra's Algorithm", "Prim & Kruskal"],
              practicals: ["Shortest path implementation"],
              tools: ["Visualizer Tools"]
            },
            {
              module_name: "Unit V: Advanced Paradigm",
              description: "Dynamic programming and greedy approaches.",
              topics: ["Knapsack Problem", "8-Queens Problem", "Traveling Salesman", "Backtracking"],
              practicals: ["8-Queens Visualizer"],
              tools: ["IDE"]
            }
          ]
        },
        {
          name: "Applied AI",
          course_code: "24KUCCA21",
          description: "Integration of Artificial Intelligence tools into discipline-specific workflows.",
          purpose: "Translating theoretical AI into practical industrial value.",
          skills_gained: ["Copilot usage", "Automated Workflows", "Prompt Engineering basics", "AI API Integration"],
          real_world_applications: ["Legal Document Automation", "Marketing Insights", "AI-assisted design"],
          modules: [
            {
              module_name: "Unit I: Concept Review",
              description: "Brief recap of AI fundamentals and domain exploration.",
              topics: ["AI Application Domains", "Law, Management, IT, Design", "AI in Dentistry/Arts", "Domain Mapping"],
              practicals: ["Domain fit audit"],
              tools: ["OpenAI Playground"]
            },
            {
              module_name: "Unit II: Domain Specific AI",
              description: "Case studies in legal research, CRM, and network security.",
              topics: ["Contract Analysis AI", "Intelligent Marketing", "Chatbots for Support", "Generative Design"],
              practicals: ["Building a support bot flow"],
              tools: ["ManyChat", "Dialogflow"]
            },
            {
              module_name: "Unit III: Hands-on Tools",
              description: "Working with pre-trained models and easy interfaces.",
              topics: ["Using AI APIs", "Customer Segmentation", "Image Classification", "Sentiment Analysis"],
              practicals: ["Integrating AI API into script"],
              tools: ["Hugging Face", "Google Cloud AI"]
            },
            {
              module_name: "Unit IV: Future Trends",
              description: "Emerging applied technologies and ethical safeguards.",
              topics: ["Applied Ethical Considerations", "Impact on chosen fields", "Future of Work", "Trend Analysis"],
              practicals: ["Trend projection report"],
              tools: ["Exploding Topics"]
            },
            {
              module_name: "Unit V: Project Showcase",
              description: "Demonstrating potential AI applications in chosen fields.",
              topics: ["Project Presentation", "Solution Limitations", "Strengths & Weaknesses", "Peer Discussions"],
              practicals: ["Final domain project"],
              tools: ["Pitch"]
            }
          ]
        }
      ]
    }
  ]
};
