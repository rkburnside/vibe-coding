'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'

type CardType = {
  id: string
  title: string
  details: string
}

type ColumnType = {
  id: string
  name: string
  cards: CardType[]
}

type BoardType = ColumnType[]

const dummyData: BoardType = [
  {
    id: '1',
    name: 'To Do',
    cards: [
      { id: '1', title: 'Task 1', details: 'Details for task 1' },
      { id: '2', title: 'Task 2', details: 'Details for task 2' },
    ],
  },
  {
    id: '2',
    name: 'In Progress',
    cards: [
      { id: '3', title: 'Task 3', details: 'Details for task 3' },
    ],
  },
  {
    id: '3',
    name: 'Review',
    cards: [],
  },
  {
    id: '4',
    name: 'Done',
    cards: [
      { id: '4', title: 'Task 4', details: 'Details for task 4' },
    ],
  },
  {
    id: '5',
    name: 'Archive',
    cards: [],
  },
]

function DraggableCard({ card, columnId, onDelete, onEdit, isEditing, onSave, onCancel, editTitle, editDetails, onTitleChange, onDetailsChange }: { card: CardType, columnId: string, onDelete: () => void, onEdit: () => void, isEditing: boolean, onSave: () => void, onCancel: () => void, editTitle: string, editDetails: string, onTitleChange: (val: string) => void, onDetailsChange: (val: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style}>
        <Card>
          <CardContent className="p-4 space-y-2">
            <input
              value={editTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Card title"
              className="w-full px-2 py-1 border rounded text-sm"
              autoFocus
            />
            <textarea
              value={editDetails}
              onChange={(e) => onDetailsChange(e.target.value)}
              placeholder="Card details"
              className="w-full px-2 py-1 border rounded text-xs"
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={onSave}>Save</Button>
              <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card onClick={onEdit} className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">{card.title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">{card.details}</p>
        </CardContent>
      </Card>
    </div>
  )
}

function DroppableColumn({ column, children }: { column: ColumnType, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  return (
    <div ref={setNodeRef} className="flex flex-col w-64 bg-muted p-4 rounded-lg min-h-32">
      {children}
    </div>
  )
}

export default function Board() {
  const [board, setBoard] = useState<BoardType>(dummyData)
  const [editingColumn, setEditingColumn] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [newCardDetails, setNewCardDetails] = useState('')
  const [activeCard, setActiveCard] = useState<CardType | null>(null)
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [editingCardTitle, setEditingCardTitle] = useState('')
  const [editingCardDetails, setEditingCardDetails] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const startEditing = (columnId: string, currentName: string) => {
    setEditingColumn(columnId)
    setEditName(currentName)
  }

  const saveEditing = () => {
    if (editingColumn) {
      setBoard(board.map(col => col.id === editingColumn ? { ...col, name: editName } : col))
      setEditingColumn(null)
    }
  }

  const cancelEditing = () => {
    setEditingColumn(null)
  }

  const startAdding = (columnId: string) => {
    setAddingToColumn(columnId)
    setNewCardTitle('')
    setNewCardDetails('')
  }

  const saveAdding = () => {
    if (addingToColumn && newCardTitle.trim()) {
      const newCard: CardType = {
        id: Date.now().toString(),
        title: newCardTitle,
        details: newCardDetails,
      }
      setBoard(board.map(col => col.id === addingToColumn ? { ...col, cards: [...col.cards, newCard] } : col))
      setAddingToColumn(null)
    }
  }

  const cancelAdding = () => {
    setAddingToColumn(null)
  }

  const deleteCard = (columnId: string, cardId: string) => {
    setBoard(board.map(col => col.id === columnId ? { ...col, cards: col.cards.filter(card => card.id !== cardId) } : col))
  }

  const startEditingCard = (card: CardType) => {
    setEditingCardId(card.id)
    setEditingCardTitle(card.title)
    setEditingCardDetails(card.details)
  }

  const saveEditingCard = () => {
    if (editingCardId && editingCardTitle.trim()) {
      setBoard(board.map(col => ({
        ...col,
        cards: col.cards.map(card => card.id === editingCardId ? { ...card, title: editingCardTitle, details: editingCardDetails } : card)
      })))
      setEditingCardId(null)
    }
  }

  const cancelEditingCard = () => {
    setEditingCardId(null)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const cardId = active.id as string
    for (const column of board) {
      const card = column.cards.find(c => c.id === cardId)
      if (card) {
        setActiveCard(card)
        break
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)
    if (!over) return
    const cardId = active.id as string
    const overColumnId = over.id as string
    let card: CardType | undefined
    let fromColumnId: string | undefined
    for (const column of board) {
      const found = column.cards.find(c => c.id === cardId)
      if (found) {
        card = found
        fromColumnId = column.id
        break
      }
    }
    if (!card || !fromColumnId || fromColumnId === overColumnId) return
    setBoard(board.map(col => {
      if (col.id === fromColumnId) {
        return { ...col, cards: col.cards.filter(c => c.id !== cardId) }
      }
      if (col.id === overColumnId) {
        return { ...col, cards: [...col.cards, card] }
      }
      return col
    }))
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4 overflow-x-auto">
        {board.map((column) => (
          <DroppableColumn key={column.id} column={column}>
            {editingColumn === column.id ? (
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={saveEditing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEditing()
                  if (e.key === 'Escape') cancelEditing()
                }}
                className="text-lg font-semibold mb-4 bg-background border rounded px-2 py-1"
                autoFocus
              />
            ) : (
              <h2
                className="text-lg font-semibold mb-4 cursor-pointer"
                onClick={() => startEditing(column.id, column.name)}
              >
                {column.name}
              </h2>
            )}
            <div className="space-y-2">
              {column.cards.map((card) => (
                <DraggableCard
                  key={card.id}
                  card={card}
                  columnId={column.id}
                  onDelete={() => deleteCard(column.id, card.id)}
                  onEdit={() => startEditingCard(card)}
                  isEditing={editingCardId === card.id}
                  onSave={saveEditingCard}
                  onCancel={cancelEditingCard}
                  editTitle={editingCardTitle}
                  editDetails={editingCardDetails}
                  onTitleChange={setEditingCardTitle}
                  onDetailsChange={setEditingCardDetails}
                />
              ))}
            </div>
            {addingToColumn === column.id ? (
              <div className="mt-4 space-y-2">
                <input
                  placeholder="Card title"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
                <textarea
                  placeholder="Card details"
                  value={newCardDetails}
                  onChange={(e) => setNewCardDetails(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveAdding}>Add</Button>
                  <Button size="sm" variant="outline" onClick={cancelAdding}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button className="mt-4" size="sm" onClick={() => startAdding(column.id)}>Add Card</Button>
            )}
          </DroppableColumn>
        ))}
      </div>
      <DragOverlay>
        {activeCard ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{activeCard.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{activeCard.details}</p>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}