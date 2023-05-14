import { LOCALE } from "@config";

export interface Props {
  datetime: string | Date;
  className?: string;
}

export default function PostDate({ datetime, className }: Props) {
  return (
    <div className={`text-black flex items-center opacity-70 ${className}`}>
      <span className="sr-only">Posted on:</span>
      <span className="text-sm">
        <FormattedDate datetime={datetime} />
      </span>
    </div>
  );
}

const FormattedDate = ({ datetime }: { datetime: string | Date }) => {
  const myDatetime = new Date(datetime);

  const date = myDatetime.toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <>{date}</>;
};
