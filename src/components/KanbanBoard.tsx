import React, { useMemo, useState } from "react"
import { ColumnType } from "../types"
import Column from "./Column"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnType[]>([])
  const columnsId = useMemo(() => columns.map((column) => column.id), [columns])
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    })
  )

  function createNewColumn() {
    const newColumn: ColumnType = {
      id: Date.now().toString(),
      title: `New Column ${columns.length + 1}`,
    }

    setColumns([...columns, newColumn])
  }

  function deleteColumn(id: string) {
    setColumns(columns.filter((column) => column.id !== id))
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column)
      return
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) {
      return
    }

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (column) => column.id === activeId
      )
      const overColumnIndex = columns.findIndex(
        (column) => column.id === overId
      )

      return arrayMove(columns, activeColumnIndex, overColumnIndex)
    })
  }

  return (
    <div className="w-full min-h-screen ">
      <div className="w-full bg-background sticky top-0">
        <div className="max-w-7xl px-4 py-4 flex justify-between mx-auto">
          <h1 className="text-primary text-3xl font-bold">Kanban Board</h1>
          <button
            className="text-primary px-4 py-2 rounded-md border-[1px] border-primary ring-primary/80 hover:ring-2"
            onClick={createNewColumn}
          >
            Add Column
          </button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="mx-auto grid grid-cols-2 max-w-7xl px-4 py-4 gap-4 md:grid-cols-4">
          <SortableContext items={columnsId}>
            {columns.map((column) => (
              <div key={column.id}>
                <Column column={column} deleteColumn={deleteColumn} />
              </div>
            ))}
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Column column={activeColumn} deleteColumn={deleteColumn} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  )
}

export default KanbanBoard
