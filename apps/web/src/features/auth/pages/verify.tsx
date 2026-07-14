"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { createClient } from "@/shared/lib/supabase/client";

export default function VerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setStatus("success");
        setTimeout(() => router.push("/browse"), 2000);
      }
    });

    // Check if already verified
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (status === "loading") {
    return (
      <div className="w-full max-w-md text-center">
        <Card className="border-slate-200 shadow-lg shadow-slate-200/20">
          <CardContent className="p-8">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-950">Verifying...</h1>
            <p className="text-sm text-slate-600 mt-2">
              Please wait while we verify your email.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-md text-center">
        <Card className="border-slate-200 shadow-lg shadow-slate-200/20">
          <CardContent className="p-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-950">Email verified</h1>
            <p className="text-sm text-slate-600 mt-3">
              Your email has been verified. Redirecting you to the store...
            </p>
            <Link href="/browse">
              <Button className="mt-6 bg-slate-950 text-white hover:bg-slate-800">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md text-center">
      <Card className="border-slate-200 shadow-lg shadow-slate-200/20">
        <CardContent className="p-8">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-950">Verification failed</h1>
          <p className="text-sm text-slate-600 mt-3">
            The verification link is invalid or has expired.
          </p>
          <div className="mt-6 space-y-3">
            <Link href="/login">
              <Button className="bg-slate-950 text-white hover:bg-slate-800">
                Sign in
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
