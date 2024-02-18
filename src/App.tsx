import { Button, useToast } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import styled, { createGlobalStyle } from "styled-components";
import {
  CHARACTER_STATUS_COLOR,
  CharacterStatus,
} from "./components/character-box/CharacterBox";
import {
  CharacterGrid,
  CharacterGridWord,
} from "./components/character-grid/CharacterGrid";
import { useGameState } from "./utils/game";
import { isValidWord } from "./utils/word";
import { MdOutlineRestartAlt } from "react-icons/md";

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
  const statuses: CharacterStatus[] = new Array(word.length)
    .fill(0)
    .map(() => "default");

  const secondPassWordSet = [];

  for (let i = 0; i < word.length; i += 1) {
    if (input[i] === word[i]) {
      statuses[i] = "green";
    } else {
      secondPassWordSet.push(word[i]);
    }
  }

  for (let i = 0; i < word.length; i += 1) {
    if (statuses[i] === "default") {
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

const getKeyboardButtonStates = (words: CharacterGridWord[]) => {
  const buttonStates: Record<string, CharacterStatus> = {};

  words.forEach(({ characters }) => {
    characters.forEach(({ character, status }) => {
      if (status === "green") {
        buttonStates[character] = "green";
      } else if (status === "yellow" && buttonStates[character] !== "green") {
        buttonStates[character] = "yellow";
      } else if (
        (status === "default" && buttonStates[character] !== "green") ||
        buttonStates[character] !== "yellow"
      ) {
        buttonStates[character] = "default";
      }
    });
  });

  return Object.entries(buttonStates);
};

export const App = (): JSX.Element => {
  const {
    input,
    isGameFinished,
    submitted,
    targetWord,
    resetGameState,
    setInput,
    setIsGameFinished,
    setSubmitted,
  } = useGameState(6);

  const keyboardButtonStates = getKeyboardButtonStates(submitted);

  const toast = useToast();

  const currentWord = getInputStatus(input, targetWord.length);

  const handleKeyInput = useCallback(
    (key: string) => {
      if (isGameFinished) {
        return;
      }

      if (
        TURKISH_CHARACTERS.includes(key) &&
        input.length < targetWord.length
      ) {
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

          if (
            input.toLocaleLowerCase("tr") === targetWord.toLocaleLowerCase("tr")
          ) {
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
    [
      input,
      isGameFinished,
      setIsGameFinished,
      setInput,
      setSubmitted,
      submitted,
      targetWord,
      toast,
    ]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      handleKeyInput(e.key.toLocaleLowerCase("tr"));
    },
    [handleKeyInput]
  );

  const handleKeyPress = useCallback(
    (button: string) => {
      let key = button.toLocaleLowerCase("tr");

      if (key === "↵") {
        key = "enter";
      } else if (key === "←") {
        key = "backspace";
      }

      handleKeyInput(key);
    },
    [handleKeyInput]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, isGameFinished]);

  console.log(keyboardButtonStates);

  return (
    <Container>
      <GlobalStyle />
      <CharacterGrid
        rows={6}
        columns={targetWord.length}
        words={[...submitted, ...(!isGameFinished ? [currentWord] : [])]}
      />
      <ButtonContainer>
        {isGameFinished ? (
          <Button colorScheme="green" onClick={resetGameState}>
            New game
          </Button>
        ) : (
          <Button color="black" rightIcon={<MdOutlineRestartAlt />}>
            Restart
          </Button>
        )}
      </ButtonContainer>
      <KeyboardContainer>
        <Keyboard
          buttonTheme={[
            {
              class: "backspace-key",
              buttons: "←",
            },
            {
              class: "enter-key",
              buttons: "↵",
            },
            ...keyboardButtonStates.map(([character, status]) => ({
              class: `kelimesiz-key kelimesiz-key-${status}`,
              buttons: `${character.toLocaleUpperCase("tr")}`,
            })),
          ]}
          layout={{
            default: [
              "C E Y U I O P Ğ Ü ←",
              "A S D F G H J K L Ş İ",
              "Z R T V B N M Ö Ç ↵",
            ],
          }}
          onKeyPress={handleKeyPress}
        />
      </KeyboardContainer>
    </Container>
  );
};

const Container = styled.div`
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 48px;
  height: 100%;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 24px;
  height: 40px;
`;

const KeyboardContainer = styled.div`
  width: 600px;

  span {
    color: black;
  }

  .react-simple-keyboard {
    background: transparent;
  }

  .hg-button {
    background-color: #ededed;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
  }

  .backspace-key {
    width: 36px !important;
  }

  .enter-key {
    width: 48px !important;
  }

  .kelimesiz-key-green {
    background-color: ${CHARACTER_STATUS_COLOR["green"]};
  }

  .kelimesiz-key-yellow {
    background-color: ${CHARACTER_STATUS_COLOR["yellow"]};
  }

  .kelimesiz-key-default {
    background-color: ${CHARACTER_STATUS_COLOR["default"]};
  }
`;

const GlobalStyle = createGlobalStyle`
  body, #root {
    height: 100vh;
    width: 100vw;
  }
`;
