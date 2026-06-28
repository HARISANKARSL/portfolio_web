import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormFieldConfig {
  id: string;
  name: string;
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "searchable-select"
    | "checkbox"
    | "radio"
    | "date"
    | "tel"
    | "multi-select";
  label?: string;
  placeholder?: string;
  value?: string | number | boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  rows?: number; // for textarea
  options?: SelectOption[]; // for select and radio
  min?: number; // for number
  max?: number; // for number
  pattern?: string; // for text validation
  className?: string;
}

interface FormRowProps {
  field: FormFieldConfig;
  onChange: (value: string | number | boolean) => void;
  onBlur?: () => void;
}

const FormRow = ({ field, onChange, onBlur }: FormRowProps) => {
  const [open, setOpen] = useState(false);

  // Helper function to get string value for input elements
  const getStringValue = (value: string | number | boolean | undefined): string => {
    if (typeof value === "boolean" || value === undefined || value === null) {
      return "";
    }
    return String(value);
  };

  const renderField = () => {
    const commonProps = {
      disabled: field.disabled,
      className: field.className,
      onBlur,
    };

    switch (field.type) {
      case "text":
        return (
          <Input
            {...commonProps}
            type="text"
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            value={getStringValue(field.value)}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            pattern={field.pattern}
          />
        );

      case "number":
        return (
          <Input
            {...commonProps}
            type="number"
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            value={getStringValue(field.value)}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
            required={field.required}
            min={field.min}
            max={field.max}
          />
        );

      case "email":
        return (
          <Input
            {...commonProps}
            type="email"
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            value={getStringValue(field.value)}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );

      case "password":
        return (
          <Input
            {...commonProps}
            type="password"
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            value={getStringValue(field.value)}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );

      case "tel":
        return (
          <Input
            {...commonProps}
            type="tel"
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            value={getStringValue(field.value)}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            pattern={field.pattern}
          />
        );

      case "date":
        return (
          <Input
            {...commonProps}
            type="date"
            id={field.id}
            name={field.name}
            value={getStringValue(field.value)}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <Textarea
            {...commonProps}
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            value={getStringValue(field.value)}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            rows={field.rows || 3}
          />
        );

      case "select":
        return (
          <Select
            value={getStringValue(field.value)}
            onValueChange={onChange}
            disabled={field.disabled}
          >
            <SelectTrigger id={field.id} className={field.className}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "searchable-select":
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn("w-full justify-between", field.className)}
                disabled={field.disabled}
              >
                {field.value
                  ? field.options?.find((opt) => opt.value === getStringValue(field.value))
                      ?.label
                  : field.placeholder || "Select option..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder={field.placeholder} />
                <CommandEmpty>No option found.</CommandEmpty>
                <CommandGroup>
                  {field.options?.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        onChange(currentValue === getStringValue(field.value) ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          getStringValue(field.value) === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        );

      case "multi-select":
        const selectedValues = Array.isArray(field.value) ? field.value : typeof field.value === "string" && field.value ? field.value.split(",") : [];
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn("w-full justify-between h-auto min-h-10 py-2", field.className)}
                disabled={field.disabled}
              >
                <div className="flex flex-wrap gap-1.5 items-center flex-1">
                  {selectedValues.length > 0
                    ? selectedValues.map((val: string) => {
                        const label = field.options?.find((opt) => opt.value === val)?.label || val;
                        return (
                          <span key={val} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors">
                            {label}
                          </span>
                        );
                      })
                    : <span className="text-muted-foreground font-normal">{field.placeholder || "Select options..."}</span>}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <Command>
                <CommandInput placeholder={field.placeholder || "Search..."} />
                <CommandEmpty>No option found.</CommandEmpty>
                <CommandGroup className="max-h-[250px] overflow-y-auto">
                  <CommandItem
                    onSelect={() => {
                      if (selectedValues.length === (field.options?.length || 0)) {
                        onChange([]);
                      } else {
                        onChange(field.options?.map((opt) => opt.value) || []);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2 w-full cursor-pointer">
                      <Checkbox
                        checked={selectedValues.length > 0 && selectedValues.length === field.options?.length}
                        className="pointer-events-none"
                      />
                      <span className="font-semibold">Select All</span>
                    </div>
                  </CommandItem>
                  {field.options?.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      keywords={[option.label]}
                      onSelect={() => {
                        let newSelected = [...selectedValues];
                        if (newSelected.includes(option.value)) {
                          newSelected = newSelected.filter((v) => v !== option.value);
                        } else {
                          newSelected.push(option.value);
                        }
                        onChange(newSelected);
                      }}
                    >
                      <div className="flex items-center space-x-2 w-full cursor-pointer">
                        <Checkbox
                          checked={selectedValues.includes(option.value)}
                          className="pointer-events-none"
                        />
                        <span>{option.label}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={Boolean(field.value)}
              onCheckedChange={onChange}
              disabled={field.disabled}
            />
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            value={getStringValue(field.value)}
            onValueChange={onChange}
            disabled={field.disabled}
            className={field.className}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                <Label htmlFor={`${field.id}-${option.value}`} className="font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-2">
      {field.label && field.type !== "checkbox" && (
        <Label htmlFor={field.id}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {field.type === "checkbox" && (
        <div className="flex items-center space-x-2">
          {renderField()}
          {field.label && (
            <Label htmlFor={field.id} className="font-normal cursor-pointer">
              {field.label}
            </Label>
          )}
        </div>
      )}
      {field.type !== "checkbox" && renderField()}
      {field.error && (
        <p className="text-sm text-red-500">{field.error}</p>
      )}
    </div>
  );
};

export default FormRow;
