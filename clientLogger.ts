export async function emitClientLog(level: "debug" | "info" | "warn" | "error" | "fatal", pkg: string, message: string) {
  const rawToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") || "" : "";
  
  if (!rawToken) return;

  try {
    await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // CRITICAL FIX: Adding 'Bearer ' prefix for the logs endpoint as well
        "Authorization": `Bearer ${rawToken}`
      },
      body: JSON.stringify({
        stack: "frontend",
        level: level.toLowerCase(),
        package: pkg.toLowerCase(),
        message: message
      })
    });
  } catch (err) {
    console.warn("[Logger Package Exception] Tracking pipeline delivery failure:", err);
  }
}