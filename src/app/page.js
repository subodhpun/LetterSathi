"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import download from "downloadjs";

export default function Home() {
  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [applications, setApplications] = useState([{ company: "", role: "" }]);

  // Results state
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper functions
  const addApplication = () => {
    setApplications([...applications, { company: "", role: "" }]);
  };

  const updateApplication = (index, field, value) => {
    const updated = [...applications];
    updated[index][field] = value;
    setApplications(updated);
  };

  const removeApplication = (index) => {
    if (applications.length > 1) {
      setApplications(applications.filter((_, i) => i !== index));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validApplications = applications.filter(
      (app) => app.company.trim() && app.role.trim()
    );

    if (validApplications.length === 0) {
      alert("Please enter at least one company and role.");
      setLoading(false);
      return;
    }

    const userData = {
      fullName,
      email,
      phone,
      github,
      portfolio,
      linkedin,
      applications: validApplications,
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        const { letters } = await res.json();
        setLetters(letters);
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Copy email to clipboard
  const copyEmail = (body) => {
    navigator.clipboard.writeText(body);
    alert("Email copied to clipboard!");
  };

  // Generate and download PDF
  const downloadPDF = async (letter) => {
    const { company, role, coverLetter } = letter;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const title = `${fullName} - Application for ${role} at ${company}`;
    const lines = coverLetter.split("\n");

    let y = 750;

    page.drawText(title, {
      x: 50,
      y,
      size: 16,
      font: titleFont,
      color: rgb(0, 0, 0),
    });

    y -= 30;

    for (const line of lines) {
      page.drawText(line, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 20;
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    download(blob, `${fullName} - ${role} at ${company}.pdf`);
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-6xl font-extrabold text-slate-800 mb-4 tracking-tight leading-tight">
            LetterSathi
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Craft personalized, professional cover letters and email drafts in seconds — 
            tailored to each role and company you apply to.
          </p>
        </header>

        {/* Show Results if Available */}
        {letters.length > 0 ? (
          <div className="space-y-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Generated Letters</h2>
            {letters.map((letter, index) => (
              <div key={index} className="bg-white shadow-lg rounded-2xl border border-slate-200 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-800">
                      {letter.role} at {letter.company}
                    </h3>
                    <p className="text-slate-600">To: {letter.company} Hiring Team</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => copyEmail(letter.emailBody)}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                    >
                      📋 Copy Email
                    </button>
                    <button
                      onClick={() => downloadPDF(letter)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      📄 Download PDF
                    </button>
                  </div>
                </div>

                {/* Cover Letter Preview */}
                <div className="mb-8">
                  <h4 className="font-semibold text-slate-700 mb-3">Cover Letter</h4>
                  <pre className="whitespace-pre-wrap text-slate-800 bg-gray-50 p-5 rounded-lg border">
                    {letter.coverLetter}
                  </pre>
                </div>

                {/* Email Preview */}
                <div>
                  <h4 className="font-semibold text-slate-700 mb-3">Email Draft</h4>
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <p className="font-medium text-blue-900 mb-2">Subject: {letter.emailSubject}</p>
                    <pre className="whitespace-pre-wrap text-blue-800">{letter.emailBody}</pre>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setLetters([])}
              className="mt-6 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
            >
              ← Back to Form
            </button>
          </div>
        ) : (
          // Show Form
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-8 md:p-10">
              {/* Personal Info */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <span className="w-2 h-7 bg-indigo-700 rounded-full"></span>
                  <span>Your Information</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g., John Doe"
                      className="w-full border border-slate-300 text-black p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="johndoe@email.com"
                      className="w-full border border-slate-300 text-black p-3 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+977-9800000000"
                      className="w-full border border-slate-300 text-black p-3 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">GitHub (optional)</label>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                      <input
                        type="url"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="github.com/johndoe"
                        className="flex-1 border border-slate-300 text-black p-3 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Portfolio (optional)</label>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <input
                        type="url"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        placeholder="johndoe.dev"
                        className="flex-1 border border-slate-300 text-black p-3 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn (optional)</label>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.556 1.358-1.248 0-.697-.52-1.248-1.357-1.248-.838 0-1.358.551-1.358 1.248 0 .697.52 1.248 1.358 1.248zm6.298 8.212V9.359c0-.897-.407-1.398-1.074-1.398-.558 0-.92.35-1.038.724h-.039v-.626H7.86v7.225h2.401zm-1.201-4.798c.588 0 .95-.324.95-.863 0-.56-.375-.862-.95-.862h-.668v1.725h.668z"/>
                      </svg>
                      <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="linkedin.com/in/johndoe"
                        className="flex-1 border border-slate-300 text-black p-3 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Applications */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <span className="w-2 h-7 bg-indigo-700 rounded-full"></span>
                  <span>Applications</span>
                </h2>

                <div className="space-y-4">
                  {applications.map((app, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 p-5 bg-gray-50 rounded-lg border">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                          type="text"
                          value={app.company}
                          onChange={(e) => updateApplication(index, "company", e.target.value)}
                          placeholder="e.g., Google"
                          className="w-full border border-slate-300 text-black p-3 rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                          type="text"
                          value={app.role}
                          onChange={(e) => updateApplication(index, "role", e.target.value)}
                          placeholder="e.g., Frontend Developer"
                          className="w-full border border-slate-300 text-black p-3 rounded-lg"
                        />
                      </div>
                      {applications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeApplication(index)}
                          className="self-center px-3 py-3 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addApplication}
                  className="mt-4 text-indigo-700 hover:text-indigo-900 text-sm font-medium transition flex items-center gap-1"
                >
                  + Add Another Application
                </button>
              </section>

              {/* Actions */}
              <section className="flex flex-wrap gap-4 justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-7 py-3 rounded-lg shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-700 hover:bg-indigo-800 text-white"
                  }`}
                >
                  {loading ? "⏳ Generating..." : "🚀 Generate Letters"}
                </button>
              </section>
            </div>
          </form>
        )}

        <footer className="text-center mt-12 text-slate-500 text-sm leading-relaxed">
          <p>Designed for professionals who value clarity, precision, and personalization.</p>
          <p className="mt-1">— LetterSathi helps your applications stand out with confidence.</p>
        </footer>
      </div>
    </div>
  );
}