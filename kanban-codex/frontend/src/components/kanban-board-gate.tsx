"use client";

import dynamic from "next/dynamic";

const KanbanBoard = dynamic(
  () => import("./kanban-board").then((module) => module.KanbanBoard),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, rgb(236 173 10 / 0.22), transparent 34%), radial-gradient(circle at top right, rgb(32 157 215 / 0.16), transparent 38%), linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%)",
        }}
      />
    ),
  },
);

export function KanbanBoardGate() {
  return <KanbanBoard />;
}
