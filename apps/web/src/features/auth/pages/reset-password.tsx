"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent } from "@/shared/ui/card";
import { createClient } from "@/shared/lib/supabase/client";

const PASSWORD_REQUIREMENTS = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        setValidToken(!error);
        if (error) setError("Invalid or expired reset link. Please request a new one.");
      });
    } else {
      setValidToken(false);
      setError("No reset token found. Please request a new password reset link.");
    }
  }, [searchParams, supabase]);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <Card className="border-slate-200 shadow-lg shadow-slate-200/20">
          <CardContent className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-950">Password updated</h1>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="mt-6 bg-slate-950 text-white hover:bg-slate-800"
            >
              Sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (validToken === false && !searchParams.get("code")) {
    return (
      <div className="w-full max-w-md">
        <Card className="border-slate-200 shadow-lg shadow-slate-200/20">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-950">Invalid link</h1>
            <p className="text-sm text-slate-600 mt-3">
              This password reset link is invalid or has expired.
            </p>
            <Link href="/forgot-password">
              <Button className="mt-6 bg-slate-950 text-white hover:bg-slate-800">
                Request new link
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Card className="border-slate-200 shadow-lg shadow-slate-200/20">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-950">Set new password</h1>
            <p className="text-sm text-slate-600 mt-2">
              Choose a strong password for your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                New password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-slate-300 bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {PASSWORD_REQUIREMENTS.map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                        req.test(password)
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {req.test(password) && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span className={req.test(password) ? "text-slate-700" : "text-slate-400"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11 border-slate-300 bg-white"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || validToken === null}
              className="w-full h-11 bg-slate-950 text-white hover:bg-slate-800"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Update password"
              )}
            </Button>
          </form>

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md text-center">
          <Card className="border-slate-200 shadow-lg shadow-slate-200/20">
            <CardContent className="p-8">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin mx-auto" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
