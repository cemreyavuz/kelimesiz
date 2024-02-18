import wordList from "../assets/word-list/word-list.json";

export const getTodaysWord = (length: number): string => {
  const eligibleWords = wordList.filter((w) => w.length === length);

  // TODO: add hash with random seed depending on the day
  const hash = new Date().getTime() % eligibleWords.length;

  return eligibleWords[hash];
};

export const isValidWord = (input: string): boolean => {
  return wordList.includes(input.toLocaleLowerCase("tr"));
};
