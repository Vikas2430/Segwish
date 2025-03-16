"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Plus, Search, X, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useFilters, type Filter } from "@/hooks/use-filters"
import { mockData, type DataRow } from "@/lib/mock-data"

interface FilterInterfaceProps {
  onApplyFilters: (filters: Filter[], operator: "and" | "or") => void;
}

export default function FilterInterface({ onApplyFilters }: FilterInterfaceProps) {
  const { activeFilters, addFilter, clearFilters } = useFilters()
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [selectedMetric, setSelectedMetric] = useState<string>("")
  const [selectedDimension, setSelectedDimension] = useState<string>("")
  const [selectedOperator, setSelectedOperator] = useState<"equals" | "less_than" | "greater_than">("equals")
  const [metricValue, setMetricValue] = useState<string>("")
  const [filterOperator, setFilterOperator] = useState<"and" | "or">("and")
  const [selectedDimensionValues, setSelectedDimensionValues] = useState<string[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [valueSearchTerm, setValueSearchTerm] = useState("")
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [dimensionValues, setDimensionValues] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Get unique values for each dimension from mock data
  const getDimensionValues = (dimension: string): string[] => {
    const values = new Set<string>();
    mockData.forEach((row: DataRow) => {
      const value = row[dimension as keyof DataRow];
      if (typeof value === 'string') {
        values.add(value);
      }
    });
    return Array.from(values);
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      const availableValues = selectedDimension
        ? dimensionValues.filter(v => v.toLowerCase().includes(valueSearchTerm.toLowerCase()))
        : []
      setSelectedValues(availableValues)
      
      // Update the filter value if it's a dimension
      if (selectedDimension) {
        const type = selectedDimension.toLowerCase().replace(/ /g, '_') as Filter['type']
        const existingFilterIndex = selectedFilters.findIndex(f => f.type === type)
        if (existingFilterIndex !== -1) {
          const newFilters = [...selectedFilters]
          newFilters[existingFilterIndex] = {
            ...newFilters[existingFilterIndex],
            value: availableValues // Store as array directly
          }
          setSelectedFilters(newFilters)
        }
      }
    } else {
      setSelectedValues([])
      
      // Clear the filter value if it's a dimension
      if (selectedDimension) {
        const type = selectedDimension.toLowerCase().replace(/ /g, '_') as Filter['type']
        const existingFilterIndex = selectedFilters.findIndex(f => f.type === type)
        if (existingFilterIndex !== -1) {
          const newFilters = [...selectedFilters]
          newFilters[existingFilterIndex] = {
            ...newFilters[existingFilterIndex],
            value: []
          }
          setSelectedFilters(newFilters)
        }
      }
    }
  }

  const handleValueSelection = (value: string, checked: boolean) => {
    setSelectedValues(prev => {
      const newSelection = checked
        ? [...prev, value]
        : prev.filter(v => v !== value)
      
      // Update select all state
      const availableValues = selectedDimension
        ? dimensionValues.filter(v => v.toLowerCase().includes(valueSearchTerm.toLowerCase()))
        : []
      
      setSelectAll(newSelection.length === availableValues.length)
      
      // Update the filter value if it's a dimension
      if (selectedDimension) {
        const type = selectedDimension.toLowerCase().replace(/ /g, '_') as Filter['type']
        const existingFilterIndex = selectedFilters.findIndex(f => f.type === type)
      if (existingFilterIndex !== -1) {
        const newFilters = [...selectedFilters]
          newFilters[existingFilterIndex] = {
            ...newFilters[existingFilterIndex],
            value: newSelection // Store as array directly
          }
          setSelectedFilters(newFilters)
        } else {
          setSelectedFilters([...selectedFilters, {
            type,
            operator: 'equals',
            value: newSelection // Store as array directly
          }])
        }
      }
      
      return newSelection
    })
  }

  const handleDimensionSelection = (dimension: string) => {
    setSelectedDimension(dimension)
    setSelectedMetric("")
    setValueSearchTerm("")
    
    // Get unique values for the selected dimension
    const values = getDimensionValues(dimension)
    setDimensionValues(values)
    
    // Check if filter already exists and restore selected values
    const existingFilterIndex = selectedFilters.findIndex(f => f.type === dimension.toLowerCase().replace(/ /g, '_'))
    if (existingFilterIndex !== -1) {
      const existingValues = selectedFilters[existingFilterIndex].value
      if (typeof existingValues === 'string' && existingValues.includes(';')) {
        setSelectedValues(existingValues.split(';'))
        setSelectAll(existingValues.split(';').length === values.length)
      } else if (Array.isArray(existingValues)) {
        setSelectedValues(existingValues)
        setSelectAll(existingValues.length === values.length)
      } else {
        setSelectedValues([])
        setSelectAll(false)
      }
    } else {
      setSelectedValues([])
      setSelectAll(false)
      setSelectedFilters([...selectedFilters, {
        type: dimension.toLowerCase().replace(/ /g, '_') as Filter['type'],
        operator: 'equals',
        value: ''
      }])
    }
  }

  const handleMetricSelection = (metric: string) => {
    setSelectedMetric(metric)
    const metricType = metric.toLowerCase().replace(/ /g, '_')
    
    // Check if a metric filter already exists
    const existingFilterIndex = selectedFilters.findIndex(f => f.type === metricType)
    if (existingFilterIndex === -1) {
      setSelectedFilters([...selectedFilters, {
        type: metricType as Filter['type'],
        operator: selectedOperator,
        value: metricValue || ''
      }])
    }
  }

  const handleOperatorChange = (newOperator: "equals" | "less_than" | "greater_than") => {
    setSelectedOperator(newOperator);
    // Remove the automatic filter update
    if (selectedMetric) {
      const metricType = selectedMetric.toLowerCase().replace(/ /g, '_');
      const existingFilterIndex = selectedFilters.findIndex(f => f.type === metricType);
      if (existingFilterIndex !== -1) {
        const newFilters = [...selectedFilters];
        newFilters.splice(existingFilterIndex, 1);
        setSelectedFilters(newFilters);
      }
    }
  }

  const handleMetricValueChange = (value: string) => {
    setMetricValue(value)
    if (selectedMetric) {
      const metricType = selectedMetric.toLowerCase().replace(/ /g, '_')
      const existingFilterIndex = selectedFilters.findIndex(f => 
        ['spend', 'impressions', 'clicks', 'installs', 'ipm', 'ctr', 'cpm', 'cost_per_click', 'cost_per_install'].includes(f.type)
      )
      
      if (existingFilterIndex !== -1) {
        const newFilters = [...selectedFilters]
        if (value) {
          newFilters[existingFilterIndex] = {
            type: metricType as Filter['type'],
            operator: selectedOperator,
            value
          }
        } else {
          newFilters.splice(existingFilterIndex, 1)
        }
        setSelectedFilters(newFilters)
      } else if (value) {
        setSelectedFilters([...selectedFilters, {
          type: metricType as Filter['type'],
          operator: selectedOperator,
          value
        }])
      }
    }
  }

  const handleClearFilter = (index: number) => {
    const newFilters = [...activeFilters]
    newFilters.splice(index, 1)
    clearFilters()
    newFilters.forEach((f) => addFilter(f))
  }

  // Extract unique values from the dataset
  const dimensions = [
    "Creative Name",
    "Country",
    "Ad Network",
    "OS",
    "Ad Group",
    "Campaign"
  ]

  const metrics = [
    "IPM",
    "CTR",
    "Spend",
    "Impressions",
    "Clicks",
    "CPM",
    "Cost per Click",
    "Cost per Install",
    "Installs"
  ]

  const filteredDimensions = searchTerm
    ? dimensions.filter(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
    : dimensions

  const filteredMetrics = searchTerm
    ? metrics.filter(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
    : metrics

  const handleApplyFilters = () => {
    const filtersToApply: Filter[] = [];
    if (selectedMetric && selectedOperator && metricValue) {
      filtersToApply.push({
        type: selectedMetric.toLowerCase().replace(/ /g, '_') as Filter['type'],
        operator: selectedOperator,
        value: parseFloat(metricValue) || metricValue,
        filterOperator
      });
    }
    if (selectedDimension && selectedDimensionValues.length > 0) {
      filtersToApply.push({
        type: selectedDimension.toLowerCase().replace(/ /g, '_') as Filter['type'],
        operator: 'is',
        value: selectedDimensionValues,
        filterOperator
      });
    }
    onApplyFilters(filtersToApply, filterOperator);
    setIsFilterOpen(false);
  }

  // Update the display of active filters
  const renderFilterValue = (filter: Filter) => {
    if (Array.isArray(filter.value)) {
      return `${filter.value.slice(0, 2).join(", ")}${filter.value.length > 2 ? ` +${filter.value.length - 2}` : ''}`
    } else if (typeof filter.value === 'string' && filter.value.includes(';')) {
      const values = filter.value.split(';').filter(v => v.trim() !== '')
      return `${values.slice(0, 2).join(", ")}${values.length > 2 ? ` +${values.length - 2}` : ''}`
    }
    return filter.value
  }

  return (
    <div>
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="border border-[#E5E7EB] bg-white text-[#374151] hover:bg-gray-50 text-sm font-medium h-9 px-3"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn(
            "p-0 shadow-md border border-[#E5E7EB]",
            selectedMetric || selectedDimension ? "w-[500px]" : "w-[250px]"
          )} 
          align="start"
        >
          <div className={cn(
            "grid divide-x divide-[#E5E7EB]",
            selectedMetric || selectedDimension ? "grid-cols-[250px_250px]" : "grid-cols-[250px]"
          )}>
            {/* First column - Select Category */}
            <div className="bg-white">
              <div className="p-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5" />
                  <span className="text-sm text-[#374151]">step 1 - select category</span>
                </div>
              </div>
              
              <div className="p-3">
                <div className="relative mb-3">
                  <Input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 border-[#E5E7EB] text-sm focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1]"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#9CA3AF]" />
              </div>

              <Tabs defaultValue="dimensions" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 p-0.5 h-8 bg-[#F3F4F6] rounded mb-2">
                    {["Dimensions", "Metrics"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab.toLowerCase()}
                        className="px-4 py-1 text-xs font-medium rounded data-[state=active]:bg-white data-[state=active]:text-[#374151] data-[state=active]:shadow-sm"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                  <TabsContent value="dimensions" className="m-0">
                    {filteredDimensions.map((item) => (
                      <Button
                        key={item}
                        variant="ghost"
                        onClick={() => handleDimensionSelection(item)}
                        className={cn(
                          "w-full justify-start text-sm font-normal px-3 py-2 h-auto hover:bg-[#F3F4F6] text-[#374151]",
                          selectedDimension === item && "bg-[#F3F4F6]"
                        )}
                      >
                        {item}
                      </Button>
                    ))}
                  </TabsContent>

                  <TabsContent value="metrics" className="m-0">
                    {filteredMetrics.map((item) => (
                    <Button
                      key={item}
                      variant="ghost"
                        onClick={() => handleMetricSelection(item)}
                        className={cn(
                          "w-full justify-start text-sm font-normal px-3 py-2 h-auto hover:bg-[#F3F4F6] text-[#374151]",
                          selectedMetric === item && "bg-[#F3F4F6]"
                        )}
                    >
                      {item}
                    </Button>
                  ))}
                </TabsContent>
              </Tabs>
              </div>
            </div>

            {/* Second column - Configure Filter or Select Values */}
            {(selectedMetric || selectedDimension) && (
              <div className="bg-white flex flex-col h-full">
                {/* Step 2 Header */}
                <div className="p-3 border-b border-[#E5E7EB]">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm text-[#374151]">
                      {selectedDimension ? (
                        <>
                          <span>Dimensions</span>
                          <ChevronRight className="h-4 w-4" />
                          <span>{selectedDimension}</span>
                        </>
                      ) : selectedMetric ? (
                        <>
                          <span>Metrics</span>
                          <ChevronRight className="h-4 w-4" />
                          <span>{selectedMetric}</span>
                        </>
                      ) : null}
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      Select Value
                    </div>
                  </div>
                </div>

                {/* Step 2 Content and Step 3 */}
                <div className="flex-1">
                  {selectedMetric ? (
                    <div className="flex flex-col">
                      {/* Metric Input */}
                      <div className="p-3 border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-2">
                          <div className="w-[120px] shrink-0">
                            <Select value={selectedOperator} onValueChange={(value: "equals" | "less_than" | "greater_than") => handleOperatorChange(value)}>
                              <SelectTrigger className="h-9 px-3 bg-white border-[#E5E7EB] text-sm focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] flex items-center justify-between">
                                <SelectValue placeholder="Operator">
                                  {selectedOperator === 'equals' ? 'Equals' :
                                   selectedOperator === 'less_than' ? 'Lesser than' :
                                   selectedOperator === 'greater_than' ? 'Greater than' : ''}
                                </SelectValue>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-[#E5E7EB] shadow-md rounded-md min-w-[120px] p-1">
                                <SelectItem value="equals" className="text-sm px-2 py-1.5 rounded-sm hover:bg-[#F3F4F6] cursor-pointer">
                                  Equals
                                </SelectItem>
                                <SelectItem value="less_than" className="text-sm px-2 py-1.5 rounded-sm hover:bg-[#F3F4F6] cursor-pointer">
                                  Less than
                                </SelectItem>
                                <SelectItem value="greater_than" className="text-sm px-2 py-1.5 rounded-sm hover:bg-[#F3F4F6] cursor-pointer">
                                  Greater than
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="relative flex-1">
                            <Input
                              type="number"
                              placeholder="Enter Value"
                              value={metricValue}
                              onChange={(e) => handleMetricValueChange(e.target.value)}
                              className="h-9 pl-7 border-[#E5E7EB] text-sm focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1]"
                            />
                            <span className="absolute left-3 top-2.5 text-sm text-[#6B7280]">
                              {selectedMetric && (selectedMetric === "IPM" || selectedMetric === "CTR") ? "%" : "$"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 - AND/OR Operator */}
                      {metricValue && (
                        <div className="p-3 border-b border-[#E5E7EB]">
                          <div className="flex justify-center">
                            <div className="relative flex h-9 w-40 rounded-md border border-[#E5E7EB] bg-white">
                              <div 
                                className={cn(
                                  "absolute top-0 h-full w-20 rounded-md bg-[#333333] transition-transform duration-200 ease-in-out",
                                  filterOperator === "or" ? "translate-x-full" : "translate-x-0"
                                )}
                              />
                              <button
                                type="button"
                                onClick={() => setFilterOperator("and")}
                                className={cn(
                                  "relative z-10 flex-1 text-sm font-medium transition-colors duration-200",
                                  filterOperator === "and" ? "text-white" : "text-[#374151]"
                                )}
                              >
                                AND
                              </button>
                              <button
                                type="button"
                                onClick={() => setFilterOperator("or")}
                                className={cn(
                                  "relative z-10 flex-1 text-sm font-medium transition-colors duration-200",
                                  filterOperator === "or" ? "text-white" : "text-[#374151]"
                                )}
                              >
                                OR
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dimension Section */}
                      {selectedDimension && selectedValues.length > 0 && (
                        <div className="p-3">
                          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
                            <div className="flex items-center justify-between p-2">
                              <div className="flex items-center gap-1 text-sm text-[#374151]">
                                <span>Tag</span>
                                <ChevronRight className="h-4 w-4" />
                                <span>{selectedDimension}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDimension("")
                                  setSelectedValues([])
                                }}
                                className="p-1 hover:bg-gray-100 rounded-md"
                              >
                                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="0.96875" y="0.679688" width="28" height="28" rx="4" fill="white"/>
                                  <path d="M8.96875 10.6797H20.9688M19.6354 10.6797V20.013C19.6354 20.6797 18.9688 21.3463 18.3021 21.3463H11.6354C10.9688 21.3463 10.3021 20.6797 10.3021 20.013V10.6797M12.3021 10.6797V9.34635C12.3021 8.67968 12.9687 8.01302 13.6354 8.01302H16.3021C16.9688 8.01302 17.6354 8.67968 17.6354 9.34635V10.6797M13.6354 14.013V18.013M16.3021 14.013V18.013" stroke="#999999" strokeWidth="0.866667" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                            <div className="flex items-center p-2 bg-[#F9FAFB]">
                              <span className="text-sm text-[#374151]">
                                is {`${selectedValues.slice(0, 3).join(", ")}${selectedValues.length > 3 ? ` or ${selectedValues.length - 3} others` : ''}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Selected Values Dropdown */}
                      <div className="relative">
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="flex-1 flex items-center justify-between px-3 py-2 text-sm border border-[#E5E7EB] rounded-md bg-white hover:bg-gray-50"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          >
                            <span className="text-[#374151]">
                              {selectedValues.length === 0 
                                ? "Select Value" 
                                : `Selected (${selectedValues.length})`}
                            </span>
                            <ChevronDown className="h-4 w-4 text-[#6B7280]" />
                          </button>
                          {selectedValues.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedValues([])
                                setSelectAll(false)
                                // Clear the filter value if it's a dimension
                                if (selectedDimension) {
                                  const type = selectedDimension.toLowerCase().replace(/ /g, '_') as Filter['type']
                                  const existingFilterIndex = selectedFilters.findIndex(f => f.type === type)
                                  if (existingFilterIndex !== -1) {
                                    const newFilters = [...selectedFilters]
                                    newFilters[existingFilterIndex] = {
                                      ...newFilters[existingFilterIndex],
                                      value: []
                                    }
                                    setSelectedFilters(newFilters)
                                  }
                                }
                              }}
                              className="ml-2 p-2 hover:bg-gray-100 rounded-md"
                            >
                              <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.96875" y="0.679688" width="28" height="28" rx="4" fill="white"/>
                                <path d="M8.96875 10.6797H20.9688M19.6354 10.6797V20.013C19.6354 20.6797 18.9688 21.3463 18.3021 21.3463H11.6354C10.9688 21.3463 10.3021 20.6797 10.3021 20.013V10.6797M12.3021 10.6797V9.34635C12.3021 8.67968 12.9687 8.01302 13.6354 8.01302H16.3021C16.9688 8.01302 17.6354 8.67968 17.6354 9.34635V10.6797M13.6354 14.013V18.013M16.3021 14.013V18.013" stroke="#999999" strokeWidth="0.866667" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          )}
                        </div>
                        {isDropdownOpen && selectedValues.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-[#E5E7EB] rounded-md shadow-lg">
                            <div className="p-1">
                              {selectedValues.map((value) => (
                                <div
                                  key={value}
                                  className="flex items-center justify-between px-2 py-1 text-sm text-[#374151] hover:bg-gray-50"
                                >
                                  <span>{value}</span>
                                  <X
                                    className="h-4 w-4 text-[#6B7280] cursor-pointer hover:text-[#374151]"
                                    onClick={() => handleValueSelection(value, false)}
                                  />
                                </div>
                              ))}
                </div>
                          </div>
                        )}
              </div>

                      {/* Search Input */}
                      <div className="relative">
                  <Input
                    placeholder="Search"
                          value={valueSearchTerm}
                          onChange={(e) => setValueSearchTerm(e.target.value)}
                          className="pl-8 h-9 border-[#E5E7EB] text-sm focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1]"
                  />
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#9CA3AF]" />
                </div>

                      {/* Checkboxes */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="select-all"
                            checked={selectAll}
                            onCheckedChange={handleSelectAllChange}
                            className="h-4 w-4 rounded border-[#E5E7EB] text-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                          />
                          <label
                            htmlFor="select-all"
                            className="text-sm text-[#374151]"
                >
                  Select all
                          </label>
                        </div>

                        <div className="space-y-2">
                          {(selectedDimension ? dimensionValues : [])
                            .filter(value => value.toLowerCase().includes(valueSearchTerm.toLowerCase()))
                            .map((value) => (
                              <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                                  id={`value-${value}`}
                                  checked={selectedValues.includes(value)}
                                  onCheckedChange={(checked) => handleValueSelection(value, checked as boolean)}
                                  className="h-4 w-4 rounded border-[#E5E7EB] text-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                                />
                                <label
                                  htmlFor={`value-${value}`}
                                  className="text-sm text-[#374151]"
                                >
                                  {value}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
                  )}
                </div>

                {/* Apply Button */}
                <div className="p-3 border-t border-[#E5E7EB]">
                  <Button 
                    onClick={handleApplyFilters} 
                    className="w-full bg-[#333333] hover:bg-[#262626] text-white h-9 text-sm font-medium"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Display Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap gap-2 items-center">
            {activeFilters.map((filter, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <span className="text-sm text-[#2E7D32] font-medium">
                    {filter.filterOperator === 'or' ? 'OR' : 'AND'}
                  </span>
                )}
                <div
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#E8F5E9] border border-[#81C784] rounded-full text-sm text-[#2E7D32]"
                >
                  <span className="capitalize">
                    {filter.type === 'tags' 
                      ? filter.value && typeof filter.value === 'string' && filter.value.includes(':')
                        ? filter.value.split(':')[0]
                        : Array.isArray(filter.value) && filter.value[0]?.includes(':')
                          ? filter.value[0].split(':')[0]
                          : filter.type.replace(/_/g, ' ')
                      : filter.type.replace(/_/g, ' ')}
                  </span>
                  <span>
                    {filter.operator === 'less_than' ? '<' :
                     filter.operator === 'greater_than' ? '>' :
                     filter.operator === 'equals' ? '=' :
                     filter.operator}
                  </span>
                  <span>{renderFilterValue(filter)}</span>
                  <X
                    className="h-4 w-4 cursor-pointer hover:text-[#1B5E20]"
                    onClick={() => handleClearFilter(index)}
                  />
                </div>
              </React.Fragment>
            ))}
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                className="text-sm text-[#2E7D32] hover:bg-[#E8F5E9]"
                onClick={() => clearFilters()}
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

