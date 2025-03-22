"use client";

import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ApiSearchParams } from "@repo/schemas";

export interface SearchBarProps {
  onSearch: (params: ApiSearchParams) => void;
  initialParams?: ApiSearchParams;
  placeholder?: string;
  filters?: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
}

export default function SearchBar({
  onSearch,
  initialParams = { sortOrder: "asc" },
  placeholder = "Search...",
  filters = [],
}: SearchBarProps) {
  // Initialize query from initial params or empty string
  const [query, setQuery] = useState(initialParams?.query || "");

  // Add a ref for the search input
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize filter values from initial params
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    filters.reduce(
      (acc, filter) => {
        // Type-safe property access
        acc[filter.name] =
          filter.name in initialParams
            ? String(
                initialParams[filter.name as keyof typeof initialParams] || "",
              )
            : "";
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  // Debounce the search to avoid too many requests
  useEffect(() => {
    // Skip initial render search if query and filters are empty
    if (
      query === "" &&
      Object.values(filterValues).every((val) => val === "")
    ) {
      // Only trigger search if initialParams had some values we need to apply
      const hasInitialFilters = filters.some(
        (filter) =>
          filter.name in initialParams &&
          initialParams[filter.name as keyof typeof initialParams] !== "",
      );

      if (!hasInitialFilters && !initialParams?.query) {
        return;
      }
    }

    // Add a debug log to track when this effect runs
    console.log(
      `[${new Date().toISOString()}] Search debounce effect triggered:`,
      { query, filterValues },
    );

    const handler = setTimeout(() => {
      const searchParams: ApiSearchParams = {
        query: query || undefined,
        sortOrder: initialParams.sortOrder || "asc",
      };

      // Add filter values to search params
      filters.forEach((filter) => {
        // Always add the filter value, even if empty (so it's explicitly set to undefined rather than omitted)
        const value = filterValues[filter.name] || undefined;
        Object.assign(searchParams, { [filter.name]: value });
      });

      console.log("Sending search params:", searchParams);
      onSearch(searchParams);

      // Remove the auto-focus when search is triggered
      // This was causing the focus to shift to search input when selecting filters
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query, filterValues, onSearch, filters, initialParams]);

  const resetSearch = () => {
    setQuery("");

    // Reset all filter values
    const newFilterValues = { ...filterValues };
    Object.keys(newFilterValues).forEach((key) => {
      newFilterValues[key] = "";
    });
    setFilterValues(newFilterValues);

    // Reset to initial sortOrder
    onSearch({ sortOrder: initialParams.sortOrder || "asc" });

    // Focus back on search input after reset
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle filter change
  const handleFilterChange = (filterName: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => {
              setQuery("");
              // Focus back on input after clearing
              if (searchInputRef.current) {
                searchInputRef.current.focus();
              }
            }}
          >
            <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {filters.length > 0 && (
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
          {filters.map((filter) => (
            <div key={filter.name} className="w-full sm:w-1/3">
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterValues[filter.name] || ""}
                onChange={(e) =>
                  handleFilterChange(filter.name, e.target.value)
                }
              >
                <option value="">{filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="w-full sm:w-1/3">
            <button
              type="button"
              onClick={resetSearch}
              className="w-full p-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
