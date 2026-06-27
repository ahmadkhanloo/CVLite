import {
  ArrowLeft,
  BookOpen,
  Braces,
  Download,
  ExternalLink,
  FileCode2,
  FileJson,
  FileText,
  Globe2,
  Import,
  Library,
  Lock,
  Maximize,
  Minimize,
  Monitor,
  Moon,
  Paintbrush,
  Plane,
  Plus,
  Printer,
  Search,
  Sparkles,
  Sun,
  Trash2,
  Upload
} from "lucide-react";

type IconName =
  | "arrow-left"
  | "braces"
  | "download"
  | "external"
  | "file"
  | "file-code"
  | "file-json"
  | "github"
  | "import"
  | "library"
  | "lock"
  | "maximize"
  | "minimize"
  | "moon"
  | "paint"
  | "plane"
  | "plus"
  | "print"
  | "search"
  | "sparkles"
  | "sun"
  | "system"
  | "trash"
  | "upload"
  | "world";

const ICONS = {
  "arrow-left": ArrowLeft,
  braces: Braces,
  download: Download,
  external: ExternalLink,
  file: FileText,
  "file-code": FileCode2,
  "file-json": FileJson,
  github: BookOpen,
  import: Import,
  library: Library,
  lock: Lock,
  maximize: Maximize,
  minimize: Minimize,
  moon: Moon,
  paint: Paintbrush,
  plane: Plane,
  plus: Plus,
  print: Printer,
  search: Search,
  sparkles: Sparkles,
  sun: Sun,
  system: Monitor,
  trash: Trash2,
  upload: Upload,
  world: Globe2
};

export function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const LucideIcon = ICONS[name] || BookOpen;
  return (
    <LucideIcon className="app-icon" size={size} strokeWidth={1.8} aria-hidden="true" focusable="false" />
  );
}
