"use client";

import { PageHeader } from "@/Shared/PageHeader";
import Link from "next/link";
import { useEffect } from "react";

export default function RefundPoliciesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <PageHeader title="Privacy Policy" imge="/assets/panda.jpg" />
      <div className="container mx-auto px-4 py-16 text-[var(--site-muted-strong)]">
        <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>

        <p className="mb-6">
          Walk Throughz
          <br />
          Toengesgasse 39, 60311 Frankfurt am Main
          <br />
          Effective date: June 2025
        </p>

        <p className="mb-6">
          Protecting your personal data is important to us. We treat your data
          confidentially and in accordance with applicable privacy laws,
          especially the GDPR and the German Federal Data Protection Act.
        </p>
        <p className="mb-6">
          Below we explain what data we collect, how we use it, and what rights
          you have regarding your data.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="mb-2 text-xl font-semibold">1. Data Controller</h2>
            <p className="mb-2">The controller within the meaning of the GDPR is:</p>
            <p>
              Walk Throughz
              <br />
              Toengesgasse 39
              <br />
              60311 Frankfurt am Main
              <br />
              Email:{" "}
              <Link href="mailto:info@walkthroughz.com" className="underline">
                info@walkthroughz.com
              </Link>
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              2. Collection and Storage of Personal Data
            </h2>
            <h3 className="mb-2 text-lg font-semibold">a) When visiting the website</h3>
            <p className="mb-2">
              When you access our website, your browser automatically sends the
              following information to our server:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>IP address</li>
              <li>Date and time of access</li>
              <li>Name of the page requested</li>
              <li>Website from which the access originated (referrer URL)</li>
              <li>Browser type and, if applicable, operating system</li>
            </ul>
            <p className="mb-4">
              This data is used for the technical delivery and stability of the
              website and is not used to identify you personally.
            </p>

            <h3 className="mb-2 text-lg font-semibold">
              b) When registering a user profile
            </h3>
            <p className="mb-2">
              When you create a profile with us, we process the following data:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>First and last name</li>
              <li>Email address</li>
              <li>Password, stored in encrypted form</li>
              <li>Mobile number, where provided</li>
              <li>Preferred language and city, optionally</li>
            </ul>
            <p className="mb-4">
              This processing is carried out for contract fulfillment, customer
              management, and providing personalized content.
            </p>

            <h3 className="mb-2 text-lg font-semibold">
              c) During bookings and payments
            </h3>
            <p className="mb-2">As part of bookings, we process:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Booking data, such as date, time, party size, and venue</li>
              <li>
                Payment data, for example card, PayPal, or Klarna information,
                handled by external payment providers
              </li>
              <li>Billing address, if required</li>
            </ul>
            <p>
              Payment processing is carried out through external providers such
              as Stripe and PayPal. Your payment data is not stored on our
              servers, but processed directly by the relevant provider. Their
              own privacy policies also apply.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              3. Purpose and Legal Basis of Processing
            </h2>
            <p className="mb-2">
              We process personal data for the following purposes:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>To handle bookings and experiences</li>
              <li>To technically provide and secure the website</li>
              <li>For user administration and profile creation</li>
              <li>For payment processing</li>
              <li>To communicate with you about inquiries or changes</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">4. Data Sharing</h2>
            <p className="mb-2">
              We only share your data where legally permitted or where you have
              expressly consented, in particular:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>With payment service providers to process your booking</li>
              <li>With venues or partners delivering the booked experience</li>
              <li>With IT service providers supporting the platform</li>
            </ul>
            <p>
              Transfers to countries outside the EU only take place where an
              adequate level of protection exists or where you have consented.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">5. Storage Period</h2>
            <p className="mb-2">
              We store your data only as long as necessary for the purposes
              described above or as required by statutory retention obligations.
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Booking and payment data: up to 10 years</li>
              <li>Profile data: until deleted by you or withdrawn</li>
              <li>Communication data: up to 3 years</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              6. Your Rights as a Data Subject
            </h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Request information about your stored data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Request restriction of processing</li>
              <li>Object to processing</li>
              <li>Receive your data in a portable format</li>
              <li>Withdraw any consent you have given at any time</li>
            </ul>
            <p className="mb-2">
              To exercise your rights, contact us at{" "}
              <Link href="mailto:info@walkthroughz.com" className="underline">
                info@walkthroughz.com
              </Link>
              .
            </p>
            <p>
              You also have the right to lodge a complaint with a data
              protection supervisory authority.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">7. Cookies and Tracking</h2>
            <p>
              Our website uses cookies to analyze usage and improve usability.
              You can accept or decline their use. Further details are provided
              in our separate cookie policy.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              8. Profile and Communication
            </h2>
            <p>
              By creating a profile, you consent to the processing of your data
              for personalization. You can change these settings in your user
              area or delete your account at any time.
            </p>
            <p>
              We may contact you by email about changes, booking information,
              or relevant offers. You can object to this at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">9. Data Security</h2>
            <p>
              We use appropriate technical and organizational measures to
              protect your data against loss, misuse, or unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">
              10. Changes to this Privacy Policy
            </h2>
            <p>
              We reserve the right to update this Privacy Policy to reflect
              legal requirements or changes to our services. The current version
              is always available on our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
