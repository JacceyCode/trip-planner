import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { Link, type LoaderFunctionArgs } from "react-router";
import { LEFT_CONFETTI, RIGHT_CONFETTI } from "~/constants";
import type { Route } from "./+types/payment-success";

export async function loader({ params }: LoaderFunctionArgs) {
  return params;
}

const PaymentSuccess = ({ loaderData }: Route.ComponentProps) => {
  useEffect(() => {
    const loadConfetti = () => {
      confetti(LEFT_CONFETTI);
      confetti(RIGHT_CONFETTI);
    };
    const conf = setTimeout(loadConfetti, 3000); // delay trigger by 3 seconds

    return () => clearTimeout(conf); // cleanup on unmount
  }, []);

  return (
    <main className="payment-success wrapper">
      <section>
        <article>
          <img src="/assets/icons/check.svg" className="size-24" />
          <h1>Thank & Welcome Aboard!</h1>

          <p>
            Your trip is booked - can't wait to have you on this adventure. Get
            ready to explore & make memories! ✨
          </p>

          <Link to={`/travel/${loaderData?.tripId}`} className="w-full">
            <ButtonComponent className="button-class !h-11 !w-full">
              <img
                src="/assets/icons/itinerary-button.svg"
                className="size-5"
              />

              <span className="p-16-semibold text-white">
                View trip details
              </span>
            </ButtonComponent>
          </Link>
          <Link to={"/"} className="w-full">
            <ButtonComponent className="button-class-secondary !h-11 !w-full">
              <img src="/assets/icons/arrow-left.svg" className="size-5" />

              <span className="p-16-semibold">Return to homepage</span>
            </ButtonComponent>
          </Link>
        </article>
      </section>
    </main>
  );
};
export default PaymentSuccess;
