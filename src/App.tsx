import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { CharacterStatus } from "./components/character-box/CharacterBox";
import {
  CharacterGrid,
  CharacterGridWord,
} from "./components/character-grid/CharacterGrid";
import { useGameState } from "./utils/game";
import { isValidWord } from "./utils/word";

const TURKISH_CHARACTERS = [
  "a",
  "b",
  "c",
  "ç",
  "d",
  "e",
  "f",
  "g",
  "ğ",
  "h",
  "ı",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "ö",
  "p",
  "r",
  "s",
  "ş",
  "t",
  "u",
  "ü",
  "v",
  "y",
  "z",
];

const getInputResult = (input: string, word: string): CharacterGridWord => {
  const statuses: CharacterStatus[] = new Array(word.length).fill(0).map(() => 'default');

  const secondPassWordSet = [];

  for (let i = 0; i < word.length; i += 1) {
    if (input[i] === word[i]) {
      statuses[i] = 'green';
    } else {
      secondPassWordSet.push(word[i]);
    }
  }

  for (let i = 0; i < word.length; i += 1) {
    if (statuses[i] === 'default') {
      if (secondPassWordSet.includes(input[i])) {
        statuses[i] = "yellow";
      }
    }
  }
  
  const result: CharacterGridWord = {
    characters: new Array(word.length).fill(0).map((_, index) => ({
      character: input[index],
      status: statuses[index],
    })),
  };

  return result;
};

const getInputStatus = (input: string, length: number): CharacterGridWord => {
  const status: CharacterGridWord = {
    characters: new Array(length).fill(0).map((_, index) => ({
      character: input.charAt(index),
      status: "default",
    })),
  };

  return status;
};

export const App = (): JSX.Element => {
  const {
    input,
    isGameFinished,
    submitted,
    targetWord,
    setInput,
    setIsGameFinished,
    setSubmitted,
  } = useGameState(6);

  const toast = useToast();

  const currentWord = getInputStatus(input, targetWord.length);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLocaleLowerCase("tr");

      if (TURKISH_CHARACTERS.includes(key) && input.length < targetWord.length) {
        setInput(input + key);
        return;
      }

      if (key === "backspace" && input.length > 0) {
        setInput(input.slice(0, input.length - 1));
        return;
      }

      if (key === "enter" && input.length === targetWord.length) {
        if (isValidWord(input)) {
          setSubmitted(submitted.concat(getInputResult(input, targetWord)));
          setInput("");

          if (input.toLocaleLowerCase("tr") === targetWord.toLocaleLowerCase("tr")) {
            setIsGameFinished(true);
            toast({
              title: `You found the answer: "${input}"`,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        } else {
          toast({
            title: `Word not found: "${input}"`,
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      }

      return;
    },
    [input, setIsGameFinished, setInput, setSubmitted, submitted, targetWord, toast]
  );

  useEffect(() => {
    if (!isGameFinished) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, isGameFinished]);

  return (
    <Container>
      <GlobalStyle />
      <CharacterGrid
        rows={6}
        columns={targetWord.length}
        words={[...submitted, ...(!isGameFinished ? [currentWord] : [])]}
      />
    </Container>
  );
};

const Container = styled.div`
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const GlobalStyle = createGlobalStyle`
  body, #root {
    height: 100vh;
    width: 100vw;
  }
`;
