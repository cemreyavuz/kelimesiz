import styled from "styled-components";

export type CharacterStatus = "default" | "green" | "yellow";

export const CHARACTER_BOX_SIZE = 48;

const CHARACTER_STATUS_COLOR: Record<CharacterStatus, string> = {
  default: "darkgray",
  green: "#25952d",
  yellow: "#ddcc4f",
};

type CharacterBoxProps = {
  character: string; // TODO: length of 1
  status: CharacterStatus;
};

export const CharacterBox = ({
  character,
  status,
}: CharacterBoxProps): JSX.Element => {
  return (
    <Container $status={status} $empty={character.length === 0}>
      {character.toLocaleUpperCase("tr")}
    </Container>
  );
};

const Container = styled.div<{ $empty: boolean; $status: CharacterStatus }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $empty, $status }) =>
    $empty ? "gray" : CHARACTER_STATUS_COLOR[$status]};
  border-radius: 2px;
  font-size: 24px;
  font-weight: 500;
  height: ${CHARACTER_BOX_SIZE}px;
  width: ${CHARACTER_BOX_SIZE}px;
`;
