import type { DashboardData } from "@/types/dashboard";
import { dashboardMock } from "@/mocks/dashboard.mock";

export async function buscarDadosDashboard(): Promise<DashboardData> {
  return dashboardMock;
}