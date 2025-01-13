import React, { useState } from "react"
import { TaskProps } from "../types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash2 } from "lucide-react"

const TaskCard = ({ task, deleteTask, updateTask }: TaskProps) => {
  const [mouseOver, setMouseOver] = useState(false)
  const [isEditting, setIsEditting] = useState(false)

  const toggleEditting = () => {
    setIsEditting((prev) => !prev)
    setMouseOver(false)
  }

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: isEditting,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-background text-foreground p-2 rounded-md border-[1px] border-gray-400 cursor-grab min-h-[100px] relative opacity-50"
      ></div>
    )
  }

  if (isEditting) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-background text-foreground p-2 rounded-md border-[1px] border-gray-400 cursor-grab min-h-[100px] relative"
      >
        <textarea
          autoFocus
          className="w-full h-full resize-none border-none text-foreground bg-background outline-none"
          value={task.content}
          onBlur={toggleEditting}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditting()
          }}
          onChange={(e) => {
            updateTask(task.id, e.target.value)
          }}
        ></textarea>
      </div>
    )
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-full bg-background text-foreground p-2 rounded-md border-[1px] border-gray-400 cursor-grab min-h-[100px] relative"
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onClick={toggleEditting}
    >
      <p className="w-full h-[100px] text-foreground overflow-y-auto overflow-x-hidden whitespace-pre-line">
        {task.content}
      </p>
      {mouseOver && (
        <button
          className="text-xs text-red-500 p-2 absolute top-2 right-2"
          onClick={() => deleteTask(task.id)}
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}

export default TaskCard
