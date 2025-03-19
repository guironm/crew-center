"use client";

import DepartmentList from "./components/DepartmentList";
import MainLayout from "../layout/MainLayout";

export default function DepartmentsPage() {
  return (
    <MainLayout>
      <div className="py-4">
        <DepartmentList />
      </div>
    </MainLayout>
  );
}
