"use client";

import dynamic from "next/dynamic";

const KanbanBoard = dynamic(
  () => import("@/components/kanban-board").then((module) => module.KanbanBoard),
  { ssr: false },
);

export default function Home() {
  return <KanbanBoard />;
}
