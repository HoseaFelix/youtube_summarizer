import { NextRequest, NextResponse } from 'next/server';
import { feedbackSchema } from '@/constants/constant';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: NextRequest) {
  try {
    const { captions } = await req.json();

    const {
      object: { overview, keyPoints, bestPractices, warnings, summary },
    } = await generateObject({
      model: google('gemini-2.0-flash-001', {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an expert at analyzing spoken content from YouTube videos. I will give you the full transcript (captions) of a video. 

        From it, extract the following insights in structured JSON format based on this schema:

        - overview: A brief description (2–3 sentences) of what the video is about.
        - keyPoints: An array of important insights or takeaways. Each point should be short and clear.
        - bestPractices: An array of practical advice or suggestions mentioned in the video. Each should be phrased as a helpful instruction.
        - warnings: An array of warnings, misconceptions, or pitfalls that the speaker highlights (if any).
        - summary: A concise conclusion or wrap-up of the video.

        Only extract what is relevant based on the transcript. If a section (like warnings) is not present in the video, return it as an empty array.

        Now analyze the following video transcript:

        """
        ${captions}
        """
      `,
    });

    return NextResponse.json({
      feedback: { overview, keyPoints, bestPractices, warnings, summary },
    });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ error: 'Failed to generate feedback.' }, { status: 500 });
  }
}
