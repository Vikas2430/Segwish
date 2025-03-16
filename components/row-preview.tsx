"use client"

import { X } from "lucide-react"
import { DataRow } from "@/lib/mock-data"

interface RowPreviewProps {
  row: DataRow;
  onClick: () => void;
}

export default function RowPreview({ row, onClick }: RowPreviewProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Creative ID: {row.creative_id}</h3>
        <button onClick={onClick} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2">
        <div>
          <span className="text-sm text-gray-500">Creative Name:</span>
          <p className="text-sm">{row.creative_name}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Campaign:</span>
          <p className="text-sm">{row.campaign}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Spend:</span>
          <p className="text-sm">${row.spend.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

