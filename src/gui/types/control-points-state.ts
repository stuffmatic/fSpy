/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * The state of a single control point
 */
export interface ControlPointState {
  /** Relative image coordinates [0, 1] */
  x: number
  /** Relative image coordinates [0, 1] */
  y: number
}

export type ControlPointPairState = [ControlPointState, ControlPointState]

// TODO: Rename to BinaryIndex or something? Or remove if it doesnt provide type info
export enum ControlPointPairIndex {
  First = 0,
  Second = 1
}

export interface VanishingPointControlState {
  lineSegments: [ControlPointPairState, ControlPointPairState]
}

export interface ControlPointsStateBase {
  principalPoint: ControlPointState
  origin: ControlPointState
  referenceDistanceAnchor: ControlPointState
  firstVanishingPoint: VanishingPointControlState
  // The offsets are the distances in relative image coordinates
  // along the axis from the anchor to the vanishing point corresponding
  // to the selected reference axis
  referenceDistanceHandleOffsets: [number, number]
}

export interface ControlPointsState1VP {
  horizon: ControlPointPairState
}

export interface ControlPointsState2VP {
  secondVanishingPoint: VanishingPointControlState
  thirdVanishingPoint: VanishingPointControlState
}
