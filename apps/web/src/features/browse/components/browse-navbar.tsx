"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { CodeHaatLogo } from "@/shared/components/codehaat-logo";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";

const CATEGORIES = [
  "All",
  "Web Templates",
  "Mobile Apps",
  "UI Kits",
  "B.Tech Projects",
  "Boilerplates",
  "API Templates",
];

export function BrowseNavbar({ email, fullName }: { email: string; fullName?: string }) {
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">
        <CodeHaatLogo />

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search templates, UI kits, projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-10 border-slate-300 bg-slate-50 text-sm"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-600">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
          </Button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-sm">
            <User className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700 font-medium">{fullName || email}</span>
          </div>
          <form action="/api/auth/logout" method="post">
            <Button variant="ghost" size="sm" className="text-slate-500 text-xs">
              Logout
            </Button>
          </form>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex flex-col gap-4 mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 pl-10 border-slate-300 bg-slate-50 text-sm"
                />
              </div>
              <div className="text-sm text-slate-600">
                Signed in as <span className="font-medium text-slate-950">{fullName || email}</span>
              </div>
              <form action="/api/auth/logout" method="post">
                <Button variant="outline" className="w-full border-slate-300 text-slate-700">
                  Logout
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      {/* Category tabs */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
