import type { Metadata } from "next";
import { logica } from "@neup/logica";
import type { SitesArticle } from "@neup/logica/articles";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import Link from "next/link";
import { SchemaScript } from "@/components/schema-script";
import {
  capabilities,
  currentSignals,
  featuredProjects,
  learningTracks,
  mediaChannels,
} from "@/lib/site-data";
import { buildMetadata, buildWebPageSchema } from "@/lib/seo";

const pageTitle = "Business, marketing, creativity, and continuous learning.";
const pageDescription =
  "I am a business and marketing professional based in Kathmandu, Nepal. This website is where I share my work, current projects, learning journey, writing, videos, podcast conversations, and the ideas I am exploring.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/",
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

export default async function HomePage() {
  const articles = await getArticles();

  return (
    <main>
      <SchemaScript
        schema={buildWebPageSchema({
          title: pageTitle,
          description: pageDescription,
          path: "/",
        })}
      />
      <PageHero
        eyebrow="Bhawani Khanal"
        title={pageTitle}
        description={pageDescription}
        primaryCta={{ href: "/work", label: "Explore My Work" }}
        secondaryCta={{ href: "/now", label: "See What I’m Doing Now" }}
      />

      <Section
        eyebrow="Currently"
        title="A living platform, not a static portfolio."
        description="The goal is to document active work, unfinished thoughts, and long-term growth with the same seriousness usually reserved for finished case studies."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {currentSignals.map((signal) => (
            <div key={signal.label} className="card-surface p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-bronze">{signal.label}</p>
              <p className="mt-4 text-lg leading-8 text-ink">{signal.value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Featured Work"
        title="Strategy, campaign thinking, and clearer business communication."
        description="Selected areas where business thinking and creative direction meet practical execution."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <article key={project.title} className="rounded-[2rem] border border-ink/10 bg-white/40 p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-bronze">{project.category}</p>
              <h3 className="mt-5 font-display text-3xl">{project.title}</h3>
              <p className="mt-4 text-sm leading-7 text-ink/65">{project.summary}</p>
              <p className="mt-8 text-sm text-ink">{project.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="What I Do"
        title="A business journal, personal magazine, and premium portfolio combined."
        description="The work spans positioning, campaigns, creative communication, and the systems that make brands easier to understand and trust."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {capabilities.map((item) => (
            <div key={item} className="flex items-center gap-4 rounded-full border border-stone/20 px-5 py-4">
              <span className="h-2.5 w-2.5 rounded-full bg-bronze" />
              <p className="text-sm text-ink sm:text-base">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Writing"
        title="Articles, notes, and ideas in progress."
        description="Some thoughts deserve an essay. Others are sharper when left as a note."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {articles.map((post, index) => (
            <article key={post.slug} className="card-surface flex min-h-[14rem] flex-col justify-between p-6 lg:p-7">
              {post.coverImageUrl ? (
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="mb-5 aspect-[16/8] w-full rounded-[1.25rem] object-cover"
                />
              ) : null}
              <div>
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.28em] text-bronze">
                  <span>{post.tags[0] ?? "Article"}</span>
                  <span>0{index + 1}</span>
                </div>
                <h3 className="mt-4 max-w-xl font-display text-3xl leading-tight">
                  <Link href={`/blogs/${post.slug}`} className="transition hover:text-bronze">
                    {post.title}
                  </Link>
                </h3>
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
        eyebrow="Learning"
        title="A visible learning system across business, marketing, communication, and creativity."
        description="The site should show what I am studying, why it matters, and how it changes the way I work."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {learningTracks.map((track) => (
            <article key={track.title} className="rounded-[2rem] border border-ink/10 bg-white/40 p-8">
              <h3 className="font-display text-3xl">{track.title}</h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {track.topics.map((topic) => (
                  <span key={topic} className="rounded-full border border-ink/10 px-4 py-2 text-sm text-ink/70">
                    {topic}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Media"
        title="Video, podcast, and newsletter as part of one identity."
        description="The website acts as the central home, while social platforms and media channels extend the conversation."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {mediaChannels.map((channel) => (
            <article key={channel.title} className="card-surface p-8">
              <h3 className="font-display text-3xl">{channel.title}</h3>
              <p className="mt-4 copy-muted">{channel.description}</p>
            </article>
          ))}
        </div>
      </Section>

    </main>
  );
}
