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
import { Search, X } from "lucide-react"
import ThemeToggler from "./ThemeToggler"

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

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortOption, setSortOption] = useState<string>("")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    })
  )

  //filter tasks
  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks
    return tasks.filter((task) =>
      task.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [tasks, searchQuery])

  //handle search query
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value)
  }

  //sort columns
  const sortedColumns = useMemo(() => {
    const compare = (a: ColumnType, b: ColumnType) => {
      const taskCountA = tasks.filter((task) => task.columnId === a.id).length
      const taskCountB = tasks.filter((task) => task.columnId === b.id).length

      switch (sortOption) {
        case "AtoZ":
          return a.title.localeCompare(b.title)
        case "ZtoA":
          return b.title.localeCompare(a.title)
        case "TaskHighToLow":
          return taskCountB - taskCountA
        case "TaskLowToHigh":
          return taskCountA - taskCountB
        default:
          return 0
      }
    }

    return [...columns].sort(compare)
  }, [columns, tasks, sortOption])

  //load columns and tasks from local storage if exists
  useEffect(() => {
    const savedColumns = localStorage.getItem("kanban_columns")
    const savedTasks = localStorage.getItem("kanban_tasks")

    if (savedColumns) setColumns(JSON.parse(savedColumns))
    if (savedTasks) setTasks(JSON.parse(savedTasks))
  }, [])

  //save tasks and columns to local storage
  useEffect(() => {
    saveToLocalStorage(columns, tasks)
  }, [columns, tasks])

  //columns CRUD
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

  //drag functions
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
      setTasks((prevTasks) => {
        const activeTaskIndex = prevTasks.findIndex(
          (task) => task.id === activeId
        )
        const updatedTasks = [...prevTasks]

        updatedTasks[activeTaskIndex] = {
          ...updatedTasks[activeTaskIndex],
          columnId: String(overId),
        }

        return updatedTasks
      })
    }
  }

  //tasks CRUD
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
      <div className="w-full bg-background sticky top-0 z-50 border-b-[1px] border-gray-400">
        <div className="max-w-7xl px-4 py-4 flex justify-between mx-auto">
          <h1 className="text-primary text-3xl font-bold">Kanban Board</h1>

          <div className="flex gap-2 items-center">
            <ThemeToggler />
            <button
              className="text-background bg-primary px-4 py-2 rounded-md border-[1px] border-primary ring-primary/80 hover:ring-2"
              onClick={createNewColumn}
            >
              Add Column
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl px-4 py-4 flex justify-between mx-auto gap-2 flex-wrap">
        <div className="flex flex-1 gap-2 items-center border-[1px] border-gray-400 rounded-md bg-background p-2 text-foreground">
          <Search />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search tasks..."
            className="rounded-md outline-none bg-background flex-1"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 text-foreground">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border-[1px] border-gray-400 rounded-md bg-background outline-none p-2"
          >
            <option value="">Sort Board By</option>
            <option value="AtoZ">Column Name: A to Z</option>
            <option value="ZtoA">Column Name: Z to A</option>
            <option value="TaskHighToLow">Task Count: High to Low</option>
            <option value="TaskLowToHigh">Task Count: Low to High</option>
          </select>
        </div>
      </div>
      <div className="max-w-7xl px-4 py-4 flex justify-between mx-auto items-baseline">
        <h4 className="text-xl font-semibold text-foreground">
          {searchQuery ? `Search results for "${searchQuery}"` : "Your Board"}
        </h4>
        <p className="text-foreground/60">{columns.length} columns</p>
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="mx-auto grid grid-cols-2 max-w-7xl px-4 py-4 gap-8 md:grid-cols-4">
          <SortableContext items={columnsId}>
            {sortedColumns.map((column) => (
              <div key={column.id}>
                <Column
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={filteredTasks.filter(
                    (task) => task.columnId === column.id
                  )}
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
