import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { sessionId } = await request.json();

  if (!sessionId)
    return NextResponse.json(
      { message: "sessionId required" },
      { status: 400 }
    );

  const response = NextResponse.json(
    { message: "Cookies set" },
    { status: 200 }
  );

  response.cookies.set("sessionId", sessionId, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return response;
};

export const GET = async (request: NextRequest) => {
  const session = request.cookies.get("sessionId");

  if (session)
    return NextResponse.json({ sessionId: session }, { status: 200 });

  return NextResponse.json({}, { status: 400 });
};
