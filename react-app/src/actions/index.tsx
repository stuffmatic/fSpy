export const MOVE_CONTROL_POINT = 'MOVE_CONTROL_POINT';
export type MOVE_CONTROL_POINT = typeof MOVE_CONTROL_POINT;

export const DUMMY = 'DUMMY';
export type DUMMY = typeof DUMMY;

export interface MoveControlPoint {
  type: MOVE_CONTROL_POINT
  x: number
  y: number
}

export interface DummyAction {
  type: DUMMY
}

export type Action = MoveControlPoint | DummyAction

export function moveControlPoint(x: number, y: number): MoveControlPoint {
  return {
    type: MOVE_CONTROL_POINT,
    x: x,
    y: y
  }
}
