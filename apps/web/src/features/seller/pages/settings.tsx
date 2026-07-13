import { Settings } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";

export default function SellerSettingsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950 mb-6">Settings</h1>
      <Card className="border-slate-200">
        <CardContent className="p-12 text-center">
          <Settings className="w-10 h-10 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Settings coming soon. Manage your seller profile and payout details.</p>
        </CardContent>
      </Card>
    </>
  );
}
