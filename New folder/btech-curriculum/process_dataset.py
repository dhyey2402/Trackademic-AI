import pandas as pd
import json
import collections

# Load Excel File
file_path = r"c:\Users\Siddhant Patel\OneDrive\Desktop\New folder\India_Engineering_Curriculum_Dataset.xlsx"
try:
    df = pd.read_excel(file_path, skiprows=1)
except Exception as e:
    print("Error reading excel:", e)
    exit(1)

# Format the dataset
dataset = collections.defaultdict(lambda: collections.defaultdict(lambda: collections.defaultdict(list)))

for idx, row in df.iterrows():
    branch = str(row.get('Branch', '')).strip()
    specialization = str(row.get('Specialization', '')).strip()
    semester = str(row.get('Semester / Year', '')).strip()
    subject_name = str(row.get('Subject Name', '')).strip()
    subject_type = str(row.get('Subject Type', '')).strip()
    emerging = str(row.get('Future / Emerging Subject', '')).strip()

    if not branch or not subject_name or str(subject_name) == 'nan':
        continue
        
    specialization = specialization if specialization and str(specialization) != 'nan' else 'Core'
    
    # Store subject dict
    subj = {
        "name": subject_name,
        "type": subject_type,
        "emerging": True if emerging.lower() == 'yes' else False
    }

    # Normalize Sem 1-2 to independent Sem 1 and Sem 2 copies to fit 8-sem loop
    if semester == 'Sem 1-2':
        dataset[branch][specialization]['Sem 1'].append(subj)
        dataset[branch][specialization]['Sem 2'].append(subj)
    elif semester == 'Sem 7-8':
        dataset[branch][specialization]['Sem 7'].append(subj)
        dataset[branch][specialization]['Sem 8'].append(subj)
    else:
        dataset[branch][specialization][semester].append(subj)

# Because we need exactly 6 distinct subjects per semester, if Sem 1-2 gives us e.g. 10 subjects, 
# let's split them 5 and 5, or 6 and 4.
for branch, specs in dataset.items():
    for spec, sems in specs.items():
        if 'Sem 1' in sems and 'Sem 2' in sems:
             # if they are identical lists (due to Sem 1-2 above being copied fully to both)
             # Let's divide them in half so they don't take exactly the same subjects both semesters.
             # Check if they are lists of the same length and content
             sem1 = sems['Sem 1']
             if len(sem1) > 6:
                 mid = len(sem1) // 2
                 sems['Sem 1'] = sem1[:mid]
                 sems['Sem 2'] = sem1[mid:]

# Dump to dataset.js
with open(r"c:\Users\Siddhant Patel\OneDrive\Desktop\New folder\btech-curriculum\dataset.js", "w", encoding="utf-8") as f:
    f.write("const MASTER_DATASET = ")
    json.dump(dataset, f, indent=2)
    f.write(";")

print("Successfully generated dataset.js!")
