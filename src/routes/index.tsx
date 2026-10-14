import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/zhino/Navbar";
import { Cinematic } from "@/components/zhino/Cinematic";
import { Intro, Services, Journey, PhoneDemo, Report, Features, FAQ, FinalCTA, Footer } from "@/components/zhino/Sections";
import { ZHINO } from "@/lib/zhino";

const TITLE = "ژینو | بات تلگرام آزمون فصل‌به‌فصل و آزمایشی کنکور";
const DESC = "آزمون فصل‌به‌فصل، آزمون‌های آزمایشی ماز و قلمچی و آزمون‌های مبحثی ژینوپلاس؛ همراه با محاسبه درصد، کارنامه عملکرد و گزارش به مشاور کنکور.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fa_IR" },
      { property: "og:url", content: ZHINO.siteUrl },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: ZHINO.siteUrl }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "ZHINO — ژینو",
          url: ZHINO.siteUrl,
          sameAs: [ZHINO.telegramBot],
          description: DESC,
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background text-foreground">
      <a href="#intro" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-[60] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2">پرش به محتوا</a>
      <Navbar />
      <main>
        <Cinematic />
        <Intro />
        <Services />
        <Journey />
        <PhoneDemo />
        <Report />
        <Features />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
