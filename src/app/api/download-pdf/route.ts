import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileUrl = searchParams.get("url");
    const order = searchParams.get("order") || "document";

    if (!fileUrl) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch file from remote server: ${response.statusText}` }, 
        { status: response.status }
      );
    }

    const data = await response.arrayBuffer();
    const contentType = response.headers.get("Content-Type") || "application/pdf";

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // The attachment directive forces the browser to show a "Save As" dialog or automatically download.
        "Content-Disposition": `attachment; filename="booking-${order}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error proxying PDF download:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
