export type Column = {
  id: string
  title: string
}

export interface ColumnProps {
  column: Column
  deleteColumn: (id: string) => void
}
