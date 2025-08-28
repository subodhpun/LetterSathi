// app/api/generate/route.js
export async function POST(request) {
    try {
      const data = await request.json();
  
      if (!data.fullName || !data.applications?.length) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400 }
        );
      }
  
      const letters = data.applications.map((app) => {
        const { company, role, hiringManager } = app;
        const manager = hiringManager || "Hiring Manager"; // ✅ Use per-application hiring manager
  
        const coverLetter = `
  Dear ${manager},
  
  I am writing to apply for the position of ${role} at ${company}. With my background in software development and passion for creating user-centered applications, I am excited about the opportunity to contribute to your team.
  
  During my 3-month internship, I developed web tools such as a coupon code generator, URL shortener with redirection, WordPress pages, and React.js projects. These experiences strengthened my skills in HTML, CSS, JavaScript, and modern frameworks like React.
  
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
          hiringManager: manager,
          coverLetter,
          emailSubject,
          emailBody,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          github: data.github,
          portfolio: data.portfolio,
          linkedin: data.linkedin,
        };
      });
  
      return new Response(JSON.stringify({ letters }), { status: 200 });
    } catch (error) {
      console.error("Error:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  }