import type { ColorTag } from "@/hooks/use-2fa";

export const colorTagMap: Record<ColorTag, { border: string; bg: string; text: string; badge: string }> = {
  default: {
    border: "border-slate-200 dark:border-slate-800",
    bg: "bg-slate-50 dark:bg-slate-950",
    text: "text-slate-900 dark:text-slate-100",
    badge: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  },
  blue: {
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  },
  green: {
    border: "border-green-200 dark:border-green-800",
    bg: "bg-green-50/50 dark:bg-green-950/20",
    text: "text-green-700 dark:text-green-400",
    badge: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  },
  indigo: {
    border: "border-indigo-200 dark:border-indigo-800",
    bg: "bg-indigo-50/50 dark:bg-indigo-950/20",
    text: "text-indigo-700 dark:text-indigo-400",
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
  },
  rose: {
    border: "border-rose-200 dark:border-rose-800",
    bg: "bg-rose-50/50 dark:bg-rose-950/20",
    text: "text-rose-700 dark:text-rose-400",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
  },
  orange: {
    border: "border-orange-200 dark:border-orange-800",
    bg: "bg-orange-50/50 dark:bg-orange-950/20",
    text: "text-orange-700 dark:text-orange-400",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
  },
};
