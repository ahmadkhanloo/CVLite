import type { AISettings } from "../../types/ai";
import type { Resume } from "../../types/resume";
import { normalizeResume } from "../../data/defaults";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

async function callAI(settings: AISettings, prompt: string): Promise<string> {
  const { provider, apiKey } = settings;
  if (!apiKey) throw new Error("No API key configured.");

  if (provider === "anthropic") {
    const model = settings.model || "claude-haiku-4-5-20251001";
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: { message?: string } }).error?.message || `Anthropic error ${res.status}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json();
    return data.content?.[0]?.text || "";
  }

  // OpenAI
  const model = settings.model || "gpt-4o-mini";
  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((err as any).error?.message || `OpenAI error ${res.status}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function rewriteBullet(settings: AISettings, bullet: string, jobTitle: string): Promise<string> {
  const prompt = `You are a professional resume writer. Rewrite this resume bullet point to be stronger, more impactful, and metrics-driven. Use active verbs. Return ONLY the improved bullet, no explanation.

Job title context: ${jobTitle}
Original bullet: ${bullet}`;
  return callAI(settings, prompt);
}

export async function generateSummary(settings: AISettings, resume: Partial<Resume>): Promise<string> {
  const r = normalizeResume(resume);
  const context = [
    `Name: ${r.basics.firstName} ${r.basics.lastName}`,
    `Headline: ${r.basics.headline}`,
    `Experience: ${r.experience.slice(0, 3).map((e) => `${e.title} at ${e.organization} (${e.period})`).join("; ")}`,
    `Skills: ${r.skills.flatMap((s) => s.keywords).slice(0, 10).join(", ")}`
  ].join("\n");
  const prompt = `Write a professional resume summary (3-4 sentences) for this person. Return ONLY the summary text, no labels or explanation.\n\n${context}`;
  return callAI(settings, prompt);
}

export async function tailorResume(settings: AISettings, resume: Partial<Resume>, jobDescription: string): Promise<string> {
  const r = normalizeResume(resume);
  const resumeText = [
    r.basics.headline,
    r.summary,
    r.experience.slice(0, 3).map((e) => `${e.title} at ${e.organization}: ${e.bullets.slice(0, 2).join(". ")}`).join("\n"),
    `Skills: ${r.skills.flatMap((s) => s.keywords).join(", ")}`
  ].join("\n\n");
  const prompt = `You are a professional resume consultant. Given this resume and job description, suggest 5 specific changes to better tailor the resume for the job. Format as a numbered list of actionable suggestions.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`;
  return callAI(settings, prompt);
}

export async function atsCheck(settings: AISettings, resume: Partial<Resume>, jobDescription: string): Promise<string> {
  const r = normalizeResume(resume);
  const skills = r.skills.flatMap((s) => s.keywords).join(", ");
  const prompt = `Analyze this resume against the job description for ATS (Applicant Tracking System) compatibility. Identify:
1. Keywords in the job description that are missing from the resume
2. ATS compatibility score (0-100)
3. Top 3 improvements to boost ATS score

RESUME SKILLS/HEADLINE: ${r.basics.headline}. Skills: ${skills}
JOB DESCRIPTION: ${jobDescription.slice(0, 1200)}`;
  return callAI(settings, prompt);
}
