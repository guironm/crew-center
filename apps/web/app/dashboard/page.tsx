"use client";

import MainLayout from "../layout/MainLayout";
import DashboardCard from "./components/DashboardCard";
import employeesImg from "./assets/images/employees.webp";
import departmentsImg from "./assets/images/departments.webp";
import envelopeImg from "./assets/images/envelope.webp";
import { useStatistics } from "./hooks/useStatistics";

export default function DashboardPage() {
  const { statistics, loading, error } = useStatistics();

  return (
    <MainLayout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-pulse text-lg">Loading statistics...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-500">
              Error loading dashboard data. Please try again later.
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DashboardCard
              title="Employees"
              count={statistics.employees.total}
              description="Total employees in the system"
              link="/employees"
              imageSrc={employeesImg.src}
              delay={0}
            />

            <DashboardCard
              title="Departments"
              count={statistics.departments}
              description="Active departments"
              link="/departments"
              imageSrc={departmentsImg.src}
              delay={0.2}
            />

            <DashboardCard
              title="Communications"
              count={statistics.communications}
              description="Employees cc'd this month"
              link="/employees"
              imageSrc={envelopeImg.src}
              delay={0.4}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
