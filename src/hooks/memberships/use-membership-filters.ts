import { useState } from "react";
import { MembershipWithStats } from "@/types";

export const MEMBERSHIP_FILTERS = {
  all: { label: "Todas", match: () => true },
  expiring: {
    label: "Por vencer",
    match: (m: MembershipWithStats) => m.status === "ACTIVE" && m.isAboutExpire,
  },
  expired: {
    label: "Vencidas",
    match: (m: MembershipWithStats) => m.status === "EXPIRED" || (m.status === "ACTIVE" && m.isExpired),
  },
  suspended: { label: "Suspendidas", match: (m: MembershipWithStats) => m.status === "SUSPENDED" },
  cancelled: { label: "Canceladas", match: (m: MembershipWithStats) => m.status === "CANCELLED" },
};

export type MembershipFilterKey = keyof typeof MEMBERSHIP_FILTERS;

export const MEMBERSHIP_FILTER_KEYS = Object.keys(MEMBERSHIP_FILTERS) as MembershipFilterKey[];

export function useMembershipFilters(memberships: MembershipWithStats[]) {
  const [filter, setFilter] = useState<MembershipFilterKey>("all");
  const [search, setSearch] = useState("");

  const count = (key: MembershipFilterKey) => memberships.filter(MEMBERSHIP_FILTERS[key].match).length;

  const term = search.trim().toLowerCase();
  const visible = memberships
    .filter(MEMBERSHIP_FILTERS[filter].match)
    .filter((m) => !term || `${m.user?.firstName} ${m.user?.firstLastName} ${m.user?.email} ${m.user?.phone}`.toLowerCase().includes(term));

  const stats = {
    total: memberships.length,
    activeUpToDate: memberships.filter((m) => m.status === "ACTIVE" && !m.isExpired).length,
    expiring: count("expiring"),
    expired: count("expired"),
  };

  return { filter, setFilter, search, setSearch, visible, count, stats };
}
