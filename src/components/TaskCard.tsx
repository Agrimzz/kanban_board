import React, { useState } from "react"
import { TaskProps } from "../types"

const TaskCard = ({ task, deleteTask, updateTask }: TaskProps) => {
  const [mouseOver, setMouseOver] = useState(false)
  const [isEditting, setIsEditting] = useState(false)

  const toggleEditting = () => {
    setIsEditting((prev) => !prev)
    setMouseOver(false)
  }

  if (isEditting) {
    return (
      <div className="bg-background text-foreground p-2 rounded-md border-[1px] border-gray-400 cursor-grab min-h-[100px] relative">
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
          className="bg-red-400 text-xs text-white p-1 absolute top-2 right-2"
          onClick={() => deleteTask(task.id)}
        >
          D
        </button>
      )}
    </div>
  )
}

export default TaskCard
