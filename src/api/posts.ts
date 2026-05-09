const API_BASE_URL =
  "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev";

export type Post = {
  id: number;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
  categories: string[];
  content: string;
};

type PostsResponse = {
  message: string;
  posts: Post[];
};

type PostResponse = {
  message: string;
  post: Post;
};

export type ContactPayload = {
  name: string;
  email: string;
  content: string;
};

type ContactResponse = {
  message: string;
  data: ContactPayload;
};

const fetchApi = async <T>(path: string, errorMessage: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
};

export const fetchPosts = async (): Promise<Post[]> => {
  const data = await fetchApi<PostsResponse>(
    "/posts",
    "記事一覧の取得に失敗しました",
  );
  return data.posts;
};

export const fetchPostById = async (id: number): Promise<Post> => {
  const data = await fetchApi<PostResponse>(
    `/posts/${id}`,
    "記事詳細の取得に失敗しました",
  );
  return data.post;
};

export const sendContact = async (
  payload: ContactPayload,
): Promise<ContactResponse> => {
  const response = await fetch(`${API_BASE_URL}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("送信に失敗しました");
  }

  return response.json() as Promise<ContactResponse>;
};
