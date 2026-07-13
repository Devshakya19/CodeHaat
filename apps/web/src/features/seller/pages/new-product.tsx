"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Github } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent } from "@/shared/ui/card";

const CATEGORIES = [
  "Web Templates",
  "Mobile Apps",
  "UI Kits",
  "B.Tech Projects",
  "Boilerplates",
  "API Templates",
];

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [tags, setTags] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement product creation with Supabase
    setTimeout(() => {
      setLoading(false);
      alert("Product creation will be implemented with database.");
    }, 1000);
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
