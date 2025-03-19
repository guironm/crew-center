"use client";

import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import Modal from "../components/ui/Modal";
import CreateEmployeeForm from "./components/CreateEmployeeForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import EmployeeList from "./components/EmployeeList";
export default function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <MainLayout>
      <div className="py-4">
        <EmployeeList />
      </div>

      <FloatingActionButton
        icon={<PlusIcon className="w-8 h-8" />}
        onClick={openModal}
        aria-label="Add new employee"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Create New Employee"
      >
        <CreateEmployeeForm onSuccess={closeModal} />
      </Modal>
    </MainLayout>
  );
}
