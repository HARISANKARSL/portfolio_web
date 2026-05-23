interface NoDataProps {
  message?: string;
}

export default function NoDataFound({
  message = "No data found",
}: NoDataProps) {
  return (
    <div className="col-span-full flex items-center justify-center py-20">
      <p className="text-muted-foreground text-xs">
        {message}
      </p>
    </div>
  );
}