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

export const generateCaptions = async (url)=>{

  const Transcript = await supadata.youtube.transcript({
    url: url,
  });
  
  if (!Transcript?.content || !Array.isArray(Transcript.content)) {
    useErrorStore.getState().setError("No transcript content found.");
    return;
  }

  const flattenedCaptions = Transcript.content.flat();

  const captions = flattenedCaptions.map(item => item.text).join(' ');

  const res = await fetch('/api/create-feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ captions }),
  });  

  const data = await res.json();

  if(data.feedback) {
    useFeedbackStore.setState(data.feedback)
    useErrorStore.getState().clearError()
  } else{
    useErrorStore.getState().setError(data.error || 'unknown error' )
  }

}



