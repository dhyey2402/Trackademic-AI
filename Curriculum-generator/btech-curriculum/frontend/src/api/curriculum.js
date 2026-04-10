const BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000";

async function post(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "API error");
  }
  return res.json();
}

async function get(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export const curriculumAPI = {
  generate: ({ branch, focus, institution, futureWeight, yearRange }) =>
    post("/api/generate-curriculum", { branch, focus, institution, future_weight: futureWeight, year_range: yearRange }),
  generateSyllabus: ({ subject, branch, semester, credits }) =>
    post("/api/generate-syllabus", { subject, branch, semester, credits }),
  getInsights: (curriculum, branch) =>
    post("/api/insights", { curriculum, branch }),
  getBranches: () => get("/api/branches"),
  listCurricula: () => get("/api/curricula"),
  getCurriculum: (id) => get(`/api/curricula/${id}`)
};
