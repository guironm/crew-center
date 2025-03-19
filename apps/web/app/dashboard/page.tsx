import MainLayout from "../layout/MainLayout";
import DashboardCard from "./components/DashboardCard";
import employeesImg from "./assets/images/employees.webp";
import departmentsImg from "./assets/images/departments.webp";
import envelopeImg from "./assets/images/envelope.webp";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard
            title="Employees"
            count="150"
            description="Total employees in the system"
            link="/employees"
            imageSrc={employeesImg.src}
          />

          <DashboardCard
            title="Departments"
            count="7"
            description="Active departments"
            link="/departments"
            imageSrc={departmentsImg.src}
          />

          <DashboardCard
            title="Communications"
            count="120"
            description="Employees cc'd this month"
            link="/employees"
            imageSrc={envelopeImg.src}
          />
        </div>
      </div>
    </MainLayout>
  );
}
