import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const ip =
      req.headers.get("CF-Connecting-IP") ||
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "127.0.0.1";

    // const res = await fetch(`https://ipinfo.io/${ip}?token=7ba58821afeaf6`);
    const response = await fetch(`https://ipinfo.info/ip_api.php?ip=${ip}`, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9,fa;q=0.8",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      referrer: "https://ipinfo.info/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    });

    const geoData = await response.json();

    return NextResponse.json({ ok: true, data: geoData, ip }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Error fetching IP information" },
      { status: 500 }
    );
  }
};
