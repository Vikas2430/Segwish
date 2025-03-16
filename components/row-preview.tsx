"use client"

import { X } from "lucide-react"

interface RowPreviewProps {
  row: any
  onClick: () => void
}

export default function RowPreview({ row, onClick }: RowPreviewProps) {
  return (
    <div
      className="fixed bottom-4 right-4 w-64 bg-white rounded-md shadow-lg border border-[#d9d9d9] overflow-hidden z-50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between bg-[#f8fafb] p-3 border-b border-[#f2f4f8]">
        <h3 className="font-medium text-sm">Row #{row.id}</h3>
        <X className="h-4 w-4 text-[#757575] hover:text-[#292d32]" />
      </div>
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-[#757575]">Character:</div>
          <div>{row.character}</div>

          <div className="text-[#757575]">Background:</div>
          <div>{row.background}</div>

          <div className="text-[#757575]">Spends:</div>
          <div>{row.spends}</div>
        </div>

        <div className="mt-2 text-xs text-[#97cf35] text-center">Click to view full details</div>
      </div>
    </div>
  )
}

