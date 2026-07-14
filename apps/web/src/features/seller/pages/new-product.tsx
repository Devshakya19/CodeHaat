"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Github, CheckCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent } from "@/shared/ui/card";
import { createClient } from "@/shared/lib/supabase/client";

const CATEGORIES = [
  "Web Templates",
  "Mobile Apps",
  "UI Kits",
  "B.Tech Projects",
  "Boilerplates",
  "API Templates",
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [tags, setTags] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError("You must be logged in to create a product");
        setLoading(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";
      const response = await fetch(`${apiUrl}/api/seller/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price_paise: Math.round(parseFloat(price) * 100),
          category_id: category || undefined,
          github_repo_url: githubUrl || undefined,
          tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/seller/products"), 2000);
      } else {
        setError(result.error || "Failed to create product");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8">
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-950 mb-2">Product Created!</h2>
            <p className="text-slate-600">Your product has been listed. Redirecting to products...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <Link
          href="/seller/products"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-950 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </Link>
        <h1 className="text-2xl font-bold text-slate-950">List New Product</h1>
        <p className="text-slate-600 mt-1">Add your code asset to the marketplace</p>
      </div>

      <div className="max-w-2xl">
        <Card className="border-slate-200">
          <CardContent className="p-8">
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Product title
                </label>
                <Input
                  id="title"
                  placeholder="e.g. Next.js SaaS Starter Kit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-11 border-slate-300 bg-white"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Describe what's included, key features, tech stack..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Price (₹)
                  </label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="49"
                    className="h-11 border-slate-300 bg-white"
                  />
                  <p className="text-xs text-slate-500 mt-1">Minimum ₹49. You keep 97.5%.</p>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-700 mb-1.5">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="githubUrl"
                    placeholder="https://github.com/username/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    required
                    className="h-11 border-slate-300 bg-white pl-10"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Buyers will get access to a private fork of this repo.
                </p>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tags
                </label>
                <Input
                  id="tags"
                  placeholder="React, Next.js, TypeScript (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="h-11 border-slate-300 bg-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-slate-950 text-white hover:bg-slate-800"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  List Product
                </Button>
                <Link href="/seller/products">
                  <Button type="button" variant="outline" className="border-slate-300 text-slate-700">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
