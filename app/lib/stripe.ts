import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export const createProduct = async (
  name: string,
  description: string,
  images: string[],
  price: number,
  tripId: string
) => {
  // Create product
  const product = await stripe.products.create({
    name,
    description,
    images,
  });

  // Add Price
  const priceObject = await stripe.prices.create({
    product: product.id,
    unit_amount: price * 100, // In Cents
    currency: "usd",
  });

  // Get Payment Link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: priceObject.id, quantity: 1 }],
    metadata: { tripId },
    after_completion: {
      type: "redirect",
      redirect: {
        url: `${process.env.VITE_BASE_URL}/travel/${tripId}/success`,
      },
    },
  });

  return paymentLink;
};
