import FilterInterface from "@/components/filter-interface"
import SegwiseLogo from "@/components/segwise-logo"
import DataTable from "@/components/data-table"

export default function Home() {
  const handleApplyFilters = (filters: any[], operator: "and" | "or") => {
    // Handle filters here
    console.log({ filters, operator });
  };

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <SegwiseLogo />
          <div>
            <h1 className="font-semibold text-[#292d32]">Segwise</h1>
            <p className="text-sm text-[#555555]">Front End Test</p>
          </div>
        </div>

        {/* Main content */}
        <div className="border border-dashed border-[#d9d9d9] rounded-lg p-6 mb-8">
          <FilterInterface onApplyFilters={handleApplyFilters} />
          <div className="mt-6">
            <DataTable />
          </div>
        </div>
        {/* Footer */}
        <div className="text-right text-xs text-[#757575] py-4">2025</div>
      </div>
    </main>
  )
}

