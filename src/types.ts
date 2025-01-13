export type ColumnType = {
  id: string
  title: string
}

export interface ColumnProps {
  column: ColumnType
  deleteColumn: (id: string) => void
}
