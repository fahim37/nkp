import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import Faq from "./faq";

export function FaqSection() {
  return (
    <section className="container mt-10 lg:mt-24">
      <div className="grid gap-8 lg:grid-cols-6">
        <div className="col-span-6 lg:col-span-2">
          <div className="flex justify-between lg:block">
            <div>
              <div className="flex items-center gap-4">
                <div className="h-7 w-4 rounded bg-[var(--site-accent)] sm:h-9 sm:w-5" />
                <h1 className="heading-size font-benedict font-normal leading-[120%] tracking-[0.04em] text-white [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]">
                  FAQ
                </h1>
              </div>
              <div className="mt-2 mb-4 text-[24px] font-semibold tracking-tight text-white md:text-[28px] lg:text-[26px]">
                Frequently Asked <div>Questions</div>
              </div>
            </div>
            <Link href="/faq">
              <Button className="bg-[var(--site-button-bg)] text-[var(--site-button-text)] hover:bg-white">
                View all questions <MoveRight />
              </Button>
            </Link>
          </div>
        </div>

        <div className="col-span-6 lg:col-span-4">
          <Faq />
        </div>
      </div>
    </section>
  );
}
