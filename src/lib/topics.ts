export type TopicCategory =
  | "開発言語"
  | "フレームワーク・ライブラリ"
  | "インフラ・クラウド"
  | "データベース"
  | "AI"
  | "デザイン"
  | "その他";

export type Topic = {
  slug: string;
  name: string;
  category: TopicCategory;
};

export const TOPIC_CATEGORIES: TopicCategory[] = [
  "開発言語",
  "フレームワーク・ライブラリ",
  "インフラ・クラウド",
  "データベース",
  "AI",
  "デザイン",
  "その他",
];

export const TOPICS: Topic[] = [
  // 開発言語
  { slug: "typescript", name: "TypeScript", category: "開発言語" },
  { slug: "javascript", name: "JavaScript", category: "開発言語" },
  { slug: "html", name: "HTML", category: "開発言語" },
  { slug: "css", name: "CSS", category: "開発言語" },
  { slug: "php", name: "PHP", category: "開発言語" },
  { slug: "python", name: "Python", category: "開発言語" },
  { slug: "go", name: "Go", category: "開発言語" },
  { slug: "rust", name: "Rust", category: "開発言語" },
  { slug: "java", name: "Java", category: "開発言語" },
  { slug: "ruby", name: "Ruby", category: "開発言語" },

  // フレームワーク・ライブラリ
  { slug: "nodejs", name: "Node.js", category: "フレームワーク・ライブラリ" },
  { slug: "laravel", name: "Laravel", category: "フレームワーク・ライブラリ" },
  { slug: "nextjs", name: "Next.js", category: "フレームワーク・ライブラリ" },
  { slug: "react", name: "React", category: "フレームワーク・ライブラリ" },
  { slug: "vue", name: "Vue.js", category: "フレームワーク・ライブラリ" },
  { slug: "nuxt", name: "Nuxt.js", category: "フレームワーク・ライブラリ" },
  { slug: "nestjs", name: "NestJS", category: "フレームワーク・ライブラリ" },
  { slug: "rails", name: "Rails", category: "フレームワーク・ライブラリ" },

  // インフラ・クラウド
  { slug: "aws", name: "AWS", category: "インフラ・クラウド" },
  { slug: "gcp", name: "Google Cloud", category: "インフラ・クラウド" },
  { slug: "azure", name: "Azure", category: "インフラ・クラウド" },
  { slug: "docker", name: "Docker", category: "インフラ・クラウド" },
  { slug: "kubernetes", name: "Kubernetes", category: "インフラ・クラウド" },
  { slug: "terraform", name: "Terraform", category: "インフラ・クラウド" },
  { slug: "vercel", name: "Vercel", category: "インフラ・クラウド" },
  { slug: "cloudflare", name: "Cloudflare", category: "インフラ・クラウド" },
  { slug: "linux", name: "Linux", category: "インフラ・クラウド" },
  { slug: "network", name: "Network", category: "インフラ・クラウド" },

  // データベース
  { slug: "db", name: "DB", category: "データベース" },
  { slug: "sql", name: "SQL", category: "データベース" },

  // AI
  { slug: "claude", name: "Claude", category: "AI" },
  { slug: "chatgpt", name: "ChatGPT", category: "AI" },
  { slug: "gemini", name: "Gemini", category: "AI" },

  // デザイン
  { slug: "design", name: "デザイン", category: "デザイン" },
  { slug: "ui", name: "UI", category: "デザイン" },
  { slug: "ux", name: "UX", category: "デザイン" },

  // その他
  { slug: "security", name: "セキュリティ", category: "その他" },
  { slug: "git", name: "Git", category: "その他" },
  { slug: "test", name: "テスト", category: "その他" },
  { slug: "algorithm", name: "アルゴリズム", category: "その他" },
  { slug: "atcoder", name: "AtCoder", category: "その他" },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS.find((topic) => topic.slug === slug);
}

export function getTopicsByCategory(category: TopicCategory): Topic[] {
  return TOPICS.filter((topic) => topic.category === category);
}
