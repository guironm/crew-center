"use client";

import { EnvelopeIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { Employee } from "@repo/schemas";
import Image from "next/image";
import Link from "next/link";

interface EmployeeCardProps {
  employee: Employee;
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <Link href={`/employees/${employee.id}`}>
      <div className="rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg bg-white border-2 border-slate-300">
        <div className="flex items-center mb-4">
          {employee.picture ? (
            <Image
              src={employee.picture}
              alt={employee.name}
              width={75}
              height={75}
              className="rounded-full mr-4 object-cover"
            />
          ) : (
            <div className="w-18 h-18 rounded-full bg-blue-100 text-sky-600 flex items-center justify-center mr-4">
              <span className="font-bold text-xl">
                {employee.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">{employee.name}</h3>
            <p className="text-gray-600">{employee.role}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <EnvelopeIcon className="w-4 h-4 mr-2" />
            <span>{employee.email}</span>
          </div>
          <div className="flex items-center">
            <BuildingOfficeIcon className="w-4 h-4 mr-2" />
            <span>
              {employee.department
                ? employee.department.name
                : "Unknown Department"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
