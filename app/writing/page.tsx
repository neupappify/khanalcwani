import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SchemaScript } from "@/components/schema-script";
import { logica } from "@neup/logica";
import type { SitesArticle } from "@neup/logica/articles";
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

async function getArticles(): Promise<SitesArticle[]> {
  const projectId = process.env.NEUP_SITES_PROJECT_ID;

  if (!projectId) return [];

  const response = await logica.articles(projectId).get();
  const articles = response.body?.success ? response.body.data ?? [] : [];

  return [...articles].sort(
    (first, second) => new Date(second.writtenAt ?? 0).getTime() - new Date(first.writtenAt ?? 0).getTime()
  );
}

export default async function WritingPage() {
  const articles = await getArticles();

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
        <div className="grid gap-6 lg:grid-cols-2">
          {articles.map((post, index) => (
            <article key={post.slug} className="card-surface flex min-h-[14rem] flex-col justify-between p-6 lg:p-7">
              <div>
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.28em] text-bronze">
                  <span>{post.tags[0] ?? "Article"}</span>
                  <span>0{index + 1}</span>
                </div>
                <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight">
                  <Link href={`/blogs/${post.slug}`} className="transition hover:text-bronze">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-ink/65">
                  {post.metaDescription ?? "Read the latest ideas, observations, and lessons from the work."}
                </p>
              </div>
              <Link href={`/blogs/${post.slug}`} className="mt-5 inline-flex text-sm font-medium text-bronze transition hover:text-ink">
                Read post <span aria-hidden="true" className="ml-2">→</span>
              </Link>
            </article>
          ))}
          {articles.length === 0 ? <p className="copy-muted">No articles are available yet.</p> : null}
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
