"use client";

import Link from "next/link";
import { Department } from "@repo/schemas";

interface DepartmentCardProps {
  department: Department;
}

export default function DepartmentCard({ department }: DepartmentCardProps) {
  return (
    <Link href={`/departments/${department.id}`}>
      <div className="hover:border-slate-600 bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-2 border-slate-300">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          {department.name}
        </h2>
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
