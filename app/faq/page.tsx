// app/faq/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import FAQPage from "@/src/components/FQPage"; // <-- your interactive component

// ---------- SEO metadata ----------
export const metadata: Metadata = {
  title:
    "Frequently Asked Questions | Gocyn - Internships, Courses & Certificates",
  description:
    "Find answers about free online internships with certificates, courses, mentorship, pricing, and more. Get verifiable certificates recognized by companies.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Frequently Asked Questions | Gocyn",
    description:
      "Everything about Gocyn internships, courses, and certificates — answered.",
    url: "/faq",
    type: "website",
  },
};

// ---------- Structured data (server‑side) ----------
// Re‑use the same data you defined in the client component.
// In production, import this from a shared data file to avoid duplication.

const faqsData = [
  {
    question: "Can I get a free online internship with a certificate as a fresher?",
    answer: "Yes! Gocyn offers free online internships with verifiable certificates...",
    // … all your FAQ objects (paste your existing array here)
  },
  // ... rest of your FAQ items
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqsData.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Online Internships and Courses with Certificates — Gocyn",
  description:
    "Free and paid online internships with industry-recognized certificates for students and freshers.",
  url: "https://www.gocyn.com",
  numberOfItems: 3,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Course",
        name: "Web Development Internship with Certificate",
        description: "Hands-on web development internship for beginners...",
        provider: { "@type": "Organization", name: "Gocyn", sameAs: "https://www.gocyn.com" },
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR", availability: "https://schema.org/InStock" },
        educationalLevel: "Beginner",
        teaches: ["HTML", "CSS", "JavaScript", "React"],
      },
    },
    // ... other courses as in your original array
  ],
};

export default function FAQClient() {
  return (
    <>
      {/* JSON‑LD injected at server render – perfect for SEO */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="course-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      {/* Your fully interactive FAQ component */}
      <FAQPage />
    </>
  );
}