'use client'

import { useFeedbackStore, useErrorStore } from '@/store/store'
import { FeedbackData } from '@/types'
import React from 'react'

const AnimatedContent = () => {
  const { error } = useErrorStore()
  const {
    overview,
    keyPoints,
    bestPractices,
    warnings,
    summary,
  }  = useFeedbackStore() as FeedbackData

  const hasFeedback =
    overview.trim() !== '' ||
    keyPoints.length > 0 ||
    bestPractices.length > 0 ||
    warnings.length > 0 ||
    summary.trim() !== ''

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-6">
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {!hasFeedback && (
        <p className="text-gray-600 text-sm sm:text-base">
          Enter the YouTube URL below. Ensure there are no spaces before or after the link. <br />
          Just copy and paste the link—no extra characters.
        </p>
      )}

      {hasFeedback && (
        <div className="space-y-6 text-sm sm:text-base text-gray-800">
          {/* Overview */}
          <div>
            <h2 className="text-lg font-semibold mb-1">Overview</h2>
            <p className="leading-relaxed">{overview}</p>
          </div>

          {/* Key Points */}
          {keyPoints.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Key Points in the Video:</h2>
              <ul className="list-disc list-inside space-y-1">
                {keyPoints.map((item, index) => (
                  <li key={index}>{item.comment}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Best Practices */}
          {bestPractices.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Best Practices:</h2>
              <ul className="list-disc list-inside space-y-1">
                {bestPractices.map((item, index) => (
                  <li key={index}>{item.comment}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Warnings:</h2>
              <ul className="list-disc list-inside space-y-1 text-red-600">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-1">Summary</h2>
            <p className="leading-relaxed">{summary}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnimatedContent
