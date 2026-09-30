import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { logica } from "@neup/logica";
import { SchemaScript } from "@/components/schema-script";
import { buildArticleSchema, buildMetadata, buildWebPageSchema } from "@/lib/seo";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

async function getArticle(slug: string) {
  const projectId = process.env.NEUP_SITES_PROJECT_ID;

  if (!projectId) return null;

  const response = await logica.articles(projectId).article(slug).get();
  return response.body?.success ? response.body.data ?? null : null;
}

function renderArticleContent(content: string): ReactNode {
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return (
      <div
        className="[&_p]:mb-6 [&_p:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return content
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph, index) => (
      <p key={index} className="mb-6 last:mb-0">
        {paragraph.split(/\r?\n/).map((line, lineIndex) => (
          <span key={lineIndex}>
            {line}
            {lineIndex < paragraph.split(/\r?\n/).length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    ));
}

function formatPublishedDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const dateLabel = `${months[date.getMonth()]} ${date.getDate()}`;

  return date.getFullYear() === new Date().getFullYear() ? dateLabel : `${dateLabel}, ${date.getFullYear()}`;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return buildMetadata({
      title: "Blog post not found",
      description: "The requested blog post could not be found.",
      path: `/blogs/${slug}`,
    });
  }

  return buildMetadata({
    title: article.title,
    description: article.metaDescription ?? "A blog post from Bhawani Khanal.",
    path: `/blogs/${article.slug}`,
    type: "article",
    images: article.coverImageUrl
      ? [{ url: article.coverImageUrl, alt: article.title }]
      : undefined,
  });
}

export default async function BlogArticlePage({ params }: BlogPageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const description = article.metaDescription ?? "A blog post from Bhawani Khanal.";

  return (
    <main>
      <SchemaScript
        schema={[
          buildWebPageSchema({ title: article.title, description, path: `/blogs/${article.slug}` }),
          buildArticleSchema({
            title: article.title,
            description,
            path: `/blogs/${article.slug}`,
            image: article.coverImageUrl ?? "/assets/uploads/starting-my-cookies-jar-aigenerate-animestyle.png",
            datePublished: article.writtenAt ?? new Date().toISOString(),
          }),
        ]}
      />

      <section className="grain overflow-hidden bg-[linear-gradient(180deg,#e7dfd2_0%,#f1ebdf_55%,#f5f1e8_100%)] text-ink">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="max-w-3xl space-y-5">
            <p className="eyebrow">Blog post</p>
            <h1 className="font-display text-5xl leading-[0.95] sm:text-6xl">{article.title}</h1>
            <p className="max-w-2xl text-base leading-7 text-ink/70">{description}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-bronze">
              {article.writtenAt ? (
                <time dateTime={article.writtenAt}>{formatPublishedDate(article.writtenAt)}</time>
              ) : null}
              {article.writtenAt ? <span aria-hidden="true">•</span> : null}
              <span>{article.writtenBy || "Bhawani Khanal"}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-20">
          {article.coverImageUrl ? (
            <div className="-mx-4 mb-10 sm:-mx-8 lg:-mx-16">
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="aspect-[16/8] w-full rounded-[2rem] object-cover"
              />
            </div>
          ) : null}
          <article className="prose prose-stone max-w-none text-base leading-8 [&_p]:mb-6 [&_p:last-child]:mb-0">
            {renderArticleContent(article.content)}
          </article>
          <Link href="/blogs" className="mt-12 inline-flex text-sm font-medium text-bronze transition hover:text-ink">
            <span aria-hidden="true" className="mr-2">←</span> Back to blogs
          </Link>
        </div>
      </section>
    </main>
  );
}
