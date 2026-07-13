import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, TrendingUp, DollarSign, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Seller Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome back, {user.user_metadata?.full_name || user.email}
          </p>
        </div>
        <Link href="/seller/products">
          <Button className="bg-slate-950 text-white hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            List Product
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-950/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Total Products</div>
                <div className="text-2xl font-bold text-slate-950">0</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-950/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Total Sales</div>
                <div className="text-2xl font-bold text-slate-950">0</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-950/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Revenue</div>
                <div className="text-2xl font-bold text-slate-950">₹0</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">You Keep (97.5%)</div>
                <div className="text-2xl font-bold text-emerald-600">₹0</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
