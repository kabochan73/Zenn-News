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

export type Bookmark = {
  articleId: number;
  path: string;
  title: string;
  authorName: string;
  authorAvatarUrl: string | null;
  publishedAt: string;
  bookmarkedAt: string;
};
