import { LOCALE } from "@config";

export interface Props {
  datetime: string | Date;
  className?: string;
}

export default function Datetime({ datetime, className }: Props) {
  return (
    <div className={`text-black flex items-center opacity-70 ${className}`}>
      <span className="sr-only">Posted on:</span>
      <span className="text-sm">
        <FormattedDatetime datetime={datetime} />
      </span>
    </div>
  );
}

const FormattedDatetime = ({ datetime }: { datetime: string | Date }) => {
  const myDatetime = new Date(datetime);

  const date = myDatetime.toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = myDatetime.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {date}
      <span aria-hidden="true"> | </span>
      <span className="sr-only">&nbsp;at&nbsp;</span>
      {time}
    </>
  );
};
