import { NextResponse } from "next/server";


export async function POST(request) {
    return NextResponse.json(`"Hi Nolan,\n\nI noticed you are a Backend Engineer at Zapier with a background in full stack web development and a passion for learning and growing. Your journey from music business to programming is fascinating. Will a LinkedIn Scraping API be useful for your needs?"`);
}
