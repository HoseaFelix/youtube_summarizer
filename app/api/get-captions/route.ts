import { NextRequest, NextResponse } from "next/server";
import { Supadata } from "@supadata/js";

const supadata = new Supadata({
  apiKey: process.env.SUPADATA_API_KEY!, // keep it secret
});

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    const transcript = await supadata.youtube.transcript({ url });

    if (!transcript?.content || !Array.isArray(transcript.content)) {
      return NextResponse.json(
        { error: "No transcript found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Supadata error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript." },
      { status: 500 }
    );
  }
}
