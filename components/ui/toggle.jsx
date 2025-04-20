import { cn } from "@/lib/utils";

export function Toggle({ pressed, onPressedChange, children }) {
  return (
    <button
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md transition-colors",
        pressed ? "bg-zinc-700 text-white" : "bg-gray-200 text-black"
      )}
    >
      {children}
    </button>
  );
}
