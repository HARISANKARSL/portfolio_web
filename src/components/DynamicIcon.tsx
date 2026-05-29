import React from "react";
import * as LucideIcons from "lucide-react";

interface DynamicIconProps {
  name: string; // The plain text name of the icon, e.g., "FileBraces", "Code2"
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = "w-6 h-6" }) => {
  // Clean the string (in case the user accidentally typed "<FileBraces/>" instead of "FileBraces")
  const cleanName = name
    .replace(/[<>/\s]/g, "") // Remove brackets, slashes, and spaces
    .trim();

  // Look up the matching component dynamically in the Lucide icon library
  const IconComponent = (LucideIcons as any)[cleanName];

  // If the icon is found, render it as a real React element
  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  // Fallback icon (Code2) if the name typed by the user is invalid or not found
  const FallbackIcon = LucideIcons.Code2;
  return <FallbackIcon className={className} />;
};

export default DynamicIcon;
