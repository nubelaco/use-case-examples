import { NextResponse } from "next/server";
import mockPersonProfile from "./mock.json";

export async function GET(request) {
  const params = request.url.split("?")[1];

  
    return NextResponse.json(mockPersonProfile); 
}
