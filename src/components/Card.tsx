import PostDate from "./Date";
import type { BlogFrontmatter } from "@content/_schemas";

export interface Props {
  href?: string;
  frontmatter: BlogFrontmatter;
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, description, isApiumArticle, externalUrl } =
    frontmatter;
  return (
    <li className="my-10">
      <a
        href={isApiumArticle ? externalUrl : href}
        className="inline-block text-lg font-medium underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        <h2 className="text-2xl font-medium text-main-accent hover:text-main-accent-light">
          {title}
        </h2>
      </a>

      <div class="flex items-center space-x-4">
        <PostDate datetime={pubDatetime} />
        {isApiumArticle ? (
          <div className="my-1 inline-flex items-center space-x-2 border-l-4 border-main-accent-dark py-1 px-2 text-xs text-main-accent opacity-50">
            This is an article posted on my employer's (Apiumhub) blog.
          </div>
        ) : (
          <></>
        )}
      </div>

      <p className="mt-2">{description}</p>
    </li>
  );
}
