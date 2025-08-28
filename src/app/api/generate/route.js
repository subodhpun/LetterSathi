// app/api/generate/route.js

export async function POST(request) {
    try {
      const data = await request.json();
  
      // Validate required fields
      if (!data.fullName || !data.applications?.length) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: fullName or applications" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      // Generate a cover letter for each application
      const letters = data.applications.map((app) => {
        const { company, role } = app;
  
        // ✅ Simple template (replace with AI or advanced logic later)
        const coverLetter = `
  Dear Hiring Team at ${company},
  
  I am writing to express my interest in the ${role} position at ${company}. With my background in software development and passion for creating user-centered applications, I am excited about the opportunity to contribute to your team.
  
  In my previous role at [Previous Company], I successfully [mention a key achievement]. I believe this experience aligns well with the goals of ${company} and the requirements of the ${role} role.
  
  I would welcome the opportunity to further discuss how my skills and experiences can benefit ${company}. Thank you for considering my application.
  
  Sincerely,  
  ${data.fullName}
        `.trim();
  
        const emailSubject = `Application for ${role} at ${company}`;
        const emailBody = `
  Hello ${company} Hiring Team,
  
  I'm excited to apply for the ${role} position at ${company}. I've attached my resume and cover letter for your review.
  
  Best regards,  
  ${data.fullName}  
  ${data.email ? `Email: ${data.email}` : ""}  
  ${data.phone ? `Phone: ${data.phone}` : ""}
        `.trim();
  
        return {
          company,
          role,
          coverLetter,
          emailSubject,
          emailBody,
        };
      });
  
      return new Response(
        JSON.stringify({ letters }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error generating letters:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }