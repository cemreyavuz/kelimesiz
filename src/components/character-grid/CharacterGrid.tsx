import styled from "styled-components";
import {
  CHARACTER_BOX_SIZE,
  CharacterBox,
  CharacterStatus,
} from "../character-box/CharacterBox";

export type CharacterGridItem = {
  character: string;
  status: CharacterStatus;
};

export type CharacterGridWord = {
  characters: CharacterGridItem[];
};

const CHARACTER_GRID_SPACE = 4;

type CharacterGridProps = {
  rows: number;
  columns: number;
  words: CharacterGridWord[];
};

const getEmptyRow = (length: number): CharacterGridWord => {
  return {
    characters: new Array(length).fill(0).map(() => ({
      character: "",
      status: "default",
    })),
  };
};

const CharacterGridRow = ({
  columns,
  word,
}: {
  columns: number;
  word: CharacterGridWord;
}): JSX.Element => {
  return (
    <Row $columns={columns}>
      {word.characters.map((character) => (
        <CharacterBox {...character} />
      ))}
    </Row>
  );
};

export const CharacterGrid = ({
  rows,
  columns,
  words,
}: CharacterGridProps): JSX.Element => {
  return (
    <Container $rows={rows}>
      {words.map((word) => (
        <CharacterGridRow columns={columns} word={word} />
      ))}
      {new Array(rows - words.length).fill(0).map(() => (
        <CharacterGridRow columns={columns} word={getEmptyRow(columns)} />
      ))}
    </Container>
  );
};

const Container = styled.div<{ $rows: number }>`
  display: flex;
  flex-direction: column;
  gap: ${CHARACTER_GRID_SPACE}px;
  height: ${({ $rows }) =>
    $rows * CHARACTER_BOX_SIZE + ($rows - 1) * CHARACTER_GRID_SPACE}px;
`;

const Row = styled.div<{ $columns: number }>`
  display: flex;
  gap: ${CHARACTER_GRID_SPACE}px;
  width: ${({ $columns }) =>
    $columns * CHARACTER_BOX_SIZE + ($columns - 1) * CHARACTER_GRID_SPACE}px;
`;
