import React, { useState } from "react"
import { ColumnProps } from "../types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TaskCard from "./TaskCard"

const Column = (props: ColumnProps) => {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props
  const [isEditting, setIsEditting] = useState(false)
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
    disabled: isEditting,
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
      className="min-h-[500px] flex flex-col gap-4"
      ref={setNodeRef}
      style={style}
    >
      <div
        className=" flex justify-between items-center"
        {...attributes}
        {...listeners}
        onClick={() => setIsEditting(true)}
      >
        {!isEditting && (
          <h2 className="text-foreground/50 text-base font-semibold">
            {column.title}
          </h2>
        )}

        {isEditting && (
          <input
            className="text-foreground font-semibold outline-none bg-transparent"
            autoFocus
            value={column.title}
            onChange={(e) => {
              updateColumn(column.id, e.target.value)
            }}
            onBlur={() => setIsEditting(false)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return
              setIsEditting(false)
            }}
          />
        )}
        <button
          className="bg-red-400 text-white p-2"
          onClick={() => deleteColumn(column.id)}
        >
          Delete
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {tasks?.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          className="text-sm font-semibold text-foreground"
          onClick={() => {
            createTask(column.id)
          }}
        >
          Add task
        </button>
      </div>
    </div>
  )
}

export default Column
