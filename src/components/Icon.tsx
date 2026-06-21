import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Import,
  Library,
  Lock,
  Moon,
  Paintbrush,
  Plane,
  Plus,
  Printer,
  Search,
  Sparkles,
  Sun,
  Trash2,
  Upload,
  Monitor
} from "lucide-react";

type IconName =
  | "arrow-left"
  | "download"
  | "external"
  | "file"
  | "github"
  | "import"
  | "library"
  | "lock"
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
  download: Download,
  external: ExternalLink,
  file: FileText,
  github: BookOpen,
  import: Import,
  library: Library,
  lock: Lock,
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
