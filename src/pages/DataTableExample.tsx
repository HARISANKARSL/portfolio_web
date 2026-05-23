import { useState } from "react";
import DataTable, { DataTableColumn } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import SectionHeader from "@/components/SectionHeader";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  joinDate: string;
}

const DataTableExample = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8901",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 234-567-8902",
      status: "active",
      joinDate: "2024-02-20",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1 234-567-8903",
      status: "inactive",
      joinDate: "2023-12-10",
    },
  ]);

  const handleEdit = (user: User) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // Define columns with custom rendering
  const columns: DataTableColumn[] = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email Address" },
    { key: "phone", label: "Phone Number" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === "active"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "joinDate",
      label: "Join Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionHeader
          title="Users Management"
          description="Manage your users with the flexible DataTable component"
          button={true}
          buttonLabel="Add User"
          onButtonClick={() => console.log("Add new user")}
        />

        <DataTable
          data={users}
          config={{
            columns: columns,
            columnOrder: ["name", "email", "phone", "status", "joinDate"],
            emptyMessage: "No users found",
            actions: "Actions",
            actionRender: (user: User) => (
              <div className="space-x-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(user)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ),
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default DataTableExample;
