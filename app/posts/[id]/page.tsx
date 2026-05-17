"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchPostById } from "@/src/api/posts";
import { Post } from "@/src/app/_types/Post";
import Image from "next/image";

const formatDate = (iso: string) => {
  if (!iso) return "";

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
};

export default function PostShow() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let ignore = false;

    const loadPost = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await fetchPostById(id);

        if (!ignore) setPost(data);
      } catch (e) {
        if (!ignore) {
          const message =
            e instanceof Error ? e.message : "エラーが発生しました";
          setError(message);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    loadPost();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (isLoading) {
    return <p className="px-4 py-10">読み込み中...</p>;
  }
  if (error) {
    return <p className="px-4 py-10 text-red-600">{error}</p>;
  }
  if (!post) {
    return <p className="px-4 py-10 text-gray-800">記事が見つかりません</p>;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-gray-800">
      <article>
        <Image
          src={post.thumbnailUrl.url}
          alt={post.title}
          width={800}
          height={400}
          className="mb-4 w-full h-auto"
        />

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <time className="text-sm font-medium text-gray-500">
            {formatDate(post.createdAt)}
          </time>

          <div className="flex gap-2">
            {post.categories.map((category) => (
              <span
                key={category.id}
                className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>

        <h1 className="mb-6 font-bold text-black md:text-3xl">
          <span dangerouslySetInnerHTML={{ __html: post.title }} />
        </h1>

        <div
          className="leading-relaxed text-gray-600"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
