import MainLayout from "../layout/MainLayout";
import DepartmentList from './components/DepartmentList';

export default function DepartmentsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
          <p className="text-slate-600">View and manage departments</p>
        </div>
        
        <DepartmentList />
      </div>
    </MainLayout>
  );
} 