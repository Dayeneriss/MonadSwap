import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  try {
    const response = await fetch(
      `https://api.0x.org/swap/v1/price?${searchParams.toString()}`,
      {
        headers: {
          "0x-api-key": process.env.ZEROX_API_KEY || "",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching price:", error);
    return NextResponse.json({ error: "Failed to fetch price" }, { status: 500 });
  }
}
