export type Post = {
  id: string;
  createdAt: string;
  title: string;
  content: string;
  thumbnailUrl: { url: string; height: number; width: number };
  categories: { id: string; name: string }[];
};

export type PostsResponse = {
  contents: Post[];
  totalCount: number;
  offset: number;
  limit: number;
};
