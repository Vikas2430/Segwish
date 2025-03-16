"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ArrowDown, ArrowUp, Search } from "lucide-react"
import { mockData, type DataRow } from "@/lib/mock-data"
import { useFilters } from "@/hooks/use-filters"
import RowPreview from "@/components/row-preview"
import RowModal from "@/components/row-modal"

export default function DataTable() {
  const { activeFilters } = useFilters()
  const [data, setData] = useState<DataRow[]>(mockData)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof DataRow; direction: "asc" | "desc" } | null>(null)
  const [selectedRow, setSelectedRow] = useState<DataRow | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Apply filters and search
  useEffect(() => {
    let filteredData = [...mockData]

    // Apply active filters
    if (activeFilters.length > 0) {
      filteredData = filteredData.filter((item) => {
        return activeFilters.every((filter, index) => {
          // Get the operator for combining with the next filter
          const operator = filter.filterOperator || 'and'
          
          // Function to check if the current filter matches
          const currentFilterMatches = () => {
            // Handle dimension filters (string equality)
            if (["creative_name", "country", "ad_network", "os", "campaign", "ad_group"].includes(filter.type)) {
              const itemValue = String(item[filter.type]).toLowerCase()
              if (Array.isArray(filter.value)) {
                return filter.value.some(val => String(val).toLowerCase() === itemValue)
              }
              const filterValue = String(filter.value).toLowerCase()
              return filter.operator === "equals" ? itemValue === filterValue : itemValue.includes(filterValue)
            }

            // Handle percentage metrics (IPM and CTR)
            if (["ipm", "ctr"].includes(filter.type)) {
              const itemValue = Number(item[filter.type])
              // Convert filter value from percentage to decimal for comparison
              const filterValue = !Array.isArray(filter.value) ? Number(filter.value) / 100 : NaN

              if (isNaN(filterValue)) return true

              switch (filter.operator) {
                case "equals":
                  return Math.abs(itemValue - filterValue) < 0.0001 // Use small epsilon for floating point comparison
                case "less_than":
                  return itemValue < filterValue
                case "greater_than":
                  return itemValue > filterValue
                default:
                  return true
              }
            }

            // Handle regular metric filters (numeric comparisons)
            if (["spend", "impressions", "clicks", "installs", "cpm", "cost_per_click", "cost_per_install"].includes(filter.type)) {
              const itemValue = Number(item[filter.type])
              const filterValue = !Array.isArray(filter.value) ? Number(filter.value) : NaN

              if (isNaN(filterValue)) return true

              switch (filter.operator) {
                case "equals":
                  return itemValue === filterValue
                case "less_than":
                  return itemValue < filterValue
                case "greater_than":
                  return itemValue > filterValue
                default:
                  return true
              }
            }

            return true
          }

          // If this is the last filter, just return its result
          if (index === activeFilters.length - 1) {
            return currentFilterMatches()
          }

          // Get the next filter's result
          const nextFilter = activeFilters[index + 1]
          const nextFilterMatches = () => {
            // Similar logic for next filter...
            if (["creative_name", "country", "ad_network", "os", "campaign", "ad_group"].includes(nextFilter.type)) {
              const itemValue = String(item[nextFilter.type]).toLowerCase()
              if (Array.isArray(nextFilter.value)) {
                return nextFilter.value.some(val => String(val).toLowerCase() === itemValue)
              }
              const filterValue = String(nextFilter.value).toLowerCase()
              return nextFilter.operator === "equals" ? itemValue === filterValue : itemValue.includes(filterValue)
            }

            if (["ipm", "ctr"].includes(nextFilter.type)) {
              const itemValue = Number(item[nextFilter.type])
              const filterValue = !Array.isArray(nextFilter.value) ? Number(nextFilter.value) / 100 : NaN

              if (isNaN(filterValue)) return true

              switch (nextFilter.operator) {
                case "equals":
                  return Math.abs(itemValue - filterValue) < 0.0001
                case "less_than":
                  return itemValue < filterValue
                case "greater_than":
                  return itemValue > filterValue
                default:
                  return true
              }
            }

            if (["spend", "impressions", "clicks", "installs", "cpm", "cost_per_click", "cost_per_install"].includes(nextFilter.type)) {
              const itemValue = Number(item[nextFilter.type])
              const filterValue = !Array.isArray(nextFilter.value) ? Number(nextFilter.value) : NaN

              if (isNaN(filterValue)) return true

              switch (nextFilter.operator) {
                case "equals":
                  return itemValue === filterValue
                case "less_than":
                  return itemValue < filterValue
                case "greater_than":
                  return itemValue > filterValue
                default:
                  return true
              }
            }

            return true
          }

          // Combine current and next filter results based on operator
          return operator === 'or' 
            ? currentFilterMatches() || nextFilterMatches()
            : currentFilterMatches() && nextFilterMatches()
        })
      })
    }

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filteredData = filteredData.filter((item) => {
        return Object.entries(item).some(([key, value]) => {
          // Skip tags field in search
          if (key === 'tags') return false
          return String(value).toLowerCase().includes(searchLower)
        })
      })
    }

    // Apply sorting
    if (sortConfig) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        // Handle numeric sorting
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === "asc" 
            ? aValue - bValue 
            : bValue - aValue
        }

        // Handle string sorting
        const aStr = String(aValue).toLowerCase()
        const bStr = String(bValue).toLowerCase()
        
        if (aStr < bStr) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (aStr > bStr) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setData(filteredData)
  }, [activeFilters, searchTerm, sortConfig])

  const handleSort = (key: keyof DataRow) => {
    let direction: "asc" | "desc" = "asc"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }

    setSortConfig({ key, direction })
  }

  const handleRowClick = (row: DataRow) => {
    setSelectedRow(row)
  }

  const handlePreviewClick = () => {
    setShowModal(true)
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-[#d9d9d9]"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#757575]" />
        </div>
      </div>

      <div className="border border-[#f2f4f8] rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f8fafb]">
            <TableRow>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8]" onClick={() => handleSort("creative_id")}>
                Creative ID
                {sortConfig?.key === "creative_id" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8]" onClick={() => handleSort("creative_name")}>
                Creative Name
                {sortConfig?.key === "creative_name" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8]" onClick={() => handleSort("country")}>
                Country
                {sortConfig?.key === "country" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8]" onClick={() => handleSort("ad_network")}>
                Ad Network
                {sortConfig?.key === "ad_network" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8]" onClick={() => handleSort("os")}>
                OS
                {sortConfig?.key === "os" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8]" onClick={() => handleSort("campaign")}>
                Campaign
                {sortConfig?.key === "campaign" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8]" onClick={() => handleSort("ad_group")}>
                Ad Group
                {sortConfig?.key === "ad_group" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8] text-right" onClick={() => handleSort("ipm")}>
                IPM
                {sortConfig?.key === "ipm" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8] text-right" onClick={() => handleSort("ctr")}>
                CTR
                {sortConfig?.key === "ctr" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8] text-right" onClick={() => handleSort("spend")}>
                Spend
                {sortConfig?.key === "spend" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8] text-right" onClick={() => handleSort("impressions")}>
                Impressions
                {sortConfig?.key === "impressions" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8] text-right" onClick={() => handleSort("clicks")}>
                Clicks
                {sortConfig?.key === "clicks" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8] text-right" onClick={() => handleSort("cpm")}>
                CPM
                {sortConfig?.key === "cpm" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8] text-right" onClick={() => handleSort("cost_per_click")}>
                CPC
                {sortConfig?.key === "cost_per_click" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8] text-right" onClick={() => handleSort("cost_per_install")}>
                CPI
                {sortConfig?.key === "cost_per_install" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-[#f2f4f8] text-right" onClick={() => handleSort("installs")}>
                Installs
                {sortConfig?.key === "installs" && (
                  sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="inline ml-1 h-3 w-3" />
                  ))}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} className="text-center py-8 text-[#757575]">
                  No data found. Try adjusting your filters or search.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.creative_id} className="hover:bg-[#f8fafb]">
                  <TableCell
                    className="font-medium cursor-pointer hover:text-[#97cf35]"
                    onClick={() => handleRowClick(row)}
                  >
                    {row.creative_id}
                  </TableCell>
                  <TableCell>{row.creative_name}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.ad_network}</TableCell>
                  <TableCell>{row.os}</TableCell>
                  <TableCell>{row.campaign}</TableCell>
                  <TableCell>{row.ad_group}</TableCell>
                  <TableCell className="text-right">{row.ipm.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">{row.ctr.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">${row.spend.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{row.impressions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${row.cpm.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${row.cost_per_click.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${row.cost_per_install.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{row.installs.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedRow && <RowPreview row={selectedRow} onClick={handlePreviewClick} />}
      {showModal && selectedRow && <RowModal row={selectedRow} onClose={() => setShowModal(false)} />}
    </div>
  )
}

