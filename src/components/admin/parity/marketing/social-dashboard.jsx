"use client";

import { useState } from "react";
import { refreshSocialAction } from "@/lib/actions/admin/parity/marketing";
import { useToast } from "@/components/ui/toast";
import { ContentCalendar } from "./content-calendar";
import { ScriptSection } from "./script-section";
import { TrendSection } from "./trend-section";

/** social_media_dashboard.php: Trend Analyser, Content Calendar and Video Script Generator. */
export function SocialDashboard({ initial, events, can }) {
  const { notify } = useToast();
  const [data, setData] = useState(initial);
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    const result = await refreshSocialAction();
    setRefreshing(false);
    if (!result.ok) return notify({ message: result.message, tone: "error" });
    setData(result.data);
  }

  return (
    <div className="space-y-4">
      <TrendSection latest={data.latestReport} history={data.reports} canAdd={can.add} onRefresh={refresh} refreshing={refreshing} />
      <ContentCalendar events={events} can={can} />
      <ScriptSection latest={data.latestScript} history={data.scripts} canAdd={can.add} onRefresh={refresh} refreshing={refreshing} />
    </div>
  );
}
