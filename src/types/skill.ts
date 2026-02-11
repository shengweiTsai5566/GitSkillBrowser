export interface Skill {
  id: string;
  name: string;
  description: string;
  descriptionZH?: string | null;
  repoUrl: string;
  category: string;
  tags: string[];
  downloadCount: number;
  owner: {
    name: string | null;
    image: string | null;
  };
  _count?: {
    versions: number;
  };
  createdAt: string;
  updatedAt: string;
}