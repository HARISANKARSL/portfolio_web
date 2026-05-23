import { useState } from "react";
import FormRow, { FormFieldConfig } from "@/components/FormRow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

// Example JSON configuration for your form fields
const formFieldsConfig: FormFieldConfig[] = [
  {
    id: "firstName",
    name: "firstName",
    type: "text",
    label: "First Name",
    placeholder: "Enter your first name",
    required: true,
  },
  {
    id: "email",
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    required: true,
  },
  {
    id: "phone",
    name: "phone",
    type: "tel",
    label: "Phone Number",
    placeholder: "+1 (555) 000-0000",
    pattern: "[0-9+\\-() ]*",
  },
  {
    id: "age",
    name: "age",
    type: "number",
    label: "Age",
    placeholder: "Enter your age",
    min: 18,
    max: 100,
  },
  {
    id: "category",
    name: "category",
    type: "select",
    label: "Category",
    placeholder: "Select a category",
    options: [
      { label: "Frontend", value: "frontend" },
      { label: "Backend", value: "backend" },
      { label: "DevOps", value: "devops" },
      { label: "Database", value: "database" },
    ],
    required: true,
  },
  {
    id: "skillLevel",
    name: "skillLevel",
    type: "searchable-select",
    label: "Skill Level",
    placeholder: "Search skill level...",
    options: [
      { label: "Beginner", value: "beginner" },
      { label: "Intermediate", value: "intermediate" },
      { label: "Advanced", value: "advanced" },
      { label: "Expert", value: "expert" },
      { label: "Master", value: "master" },
    ],
  },
  {
    id: "country",
    name: "country",
    type: "searchable-select",
    label: "Country",
    placeholder: "Search country...",
    options: [
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "United Kingdom", value: "uk" },
      { label: "Germany", value: "de" },
      { label: "France", value: "fr" },
      { label: "India", value: "in" },
      { label: "Australia", value: "au" },
    ],
  },
  {
    id: "bio",
    name: "bio",
    type: "textarea",
    label: "Bio",
    placeholder: "Tell us about yourself...",
    rows: 4,
  },
  {
    id: "startDate",
    name: "startDate",
    type: "date",
    label: "Start Date",
    required: true,
  },
  {
    id: "subscribe",
    name: "subscribe",
    type: "checkbox",
    label: "Subscribe to newsletter",
  },
  {
    id: "status",
    name: "status",
    type: "radio",
    label: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "On Leave", value: "leave" },
    ],
  },
];

interface FormData {
  [key: string]: string | number | boolean;
}

const FormRowExample = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleFieldChange = (fieldId: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation example
    const newErrors: { [key: string]: string } = {};

    formFieldsConfig.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Form Data:", formData);
    alert("Form submitted! Check console for data.");
  };

  const handleReset = () => {
    setFormData({});
    setErrors({});
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">FormRow Component Example</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Dynamic form builder with multiple field types
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Map through the configuration and render FormRow for each field */}
            {formFieldsConfig.map((field) => (
              <FormRow
                key={field.id}
                field={{
                  ...field,
                  value: formData[field.id],
                  error: errors[field.id],
                }}
                onChange={(value) => handleFieldChange(field.id, value)}
              />
            ))}

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Submit Form
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </form>
        </Card>

        {/* Display submitted data */}
        {Object.keys(formData).length > 0 && (
          <Card className="p-6 bg-gray-50 dark:bg-gray-900">
            <h2 className="font-bold mb-4">Form Data Preview:</h2>
            <pre className="bg-white dark:bg-gray-800 p-4 rounded overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FormRowExample;
