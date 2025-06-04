export interface Document {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

export interface DocumentListProps {
  documents: Document[];
  loading: boolean;
} 