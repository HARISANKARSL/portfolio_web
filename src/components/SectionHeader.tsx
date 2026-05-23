import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  description?: string;
  button?: boolean;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const SectionHeader = ({
  title,
  description,
  button = false,
  buttonLabel = "Add",
  onButtonClick,
}: SectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>

        {description && (
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
        )}
      </div>

      {button && (
        <Button onClick={onButtonClick}>
          + {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default SectionHeader;