import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { SellerNavbar } from "@/features/seller/components/seller-navbar";
import { getUserRole, ROLES } from "@/shared/lib/roles";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = getUserRole(user);
  if (role !== ROLES.DEVELOPER) redirect("/browse");

  return (
    <div className="min-h-screen bg-slate-50">
      <SellerNavbar
        email={user.email!}
        fullName={user.user_metadata?.full_name}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
