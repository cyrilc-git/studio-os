import UsageDashboard from "@/components/UsageDashboard";

export const metadata = {
  title: "Dashboard Usage — Studio OS",
  description: "Consommation tokens & coûts Anthropic API",
};

export default function DashboardPage() {
  return <UsageDashboard />;
}
