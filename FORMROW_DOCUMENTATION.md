# FormRow Component Documentation

A highly flexible form component that supports multiple field types with customizable properties.

## Features

✅ Multiple field types: text, number, email, password, tel, date, textarea, select, searchable-select, checkbox, radio
✅ Searchable dropdowns with command search interface
✅ Full validation support (required, pattern, min/max)
✅ Error display
✅ Disabled state support
✅ Custom className support
✅ JSON-based configuration for easy form building

## Field Types

| Type | Description | Properties |
|------|-------------|-----------|
| `text` | Text input | placeholder, pattern, required |
| `number` | Number input | min, max, placeholder, required |
| `email` | Email input | placeholder, required |
| `password` | Password input | placeholder, required |
| `tel` | Telephone input | pattern, placeholder, required |
| `date` | Date picker | placeholder, required |
| `textarea` | Multi-line text | rows, placeholder, required |
| `select` | Dropdown (no search) | options (array), placeholder, required |
| `searchable-select` | Dropdown with search | options (array), placeholder, required |
| `checkbox` | Single checkbox | label, disabled |
| `radio` | Radio button group | options (array), disabled |

## Field Configuration Interface

```typescript
interface FormFieldConfig {
  id: string;                    // Unique identifier
  name: string;                  // Input name attribute
  type: FieldType;              // One of the types above
  label?: string;               // Display label
  placeholder?: string;         // Placeholder text
  value?: string | number | boolean;  // Current value
  disabled?: boolean;           // Disable field
  required?: boolean;           // Mark as required
  error?: string;               // Error message to display
  rows?: number;                // For textarea only
  options?: SelectOption[];     // For select/radio/searchable-select
  min?: number;                 // For number input
  max?: number;                 // For number input
  pattern?: string;             // For text validation
  className?: string;           // Custom CSS classes
}
```

## Usage Example

### Basic Form with JSON Config

```tsx
import FormRow, { FormFieldConfig } from "@/components/FormRow";
import { useState } from "react";

const formConfig: FormFieldConfig[] = [
  {
    id: "name",
    name: "name",
    type: "text",
    label: "Full Name",
    placeholder: "Enter your name",
    required: true,
  },
  {
    id: "category",
    name: "category",
    type: "select",
    label: "Category",
    options: [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
    ],
    required: true,
  },
  {
    id: "country",
    name: "country",
    type: "searchable-select",
    label: "Country",
    placeholder: "Search country...",
    options: [
      { label: "USA", value: "us" },
      { label: "Canada", value: "ca" },
      // ... more options
    ],
  },
];

function MyForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  return (
    <form>
      {formConfig.map(field => (
        <FormRow
          key={field.id}
          field={{
            ...field,
            value: formData[field.id],
            error: errors[field.id]
          }}
          onChange={(value) => handleChange(field.id, value)}
        />
      ))}
    </form>
  );
}
```

### With Validation

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const newErrors = {};

  formConfig.forEach(field => {
    if (field.required && !formData[field.id]) {
      newErrors[field.id] = `${field.label} is required`;
    }
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // Submit form
  console.log(formData);
};
```

## Dropdown with Search Example

```typescript
{
  id: "language",
  name: "language",
  type: "searchable-select",
  label: "Programming Language",
  placeholder: "Search language...",
  options: [
    { label: "JavaScript", value: "js" },
    { label: "TypeScript", value: "ts" },
    { label: "Python", value: "py" },
    { label: "Java", value: "java" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
  ]
}
```

## Regular Dropdown (No Search)

```typescript
{
  id: "category",
  name: "category",
  type: "select",
  label: "Category",
  options: [
    { label: "Frontend", value: "frontend" },
    { label: "Backend", value: "backend" },
    { label: "DevOps", value: "devops" },
  ]
}
```

## Field with Validation Example

```typescript
{
  id: "age",
  name: "age",
  type: "number",
  label: "Age",
  placeholder: "Enter your age",
  required: true,
  min: 18,
  max: 100,
  error: undefined // Set dynamically from parent
}
```

## Component Props

```typescript
interface FormRowProps {
  field: FormFieldConfig;           // Field configuration
  onChange: (value: any) => void;   // Called when field value changes
  onBlur?: () => void;              // Called when field loses focus
}
```

## Usage in Your Skills Component

You can refactor your Skills.tsx to use this component:

```tsx
import FormRow, { FormFieldConfig } from "@/components/FormRow";

const skillFormConfig: FormFieldConfig[] = [
  {
    id: "name",
    name: "name",
    type: "text",
    label: "Skill Name",
    placeholder: "e.g., React",
    required: true,
  },
  {
    id: "category",
    name: "category",
    type: "select",
    label: "Category",
    options: [
      { label: "Frontend", value: "Frontend" },
      { label: "Backend", value: "Backend" },
      { label: "Database", value: "Database" },
      // ... more
    ],
    required: true,
  },
  {
    id: "proficiency",
    name: "proficiency",
    type: "select",
    label: "Proficiency Level",
    options: [
      { label: "Beginner", value: "Beginner" },
      { label: "Intermediate", value: "Intermediate" },
      { label: "Advanced", value: "Advanced" },
      { label: "Expert", value: "Expert" },
    ],
    required: true,
  },
];

// In your component, map through the config:
{skillFormConfig.map(field => (
  <FormRow
    key={field.id}
    field={{
      ...field,
      value: formData[field.id],
      error: errors[field.id]
    }}
    onChange={(value) => handleFieldChange(field.id, value)}
  />
))}
```

## Styling

The component uses shadcn/ui components and Tailwind CSS. You can customize styling by:

1. Passing `className` prop to field config
2. Modifying the component directly
3. Using Tailwind CSS classes in your parent component

## Example Page

See `FormRowExample.tsx` for a complete working example with all field types.
