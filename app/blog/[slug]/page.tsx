import parseBlogPost from "@/lib/parseBlogPost";
import parseBlogSlug from "@/lib/parseBlogSlug";

interface BlogPostParams {
  params: {
    slug: string;
  };
}

export default function BlogPost({ params: { slug } }: BlogPostParams) {
  const post = parseBlogSlug(slug);
  return (
    <>
      {" "}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />{" "}
    </>
  );
}

export async function generateStaticParams() {
  const posts = parseBlogPost();
  return posts;
}

export const dynamicParams = false;
