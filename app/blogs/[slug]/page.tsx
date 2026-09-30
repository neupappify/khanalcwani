import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { logica } from "@neup/logica";
import { PageHero } from "@/components/page-hero";
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

      <PageHero eyebrow="Blog post" title={article.title} description={description} />

      <section className="site-section">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-bronze">
            {article.tags.map((tag) => <span key={tag}>{tag}</span>)}
            {article.writtenAt ? <time dateTime={article.writtenAt}>{new Date(article.writtenAt).toLocaleDateString()}</time> : null}
          </div>
          <article
            className="prose prose-stone max-w-none text-base leading-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          <Link href="/blogs" className="mt-12 inline-flex text-sm font-medium text-bronze transition hover:text-ink">
            <span aria-hidden="true" className="mr-2">←</span> Back to blogs
          </Link>
        </div>
      </section>
    </main>
  );
}
