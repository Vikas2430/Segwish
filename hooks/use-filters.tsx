"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Filter {
  type: 'creative_name' | 'country' | 'ad_network' | 'ad_group' | 'spend' | 'impressions' | 'clicks' | 'installs' | 'tags';
  operator: 'equals' | 'less_than' | 'greater_than' | 'is';
  value: string | string[] | number;
  filterOperator?: 'and' | 'or';
}

interface FiltersContextType {
  activeFilters: Filter[];
  addFilter: (filter: Filter) => void;
  clearFilters: () => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [activeFilters, setActiveFilters] = useState<Filter[]>([])

  const addFilter = (filter: Filter) => {
    setActiveFilters((prev) => {
      // Check if filter of same type and operator already exists
      const existingIndex = prev.findIndex((f) => f.type === filter.type && f.operator === filter.operator)

      if (existingIndex >= 0) {
        // Replace existing filter
        const newFilters = [...prev]
        newFilters[existingIndex] = filter
        return newFilters
      } else {
        // Add new filter
        return [...prev, filter]
      }
    })
  }

  const clearFilters = () => {
    setActiveFilters([])
  }

  return (
    <FiltersContext.Provider value={{ activeFilters, addFilter, clearFilters }}>{children}</FiltersContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FiltersContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FiltersProvider")
  }
  return context
}

