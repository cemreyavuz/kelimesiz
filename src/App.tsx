import styled, { createGlobalStyle } from "styled-components";
import {
  CharacterGrid,
  CharacterGridWord,
} from "./components/character-grid/CharacterGrid";
import { useCallback, useEffect, useState } from "react";
import { CharacterStatus } from "./components/character-box/CharacterBox";
import { getTodaysWord, isValidWord } from "./utils/word";
import { useToast } from "@chakra-ui/react";

const WORD = getTodaysWord(6).toLocaleLowerCase('tr');

console.log(WORD);

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
  const [submitted, setSubmitted] = useState<CharacterGridWord[]>([]);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const [input, setInput] = useState("");

  const toast = useToast();

  const currentWord = getInputStatus(input, WORD.length);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLocaleLowerCase("tr");

      if (TURKISH_CHARACTERS.includes(key) && input.length < WORD.length) {
        setInput((prevInput) => prevInput + key);
        return;
      }

      if (key === "backspace" && input.length > 0) {
        setInput((prevInput) => prevInput.slice(0, input.length - 1));
        return;
      }

      if (key === "enter" && input.length === WORD.length) {
        if (isValidWord(input)) {
          setSubmitted((prevSubmitted) =>
            prevSubmitted.concat(getInputResult(input, WORD))
          );
          setInput("");

          if (input.toLocaleLowerCase("tr") === WORD.toLocaleLowerCase("tr")) {
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
    [input, toast]
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
        columns={WORD.length}
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
