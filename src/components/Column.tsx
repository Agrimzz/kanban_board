import React from "react"
import { ColumnProps } from "../types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const Column = (props: ColumnProps) => {
  const { column, deleteColumn } = props

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div className="bg-background rounded-md  min-h-[500px] flex flex-col  border-[1px] border-red-400"></div>
    )
  }

  return (
    <div
      className="bg-background rounded-md  min-h-[500px] flex flex-col"
      ref={setNodeRef}
      style={style}
    >
      <div
        className="bg-primary p-4 flex justify-between items-center"
        {...attributes}
        {...listeners}
      >
        <h2 className="text-background font-semibold">{column.title}</h2>
        <button
          className="bg-red-400 text-white p-2"
          onClick={() => deleteColumn(column.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Column
