import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SchemaScript } from "@/components/schema-script";
import { libraryShelves } from "@/lib/site-data";
import { buildMetadata, buildWebPageSchema } from "@/lib/seo";
import Link from "next/link";

const pageTitle = "Writing";
const pageDescription =
  "Read articles, notes, reading lists, and recommendations from Bhawani Khanal.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/writing",
});

export default function WritingPage() {
  return (
    <main>
      <SchemaScript
        schema={buildWebPageSchema({
          title: pageTitle,
          description: pageDescription,
          path: "/writing",
        })}
      />
      <PageHero
        eyebrow="Writing"
        title="Articles, notes, reading, and recommendations."
        description="A space for longer essays, short observations, and curated material that shapes the work."
      />

      <Section
        eyebrow="Highlights"
        title="Writing that can grow into an archive."
        description="The goal is consistent publishing without forcing every thought into a formal article."
      >
        <div className="card-surface p-8 lg:p-10">
          <p className="max-w-2xl copy-muted">
            Visit the blog for essays and observations, or browse the reading shelves below for the ideas
            currently shaping the work.
          </p>
          <Link href="/blogs" className="mt-6 inline-flex text-sm font-medium text-bronze transition hover:text-ink">
            Visit the blogs <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="Reading"
        title="A library that shows current influences and future recommendations."
        description="Books are only one part of the input stream. Essays, newsletters, podcasts, reports, and videos belong here too."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {libraryShelves.map((shelf) => (
            <article key={shelf.title} className="rounded-[2rem] border border-ink/10 bg-white/40 p-8">
              <h3 className="font-display text-3xl">{shelf.title}</h3>
              <p className="mt-4 text-sm leading-7 text-ink/65">{shelf.description}</p>
              <div className="mt-6 space-y-3">
                {shelf.items.map((item) => (
                  <p key={item} className="text-sm text-ink">
                    {item}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
