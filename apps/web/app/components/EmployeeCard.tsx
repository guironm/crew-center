"use client";

import { EnvelopeIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { Employee } from "@repo/schemas";
import { useEffect, useState } from "react";
import Image from "next/image";

interface EmployeeCardProps {
  employee: Employee;
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Generate a consistent seed from the employee's ID to get the same image every time
    const seed = employee.id.toString();
    const numericSeed = parseInt(seed, 36) % 99;
    // Use even/odd value to determine gender
    const gender = numericSeed % 2 === 0 ? "men" : "women";
    setImageUrl(
      `https://randomuser.me/api/portraits/${gender}/${numericSeed}.jpg`,
    );
  }, [employee.id]);

  return (
    <div className="rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg bg-white">
      <div className="flex items-center mb-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={employee.name}
            width={75}
            height={75}
            className="rounded-full mr-4 object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
            <span className="font-bold text-xl">{employee.name.charAt(0)}</span>
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
          <span>{employee.department}</span>
        </div>
      </div>
    </div>
  );
}
