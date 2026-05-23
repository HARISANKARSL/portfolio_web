# Skills Management - Advanced Features Documentation

## Overview
The updated Skills Management page now includes:
- ✅ Dynamic API calls with pagination, search, sorting
- ✅ Debounced search functionality
- ✅ Configurable page size
- ✅ Table and Grid view toggle
- ✅ Pagination controls based on API response
- ✅ Real-time API payload generation

## Features

### 1. Dynamic API Calls

The component builds a payload dynamically based on user input:

```typescript
{
  "search": "react",          // From search input
  "page": 1,                  // Current page
  "limit": 10,                // Items per page
  "filters": {
    "status": "active"        // Fixed filter
  },
  "sortBy": "createdAt",
  "sortOrder": -1             // -1 for desc, 1 for asc
}
```

### 2. Search Functionality

- **Debounced Search**: 500ms delay to avoid excessive API calls
- **Auto-reset**: Returns to page 1 when searching
- **Search Input**: Located in the header with hide/show capability

```tsx
<SectionHeader
  isSearch={true}
  searchPlaceholder="Search skills..."
  searchValue={search}
  onSearchChange={setSearch}
/>
```

### 3. Pagination

Uses pagination data from API response:

```typescript
pagination: {
  currentPage: 1,
  pageSize: 10,
  totalCount: 45,
  totalPages: 5,
  hasNextPage: true,
  hasPreviousPage: false
}
```

**Controls:**
- Previous/Next buttons (disabled when not available)
- Page size selector (5, 10, 20, 50 items)
- Display: "Page X of Y (Z total)"

### 4. View Toggle

**Two view types:**

#### Table View
- Responsive table with columns
- Edit/Delete actions for each row
- Full pagination controls

#### Grid View
- Card-based layout
- Show skill name, description, image
- Status badge
- Responsive: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)

### 5. SkillCard Component

Used in Grid View:

```tsx
interface SkillCardProps {
  skill: {
    _id: string;
    name: string;
    description?: string;
    icon?: string;
    image?: string;
    status: string;
  };
  onEdit: (skill: any) => void;
  onDelete: (id: string) => void;
}
```

Features:
- Image display with fallback
- Description text
- Status badge (active/inactive)
- Edit/Delete buttons

## Component Integration

### SectionHeader Updates

Added search support:

```tsx
interface SectionHeaderProps {
  title: string;
  description?: string;
  button?: boolean;
  buttonLabel?: string;
  onButtonClick?: () => void;
  isSearch?: boolean;              // NEW
  searchPlaceholder?: string;       // NEW
  searchValue?: string;            // NEW
  onSearchChange?: (value: string) => void; // NEW
}
```

Usage:
```tsx
<SectionHeader
  title="Skills Management"
  description="Add, edit, and manage your skills"
  button={true}
  buttonLabel="Add Skill"
  onButtonClick={handleAddClick}
  isSearch={true}                  // Enable search
  searchPlaceholder="Search..."
  searchValue={search}
  onSearchChange={setSearch}
/>
```

## State Management

```typescript
// Pagination
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [pagination, setPagination] = useState({...});

// Search & Filters
const [search, setSearch] = useState("");
const [sortBy, setSortBy] = useState("createdAt");
const [sortOrder, setSortOrder] = useState(-1); // -1 or 1

// View Control
const [viewType, setViewType] = useState<"table" | "grid">("table");

// Data
const [skills, setSkills] = useState<Skill[]>([]);
const [isLoading, setIsLoading] = useState(true);
```

## API Response Format

Expected API response:

```json
{
  "message": "Skills fetched successfully",
  "data": [
    {
      "_id": "69cf4d389d1da43cff4022e8",
      "userId": "69c932639748cc7504183a06",
      "name": "React",
      "description": "Frontend library",
      "icon": "react-icon",
      "image": "react.png",
      "status": "active",
      "createdAt": "2026-04-03T05:16:40.508Z",
      "updatedAt": "2026-04-03T05:16:40.508Z"
    }
  ],
  "status": true,
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Hook Functions

### fetchSkills
```typescript
const fetchSkills = useCallback(async (
  currentPage: number = 1,
  currentPageSize: number = 10,
  searchQuery: string = ""
) => {
  // Builds payload and calls API
  const payload = {
    search: searchQuery,
    page: currentPage,
    limit: currentPageSize,
    filters: { status: "active" },
    sortBy,
    sortOrder,
  };
  
  const res = await fetchTechStack(payload);
  setSkills(res.data);
  setPagination(res.pagination);
}, [sortBy, sortOrder]);
```

### Debounced Search
```typescript
useEffect(() => {
  // Debounce search input by 500ms
  const timer = setTimeout(() => {
    setPage(1); // Reset to first page
    fetchSkills(1, pageSize, search);
  }, 500);
  
  return () => clearTimeout(timer);
}, [search, pageSize, fetchSkills]);
```

## Usage Examples

### Basic Implementation

```tsx
// Default setup in Skills.tsx
<SectionHeader
  title="Skills Management"
  isSearch={true}
  searchValue={search}
  onSearchChange={setSearch}
/>

<button onClick={() => setViewType("table")}>Table</button>
<button onClick={() => setViewType("grid")}>Grid</button>
```

### Customizing Page Size Options

In the Select component:
```tsx
<Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
  <SelectContent>
    <SelectItem value="5">5 per page</SelectItem>
    <SelectItem value="10">10 per page</SelectItem>
    <SelectItem value="20">20 per page</SelectItem>
    <SelectItem value="50">50 per page</SelectItem>
  </SelectContent>
</Select>
```

### Changing Sort Order

```typescript
// Update sort order
setSortOrder(sortOrder === -1 ? 1 : -1);
// Refetch with new sort
fetchSkills(page, pageSize, search);
```

## Performance Tips

1. **Debounced Search**: Uses 500ms debounce to limit API calls
2. **Lazy Loading**: Only fetch when needed
3. **Memoized Callback**: `useCallback` prevents unnecessary re-renders
4. **Efficient Pagination**: Only load items for current page

## Hiding Search

To hide search on certain pages:

```tsx
<SectionHeader
  isSearch={false}  // Hide search
  {...otherProps}
/>
```

## Creating Similar Pages

To create similar dynamic tables:

1. Copy the pagination state setup
2. Create your own `fetchData` function
3. Replace `DataTable` config with your columns
4. Add grid view component if needed

Template:
```tsx
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [search, setSearch] = useState("");
const [pagination, setPagination] = useState({...});

const fetchData = useCallback(async (...) => {
  // Build payload
  // Call API
  // Set state
}, [...dependencies]);

// Use in effects and handlers
```

## Troubleshooting

### Search not working
- Check API endpoint accepts `search` parameter
- Verify debounce delay (500ms)
- Check browser console for API errors

### Pagination not updating
- Ensure API response includes `pagination` object
- Check field names match expected format
- Log `pagination` state in useEffect

### Grid view not showing images
- Verify `image` field in API response
- Check image URLs are valid
- Add fallback styling in SkillCard

## Future Enhancements

- [ ] Add sorting column headers (click to sort)
- [ ] Add advanced filters modal
- [ ] Add bulk actions
- [ ] Export as CSV
- [ ] Infinite scroll option
