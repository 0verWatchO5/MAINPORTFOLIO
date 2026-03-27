import AdminDashboard from "./momoDashboard";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isAdminEmail } from "@/lib/auth";

export const metadata = {
  title: "Admin | Portfolio",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect("/momo/login");
  }

  return <AdminDashboard />;
}
