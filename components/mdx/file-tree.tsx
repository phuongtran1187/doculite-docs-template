import { File as FileIcon, Folder as FolderIcon } from "lucide-react";

interface FileTreeProps {
  children: React.ReactNode;
}

export function FileTree({ children }: FileTreeProps) {
  return (
    <div className="my-6 rounded-lg border p-4">
      <ul className="space-y-1 font-mono text-sm">{children}</ul>
    </div>
  );
}

interface FolderProps {
  name: string;
  children?: React.ReactNode;
}

export function Folder({ name, children }: FolderProps) {
  return (
    <li>
      <div className="flex items-center gap-2">
        <FolderIcon className="h-4 w-4 text-blue-500" />
        <span className="font-medium">{name}</span>
      </div>
      {children && <ul className="ml-4 mt-1 space-y-1 border-l pl-4">{children}</ul>}
    </li>
  );
}

interface FileProps {
  name: string;
}

export function File({ name }: FileProps) {
  return (
    <li className="flex items-center gap-2">
      <FileIcon className="h-4 w-4 text-muted-foreground" />
      <span>{name}</span>
    </li>
  );
}
