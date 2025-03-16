"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataRow } from "@/lib/mock-data"

interface RowModalProps {
  row: DataRow;
  onClose: () => void;
}

export default function RowModal({ row, onClose }: RowModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Creative ID: {row.creative_id}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-1">Creative Name</h3>
              <p>{row.creative_name}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Tags</h3>
              <p>{row.tags}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Campaign</h3>
              <p>{row.campaign}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Ad Group</h3>
              <p>{row.ad_group}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Spend</h3>
              <p>${row.spend.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

