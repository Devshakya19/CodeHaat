"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent } from "@/shared/ui/card";
import { createClient } from "@/shared/lib/supabase/client";
import { apiGet, apiPut } from "@/shared/lib/api";

export default function SellerProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const result = await apiGet<any>(`/api/profile/${user.id}`);

      if (result.success && result.data) {
        setFullName(result.data.full_name || user.user_metadata?.full_name || "");
        setBio(result.data.bio || "");
        setWebsite(result.data.website || "");
        setLocation(result.data.location || "");
        setGithubUsername(result.data.github_username || "");
        setAvatarUrl(result.data.avatar_url || "");
      }
      setLoading(false);
    }
    loadProfile();
  }, [router, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const result = await apiPut("/api/profile", {
      id: user.id,
      full_name: fullName,
      bio,
      website,
      location,
      github_username: githubUsername,
      avatar_url: avatarUrl,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-950">Seller Profile</h1>
        <p className="text-slate-600 mt-1">Manage your public seller profile</p>
      </div>

      <div className="max-w-2xl">
        <Card className="border-slate-200">
          <CardContent className="p-8">
            {success && (
              <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Profile updated successfully
              </div>
            )}

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-20 h-20 object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {(fullName || "S").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-950">{fullName || "Seller"}</div>
                <div className="text-xs text-slate-500">Public Profile Photo</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Display Name
                </label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 border-slate-300 bg-white"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell buyers about your expertise..."
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
                />
              </div>

              <div>
                <label htmlFor="githubUsername" className="block text-sm font-medium text-slate-700 mb-1.5">
                  GitHub Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                  <Input
                    id="githubUsername"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="your-username"
                    className="h-11 border-slate-300 bg-white pl-8"
                  />
                </div>
                {githubUsername && (
                  <a
                    href={`https://github.com/${githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    View GitHub Profile <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Website
                  </label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yoursite.com"
                    className="h-11 border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Location
                  </label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bangalore, India"
                    className="h-11 border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-slate-950 text-white hover:bg-slate-800"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Profile
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-slate-300 text-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
