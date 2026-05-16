import { CampusNotice } from "../types/notification";

const TIER_HIERARCHY: Record<string, number> = { Placement: 3, Result: 2, Event: 1 };

export function extractTopPriorityNotices(items: CampusNotice[], limit: number): CampusNotice[] {
  return [...items]
    .sort((alpha, beta) => {
      const priorityAlpha = TIER_HIERARCHY[alpha.Type] || 0;
      const priorityBeta = TIER_HIERARCHY[beta.Type] || 0;
      
      if (priorityAlpha !== priorityBeta) {
        return priorityBeta - priorityAlpha; // Sort descending by absolute tier weight
      }
      // Chronological tie-breaking check (Newest timestamp elements rank higher)
      return new Date(beta.Timestamp).getTime() - new Date(alpha.Timestamp).getTime();
    })
    .slice(0, limit);
}