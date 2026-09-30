import type { Metadata } from "next";
import Link from "next/link";

import { logica } from "@neup/logica";
import type { SitesArticle, SitesArticleDetail } from "@neup/logica/articles";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SchemaScript } from "@/components/schema-script";
import { buildMetadata, buildWebPageSchema } from "@/lib/seo";

const pageTitle = "Blogs";
const pageDescription =
  "Essays, observations, and practical ideas on business, marketing, creativity, and building in public.";

async function getBlogs(): Promise<{ articles: SitesArticle[]; latest: SitesArticleDetail | null }> {
  const projectId = process.env.NEUP_SITES_PROJECT_ID;

  if (!projectId) {
    return { articles: [], latest: null };
  }

  const articlesResponse = await logica.articles(projectId).get();
  const articles = articlesResponse.body?.success ? articlesResponse.body.data ?? [] : [];
  const sortedArticles = [...articles].sort(
    (first, second) => new Date(second.writtenAt ?? 0).getTime() - new Date(first.writtenAt ?? 0).getTime()
  );
  const newestArticle = sortedArticles[0];

  if (!newestArticle) {
    return { articles: sortedArticles, latest: null };
  }

  const latestResponse = await logica.articles(projectId).article(newestArticle.slug).get();

  return {
    articles: sortedArticles,
    latest: latestResponse.body?.success ? latestResponse.body.data ?? null : null,
  };
}

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/blogs",
});

export default async function BlogsPage() {
  const { articles, latest } = await getBlogs();

  return (
    <main>
      <SchemaScript
        schema={buildWebPageSchema({
          title: pageTitle,
          description: pageDescription,
          path: "/blogs",
        })}
      />

      <PageHero
        eyebrow="Blogs"
        title="Ideas worth slowing down for."
        description="A growing collection of essays and observations about business, marketing, creativity, and the work of becoming better over time."
        secondaryCta={{ href: "/writing", label: "Explore writing" }}
      />

      <Section
        eyebrow="Latest posts"
        title="Notes from the work in progress."
        description="Some posts are polished essays. Others are simply useful questions, lessons, and ideas captured while they are still fresh."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {articles.map((post, index) => (
            <article key={post.slug} className="card-surface flex min-h-[18rem] flex-col justify-between p-8 lg:p-10">
              <div>
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.28em] text-bronze">
                  <span>{post.tags[0] ?? "Article"}</span>
                  <span>0{index + 1}</span>
                </div>
                <h2 className="mt-6 max-w-xl font-display text-4xl leading-tight">
                  <Link href={`/blogs/${post.slug}`} className="transition hover:text-bronze">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-5 max-w-xl leading-7 text-ink/65">
                  {post.metaDescription ?? "Read the latest ideas, observations, and lessons from the work."}
                </p>
              </div>

              <Link href={`/blogs/${post.slug}`} className="mt-8 inline-flex text-sm font-medium text-bronze transition hover:text-ink">
                Read post <span aria-hidden="true" className="ml-2">→</span>
              </Link>
            </article>
          ))}
          {articles.length === 0 ? (
            <p className="copy-muted">No articles are available yet.</p>
          ) : null}
        </div>
      </Section>

      {latest ? (
        <Section
          eyebrow="Latest post"
          title={latest.title}
          description={latest.metaDescription ?? "The newest article from the archive."}
        >
          <article className="card-surface p-8 lg:p-10">
            <div className="prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: latest.content }} />
          </article>
        </Section>
      ) : null}

      <Section
        eyebrow="A personal archive"
        title="Writing as a way to think clearly."
        description="The archive will grow slowly and intentionally—one useful idea, honest reflection, or practical observation at a time."
      >
        <div className="rounded-[2rem] border border-ink/10 bg-ink p-8 text-soft sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-12">
          <p className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
            Follow the ideas as they move from a rough thought into something worth sharing.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex shrink-0 rounded-full bg-bronze px-6 py-3 text-sm font-medium text-soft transition hover:bg-soft hover:text-ink lg:mt-0"
          >
            Get in touch
          </Link>
        </div>
      </Section>
    </main>
  );
}
