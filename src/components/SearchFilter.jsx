import { Search, SlidersHorizontal, X } from 'lucide-react'

const ALL_CATEGORIES = ['Technology', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Social', 'Seminar']

export default function SearchFilter({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
}) {
    const hasActiveFilters = searchQuery || statusFilter !== 'all' || categoryFilter

    const clearAll = () => {
        setSearchQuery('')
        setStatusFilter('all')
        setCategoryFilter('')
    }

    return (
        <div className="relative bg-paper p-4 sm:p-6 border-2 border-charcoal-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:transform sm:rotate-1">
            {/* Texture overlay */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-30 pointer-events-none mix-blend-multiply"></div>

            {/* Pin graphic */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-500 border-2 border-charcoal-900 shadow-md z-20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-300/50"></div>
            </div>

            <div className="relative z-10 space-y-5">
                {/* Search bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search events (e.g. 'Tech Talk')..."
                        className="input-handwritten pl-12"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-900 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Filter row */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 text-charcoal-900 font-heading font-bold text-sm bg-tape-yellow px-2 py-1 border-2 border-charcoal-900 -rotate-2 shadow-sm">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>FILTERS</span>
                    </div>

                    {/* Status filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none w-full sm:w-auto px-4 py-2 bg-paper border-2 border-charcoal-900 text-charcoal-900 font-typewriter text-sm focus:outline-none cursor-pointer hover:bg-gray-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] pr-8"
                        >
                            <option value="all">All Events</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="past">Past</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-2 border-charcoal-900 pl-2">
                            <span className="text-charcoal-900 text-xs">▼</span>
                        </div>
                    </div>

                    {/* Category filter */}
                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="appearance-none w-full sm:w-auto px-4 py-2 bg-paper border-2 border-charcoal-900 text-charcoal-900 font-typewriter text-sm focus:outline-none cursor-pointer hover:bg-gray-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] pr-8"
                        >
                            <option value="">All Categories</option>
                            {ALL_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-2 border-charcoal-900 pl-2">
                            <span className="text-charcoal-900 text-xs">▼</span>
                        </div>
                    </div>

                    {/* Clear filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-1.5 px-3 py-2 bg-coral-500 border-2 border-charcoal-900 text-charcoal-900 text-sm font-bold font-heading hover:bg-coral-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                        >
                            <X className="w-4 h-4" />
                            CLEAR
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
