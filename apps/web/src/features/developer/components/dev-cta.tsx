"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function DevCTA() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20">
      <FadeIn>
        <div className="max-w-4xl mx-auto text-center bg-slate-950 rounded-3xl px-8 py-16 sm:px-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to start earning?
          </h2>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto">
            Join developers who are already earning passive income on CodeHaat. It takes 5 minutes to list your first product.
          </p>
          <Link href="/developer-register">
            <Button size="lg" className="mt-8 bg-white text-slate-950 hover:bg-slate-100 shadow-lg px-8 h-12 text-base font-semibold rounded-full">
              Create Seller Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
