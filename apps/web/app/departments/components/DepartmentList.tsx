'use client';

import Link from 'next/link';
import { useDepartments } from '../hooks/useDepartments';
import { Department } from '@repo/schemas';

export default function DepartmentList() {
  const { data: departments, isLoading, error } = useDepartments();

  if (isLoading) {
    return <DepartmentListSkeleton />;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">
      Error loading departments: {error instanceof Error ? error.message : 'Unknown error'}
    </div>;
  }

  if (!departments || departments.length === 0) {
    return <div className="text-gray-500 p-4">No departments found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((department) => (
        <DepartmentCard key={department.id} department={department} />
      ))}
    </div>
  );
}

function DepartmentCard({ department }: { department: Department }) {
  return (
    <Link href={`/departments/${department.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-2 border-slate-300">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">{department.name}</h2>
        <p className="text-slate-600">{department.description}</p>
        <div className="mt-4 flex justify-end">
          <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm">
            ID: {department.id}
          </span>
        </div>
      </div>
    </Link>
  );
}

function DepartmentListSkeleton() {
  // Create 6 skeleton cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow p-6 animate-pulse border-2 border-slate-300"
        >
          <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-4/6 mb-2"></div>
          <div className="mt-4 flex justify-end">
            <div className="h-6 bg-slate-200 rounded-full w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
} 