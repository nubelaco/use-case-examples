import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { prompt, profileJSON } = await request.json();

  try {
    const basePrompt = `
      ${prompt}
  
      Instructions: 
      Replace every variable that is in <> format with value from with the first_name from the profileJSON below.
      Replace <SOMETHING INTERESTING FROM PROFILE DATA> with something interesting from the profileJSON below.

      profileJSON:
      ${JSON.stringify(profileJSON)}
    `;

    const baseCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.65,
      messages: [{ role: "user", content: basePrompt }],
    });

    const promptOutput = baseCompletion.choices[0].message.content;
    return NextResponse.json(promptOutput);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
