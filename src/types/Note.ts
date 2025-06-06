
export interface Note {
  id: string;
  title: string;
  summary: string;
  transcript: string;
  createdAt: Date;
  folder: string;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
}
