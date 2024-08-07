export type Coords = {
    x: number,
    y: number
}
  
export type TNode = {
    id: string;
    value: string | number | null;
    coords: Coords;
    isEndNode: boolean;
}