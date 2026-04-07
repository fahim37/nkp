"use client";

import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface StripeCheckoutProps {
  bookingId: string;
  price: number;
}

const StripeCheckout = ({ bookingId, price }: StripeCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(async ({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            setMessage("Payment successful!");

            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-payment`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.accessToken}`,
                  },
                  body: JSON.stringify({
                    paymentIntentId: paymentIntent.id,
                    bookingId,
                    price,
                    userId: session?.user?.id,
                  }),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to confirm payment");
              }

              router.push("/success");
            } catch (error) {
              console.error("Payment confirmation failed:", error);
              toast.error("Payment confirmation failed");
            }
            break;
          case "processing":
            setMessage("Your payment is processing.");
            toast.info("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            toast.error("Payment failed. Please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            toast.error("Something went wrong.");
            break;
        }
      });
  }, [stripe, router, bookingId, price, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Payment failed");
        toast.error(error.message || "Payment failed");
      } else {
        setMessage("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment successful!");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/confirm-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              bookingId,
              price,
              userId: session?.user?.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to confirm payment");
        }

        router.push("/success");
      } catch (error) {
        console.error("Payment confirmation failed:", error);
        toast.error("Payment confirmation failed");
      }
    }

    setIsLoading(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="hide-scrollbar h-[480px] max-w-[800px] overflow-auto overflow-y-auto rounded-lg border border-[var(--site-border)] bg-[var(--site-panel)] p-6 shadow-lg"
    >
      <h2 className="mb-4 text-xl font-bold text-[var(--site-muted-strong)]">
        Complete your booking
      </h2>
      <PaymentElement
        id="payment-element"
        options={{
          layout: "tabs",
        }}
        className="mb-4 w-full"
      />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full rounded bg-[var(--site-button-bg)] px-4 py-2 text-[var(--site-button-text)] transition duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span id="button-text">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-[var(--site-button-text)]" />
              Processing...
            </div>
          ) : (
            "Pay now"
          )}
        </span>
      </button>
      {message && (
        <div
          id="payment-message"
          className={`mt-4 text-sm ${
            message.toLowerCase().includes("successful")
              ? "text-green-300"
              : "text-red-300"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default StripeCheckout;
