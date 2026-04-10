const BASE_URL = "http://127.0.0.1:5000"

export interface GenerateCurriculumPayload {
  branch: string
  focus: string
  institution: string
  future_weight: number
  year_range: string
}

export interface Subject {
  code: string
  name: string
  credits: number
  type: string
  category: string
  industry_relevance: number
  future_potential: number
  tools: string[]
  is_emerging: boolean
  description: string
}

export interface Semester {
  sem: number
  year: number
  theme: string
  subjects: Subject[]
}

export interface Curriculum {
  branch: string
  total_credits: number
  semesters: Semester[]
}

export interface SavedCurriculum {
  id: number
  branch: string
  focus: string
  created_at: string
}

export interface CurriculumInsights {
  overall_score: number
  industry_alignment: number
  future_readiness: number
  gaps: string[]
  strengths: string[]
  recommendations: string[]
  emerging_tech_coverage: Record<string, number>
  obsolete_subjects: string[]
}

export const curriculumApi = {
  async generate(payload: GenerateCurriculumPayload): Promise<Curriculum> {
    const res = await fetch(`${BASE_URL}/api/generate-curriculum`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        branch: payload.branch,
        focus: payload.focus,
        institution: payload.institution,
        future_weight: payload.future_weight,
        year_range: payload.year_range,
      }),
    })
    if (!res.ok) throw new Error(`Curriculum generation failed: ${res.status}`)
    return res.json()
  },

  async getBranches(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/api/branches`)
    if (!res.ok) throw new Error("Failed to fetch branches")
    return res.json()
  },

  async listSaved(): Promise<SavedCurriculum[]> {
    const res = await fetch(`${BASE_URL}/api/curricula`)
    if (!res.ok) throw new Error("Failed to fetch saved curricula")
    return res.json()
  },

  async getInsights(branch: string, curriculum: Curriculum): Promise<CurriculumInsights> {
    const res = await fetch(`${BASE_URL}/api/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branch, curriculum }),
    })
    if (!res.ok) throw new Error("Failed to fetch insights")
    return res.json()
  },
}
