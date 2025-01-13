export type ColumnType = {
  id: string
  title: string
}

export type ColumnProps = {
  column: ColumnType
  deleteColumn: (id: string) => void
  updateColumn: (id: string, title: string) => void
  createTask: (columnId: string) => void
  tasks?: TaskType[]
  deleteTask: (taskId: string) => void
  updateTask: (taskId: string, content: string) => void
}

export type TaskType = {
  id: string
  columnId: string
  content: string
}

export type TaskProps = {
  task: TaskType
  deleteTask: (taskId: string) => void
  updateTask: (taskId: string, content: string) => void
}
