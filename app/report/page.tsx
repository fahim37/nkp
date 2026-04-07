"use client";

import { PageHeader } from "@/Shared/PageHeader";
import { useEffect } from "react";

export default function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <PageHeader title="Terms & Conditions" imge="/assets/report2.jpg" />

      <div className="py-16">
        <div className="container w-full text-[var(--site-muted-strong)]">
          <h1 className="mb-6 text-2xl font-semibold md:text-[32px]">
            General Terms & Conditions
          </h1>

          <p className="mb-4 text-sm font-medium leading-[150%] md:text-base">
            Walk Throughz
          </p>
          <p className="mb-4 text-sm font-medium leading-[150%] md:text-base">
            Toengesgasse 39, 60311 Frankfurt am Main
          </p>
          <p className="mb-9 text-sm font-medium leading-[150%] md:text-base">
            Effective date: June 2025
          </p>

          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            1. Scope
          </h2>
          <p className="mb-9 text-sm font-medium leading-[150%] md:text-base">
            These General Terms & Conditions apply to all bookings, voucher
            purchases, and services offered and concluded through the Walk
            Throughz platform.
          </p>

          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            2. Service Description
          </h2>
          <p className="mb-9 text-sm font-medium leading-[150%] md:text-base">
            Walk Throughz arranges short guided visits through selected city
            locations, such as stores, ateliers, cafes, and other distinctive
            places. Each experience is hosted either by the location itself or
            by a person appointed by Walk Throughz.
          </p>

          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            3. Booking and Contract Formation
          </h2>
          <p className="mb-9 text-sm font-medium leading-[150%] md:text-base">
            Bookings are made online through our platform. Once a booking is
            completed, a binding agreement is created between the person making
            the booking and Walk Throughz.
          </p>

          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            4. Cancellations and Rebooking
          </h2>
          <p className="mb-4 text-sm font-medium leading-[150%] md:text-base">
            As a rule, cancellations are not provided for after a booking has
            been completed. We understand that plans can change, so we
            recommend contacting us if you are unable to attend.
          </p>
          <p className="mb-4 text-sm font-medium leading-[150%] md:text-base">
            We will do our best to find a solution together with the relevant
            venue, such as a rebooking. Whether this is possible depends on
            several factors, including:
          </p>
          <ul className="mb-9 list-disc space-y-1 pl-6 text-sm font-medium leading-[150%] md:text-base">
            <li>The responsiveness and flexibility of the venue</li>
            <li>The remaining time before the scheduled date</li>
            <li>Operational and capacity-related constraints on our side</li>
          </ul>
          <p className="mb-9 text-sm font-medium leading-[150%] md:text-base">
            There is no legal entitlement to rebooking or reimbursement.
          </p>

          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            5. Vouchers
          </h2>
          <p className="mb-4 text-sm font-medium leading-[150%] md:text-base">
            Vouchers can be purchased online through Walk Throughz and redeemed
            for all available experiences.
          </p>
          <ul className="mb-9 list-disc space-y-1 pl-6 text-sm font-medium leading-[150%] md:text-base">
            <li>They remain valid for three years from the purchase date.</li>
            <li>Cash redemption is excluded.</li>
            <li>
              Vouchers are transferable, but may not be used for commercial
              purposes without prior consent from Walk Throughz.
            </li>
            <li>We do not accept liability for lost vouchers.</li>
            <li>
              Combining vouchers with special campaigns or discounts may be
              restricted.
            </li>
          </ul>

          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            6. Corporate and Group Bookings
          </h2>
          <p className="mb-4 text-sm font-medium leading-[150%] md:text-base">
            For companies, organizations, or larger groups, usually from six
            people upward, we offer tailored booking options.
          </p>
          <ul className="mb-9 list-disc space-y-1 pl-6 text-sm font-medium leading-[150%] md:text-base">
            <li>Bookings are arranged in writing, for example by email.</li>
            <li>Pricing, format, and content can be customized.</li>
            <li>
              A binding booking is created upon written confirmation and, where
              applicable, a deposit.
            </li>
            <li>
              Separate cancellation terms apply to group bookings and are
              communicated in advance.
            </li>
          </ul>
          <p className="mb-9 text-sm font-medium leading-[150%] md:text-base">
            We reserve the right to charge cancellation fees for short-notice
            cancellations, especially where venues have already made
            preparations.
          </p>

          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            7. Liability
          </h2>
          <p className="mb-9 text-sm font-medium leading-[150%] md:text-base">
            Walk Throughz is not liable for short-notice changes,
            cancellations, or quality deviations caused by the hosting venue.
            We are only liable for damage occurring during an experience within
            the limits of statutory law and only in cases of gross negligence
            or intent attributable to our own organization.
          </p>

          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            8. Participation Rules
          </h2>
          <p className="mb-9 text-sm font-medium leading-[150%] md:text-base">
            Participants must arrive punctually at the agreed meeting point and
            respect the rules of the respective venue. Walk Throughz reserves
            the right to exclude participants in exceptional cases if the event
            flow is disrupted.
          </p>

          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            9. Privacy
          </h2>
          <p className="mb-9 text-sm font-medium leading-[150%] md:text-base">
            Personal data is processed in accordance with our separate Privacy
            Policy, which is available on the website.
          </p>

          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            10. Final Provisions
          </h2>
          <p className="mb-4 text-sm font-medium leading-[150%] md:text-base">
            The place of performance is Frankfurt am Main.
          </p>
          <p className="mb-4 text-sm font-medium leading-[150%] md:text-base">
            German law applies.
          </p>
          <p className="mb-9 text-sm font-medium leading-[150%] md:text-base">
            If any provision of these Terms & Conditions is invalid, the
            validity of the remaining provisions remains unaffected.
          </p>
        </div>
      </div>
    </div>
  );
}
