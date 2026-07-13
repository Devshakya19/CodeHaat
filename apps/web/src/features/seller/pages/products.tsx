import Link from "next/link";
import { Plus, Package, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

export default function SellerProductsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Products</h1>
          <p className="text-slate-600 mt-1">Manage your listed products</p>
        </div>
        <Link href="/seller/products/new">
          <Button className="bg-slate-950 text-white hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      <Card className="border-slate-200">
        <CardContent className="p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-950 mb-2">No products yet</h3>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            Start selling by listing your first product. Connect your GitHub repo, set a price,
            and you&apos;re live in minutes.
          </p>
          <Link href="/seller/products/new">
            <Button className="bg-slate-950 text-white hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" />
              List Your First Product
            </Button>
          </Link>
        </CardContent>
      </Card>
    </>
  );
}
