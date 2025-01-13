import React from "react"
import { ColumnProps } from "../types"

const Columns = (props: ColumnProps) => {
  const { column, deleteColumn } = props

  return (
    <div className="bg-background rounded-md  min-h-[500px] flex flex-col">
      <div className="bg-primary p-4 flex justify-between items-center">
        <h2 className="text-background font-semibold">{column.title}</h2>
        <button
          className="bg-red-400 text-white p-2"
          onClick={() => deleteColumn(column.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Columns
