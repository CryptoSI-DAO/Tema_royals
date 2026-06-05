'use server';
/**
 * @fileOverview This file provides an AI flow for generating concise summaries of past match reports
 * and previews of upcoming fixtures for Tema Royals SC.
 *
 * - generateMatchSummary - A function that generates a summary or preview based on the provided text.
 * - MatchSummaryInput - The input type for the generateMatchSummary function.
 * - MatchSummaryOutput - The return type for the generateMatchSummary function.
 */

import { z } from "zod";

const MatchSummaryInputSchema = z.object({
  context: z.string().describe("The full match report text or detailed information about an upcoming fixture."),
});
export type MatchSummaryInput = z.infer<typeof MatchSummaryInputSchema>;

const MatchSummaryOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the match report or a preview of the upcoming fixture."),
});
export type MatchSummaryOutput = z.infer<typeof MatchSummaryOutputSchema>;

export async function generateMatchSummary(input: MatchSummaryInput): Promise<MatchSummaryOutput> {
  const parsedInput = MatchSummaryInputSchema.parse(input);
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not configured.");
  }

  const prompt = `You are an AI assistant providing insights for Tema Royals SC fans.
Based on the following provided text, generate a concise summary or preview.

If the text is a match report for a past game, summarize it by highlighting key events, goals, goal scorers, and the final score.
If the text describes an upcoming fixture, create a preview including participating teams, date, time, venue, and what fans can look forward to.

Keep the output to 2-3 paragraphs, focusing on information relevant to Tema Royals SC.

Text to process:
${parsedInput.context}`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              summary: { type: "string" },
            },
            required: ["summary"],
          },
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API request failed with status ${response.status}.`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini API returned an empty response.");
  }

  return MatchSummaryOutputSchema.parse(JSON.parse(text));
}
