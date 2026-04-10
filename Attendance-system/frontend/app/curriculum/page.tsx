"use client"

import { useState, useEffect, useCallback } from "react"
import { curriculumApi, type Curriculum, type SavedCurriculum, type CurriculumInsights } from "@/lib/curriculumApi"
import { ModuleHeader } from "@/components/layout/module-header"
import {
  BookOpen,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Star,
  Zap,
  BarChart2,
  History,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

const BRANCHES = [
  "Computer Science Engineering",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "AI & Machine Learning",
  "Data Science Engineering",
  "Cybersecurity Engineering",
  "Aerospace Engineering",
  "Chemical Engineering",
  "Biotechnology",
]

const FOCUS_AREAS = [
  "Artificial Intelligence",
  "Cloud Computing",
  "Cybersecurity",
  "Data Science",
  "Embedded Systems",
  "Full Stack Development",
  "IoT & Smart Systems",
  "Machine Learning",
  "Robotics & Automation",
  "Research & Academia",
  "Startup & Entrepreneurship",
]

const YEAR_RANGES = ["2024-2028", "2025-2029", "2026-2030", "2027-2031"]

type SidebarTab = "generator" | "saved" | "insights"

export default function CurriculumDashboard() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("generator")
  const [formData, setFormData] = useState({
    branch: "Computer Science Engineering",
    focus: "Artificial Intelligence",
    institution: "NIT Default",
    future_weight: 50,
    year_range: "2024-2028",
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Curriculum | null>(null)
  const [error, setError] = useState("")
  const [expandedSem, setExpandedSem] = useState<number | null>(1)
  const [savedList, setSavedList] = useState<SavedCurriculum[]>([])
  const [insights, setInsights] = useState<CurriculumInsights | null>(null)
  const [insightsLoading, setInsightsLoading] = useState(false)

  const fetchSaved = useCallback(async () => {
    try {
      const data = await curriculumApi.listSaved()
      setSavedList(data)
    } catch {
      /* backend may be offline */
    }
  }, [])

  useEffect(() => {
    if (activeTab === "saved") fetchSaved()
  }, [activeTab, fetchSaved])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)
    setInsights(null)
    try {
      const data = await curriculumApi.generate(formData)
      setResult(data)
      setExpandedSem(1)
      setActiveTab("generator")
    } catch (err: any) {
      setError(err.message || "Generation failed. Ensure the Flask backend is running on port 5000.")
    } finally {
      setLoading(false)
    }
  }

  const handleGetInsights = async () => {
    if (!result) return
    setInsightsLoading(true)
    setActiveTab("insights")
    try {
      const data = await curriculumApi.getInsights(result.branch, result)
      setInsights(data)
    } catch {
      setInsights(null)
    } finally {
      setInsightsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <ModuleHeader moduleName="Curriculum Section" moduleHref="/curriculum" />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-white/5 bg-slate-900/60 flex flex-col">
          {/* Brand */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500">
              <BookOpen className="size-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">EduCore AI</p>
              <p className="text-[10px] text-slate-500">Curriculum Generator</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {(
              [
                { key: "generator", label: "Generator", icon: Sparkles },
                { key: "saved", label: "Saved Curricula", icon: History },
                { key: "insights", label: "AI Insights", icon: BarChart2 },
              ] as { key: SidebarTab; label: string; icon: any }[]
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                id={`curriculum-nav-${key}`}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  activeTab === key
                    ? "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </nav>

          {/* Generate form area */}
          <div className="border-t border-white/5 p-4">
            <form onSubmit={handleGenerate} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Branch</label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Focus Area</label>
                <select
                  value={formData.focus}
                  onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50"
                >
                  {FOCUS_AREAS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Institution</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                  Future Weight: {formData.future_weight}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={10}
                  value={formData.future_weight}
                  onChange={(e) => setFormData({ ...formData, future_weight: Number(e.target.value) })}
                  className="w-full accent-violet-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Year Range</label>
                <select
                  value={formData.year_range}
                  onChange={(e) => setFormData({ ...formData, year_range: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50"
                >
                  {YEAR_RANGES.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <button
                id="generate-curriculum-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-all hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    Generate Curriculum
                  </>
                )}
              </button>

              {error && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
            </form>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto">
          {/* Generator tab */}
          {activeTab === "generator" && (
            <div className="p-8">
              {!result && !loading && (
                <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center space-y-4">
                  <div className="flex size-20 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20">
                    <Sparkles className="size-10 text-violet-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">AI Curriculum Generator</h2>
                  <p className="text-slate-400 max-w-md">
                    Configure your branch and focus area in the sidebar, then click{" "}
                    <span className="text-violet-400 font-semibold">Generate Curriculum</span> to create an
                    AICTE-aligned 8-semester plan powered by Claude AI.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {["8 Semesters", "AICTE Aligned", "Industry Scores", "Emerging Tech Flags"].map((t) => (
                      <span key={t} className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                  <Loader2 className="size-12 text-violet-500 animate-spin" />
                  <p className="text-slate-400">Claude is generating your curriculum...</p>
                  <p className="text-slate-600 text-sm">This may take 10-20 seconds</p>
                </div>
              )}

              {result && (
                <div className="space-y-6 page-transition">
                  {/* Header */}
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Generated Curriculum</p>
                      <h1 className="text-3xl font-bold text-white">{result.branch}</h1>
                      <p className="text-slate-400 mt-1">
                        {formData.focus} · {formData.institution} · {formData.year_range}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
                        {result.total_credits} Total Credits
                      </span>
                      <button
                        id="get-insights-btn"
                        onClick={handleGetInsights}
                        disabled={insightsLoading}
                        className="flex items-center gap-2 bg-violet-500/15 border border-violet-500/30 text-violet-400 hover:bg-violet-500/25 px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                      >
                        <BarChart2 className="size-3.5" />
                        Get AI Insights
                      </button>
                    </div>
                  </div>

                  {/* Semester accordion */}
                  <div className="space-y-3">
                    {result.semesters?.map((sem) => {
                      const isOpen = expandedSem === sem.sem
                      const presentCount = sem.subjects?.filter((s) => s.is_emerging).length || 0
                      return (
                        <div key={sem.sem} className="border border-white/8 rounded-xl overflow-hidden bg-slate-900/40">
                          <button
                            onClick={() => setExpandedSem(isOpen ? null : sem.sem)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <span className="flex size-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400 text-sm font-bold">
                                {sem.sem}
                              </span>
                              <div>
                                <p className="font-semibold text-white text-sm">Semester {sem.sem}</p>
                                <p className="text-xs text-slate-500">{sem.theme}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {presentCount > 0 && (
                                <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-xs text-green-400">
                                  {presentCount} Emerging
                                </span>
                              )}
                              <span className="text-xs text-slate-500">{sem.subjects?.length || 0} subjects</span>
                              {isOpen ? (
                                <ChevronDown className="size-4 text-slate-500" />
                              ) : (
                                <ChevronRight className="size-4 text-slate-500" />
                              )}
                            </div>
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                              {sem.subjects?.map((sub, idx) => (
                                <div
                                  key={idx}
                                  className="relative rounded-xl border border-white/5 bg-slate-800/50 p-4 hover:border-violet-500/20 transition-colors"
                                >
                                  {sub.is_emerging && (
                                    <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                                      <Zap className="size-3" />
                                    </span>
                                  )}
                                  <p className="text-xs text-slate-500 font-mono mb-1">{sub.code}</p>
                                  <p className="text-sm font-semibold text-white leading-snug">{sub.name}</p>
                                  <p className="text-xs text-slate-500 mt-1">{sub.category} · {sub.credits} cr</p>
                                  {/* Relevance bar */}
                                  <div className="mt-3 space-y-1">
                                    <div className="flex justify-between text-[10px] text-slate-600">
                                      <span>Industry</span>
                                      <span>{sub.industry_relevance}/10</span>
                                    </div>
                                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                                        style={{ width: `${(sub.industry_relevance / 10) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                  {sub.tools?.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {sub.tools.slice(0, 3).map((t) => (
                                        <span key={t} className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400">
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Saved Curricula tab */}
          {activeTab === "saved" && (
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Saved Curricula</h2>
                <p className="text-slate-400 text-sm mt-1">All previously generated curricula from the database</p>
              </div>
              {savedList.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-500 gap-3">
                  <History className="size-12 opacity-30" />
                  <p>No saved curricula yet. Generate one to see it here.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {savedList.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-slate-900/40 hover:border-white/15 transition-colors">
                      <div>
                        <p className="font-semibold text-white">{item.branch}</p>
                        <p className="text-sm text-slate-400">{item.focus}</p>
                      </div>
                      <p className="text-xs text-slate-600">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Insights tab */}
          {activeTab === "insights" && (
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">AI Curriculum Insights</h2>
                <p className="text-slate-400 text-sm mt-1">
                  {result ? `Analysis for ${result.branch}` : "Generate a curriculum first to view insights"}
                </p>
              </div>

              {insightsLoading && (
                <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                  <Loader2 className="size-10 text-violet-500 animate-spin" />
                  <p className="text-slate-400">Claude is analyzing your curriculum...</p>
                </div>
              )}

              {!result && !insightsLoading && (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-500 gap-3">
                  <BarChart2 className="size-12 opacity-30" />
                  <p>Generate a curriculum first, then click "Get AI Insights"</p>
                </div>
              )}

              {insights && !insightsLoading && (
                <div className="space-y-6 page-transition">
                  {/* Score cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Overall Score", value: insights.overall_score, icon: Star, color: "yellow" },
                      { label: "Industry Alignment", value: insights.industry_alignment, icon: TrendingUp, color: "blue" },
                      { label: "Future Readiness", value: insights.future_readiness, icon: Zap, color: "violet" },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="rounded-xl border border-white/8 bg-slate-900/40 p-5 flex items-center gap-4">
                        <div className={`flex size-12 items-center justify-center rounded-xl bg-${color}-500/10`}>
                          <Icon className={`size-6 text-${color}-400`} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">{label}</p>
                          <p className="text-3xl font-bold text-white">{value}<span className="text-sm text-slate-500">/10</span></p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Gaps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-green-400 mb-3">
                        <CheckCircle2 className="size-4" /> Strengths
                      </h3>
                      <ul className="space-y-2">
                        {insights.strengths?.map((s, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">·</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-3">
                        <AlertCircle className="size-4" /> Gaps
                      </h3>
                      <ul className="space-y-2">
                        {insights.gaps?.map((g, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">·</span> {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {insights.recommendations?.length > 0 && (
                    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
                      <h3 className="text-sm font-semibold text-violet-400 mb-3">Recommendations</h3>
                      <ul className="space-y-2">
                        {insights.recommendations.map((r, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-violet-500 mt-0.5">{i + 1}.</span> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
