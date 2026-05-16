import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ notifications: [] }, { status: 400 });
    }

    // Server-to-server requests bypass browser CORS restrictions entirely
    const response = await fetch("http://4.224.186.213/evaluation-service/notifications", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token.trim()}`,
        "Content-Type": "application/json"
      },
      next: { revalidate: 0 } // Disable Next.js data caching
    });

    if (!response.ok) {
      return NextResponse.json({ notifications: [] }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Proxy Error:", error.message);
    return NextResponse.json({ notifications: [] }, { status: 500 });
  }
}