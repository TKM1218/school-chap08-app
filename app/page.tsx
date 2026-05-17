"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchPosts } from "@/src/api/posts";
import { type Post } from "@/src/app/_types/Post";
import Image from "next/image";

const formatDate = (iso: string) => {
  if (!iso) return "";

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
};

export default function PostIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let ignore = false;

    const loadPosts = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchPosts();
        if (!ignore) setPosts(data);
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

    loadPosts();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return <p className="px-4 py-10">読み込み中...</p>;
  }
  if (error) {
    return <p className="px-4 py-10 text-red-600">{error}</p>;
  }
  if (posts.length === 0) {
    return <p className="px-4 py-10 text-gray-800">記事が見つかりません</p>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-8 text-xl font-bold">記事一覧</h1>

        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`} className="block">
              <article className="flex flex-col gap-6 border-b border-gray-200 pb-8 last:border-b-0 md:flex-row">
                <div className="w-full shrink-0 md:w-[280px]">
                  <Image
                    src={post.thumbnailUrl.url}
                    alt=""
                    width={800}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
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

                  <h2 className="mb-2 text-lg font-bold text-black md:text-xl">
                    <span dangerouslySetInnerHTML={{ __html: post.title }} />
                  </h2>

                  <div
                    className="text-sm leading-relaxed text-gray-600"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
