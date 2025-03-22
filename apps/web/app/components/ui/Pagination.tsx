"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Pagination component with page numbers and navigation buttons
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxButtons = 5; // Display max 5 page buttons

    if (totalPages <= maxButtons) {
      // Show all pages if total is less than max buttons
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first and last page
      // and some pages around current page

      // Always show page 1
      pages.push(1);

      // Calculate middle pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after page 1 if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  return (
    <div className="flex items-center justify-center space-x-2 my-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-5 w-5 text-slate-700" />
      </button>

      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) =>
          typeof page === "string" ? (
            // Render ellipsis
            <span key={`ellipsis-${index}`} className="px-3 py-1">
              {page}
            </span>
          ) : (
            // Render page button
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded border cursor-pointer ${
                page === currentPage 
                ? "bg-slate-600 text-white border-slate-600" 
                : "border-slate-300 hover:bg-slate-200 text-slate-800"
              }`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-5 w-5 text-slate-700" />
      </button>
    </div>
  );
}
