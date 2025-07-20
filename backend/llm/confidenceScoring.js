function calculateConfidence(searchResults, llmResponse) {
  if (!searchResults || searchResults.length === 0) {
    return { score: 0, level: 'Very Low', reason: 'No relevant documents found' };
  }

  const avgScore = searchResults.reduce((sum, result) => sum + (result.score || 0), 0) / searchResults.length;
  const topScore = Math.max(...searchResults.map(r => r.score || 0));
  const resultCount = searchResults.length;
  const responseLength = llmResponse?.length || 0;

  let confidence = 0;

  if (topScore >= 0.8) confidence += 40;
  else if (topScore >= 0.6) confidence += 30;
  else if (topScore >= 0.4) confidence += 20;
  else confidence += 10;


  if (resultCount >= 3) confidence += 25;
  else if (resultCount >= 2) confidence += 20;
  else confidence += 15;

  confidence += Math.min(avgScore * 25, 25);

  if (responseLength >= 500) confidence += 10;
  else if (responseLength >= 200) confidence += 7;
  else confidence += 3;

  let level, reason;
  if (confidence >= 85) {
    level = 'Very High';
    reason = 'Strong document matches with comprehensive analysis';
  } else if (confidence >= 70) {
    level = 'High';
    reason = 'Good document relevance with solid analysis';
  } else if (confidence >= 55) {
    level = 'Medium';
    reason = 'Moderate document matches, analysis may have gaps';
  } else if (confidence >= 40) {
    level = 'Low';
    reason = 'Limited document relevance, incomplete information likely';
  } else {
    level = 'Very Low';
    reason = 'Poor document matches, answer may be unreliable';
  }

  return {
    score: Math.round(confidence),
    level,
    reason,
    details: {
      topRelevanceScore: topScore?.toFixed(3),
      avgRelevanceScore: avgScore?.toFixed(3),
      documentCount: resultCount,
      responseLength
    }
  };
}

module.exports = { calculateConfidence };
