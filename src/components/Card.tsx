import PostDate from "./Date";
import type { BlogFrontmatter } from "@content/_schemas";

export interface Props {
  href?: string;
  frontmatter: BlogFrontmatter;
}

export default function Card({ href, frontmatter }: Props) {
  const { title, pubDatetime, description, isApiumArticle, externalUrl } =
    frontmatter;
  return (
    <li className="my-10 bg-main-accent p-8 border-l-8 border-main-accent/50 rounded">
      <a
        href={isApiumArticle ? externalUrl : href}
        className="inline-block underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        <h2 className="text-2xl font-medium text-main-accentLight decoration-wavy underline-offset-4 hover:underline dark:text-main-accent">
          {title}
        </h2>
      </a>

      <div className="pt-1 space-y-2">
        <PostDate datetime={pubDatetime} />
        {isApiumArticle ? (
          <div className="mt-2 inline-block bg-main-base rounded-full py-1 px-2 text-xs text-main-base/70 -ml-2">
            This is an article posted on my former employer's (Apiumhub) blog.
          </div>
        ) : (
          <></>
        )}
      </div>

      <p className="mt-5 text-sm">{description}</p>
    </li>
  );
}
