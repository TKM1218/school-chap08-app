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

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const request = async <ResponseType, RequestType = undefined>(
  path: string,
  method: HttpMethod,
  body?: RequestType,
): Promise<ResponseType> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: method === "GET" ? "default" : "no-store",
  });

  if (!response.ok) {
    throw new Error("APIリクエストに失敗しました");
  }

  return response.json() as Promise<ResponseType>;
};

const api = {
  get: <ResponseType>(path: string) => {
    return request<ResponseType>(path, "GET");
  },

  post: <ResponseType, RequestType>(path: string, body: RequestType) => {
    return request<ResponseType, RequestType>(path, "POST", body);
  },

  put: <ResponseType, RequestType>(path: string, body: RequestType) => {
    return request<ResponseType, RequestType>(path, "PUT", body);
  },

  delete: <ResponseType>(path: string) => {
    return request<ResponseType>(path, "DELETE");
  },
};

export const fetchPosts = async (): Promise<Post[]> => {
  const data = await api.get<PostsResponse>("/posts");
  return data.posts;
};

export const fetchPostById = async (id: number): Promise<Post> => {
  const data = await api.get<PostResponse>(`/posts/${id}`);
  return data.post;
};

export const sendContact = async (
  payload: ContactPayload,
): Promise<ContactResponse> => {
  return api.post<ContactResponse, ContactPayload>("/contacts", payload);
};
