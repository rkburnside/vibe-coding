'use client'

import Board from "@/app/components/board-client";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Kanban Board</h1>
      <Board />
    </div>
  );
}
