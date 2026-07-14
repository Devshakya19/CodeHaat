import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRole, ROLES } from "@/shared/lib/roles";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = getUserRole(user);
  if (role === ROLES.DEVELOPER) redirect("/seller");

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar
        email={user.email!}
        fullName={user.user_metadata?.full_name}
        avatarUrl={user.user_metadata?.avatar_url}
      />
      <div className="md:ml-64">
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
