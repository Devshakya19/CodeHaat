import { BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";

export default function SellerEarningsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950 mb-6">Earnings</h1>
      <Card className="border-slate-200">
        <CardContent className="p-12 text-center">
          <BarChart3 className="w-10 h-10 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No earnings yet. Start selling to see your earnings here.</p>
        </CardContent>
      </Card>
    </>
  );
}
