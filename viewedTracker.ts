export function getReadHistoryIds(): string[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("viewed_notice_registry") || "[]");
}

export function saveToReadHistory(id: string): string[] {
  const currentHistory = getReadHistoryIds();
  if (!currentHistory.includes(id)) {
    const freshLog = [...currentHistory, id];
    localStorage.setItem("viewed_notice_registry", JSON.stringify(freshLog));
    return freshLog;
  }
  return currentHistory;
}