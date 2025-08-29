// app/api/generate/route.js
import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export const runtime = "edge";

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.fullName || !data.applications?.length) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const letters = await Promise.all(
      data.applications.map(async (app) => {
        const { company, role, hiringManager } = app;
        const manager = hiringManager || "Hiring Manager";

        let coverLetterResult = "";

        try {
          const { textStream } = await streamText({
            model: groq("llama3-8b-8192"),
            prompt: `
You are ${data.fullName}, applying for the ${role} position at ${company}. Write a concise, professional cover letter with the following:

- Start with: "Dear ${manager},"
- Express genuine enthusiasm for the role and ${company}
- Highlight relevant experience: 3-month internship building web tools (coupon generator, URL shortener, WordPress pages, React apps)
- Emphasize skills: HTML, CSS, JavaScript, React
- Showcase traits: fast learner, detail-oriented, passionate about frontend development
- Use two short paragraphs, separated by a single blank line
- Keep the entire letter under 200 words
- Close with: "Sincerely," followed by a new line with "${data.fullName}"
- Do NOT include:
  - Subject lines
  - "Here is the cover letter:" or any meta comments
  - Contact info, resume mentions, or attachments

Match ${company}'s tone (professional, innovative, or mission-driven).`,
          });

          for await (const chunk of textStream) {
            coverLetterResult += chunk;
          }
        } catch (err) {
          console.error("Error generating letter:", err);
          coverLetterResult = `Error: ${err.message || "Failed to generate cover letter."}`;
        }

        return {
          company,
          role,
          hiringManager: manager,
          coverLetter: coverLetterResult.trim(),
          emailSubject: `Application for ${role} at ${company}`,
          emailBody: `Hello ${company} Hiring Team,

I'm excited to apply for the ${role} position at ${company}. I've attached my resume and cover letter for your review.

Best regards,
${data.fullName}
${data.email ? `Email: ${data.email}` : ""}
${data.phone ? `Phone: ${data.phone}` : ""}`.trim(),
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          github: data.github,
          portfolio: data.portfolio,
          linkedin: data.linkedin,
        };
      })
    );

    return new Response(JSON.stringify({ letters }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}