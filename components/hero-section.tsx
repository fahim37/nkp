import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section
      className="relative mb-[80px] h-[500px] w-full overflow-hidden md:h-[600px] lg:h-[720px]"
      style={{
        backgroundImage: "url('/assets/banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative flex h-full items-center">
        <div className="container">
          <div className="max-w-2xl">
            <div className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-[36px]">
              Discover what makes your city
              <div className="mt-3">feel truly alive</div>
            </div>
            <div className="mb-8">
              <div className="max-w-2md text-sm text-white/90 md:text-base">
                With <span className="font-bold">Walk Throughz</span>, you see
                your city in a new way through short, personal experiences led
                by the people who shape it. From flower shops and galleries to
                coffee roasteries, every stop opens a world of its own.
                <div className="text-white">
                  In small groups, you discover fresh perspectives, engaging
                  stories,
                  <div>and people who share your interests.</div>
                </div>
              </div>
              <p className="mt-5 max-w-md text-sm text-white/90 md:text-base">
                Local, compact, and made for connection.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="group border-none bg-[var(--site-button-bg)] text-[var(--site-button-text)] hover:bg-white"
            >
              <Link href="/deals" className="flex items-center">
                Reserve your spot
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
