import { Facebook, Instagram, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NewsletterSubscription from "./Subscribe";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Footer() {
  return (
    <footer className="bg-[var(--site-button-bg)] pb-8 pt-[50px] text-[var(--site-button-text)]">
      <div className="container grid grid-cols-1 gap-8 text-sm md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-3 xl:col-span-3">
          <div>
            <Link href="/" className="flex items-center">
              <div className="text-center">
                <div className="flex justify-center">
                  <Image
                    src="/assets/footerlogo1.png"
                    alt="Logo"
                    width={100}
                    height={100}
                    className="h-[30px] w-[80px] lg:h-[37px] lg:w-[95px]"
                  />
                </div>
                <h1 className="logo-size mt-[7px] mb-2 text-[32px] font-benedict font-medium leading-[120%] text-[var(--site-button-text)]">
                  Walk Throughz
                </h1>
              </div>
            </Link>
          </div>
          <div className="pb-4 text-[#48616D]">
            Follow us on social media for exclusive updates and special offers.
          </div>

          <div className="-mb-[35px] flex space-x-4 md:mb-0">
            <Link
              href=""
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--site-border)] text-[#48616D] transition-colors hover:bg-white"
            >
              <Facebook size={18} />
            </Link>
            <Link
              href=""
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--site-border)] text-[#48616D] transition-colors hover:bg-white"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href=""
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--site-border)] text-[#48616D] transition-colors hover:bg-white"
            >
              <Image
                src="/assets/tiktok.png"
                alt="TikTok"
                width={20}
                height={20}
              />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2 xl:col-span-3">
          <h3 className="mb-3 text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-[#48616D]">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about-us">About Us</Link>
            </li>
            <li>
              <Link href="/deals">Walk Throughz</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3 xl:col-span-3">
          <h3 className="mb-3 text-lg font-semibold text-[var(--site-button-text)]">
            Walk Throughz Sites
          </h3>
          <Select defaultValue="germany">
            <SelectTrigger className="flex w-[200px] items-center gap-2 rounded-full border border-[var(--site-border)] bg-white px-4 py-2 text-[#48616D]">
              <Globe size={18} />
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent className="bg-white text-[#48616D]">
              <SelectItem value="germany">Germany</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="lg:col-span-4 xl:col-span-3">
          <NewsletterSubscription />
        </div>
      </div>

      <div className="container">
        <div className="my-6 border-b border-[var(--site-border)]" />
      </div>

      <div className="container">
        <div className="mb-4 flex flex-col items-center justify-between md:flex-row">
          <div className="flex space-x-4">
            <div className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1 shadow-sm">
              <Image
                src="/assets/Paypal.png"
                alt="PayPal"
                width={60}
                height={30}
                className="h-6 w-auto"
              />
            </div>
            <div className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1 shadow-sm">
              <Image
                src="/assets/amex.png"
                alt="American Express"
                width={60}
                height={30}
                className="h-6 w-auto"
              />
            </div>
            <div className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1 shadow-sm">
              <Image
                src="/assets/maestro.png"
                alt="Maestro"
                width={60}
                height={30}
                className="h-6 w-auto"
              />
            </div>
            <div className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1 shadow-sm">
              <Image
                src="/assets/visa.png"
                alt="Visa"
                width={60}
                height={30}
                className="h-6 w-auto"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between text-xs text-[#607B88] md:flex-row">
          <p>© 2026 Walk Throughz. All rights reserved.</p>
          <div className="space-x-4 pt-2 md:pt-0 lg:pt-0">
            <Link href="/suport">Support</Link>
            <Link href="/report">Terms &amp; Conditions</Link>
            <Link href="/refund-policies">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
