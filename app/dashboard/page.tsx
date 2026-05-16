import { redirect } from "next/navigation";

// Alias temporal para enlaces antiguos: la Home privada vive en "/".
export default function DashboardPage() {
  redirect("/");
}
