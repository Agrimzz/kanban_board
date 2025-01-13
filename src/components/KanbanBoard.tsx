import React, { useState } from "react"
import { Column } from "../types"
import Columns from "./Columns"
import { DndContext } from "@dnd-kit/core"

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([])

  function createNewColumn() {
    const newColumn: Column = {
      id: Date.now().toString(),
      title: `New Column ${columns.length + 1}`,
    }

    setColumns([...columns, newColumn])
  }

  function deleteColumn(id: string) {
    setColumns(columns.filter((column) => column.id !== id))
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
      <DndContext>
        <div className="mx-auto grid grid-cols-2 max-w-7xl px-4 py-4 gap-4 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.id}>
              <Columns column={column} deleteColumn={deleteColumn} />
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  )
}

export default KanbanBoard
