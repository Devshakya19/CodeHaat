import { NextResponse, type NextRequest } from "next/server";

const RUST_BACKEND = process.env.CORE_ENGINE_URL || "http://localhost:4001";

async function proxyRequest(request: NextRequest, method: string) {
  const path = request.nextUrl.pathname.replace(/^\/api\/proxy\//, "");
  const backendUrl = `${RUST_BACKEND}/api/${path}`;
  const searchParams = request.nextUrl.searchParams.toString();
  const url = searchParams ? `${backendUrl}?${searchParams}` : backendUrl;

  // Read token from HttpOnly cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/codehaat_token=([^;]+)/);
  const token = tokenMatch?.[1];

  // Forward client IP for rate limiting (x-forwarded-for)
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const headers: Record<string, string> = {
    "x-forwarded-for": clientIp,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Forward content-type for body-carrying methods
  const contentType = request.headers.get("content-type");
  if (contentType && ["POST", "PUT", "PATCH"].includes(method)) {
    headers["Content-Type"] = contentType;
  }

  const init: RequestInit = { method, headers };

  if (["POST", "PUT", "PATCH"].includes(method)) {
    // Stream body — don't buffer large uploads
    init.body = request.body;
    // @ts-expect-error duplex is needed for streaming body in fetch
    init.duplex = "half";
  }

  try {
    const backendRes = await fetch(url, init);
    const body = await backendRes.text();

    const responseHeaders = new Headers();
    const contentType = backendRes.headers.get("content-type");
    if (contentType) {
      responseHeaders.set("Content-Type", contentType);
    }

    return new NextResponse(body, {
      status: backendRes.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Backend connection failed" },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, "PUT");
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, "DELETE");
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request, "PATCH");
}
