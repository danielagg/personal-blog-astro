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
        className="inline-block text-lg font-medium text-skin-accent underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        <h2 className="text-2xl font-medium hover:underline">{title}</h2>
      </a>
      <PostDate datetime={pubDatetime} />
      <p className="mt-2">{description}</p>
      {isApiumArticle ? (
        <div className="flex items-center space-x-2 py-2 text-sm">
          This is an article posted on my employer's (
          <a
            href="https://apiumhub.com/"
            target="_blank"
            className="cursor-pointer text-skin-accent hover:underline"
          >
            Apiumhub
          </a>
          ) blog.
        </div>
      ) : (
        <></>
      )}
    </li>
  );
}
