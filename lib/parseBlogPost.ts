import { readdirSync } from "fs";

const POST_LOCATION = "posts/";

export default function parseBlogPost() {
  const mdNames = readdirSync(POST_LOCATION);
  const mdData = mdNames.map((fileName) => {
    const slug = fileName.replace(".md", "");
    return {
      slug: slug,
    };
  });
  return mdData;
}
