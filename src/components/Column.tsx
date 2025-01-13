import React, { useMemo, useState } from "react"
import { ColumnProps } from "../types"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TaskCard from "./TaskCard"
import { CirclePlus, Trash2 } from "lucide-react"
const Column = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: ColumnProps) => {
  const [isEditting, setIsEditting] = useState(false)

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks])

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
      <div className="bg-background rounded-md  min-h-[500px] flex flex-col  border-[1px] border-primary opacity-50"></div>
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
          <div className="flex items-center gap-1">
            <h2 className="text-foreground/50 text-base font-semibold">
              {column.title}
            </h2>
            <div className="bg-primary rounded-full text-background text-xs w-[20px] h-[20px] flex items-center justify-center">
              {tasks.length}
            </div>
          </div>
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
          className="bg-red-400 text-white p-1 rounded-md"
          onClick={() => deleteColumn(column.id)}
        >
          <Trash2 />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      <button
        className="text-sm font-semibold flex gap-2 text-foreground items-center"
        onClick={() => {
          createTask(column.id)
        }}
      >
        <CirclePlus />
        Add task
      </button>
    </div>
  )
}

export default Column
