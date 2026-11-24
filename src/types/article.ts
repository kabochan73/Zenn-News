export type Article = {
  id: number;
  title: string;
  path: string;
  publishedAt: string;
  author: {
    name: string;
    avatarUrl: string | null;
  };
};
