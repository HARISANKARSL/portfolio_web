import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
export type FieldType =
  | "text"
  | "password"
  | "textarea"
  | "select"
  | "number"
  | "date";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
}
interface Props {
  field: FieldConfig;
  value: any;
  onChange: (name: string, value: any) => void;
}

export const FormField = ({ field, value, onChange }: Props) => {
  switch (field.type) {
    case "text":
    case "password":
    case "number":
      return (
        <Input
          type={field.type}
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );

    case "textarea":
      return (
        <Textarea
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );

    case "select":
      return (
        <Select
          value={value}
          onValueChange={(val) => onChange(field.name, val)}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    default:
      return null;
  }
};