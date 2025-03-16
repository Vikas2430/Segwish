"use client"

import { X } from "lucide-react"
import { DataRow } from "@/lib/mock-data"

interface RowModalProps {
  row: DataRow;
  onClose: () => void;
}

export default function RowModal({ row, onClose }: RowModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Creative ID: {row.creative_id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Creative Details</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">Creative Name:</span>
                <p>{row.creative_name}</p>
              </div>
              <div>
                <span className="text-gray-500">Campaign:</span>
                <p>{row.campaign}</p>
              </div>
              <div>
                <span className="text-gray-500">Ad Group:</span>
                <p>{row.ad_group}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Performance Metrics</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-500">Spend:</span>
                <p>${row.spend.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-500">Impressions:</span>
                <p>{row.impressions.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Clicks:</span>
                <p>{row.clicks.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500">CTR:</span>
                <p>{(row.ctr * 100).toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

