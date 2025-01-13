import { ColumnType, TaskType } from "../types"

export const saveToLocalStorage = (
  columns: ColumnType[],
  tasks: TaskType[]
) => {
  localStorage.setItem("kanban_columns", JSON.stringify(columns))
  localStorage.setItem("kanban_tasks", JSON.stringify(tasks))
}
