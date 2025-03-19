'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../../layout/MainLayout';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useDepartment } from '../hooks/useDepartments';

interface Department {
  id: string | number;
  name: string;
  description: string;
}

export default function DepartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: department, isLoading, error } = useDepartment(id);

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6 mb-2"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !department) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            Error loading department: {error instanceof Error ? error.message : 'Department not found'}
          </div>
          <button
            onClick={handleBack}
            className="flex items-center text-slate-600 hover:text-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Departments
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Department Detail</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800">{department.name}</h2>
            <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm mt-2">
              ID: {department.id}
            </span>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-medium text-slate-700 mb-2">Description</h3>
            <p className="text-slate-600">{department.description}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 