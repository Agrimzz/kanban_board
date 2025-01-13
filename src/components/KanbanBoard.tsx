import React, { useEffect, useMemo, useState } from "react"
import { ColumnType, TaskType } from "../types"
import Column from "./Column"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import TaskCard from "./TaskCard"
import { saveToLocalStorage } from "../utils/utils"

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnType[]>(() =>
    localStorage.getItem("kanban_columns")
      ? JSON.parse(localStorage.getItem("kanban_columns")!)
      : []
  )
  const columnsId = useMemo(() => columns.map((column) => column.id), [columns])
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null)

  const [tasks, setTasks] = useState<TaskType[]>(() =>
    localStorage.getItem("kanban_tasks")
      ? JSON.parse(localStorage.getItem("kanban_tasks")!)
      : []
  )
  const [activeTask, setActiveTask] = useState<TaskType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    })
  )

  useEffect(() => {
    const savedColumns = localStorage.getItem("kanban_columns")
    const savedTasks = localStorage.getItem("kanban_tasks")

    if (savedColumns) setColumns(JSON.parse(savedColumns))
    if (savedTasks) setTasks(JSON.parse(savedTasks))
  }, [])

  useEffect(() => {
    saveToLocalStorage(columns, tasks)
  }, [columns, tasks])

  function createNewColumn() {
    const newColumn: ColumnType = {
      id: Date.now().toString(),
      title: `New Column ${columns.length + 1}`,
    }

    setColumns([...columns, newColumn])
  }

  function deleteColumn(id: string) {
    setColumns(columns.filter((column) => column.id !== id))
    setTasks(tasks.filter((task) => task.columnId !== id))
  }

  function updateColumn(id: string, title: string) {
    setColumns(
      columns.map((column) => {
        if (column.id === id) {
          return {
            ...column,
            title,
          }
        }
        return column
      })
    )
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column)
      return
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task)
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null)
    setActiveTask(null)
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

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event

    if (!over) {
      return
    }
    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === "Task"
    const isOverATask = over.data.current?.type === "Task"

    if (!isActiveATask) return

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId)
        const overTaskIndex = tasks.findIndex((task) => task.id === overId)
        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId
        return arrayMove(tasks, activeTaskIndex, overTaskIndex)
      })
    }

    const isOverAColumn = over.data.current?.type === "Column"

    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((task) => task.id === activeId)
      tasks[activeIndex].columnId = String(overId)
      return arrayMove(tasks, activeIndex, activeIndex)
    }
  }

  function createTask(columnId: string) {
    const newTask: TaskType = {
      id: Date.now().toString(),
      columnId,
      content: "New Task",
    }

    setTasks([...tasks, newTask])
  }

  function deleteTask(taskId: string) {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  function updateTask(taskId: string, content: string) {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            content,
          }
        }
        return task
      })
    )
  }

  return (
    <div className="w-full min-h-screen ">
      <div className="w-full bg-background sticky top-0">
        <div className="max-w-7xl px-4 py-4 flex justify-between mx-auto">
          <h1 className="text-primary text-3xl font-bold">Kanban Board</h1>
          <button
            className="text-background bg-primary px-4 py-2 rounded-md border-[1px] border-primary ring-primary/80 hover:ring-2"
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
        onDragOver={onDragOver}
      >
        <div className="mx-auto grid grid-cols-2 max-w-7xl px-4 py-4 gap-8 md:grid-cols-3">
          <SortableContext items={columnsId}>
            {columns.map((column) => (
              <div key={column.id}>
                <Column
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              </div>
            ))}
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Column
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  )
}

export default KanbanBoard
