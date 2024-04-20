import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const POST_LOCATION = "posts/";

export default function parseBlogSlug(slug: string) {
  const fullPath = POST_LOCATION + slug + ".md";
  const fileContents = readFileSync(fullPath, "utf8");

  const mdMatter = matter(fileContents);
  const mdProcessed = remark()
    .use(html)
    .processSync(mdMatter.content.toString());
  return {
    slug: slug,
    content: mdProcessed.toString(),
    ...mdMatter.data,
  };
}
