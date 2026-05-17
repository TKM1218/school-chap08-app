import { type Post, type PostsResponse } from "@/src/app/_types/Post";
import {
  type ContactPayload,
  type ContactResponse,
} from "../app/_types/Contact";

const API_BASE_URL = "https://y8mog4131k.microcms.io/api/v1";
const CONTACT_API_BASE_URL =
  "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const request = async <ResponseType, RequestType = undefined>(
  path: string,
  method: HttpMethod,
  body?: RequestType,
): Promise<ResponseType> => {
  const isContactApi = path.startsWith("/contacts");
  const baseUrl = isContactApi ? CONTACT_API_BASE_URL : API_BASE_URL;

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(!isContactApi
        ? {
            "X-MICROCMS-API-KEY": process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string,
          }
        : {}),
    },
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
  return data.contents;
};

export const fetchPostById = async (id: string): Promise<Post> => {
  return api.get<Post>(`/posts/${id}`);
};

export const sendContact = async (
  payload: ContactPayload,
): Promise<ContactResponse> => {
  return api.post<ContactResponse, ContactPayload>("/contacts", payload);
};
