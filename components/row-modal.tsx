"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RowModalProps {
  row: any
  onClose: () => void
}

export default function RowModal({ row, onClose }: RowModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-[#f2f4f8]">
          <h2 className="font-semibold">Row #{row.id} Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 text-[#757575]">Character:</div>
            <div className="col-span-2">{row.character}</div>

            <div className="col-span-1 text-[#757575]">Background:</div>
            <div className="col-span-2">{row.background}</div>

            <div className="col-span-1 text-[#757575]">Elements:</div>
            <div className="col-span-2">{row.elements}</div>

            <div className="col-span-1 text-[#757575]">CTA Position:</div>
            <div className="col-span-2">{row.ctaPosition}</div>

            <div className="col-span-1 text-[#757575]">CTA Text:</div>
            <div className="col-span-2">{row.ctaText}</div>

            <div className="col-span-1 text-[#757575]">Spends:</div>
            <div className="col-span-2">{row.spends}</div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-[#f2f4f8]">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

