"use client";

import { useState } from "react";
import type { DashboardData } from "@/types/dashboard";
import { dashboardMock } from "@/mocks/dashboard.mock";

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData>(dashboardMock);
  const [loading] = useState(false);

  function carregarDashboard() {
    setDashboard(dashboardMock);
  }

  return {
    dashboard,
    loading,
    carregarDashboard,
  };
}