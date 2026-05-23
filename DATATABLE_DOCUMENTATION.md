# DataTable Component Documentation

A powerful, reusable table component that automatically generates columns from your data and allows full customization.

## Features

✅ Automatic column generation from data keys
✅ Custom column labels (auto-converted to title case if not provided)
✅ Custom column rendering
✅ Column ordering control
✅ Show/hide columns
✅ Loading and empty states
✅ Custom actions column
✅ Type-safe with TypeScript

## Component API

### DataTableColumn Interface

```typescript
interface DataTableColumn {
  key: string;                    // Data key (required)
  label?: string;                 // Custom column label
  show?: boolean;                 // Show/hide column (default: true)
  render?: (value: any, row: any) => React.ReactNode; // Custom render
}
```

### DataTableConfig Interface

```typescript
interface DataTableConfig {
  columns: DataTableColumn[];     // Column definitions
  columnOrder?: string[];         // Order of columns by key
  actions?: React.ReactNode;      // Actions column header text
  actionRender?: (row: any) => React.ReactNode; // Render actions
  isLoading?: boolean;            // Show loading state
  emptyMessage?: string;          // Message when no data
}
```

### DataTableProps

```typescript
interface DataTableProps {
  data: any[];                    // Array of data rows
  config: DataTableConfig;        // Table configuration
}
```

## Usage Examples

### Basic Table

```tsx
import DataTable from "@/components/DataTable";

function MyPage() {
  const data = [
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" },
  ];

  return (
    <DataTable
      data={data}
      config={{
        columns: [
          { key: "name" },
          { key: "email" },
        ],
      }}
    />
  );
}
```

### Table with Custom Labels

The component automatically converts keys to title case, but you can customize:

```tsx
const config = {
  columns: [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "emailAddress", label: "Email" },
  ],
};
```

### Table with Column Ordering

```tsx
const config = {
  columns: [
    { key: "name" },
    { key: "email" },
    { key: "phone" },
    { key: "id", show: false }, // Hide ID column
  ],
  columnOrder: ["name", "email", "phone"], // Order matters!
};
```

### Table with Custom Rendering

```tsx
const config = {
  columns: [
    { key: "name" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className={`px-2 py-1 rounded ${
          value === "active" 
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: "createdDate",
      label: "Created",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ],
};
```

### Table with Actions

```tsx
const config = {
  columns: [
    { key: "name" },
    { key: "email" },
  ],
  actions: "Actions",
  actionRender: (row) => (
    <div className="space-x-2 flex justify-end">
      <button onClick={() => handleEdit(row)}>Edit</button>
      <button onClick={() => handleDelete(row.id)}>Delete</button>
    </div>
  ),
};
```

### Table with Loading State

```tsx
const [isLoading, setIsLoading] = useState(true);
const [data, setData] = useState([]);

useEffect(() => {
  fetchData();
}, []);

return (
  <DataTable
    data={data}
    config={{
      columns: [...],
      isLoading: isLoading,
      emptyMessage: "No records found",
    }}
  />
);
```

## Real-World Example: Skills Table

```tsx
import DataTable, { DataTableColumn } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
}

function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tableColumns: DataTableColumn[] = [
    { key: "name", label: "Skill Name" },
    { key: "category", label: "Category" },
    {
      key: "proficiency",
      label: "Proficiency",
      render: (value) => (
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
          {value}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={skills}
      config={{
        columns: tableColumns,
        columnOrder: ["name", "category", "proficiency"],
        isLoading: isLoading,
        emptyMessage: "No skills yet",
        actions: "Actions",
        actionRender: (skill: Skill) => (
          <div className="space-x-2 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(skill)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(skill.id)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ),
      }}
    />
  );
}
```

## Column Label Auto-Conversion

The component automatically converts keys to title case:

| Key | Auto Label |
|-----|-----------|
| `name` | Name |
| `firstName` | First Name |
| `first_name` | First Name |
| `created_at` | Created At |
| `emailAddress` | Email Address |

## Styling

The component uses:
- shadcn/ui Table component for base styling
- Tailwind CSS for responsiveness
- Dark mode support built-in

## Tips & Tricks

1. **Hide ID columns**: Set `show: false` for ID or internal fields
2. **Format dates**: Use `render` function to format date values
3. **Dynamic styling**: Use `render` to conditionally apply classes
4. **Sort columns**: Arrange keys in `columnOrder` in your desired order
5. **Custom actions**: Pass any JSX to `actionRender`

## Performance

- Renders efficiently with large datasets
- No pagination built-in (can be added via wrapper component)
- Use `isLoading` to show skeleton loaders during data fetch

## Common Patterns

### With Pagination

```tsx
const [page, setPage] = useState(1);
const itemsPerPage = 10;
const paginatedData = data.slice(
  (page - 1) * itemsPerPage,
  page * itemsPerPage
);

return (
  <div>
    <DataTable data={paginatedData} config={config} />
    <PaginationControls page={page} onPageChange={setPage} />
  </div>
);
```

### With Search Filtering

```tsx
const [search, setSearch] = useState("");
const filteredData = data.filter(item =>
  item.name.toLowerCase().includes(search.toLowerCase())
);

return (
  <div>
    <input
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <DataTable data={filteredData} config={config} />
  </div>
);
```
