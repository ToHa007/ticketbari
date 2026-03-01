import React from "react";

/**
 * SHIMMER COMPONENT
 * Moving light effect
 */
const Shimmer = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-slate-600/20 to-transparent" />
  </div>
);

/**
 * 1️⃣ TICKET CARD SKELETON
 * Matches TicketCard layout
 */
export const TicketSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
    
    {/* Image */}
    <div className="relative h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <Shimmer />
    </div>

    <div className="p-5 space-y-4">

      {/* Title */}
      <div className="relative h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 overflow-hidden">
        <Shimmer />
      </div>

      {/* Subtitle */}
      <div className="relative h-3 bg-slate-100 dark:bg-slate-700 rounded-lg w-1/2 overflow-hidden">
        <Shimmer />
      </div>

      {/* Price & Seats */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        
        <div className="space-y-2">
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-10" />
          <div className="relative h-6 bg-brand/10 dark:bg-brand/20 rounded-lg w-16 overflow-hidden">
            <Shimmer />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-10" />
          <div className="relative h-6 bg-slate-100 dark:bg-slate-700 rounded-lg w-12 overflow-hidden">
            <Shimmer />
          </div>
        </div>

      </div>

      {/* Button */}
      <div className="relative h-12 bg-slate-200 dark:bg-slate-800 rounded-lg w-full overflow-hidden">
        <Shimmer />
      </div>

    </div>
  </div>
);

/**
 * 2️⃣ TABLE ROW SKELETON
 */
export const TableRowSkeleton = () => (
  <tr className="border-b border-slate-100 dark:border-slate-800">
    {[...Array(5)].map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full animate-pulse" />
      </td>
    ))}
  </tr>
);

/**
 * 3️⃣ GRID WRAPPER
 */
export const TicketGridSkeleton = ({ cards = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(cards)].map((_, i) => (
      <TicketSkeleton key={i} />
    ))}
  </div>
);