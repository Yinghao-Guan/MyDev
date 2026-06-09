export type ProjectFile = {
  name: string;
  type: "readme" | "demo" | "code" | "markdown" | "pdf";
  language?: string;
  content?: string;
  url?: string;
};

export type Project = {
  id: string;
  name: string;
  github?: string;
  live?: string;
  devpost?: string;
  files: ProjectFile[];
};
