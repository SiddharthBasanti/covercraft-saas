export const calculateStats = (text: string): { characters: number; words: number; readabilityScore: number } => {
  const words = text.trim().split(/\s+/).length;
  const characters = text.length;
  
  // Simple readability score based on average word length (1-10 scale)
  const avgWordLength = characters / words;
  const readabilityScore = Math.max(1, Math.min(10, 10 - (avgWordLength - 4) * 2));

  return {
    characters,
    words,
    readabilityScore: Math.round(readabilityScore * 10) / 10
  };
};

export const downloadAsFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};