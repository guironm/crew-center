"use client";

import { useParams, useRouter } from "next/navigation";
import { useEmployee, useDeleteEmployee } from "../hooks/useEmployees";
import MainLayout from "../../layout/MainLayout";
import {
  EnvelopeIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  CalendarIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import Modal from "../../components/ui/Modal";
import EditEmployeeForm from "../components/EditEmployeeForm";

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Use the employee hook with specific caching options for this page
  const {
    data: employee,
    isLoading,
    error,
  } = useEmployee(id, {
    // Override default caching - keep this data fresh for just 1 minute
    staleTime: 60 * 1000,
  });

  // Use delete employee hook
  const deleteMutation = useDeleteEmployee();

  const handleBack = () => {
    router.back();
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEdit = () => {
    openEditModal();
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this employee? This action cannot be undone.",
      )
    ) {
      setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(id);
        // Navigate back to employees list after successful deletion
        router.push("/employees");
      } catch (error) {
        console.error("Error deleting employee:", error);
        setIsDeleting(false);
        alert(
          `Failed to delete employee: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }
  };

  {
    /* ddnt feel like using a skeleton loader, so here's a simple one */
  }
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded w-1/2 mb-6"></div>
            <div className="flex mb-6">
              <div className="w-24 h-24 bg-slate-200 rounded-full mr-6"></div>
              <div className="flex-1">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6 mb-2"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !employee) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-rose-600 p-4 rounded-lg mb-4">
            {error instanceof Error && error.message.includes("404")
              ? "Employee not found. The requested employee ID does not exist in the database."
              : `Error loading employee: ${error instanceof Error ? error.message : "Employee not found"}`}
          </div>
          <button
            onClick={handleBack}
            className="flex items-center text-slate-600 hover:text-slate-800"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Employees
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-slate-600 hover:text-slate-800 mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-slate-800">
            Employee Profile
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 bg-gray-50">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 relative mb-4">
                  {employee.picture ? (
                    <Image
                      src={employee.picture}
                      alt={employee.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-blue-100 text-sky-600 flex items-center justify-center">
                      <span className="font-bold text-4xl">
                        {employee.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {employee.name}
                </h2>
                <p className="text-slate-600 mb-2">{employee.role}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    employee.status === "active"
                      ? "bg-green-100 text-green-800"
                      : employee.status === "on_leave"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-rose-800"
                  }`}
                >
                  {employee.status.replace("_", " ")}
                </span>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={handleEdit}
                    className="flex items-center bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-md transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-md transition-colors disabled:bg-rose-400"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-slate-700 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-5 h-5 mr-2 text-slate-500" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="w-5 h-5 mr-2 text-slate-500" />
                      <span>
                        {employee.department
                          ? employee.department.name
                          : "Unknown Department"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-slate-700 mb-4">
                    Employment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="w-5 h-5 mr-2 text-slate-500" />
                      <span>${employee.salary.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2 text-slate-500" />
                      <span>
                        {employee.hireDate
                          ? new Date(employee.hireDate).toLocaleDateString()
                          : "Not available"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <HashtagIcon className="w-5 h-5 mr-2 text-slate-500" />
                      <span>ID: {employee.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Employee Modal */}
        {employee && (
          <Modal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            title="Edit Employee"
          >
            <EditEmployeeForm employee={employee} onSuccess={closeEditModal} />
          </Modal>
        )}
      </div>
    </MainLayout>
  );
}
