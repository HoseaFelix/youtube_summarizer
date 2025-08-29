import { z } from 'zod';
import { useErrorStore, useFeedbackStore } from '@/store/store';
import {Supadata} from '@supadata/js';


// Initialize the client
const supadata = new Supadata({
  apiKey: 'sd_47c5426952503382aea9eb490833e5b8',
});

export const feedbackSchema = z.object({
  overview: z.string(),
  keyPoints: z.array(z.object({ comment: z.string() })),
  bestPractices: z.array(z.object({ comment: z.string() })),
  warnings: z.array(z.string()),
  summary: z.string(),
});

export const generateCaptions = async (url) => {
  try {
    const res = await fetch("/api/get-captions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const { transcript, error } = await res.json();

    if (error || !transcript?.content) {
      useErrorStore.getState().setError(error || "No transcript content found.");
      return;
    }

    const flattenedCaptions = transcript.content.flat();
    const captions = flattenedCaptions.map(item => item.text).join(" ");

    const feedbackRes = await fetch("/api/create-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ captions }),
    });

    const data = await feedbackRes.json();

    if (data.feedback) {
      useFeedbackStore.setState(data.feedback);
      useErrorStore.getState().clearError();
    } else {
      useErrorStore.getState().setError(data.error || "Unknown error");
    }
  } catch (err) {
    console.error("Error generating captions:", err);
    useErrorStore.getState().setError("Request failed");
  }
};




