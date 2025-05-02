import { PagerComponent } from "@syncfusion/ej2-react-grids";
import { Header, TripCard } from "components";
import { useState } from "react";
import { Link, useSearchParams, type LoaderFunctionArgs } from "react-router";
import { getUserPaidTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import type { Route } from "./+types/paid-trips";

export const clientLoader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 8;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * limit;

  const result = await getUserPaidTrips(limit, offset);
  if (!result) {
    throw new Error("Failed to fetch user paid trips.");
  }
  const { allTrips, total } = result;

  return {
    trips: allTrips.map(({ $id, tripDetails, imageUrls }) => ({
      id: $id,
      ...parseTripData(tripDetails),
      imageUrls: imageUrls ?? [],
    })),
    total,
  };
};

const PaidTrips = ({ loaderData }: Route.ComponentProps) => {
  const trips = loaderData.trips as Trip[] | [];

  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") || "1");

  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`;
  };
  return (
    <section id="trips" className="py-28 wrapper flex flex-col gap-10">
      <Header
        title="Your Paid Trips"
        description="Get ready to explore & make memories! ✨"
      />

      {trips.length > 0 ? (
        <>
          <div className="trip-grid">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                name={trip.name}
                imageUrl={trip.imageUrls[0]}
                location={trip.itinerary?.[0]?.location ?? ""}
                tags={[trip.interests, trip.travelStyle]}
                price={trip.estimatedPrice}
              />
            ))}
          </div>

          <PagerComponent
            totalRecordsCount={loaderData.total}
            pageSize={8}
            currentPage={currentPage}
            click={(args) => handlePageChange(args.currentPage)}
            cssClass="!mb-4"
          />
        </>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-xl font-semibold text-dark-100">
          <h3>No Trips paid for yet.</h3>
          <Link to="/" className="text-blue-700 hover:underline">
            Explore Tour Page
          </Link>
        </div>
      )}
    </section>
  );
};

export default PaidTrips;
