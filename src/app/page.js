import Home from "./homeClient";

export const metadata = {
  title: "LetterSathi - AI-Powered Cover Letter & Email Generator",
  description:
    "Craft personalized, professional cover letters and email drafts in seconds — tailored to each role and company you apply to.",
  keywords: [
    "cover letter generator",
    "AI cover letter",
    "email draft generator",
    "job application letters",
    "resume tools",
    "LetterSathi",
  ],
  openGraph: {
    title: "LetterSathi - AI-Powered Cover Letter & Email Generator",
    description:
      "Generate tailored cover letters and emails instantly. Perfect for professionals and job seekers.",
    url: "https://yourdomain.com",
    siteName: "LetterSathi",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "LetterSathi AI tool screenshot",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LetterSathi - AI-Powered Cover Letter & Email Generator",
    description:
      "Generate cover letters and emails that land interviews. Try LetterSathi today.",
    images: ["https://yourdomain.com/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Page() {
  return <Home />;
}
