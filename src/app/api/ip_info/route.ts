import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    // استخراج IP کاربر
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    // ارسال درخواست به ipinfo با IP کاربر
    const res = await fetch(`https://ipinfo.io/${ip}?token=7ba58821afeaf6`);
    const geoData = await res.json();

    return NextResponse.json({ ok: true, data: geoData }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Error fetching IP information" },
      { status: 500 }
    );
  }
};
