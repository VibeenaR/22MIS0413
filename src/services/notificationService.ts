import { CampusNotice } from "../types/notification";

export async function downloadNotificationPayload(): Promise<CampusNotice[]> {
  const rawToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") || "" : "";

  if (!rawToken) {
    return [];
  }

  try {
    // Calling your internal API endpoint instead
    const response = await fetch("/api/proxy-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: rawToken })
    });
    
    if (!response.ok) {
      return [];
    }
    
    const analyticalData = await response.json();
    return analyticalData.notifications || [];
  } catch (err) {
    console.error("Service Proxy Fetch Error:", err);
    return [];
  }
}