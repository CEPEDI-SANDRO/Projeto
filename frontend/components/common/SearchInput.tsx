import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Pesquisar...",
}: SearchInputProps) {
  return (
    <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm sm:max-w-sm">
      <Search className="h-4 w-4 text-slate-400" />

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
    </div>
  );
}