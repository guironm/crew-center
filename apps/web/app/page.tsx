import EmployeeList from "./components/EmployeeList";
import MainLayout from "./layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <EmployeeList />
    </MainLayout>
  );
}
