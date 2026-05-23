# Skills Form Configuration (JSON)

## Overview

The Skills dialog form uses a JSON-based configuration with the `FormRow` component for dynamic form rendering. This approach makes it easy to add, remove, or modify form fields without changing the JSX.

## Form Configuration Structure

```typescript
const formFieldsConfig: FormFieldConfig[] = [
  {
    id: "name",
    name: "name",
    type: "text",
    label: "Skill Name",
    placeholder: "e.g., React",
    value: formData.name,
    required: true,
  },
  {
    id: "category",
    name: "category",
    type: "select",
    label: "Category",
    placeholder: "Select category",
    value: formData.category,
    required: true,
    options: [
      { label: "Frontend", value: "Frontend" },
      { label: "Backend", value: "Backend" },
      { label: "Database", value: "Database" },
      { label: "DevOps", value: "DevOps" },
      { label: "Language", value: "Language" },
      { label: "Tool", value: "Tool" },
    ],
  },
  {
    id: "proficiency",
    name: "proficiency",
    type: "select",
    label: "Proficiency Level",
    placeholder: "Select proficiency",
    value: formData.proficiency,
    required: true,
    options: [
      { label: "Beginner", value: "Beginner" },
      { label: "Intermediate", value: "Intermediate" },
      { label: "Advanced", value: "Advanced" },
      { label: "Expert", value: "Expert" },
    ],
  },
];
```

## Field Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the field |
| `name` | string | Yes | Form field name (used in form data) |
| `type` | string | Yes | Field type: text, select, email, etc. |
| `label` | string | No | Display label for the field |
| `placeholder` | string | No | Placeholder text |
| `value` | string \| number \| boolean | No | Current field value |
| `required` | boolean | No | Mark field as required (shows *) |
| `options` | SelectOption[] | No | Array of options for select/radio |
| `disabled` | boolean | No | Disable the field |
| `error` | string | No | Error message to display |

## FormRow Component Integration

```tsx
{formFieldsConfig.map((field) => (
  <FormRow
    key={field.id}
    field={field}
    onChange={(value) => handleFieldChange(field.id, value)}
  />
))}
```

## State Management

```typescript
const [formData, setFormData] = useState({
  name: "",
  category: "",
  proficiency: "",
});

const handleFieldChange = (fieldId: string, value: string | number | boolean) => {
  setFormData((prev) => ({ ...prev, [fieldId]: value }));
};
```

## Adding New Fields

To add a new field to the form:

1. **Update form state:**
```typescript
const [formData, setFormData] = useState({
  name: "",
  category: "",
  proficiency: "",
  description: "", // NEW FIELD
});
```

2. **Add field to config:**
```typescript
{
  id: "description",
  name: "description",
  type: "textarea",
  label: "Description",
  placeholder: "Enter skill description",
  value: formData.description,
  rows: 3,
}
```

3. **That's it!** The FormRow component will automatically render it.

## Example: Adding More Field Types

```typescript
const formFieldsConfig: FormFieldConfig[] = [
  // Text input
  {
    id: "name",
    name: "name",
    type: "text",
    label: "Skill Name",
    value: formData.name,
  },
  
  // Textarea
  {
    id: "description",
    name: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Describe this skill",
    value: formData.description,
    rows: 4,
  },
  
  // Select dropdown
  {
    id: "category",
    name: "category",
    type: "select",
    label: "Category",
    value: formData.category,
    options: [
      { label: "Frontend", value: "frontend" },
      { label: "Backend", value: "backend" },
    ],
  },
  
  // Searchable select
  {
    id: "level",
    name: "level",
    type: "searchable-select",
    label: "Difficulty Level",
    value: formData.level,
    options: [
      { label: "Beginner", value: "beginner" },
      { label: "Intermediate", value: "intermediate" },
      { label: "Advanced", value: "advanced" },
    ],
  },
  
  // Number input
  {
    id: "yearsOfExperience",
    name: "yearsOfExperience",
    type: "number",
    label: "Years of Experience",
    value: formData.yearsOfExperience,
    min: 0,
    max: 50,
  },
  
  // Email
  {
    id: "email",
    name: "email",
    type: "email",
    label: "Contact Email",
    value: formData.email,
  },
  
  // Checkbox
  {
    id: "isActive",
    name: "isActive",
    type: "checkbox",
    label: "Active",
    value: formData.isActive,
  },
];
```

## Benefits of JSON Configuration Approach

✅ **Dynamic Rendering** - Add/remove fields by modifying the config array
✅ **Cleaner JSX** - No manual form field markup
✅ **Type-Safe** - FormFieldConfig interface ensures correct properties
✅ **Reusable** - Same component used across the app
✅ **Easy Validation** - Can add validation logic in FormRow component
✅ **Flexible** - Custom rendering with `render` function in FormFieldConfig

## Validation Example

```typescript
const handleAddSkill = () => {
  // Validate required fields from config
  const errors: { [key: string]: string } = {};
  
  formFieldsConfig.forEach((field) => {
    if (field.required && !formData[field.id as keyof typeof formData]) {
      errors[field.id] = `${field.label} is required`;
    }
  });

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  // Submit form...
};
```

## Conditional Field Display

```typescript
const visibleFields = formFieldsConfig.filter((field) => {
  // Hide email field if not admin
  if (field.id === "email" && !isAdmin) return false;
  return true;
});

{visibleFields.map((field) => (
  <FormRow key={field.id} field={field} onChange={...} />
))}
```

## Related Components

- **FormRow**: Main component that renders individual fields
- **FormFieldConfig**: TypeScript interface defining field configuration
- **SelectOption**: Interface for select/radio options

## Comparison: Before vs After

### Before (Manual JSX)
```tsx
<div>
  <Label htmlFor="name">Skill Name</Label>
  <Input
    id="name"
    name="name"
    value={formData.name}
    onChange={handleInputChange}
    placeholder="e.g., React"
  />
</div>

<div>
  <Label htmlFor="category">Category</Label>
  <Select
    value={formData.category}
    onValueChange={(value) => handleSelectChange("category", value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Frontend">Frontend</SelectItem>
      {/* ... more items */}
    </SelectContent>
  </Select>
</div>

{/* ... repeated for each field */}
```

### After (FormRow Configuration)
```tsx
const formFieldsConfig = [
  { id: "name", type: "text", label: "Skill Name", ... },
  { id: "category", type: "select", label: "Category", options: [...] },
  { id: "proficiency", type: "select", label: "Proficiency Level", ... },
];

{formFieldsConfig.map((field) => (
  <FormRow
    key={field.id}
    field={field}
    onChange={(value) => handleFieldChange(field.id, value)}
  />
))}
```

**Much cleaner and more maintainable!** ✨
