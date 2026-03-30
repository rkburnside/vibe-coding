"use client";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import {
  useId,
  useState,
  useTransition,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import {
  addCard,
  createInitialBoard,
  deleteCard,
  findCard,
  moveCard,
  renameColumn,
  type BoardState,
  type CardData,
  type ColumnData,
  type DropTarget,
} from "@/lib/board";

import styles from "./kanban-board.module.css";

type CardComposerState = {
  isOpen: boolean;
  title: string;
  details: string;
};

type ComposerMap = Record<string, CardComposerState>;

type ColumnMeta = {
  accent: string;
  hint: string;
  badge: string;
};

const columnMeta: Record<string, ColumnMeta> = {
  brief: {
    accent: "var(--accent-yellow)",
    hint: "Capture the ask, the stakes, and the clearest version of the goal.",
    badge: "01",
  },
  shape: {
    accent: "var(--blue-primary)",
    hint: "Define the flow, scope, and structure before anything gets built.",
    badge: "02",
  },
  build: {
    accent: "var(--purple-secondary)",
    hint: "Turn the plan into a polished interaction with crisp implementation.",
    badge: "03",
  },
  review: {
    accent: "var(--dark-navy)",
    hint: "Pressure test every state so the board feels steady and intentional.",
    badge: "04",
  },
  launch: {
    accent: "linear-gradient(135deg, var(--accent-yellow), var(--blue-primary))",
    hint: "Package the handoff, confirm the polish, and get it ready to ship.",
    badge: "05",
  },
};

export function KanbanBoard() {
  const [board, setBoard] = useState<BoardState>(() => createInitialBoard());
  const [composerState, setComposerState] = useState<ComposerMap>(() =>
    createComposerState(),
  );
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const boardDescriptionId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const totalCards = board.columns.reduce(
    (total, column) => total + column.cards.length,
    0,
  );
  const activeCard = activeCardId ? findCard(board, activeCardId) : null;

  function commitBoard(update: (current: BoardState) => BoardState) {
    startTransition(() => {
      setBoard((current) => update(current));
    });
  }

  function handleColumnBlur(column: ColumnData, nextTitle: string) {
    if (!nextTitle.trim()) {
      return;
    }

    commitBoard((current) => renameColumn(current, column.id, nextTitle));
  }

  function handleColumnKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
    }
  }

  function openComposer(columnId: string) {
    setComposerState((current) => ({
      ...current,
      [columnId]: {
        ...current[columnId],
        isOpen: true,
      },
    }));
  }

  function closeComposer(columnId: string) {
    setComposerState((current) => ({
      ...current,
      [columnId]: createEmptyComposer(),
    }));
  }

  function updateComposer(
    columnId: string,
    field: keyof Pick<CardComposerState, "title" | "details">,
    value: string,
  ) {
    setComposerState((current) => ({
      ...current,
      [columnId]: {
        ...current[columnId],
        isOpen: true,
        [field]: value,
      },
    }));
  }

  function handleAddCard(event: FormEvent<HTMLFormElement>, columnId: string) {
    event.preventDefault();

    const draft = composerState[columnId];

    if (!draft.title.trim() || !draft.details.trim()) {
      return;
    }

    commitBoard((current) =>
      addCard(current, columnId, {
        title: draft.title,
        details: draft.details,
      }),
    );

    closeComposer(columnId);
  }

  function handleDelete(cardId: string) {
    commitBoard((current) => deleteCard(current, cardId));
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveCardId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCardId(null);

    if (!event.over) {
      return;
    }

    const activeId = String(event.active.id);
    const overData = event.over.data.current as
      | { type?: "card" | "column"; cardId?: string; columnId?: string }
      | undefined;

    let target: DropTarget | null = null;

    if (overData?.type === "column" && overData.columnId) {
      target = { type: "column", columnId: overData.columnId };
    } else if (overData?.type === "card" && overData.cardId) {
      target = { type: "card", cardId: overData.cardId };
    }

    if (!target) {
      return;
    }

    commitBoard((current) => moveCard(current, activeId, target));
  }

  return (
    <div className={styles.shell}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Single Board MVP</p>
            <h1>Kanban that stays simple and still feels premium.</h1>
            <p className={styles.heroText}>
              Rename the five lanes, move cards with smooth drag-and-drop,
              and keep planning crisp with title-and-details cards only.
            </p>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.statCard}>
              <span>{board.columns.length}</span>
              <p>fixed columns</p>
            </div>
            <div className={styles.statCard}>
              <span>{totalCards}</span>
              <p>seeded cards</p>
            </div>
            <div className={styles.statCard}>
              <span>{isPending ? "Live" : "Ready"}</span>
              <p>client-rendered flow</p>
            </div>
          </div>
        </header>

        <DndContext
          collisionDetection={closestCorners}
          modifiers={[restrictToWindowEdges]}
          onDragCancel={() => setActiveCardId(null)}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          sensors={sensors}
        >
          <section
            aria-describedby={boardDescriptionId}
            className={styles.boardSurface}
          >
            <div className={styles.surfaceHeader}>
              <div>
                <p className={styles.surfaceLabel}>Board</p>
                <h2>Studio Delivery Lane</h2>
              </div>
              <p className={styles.surfaceStatus}>
                {isPending
                  ? "Applying the latest board update."
                  : "All changes stay local to this session."}
              </p>
            </div>

            <p className={styles.srOnly} id={boardDescriptionId}>
              A single Kanban board with five renameable columns, seeded cards,
              drag-and-drop movement, and add or delete controls on each card.
            </p>

            <div className={styles.columns} data-testid="board-columns">
              {board.columns.map((column, index) => (
                <BoardColumn
                  column={column}
                  composer={composerState[column.id]}
                  key={column.id}
                  onAddCard={handleAddCard}
                  onCloseComposer={closeComposer}
                  onColumnBlur={handleColumnBlur}
                  onColumnKeyDown={handleColumnKeyDown}
                  onDeleteCard={handleDelete}
                  onOpenComposer={openComposer}
                  onUpdateComposer={updateComposer}
                  style={
                    {
                      "--stagger-index": index,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </section>

          <DragOverlay>
            {activeCard ? (
              <CardPreview
                accent={resolveAccent(activeCardId, board)}
                card={activeCard}
                overlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}

type BoardColumnProps = {
  column: ColumnData;
  composer: CardComposerState;
  onAddCard: (event: FormEvent<HTMLFormElement>, columnId: string) => void;
  onCloseComposer: (columnId: string) => void;
  onColumnBlur: (column: ColumnData, nextTitle: string) => void;
  onColumnKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onDeleteCard: (cardId: string) => void;
  onOpenComposer: (columnId: string) => void;
  onUpdateComposer: (
    columnId: string,
    field: keyof Pick<CardComposerState, "title" | "details">,
    value: string,
  ) => void;
  style?: CSSProperties;
};

function BoardColumn({
  column,
  composer,
  onAddCard,
  onCloseComposer,
  onColumnBlur,
  onColumnKeyDown,
  onDeleteCard,
  onOpenComposer,
  onUpdateComposer,
  style,
}: BoardColumnProps) {
  const meta = columnMeta[column.id];
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  return (
    <section
      aria-label={`${column.title} column`}
      className={clsx(styles.column, isOver && styles.columnOver)}
      data-testid={`column-${column.id}`}
      role="region"
      style={style}
    >
      <div className={styles.columnAccent} style={{ background: meta.accent }} />

      <header className={styles.columnHeader}>
        <div>
          <p className={styles.columnBadge}>{meta.badge}</p>
          <input
            aria-label="Column name"
            className={styles.columnTitle}
            defaultValue={column.title}
            onBlur={(event) => {
              const nextTitle = event.currentTarget.value.trim();

              if (!nextTitle) {
                event.currentTarget.value = column.title;
                return;
              }

              onColumnBlur(column, nextTitle);
            }}
            onKeyDown={onColumnKeyDown}
          />
        </div>
        <span className={styles.columnCount}>{column.cards.length}</span>
      </header>

      <p className={styles.columnHint}>{meta.hint}</p>

      <div
        className={clsx(styles.cardList, isOver && styles.cardListActive)}
        data-testid={`column-dropzone-${column.id}`}
        ref={setNodeRef}
      >
        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <BoardCard
              accent={meta.accent}
              card={card}
              columnId={column.id}
              key={card.id}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>

        {column.cards.length === 0 ? (
          <div className={styles.emptyState}>
            Drop a card here or add a fresh one below.
          </div>
        ) : null}
      </div>

      {composer.isOpen ? (
        <form
          className={styles.composer}
          data-testid={`composer-${column.id}`}
          onSubmit={(event) => onAddCard(event, column.id)}
        >
          <label className={styles.field}>
            <span>Card title</span>
            <input
              aria-label="Card title"
              onChange={(event) =>
                onUpdateComposer(column.id, "title", event.currentTarget.value)
              }
              placeholder="Name the work clearly"
              required
              value={composer.title}
            />
          </label>

          <label className={styles.field}>
            <span>Card details</span>
            <textarea
              aria-label="Card details"
              onChange={(event) =>
                onUpdateComposer(column.id, "details", event.currentTarget.value)
              }
              placeholder="Add the short note or handoff details"
              required
              rows={3}
              value={composer.details}
            />
          </label>

          <div className={styles.composerActions}>
            <button className={styles.primaryButton} type="submit">
              Add card
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => onCloseComposer(column.id)}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          className={styles.addButton}
          onClick={() => onOpenComposer(column.id)}
          type="button"
        >
          New card
        </button>
      )}
    </section>
  );
}

type BoardCardProps = {
  accent: string;
  card: CardData;
  columnId: string;
  onDelete: (cardId: string) => void;
};

function BoardCard({ accent, card, columnId, onDelete }: BoardCardProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      cardId: card.id,
      columnId,
    },
  });

  return (
    <article
      className={clsx(styles.card, isDragging && styles.cardDragging)}
      data-testid={`card-${card.id}`}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className={styles.cardAccent} style={{ background: accent }} />

      <div className={styles.cardTop}>
        <div>
          <p className={styles.cardLabel}>Card</p>
          <h3>{card.title}</h3>
        </div>

        <div className={styles.cardActions}>
          <button
            aria-label={`Drag ${card.title}`}
            className={styles.dragHandle}
            ref={setActivatorNodeRef}
            type="button"
            {...attributes}
            {...listeners}
          >
            <span />
            <span />
          </button>

          <button
            aria-label={`Delete ${card.title}`}
            className={styles.deleteButton}
            onClick={() => onDelete(card.id)}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>

      <p className={styles.cardDetails}>{card.details}</p>
    </article>
  );
}

type CardPreviewProps = {
  accent: string;
  card: CardData;
  overlay?: boolean;
};

function CardPreview({ accent, card, overlay = false }: CardPreviewProps) {
  return (
    <article
      className={clsx(styles.card, overlay && styles.cardOverlay)}
      style={{ width: "min(20rem, calc(100vw - 2rem))" }}
    >
      <div className={styles.cardAccent} style={{ background: accent }} />
      <div className={styles.cardTop}>
        <div>
          <p className={styles.cardLabel}>Card</p>
          <h3>{card.title}</h3>
        </div>
      </div>
      <p className={styles.cardDetails}>{card.details}</p>
    </article>
  );
}

function createComposerState(): ComposerMap {
  const initialBoard = createInitialBoard();

  return Object.fromEntries(
    initialBoard.columns.map((column) => [column.id, createEmptyComposer()]),
  );
}

function createEmptyComposer(): CardComposerState {
  return {
    isOpen: false,
    title: "",
    details: "",
  };
}

function resolveAccent(activeCardId: string | null, board: BoardState): string {
  if (!activeCardId) {
    return "var(--accent-yellow)";
  }

  const column = board.columns.find((candidate) =>
    candidate.cards.some((card) => card.id === activeCardId),
  );

  if (!column) {
    return "var(--accent-yellow)";
  }

  return columnMeta[column.id]?.accent ?? "var(--accent-yellow)";
}
