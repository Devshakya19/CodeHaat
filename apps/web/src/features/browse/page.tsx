import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRole, ROLES } from "@/shared/lib/roles";
import { BrowseNavbar } from "@/features/browse/components/browse-navbar";
import { ProductGrid } from "@/features/browse/components/product-grid";
import { Sparkles, TrendingUp, Zap } from "lucide-react";

export default async function BrowsePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = getUserRole(user);
  if (role === ROLES.DEVELOPER) redirect("/seller");

  return (
    <div className="min-h-screen bg-slate-50">
      <BrowseNavbar
        email={user.email!}
        fullName={user.user_metadata?.full_name}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user.user_metadata?.full_name?.split(" ")[0] || "there"}!
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-lg">
              Discover production-ready code assets from top Indian developers. GitHub delivery, instant access.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>2,400+ products</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>New arrivals daily</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Instant GitHub delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Trending Products</h2>
            <p className="text-sm text-slate-500 mt-1">Most popular this week</p>
          </div>
          <button className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">
            View all →
          </button>
        </div>

        {/* Product Grid */}
        <ProductGrid />

        {/* Load More */}
        <div className="mt-10 text-center">
          <button className="px-6 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors">
            Load More Products
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} CodeHaat. All rights reserved. Made with ♥ in India.
          </p>
        </div>
      </footer>
    </div>
  );
}
