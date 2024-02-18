import { useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
import { CharacterGridWord } from "../components/character-grid/CharacterGrid";
import { getTodaysWord } from "./word";

type GameState = {
  targetWord: string;
  input: string;
  isGameFinished: boolean;
  submitted: CharacterGridWord[];
};

type MutableGameState = GameState & {
  resetGameState: () => void;
  setInput: (v: string) => void;
  setIsGameFinished: (v: boolean) => void;
  setSubmitted: (v: CharacterGridWord[]) => void;
};

const generateInitialGameState = (length: number): GameState => {
  return {
    targetWord: getTodaysWord(length),
    submitted: [],
    isGameFinished: false,
    input: "",
  };
};

export const useGameState = (length: number): MutableGameState => {
  const [value, setValue] = useLocalStorage(
    `wordlesstr-game-${length}`,
    generateInitialGameState(length)
  );

  const setInput = useCallback(
    (updatedValue: string) => {
      setValue((prevValue) => ({
        ...prevValue,
        input: updatedValue,
      }));
    },
    [setValue]
  );

  const setIsGameFinished = useCallback(
    (updatedValue: boolean) => {
      setValue((prevValue) => ({
        ...prevValue,
        isGameFinished: updatedValue,
      }));
    },
    [setValue]
  );

  const setSubmitted = useCallback(
    (updatedValue: CharacterGridWord[]) => {
      setValue((prevValue) => ({
        ...prevValue,
        submitted: updatedValue,
      }));
    },
    [setValue]
  );

  const resetGameState = useCallback(() => {
    setValue(generateInitialGameState(length));
  }, [length, setValue]);

  return {
    ...value,
    resetGameState,
    setInput,
    setIsGameFinished,
    setSubmitted,
  };
};
