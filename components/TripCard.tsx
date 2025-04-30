import { Link, useLocation } from "react-router";
import { cn, getFirstWord } from "~/lib/utils";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";

const TripCard = ({
  id,
  imageUrl,
  location,
  name,
  price,
  tags,
}: TripCardProps) => {
  const pathname = useLocation().pathname;
  return (
    <Link
      to={
        pathname === "/" || pathname.startsWith("/travel")
          ? `/travel/${id}`
          : `/trips/${id}`
      }
      className="trip-card"
    >
      <img src={imageUrl} alt={name} />

      <article>
        <h2>{name}</h2>
        <figure>
          <img
            src="/assets/icons/location-mark.svg"
            alt="location"
            className="size-4"
          />
          <figcaption>{location}</figcaption>
        </figure>
      </article>

      <div className="mt-5 pl-[18px] pr-3.5 pb-5">
        <ChipListComponent id="travel-chip">
          <ChipsDirective>
            {tags.map((tag, i) => (
              <ChipDirective
                key={i}
                text={getFirstWord(tag)}
                cssClass={cn(
                  i === 1
                    ? "!bg-ping-50 !text-pink-500"
                    : "!bg-success-50 !text-success-700"
                )}
              />
            ))}
          </ChipsDirective>
        </ChipListComponent>
      </div>

      <article className="tripCard-pill">{price}</article>
    </Link>
  );
};

export default TripCard;
