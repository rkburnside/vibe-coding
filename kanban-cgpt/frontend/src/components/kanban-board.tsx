"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import {
  addCard,
  BoardState,
  Card,
  deleteCard,
  initialBoardState,
  moveCard,
  renameColumn,
} from "@/lib/board-state";

type DraftCard = {
  title: string;
  details: string;
};

const createCardId = () =>
  `card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function CardView({
  card,
  dragging = false,
  listeners,
  attributes,
}: {
  card: Card;
  dragging?: boolean;
  listeners?: ReturnType<typeof useSortable>["listeners"];
  attributes?: ReturnType<typeof useSortable>["attributes"];
}) {
  return (
    <article
      className={`rounded-[28px] border px-4 py-4 shadow-[0_18px_40px_rgba(3,33,71,0.14)] transition ${
        dragging
          ? "border-[var(--accent-yellow)] bg-white/95 shadow-[0_28px_60px_rgba(3,33,71,0.24)]"
          : "border-white/70 bg-white/90"
      }`}
    >
      <button
        type="button"
        className="w-full cursor-grab text-left active:cursor-grabbing"
        aria-label={`Drag ${card.title}`}
        {...attributes}
        {...listeners}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold tracking-[-0.02em] text-[var(--dark-navy)]">
            {card.title}
          </h3>
          <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[var(--accent-yellow)]" />
        </div>
        <p className="text-sm leading-6 text-[var(--gray-text)]">{card.details}</p>
      </button>
    </article>
  );
}

function SortableCard({
  card,
  onDelete,
}: {
  card: Card;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: card.id,
      data: {
        type: "card",
        cardId: card.id,
      },
    });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="group relative"
      data-card-id={card.id}
    >
      <CardView
        card={card}
        dragging={isDragging}
        listeners={listeners}
        attributes={attributes}
      />
      <button
        type="button"
        onClick={onDelete}
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(117,57,145,0.12)] bg-white text-[var(--purple-secondary)] opacity-0 shadow-sm transition group-hover:opacity-100 focus-visible:opacity-100"
        aria-label={`Delete ${card.title}`}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function ColumnDropZone({ columnId }: { columnId: string }) {
  const { setNodeRef } = useDroppable({
    id: columnId,
    data: {
      type: "column",
      columnId,
    },
  });

  return <div ref={setNodeRef} className="min-h-6 rounded-2xl" />;
}

function Column({
  column,
  onRename,
  onAddCard,
  onDeleteCard,
}: {
  column: BoardState["columns"][number];
  onRename: (columnId: string, name: string) => void;
  onAddCard: (columnId: string, draft: DraftCard) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
}) {
  const [draft, setDraft] = useState<DraftCard>({ title: "", details: "" });

  const submitCard = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.title.trim() || !draft.details.trim()) {
      return;
    }

    onAddCard(column.id, draft);
    setDraft({ title: "", details: "" });
  };

  return (
    <section
      className="flex min-h-[38rem] flex-col rounded-[32px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(241,247,255,0.9))] p-5 shadow-[0_24px_60px_rgba(3,33,71,0.10)] backdrop-blur"
      aria-labelledby={`${column.id}-title`}
      data-column-id={column.id}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="space-y-2">
          <label
            htmlFor={`${column.id}-name`}
            className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--blue-primary)]"
          >
            Column
          </label>
          <input
            id={`${column.id}-name`}
            aria-label={`Rename ${column.name}`}
            value={column.name}
            onChange={(event) => onRename(column.id, event.target.value)}
            className="w-full border-none bg-transparent p-0 text-2xl font-semibold tracking-[-0.04em] text-[var(--dark-navy)] outline-none"
          />
        </div>
        <div className="rounded-full border border-[rgba(32,157,215,0.15)] bg-white px-3 py-1 text-sm font-medium text-[var(--blue-primary)]">
          {column.cards.length} cards
        </div>
      </div>

      <SortableContext
        items={column.cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-1 flex-col gap-4">
          {column.cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              onDelete={() => onDeleteCard(column.id, card.id)}
            />
          ))}
          <ColumnDropZone columnId={column.id} />
        </div>
      </SortableContext>

      <form onSubmit={submitCard} className="mt-5 space-y-3 rounded-[28px] bg-[#f7fbff] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--dark-navy)]">
          <Plus size={16} className="text-[var(--purple-secondary)]" />
          Add Card
        </div>
        <input
          value={draft.title}
          onChange={(event) =>
            setDraft((current) => ({ ...current, title: event.target.value }))
          }
          placeholder="Card title"
          aria-label={`New card title for ${column.name}`}
          className="w-full rounded-2xl border border-[rgba(32,157,215,0.18)] bg-white px-4 py-3 text-sm text-[var(--dark-navy)] outline-none transition focus:border-[var(--blue-primary)]"
        />
        <textarea
          value={draft.details}
          onChange={(event) =>
            setDraft((current) => ({ ...current, details: event.target.value }))
          }
          placeholder="Card details"
          aria-label={`New card details for ${column.name}`}
          rows={3}
          className="w-full resize-none rounded-2xl border border-[rgba(32,157,215,0.18)] bg-white px-4 py-3 text-sm text-[var(--dark-navy)] outline-none transition focus:border-[var(--blue-primary)]"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-[var(--purple-secondary)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Create card
        </button>
      </form>
    </section>
  );
}

export function KanbanBoard() {
  const [board, setBoard] = useState<BoardState>(() => initialBoardState());
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const cardsById = useMemo(
    () =>
      Object.fromEntries(
        board.columns.flatMap((column) =>
          column.cards.map((card) => [card.id, card] as const),
        ),
      ),
    [board.columns],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    const overType = event.over?.data.current?.type;
    const overColumnId =
      overType === "column"
        ? String(event.over?.data.current?.columnId)
        : null;

    setActiveCardId(null);

    if (!overId) {
      return;
    }

    if (event.over && event.active.id === event.over.id) {
      return;
    }

    if (overType === "card") {
      const sourceColumn = board.columns.find((column) =>
        column.cards.some((card) => card.id === activeId),
      );
      const targetColumn = board.columns.find((column) =>
        column.cards.some((card) => card.id === overId),
      );

      if (
        sourceColumn &&
        targetColumn &&
        sourceColumn.id === targetColumn.id
      ) {
        const oldIndex = sourceColumn.cards.findIndex((card) => card.id === activeId);
        const newIndex = sourceColumn.cards.findIndex((card) => card.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          setBoard((current) => ({
            columns: current.columns.map((column) =>
              column.id === sourceColumn.id
                ? { ...column, cards: arrayMove(column.cards, oldIndex, newIndex) }
                : column,
            ),
          }));
          return;
        }
      }
    }

    setBoard((current) => moveCard(current, activeId, overType === "card" ? overId : null, overColumnId));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => setActiveCardId(String(event.active.id))}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveCardId(null)}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="relative overflow-hidden rounded-[36px] border border-white/50 bg-[radial-gradient(circle_at_top_left,rgba(236,173,10,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(117,57,145,0.20),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(232,243,255,0.92))] px-6 py-8 shadow-[0_28px_80px_rgba(3,33,71,0.16)] sm:px-8 lg:px-10">
          <div className="absolute inset-y-4 right-4 hidden w-32 rounded-full border border-white/60 bg-[linear-gradient(180deg,rgba(32,157,215,0.18),rgba(117,57,145,0.12))] blur-3xl sm:block" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--blue-primary)]">
                Single-board Kanban
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-[var(--dark-navy)] sm:text-5xl">
                Elegant project flow with just the essentials.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--gray-text)] sm:text-lg">
                Rename any lane, drag work across the board, and keep the whole
                plan visible without extra ceremony.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
              <div className="rounded-[26px] border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gray-text)]">
                  Columns
                </div>
                <div className="mt-2 text-2xl font-semibold text-[var(--dark-navy)]">
                  {board.columns.length}
                </div>
              </div>
              <div className="rounded-[26px] border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gray-text)]">
                  Active Cards
                </div>
                <div className="mt-2 text-2xl font-semibold text-[var(--dark-navy)]">
                  {board.columns.reduce((sum, column) => sum + column.cards.length, 0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-6 grid gap-5 xl:grid-cols-5">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onRename={(columnId, name) =>
                setBoard((current) => renameColumn(current, columnId, name))
              }
              onAddCard={(columnId, draft) =>
                setBoard((current) =>
                  addCard(current, columnId, {
                    id: createCardId(),
                    title: draft.title.trim(),
                    details: draft.details.trim(),
                  }),
                )
              }
              onDeleteCard={(columnId, cardId) =>
                setBoard((current) => deleteCard(current, columnId, cardId))
              }
            />
          ))}
        </main>
      </div>

      <DragOverlay>
        {activeCardId && cardsById[activeCardId] ? (
          <div className="w-[min(100vw-2rem,20rem)]">
            <CardView card={cardsById[activeCardId]} dragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
