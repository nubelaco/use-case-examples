import { NextResponse } from "next/server";

export async function GET(request) {
  const params = request.url.split("?")[1];

  try {
    const response = await fetch(
      `https://nubela.co/proxycurl/api/v2/linkedin?${
       params
      }`,
      {
        headers: {
          Authorization:`Bearer ${process.env.PROXYCURL_API_KEY}`,
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }); 
  }
}
