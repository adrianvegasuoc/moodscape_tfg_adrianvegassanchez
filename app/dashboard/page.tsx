import { redirect } from "next/navigation";

// Mantiene compatibilidad con enlaces antiguos: la Home privada vive en "/".
export default function DashboardPage() {
  redirect("/");
}
