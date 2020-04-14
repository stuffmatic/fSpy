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

import { ControlPointsStateBase, ControlPointsState1VP, ControlPointsState2VP } from '../types/control-points-state'
import Constants from '../constants'

const defaultOrigin = {
  x: 0.602536594761171,
  y: 0.36081762673040585
}

const defaultReferenceDistanceAnchor = {
  x: 0.5080116846430406,
  y: 0.6779647921622778
}

export const defaultControlPointsStateBase: ControlPointsStateBase = {
  principalPoint: {
    x: 0.5,
    y: 0.5
  },
  origin: defaultOrigin,
  referenceDistanceAnchor: Constants.referenceDistanceAnchorEnabled ? defaultReferenceDistanceAnchor : defaultOrigin,
  referenceDistanceHandleOffsets: [
    0.13108430697783005,
    0.065990108556575
  ],
  firstVanishingPoint: {
    lineSegments: [
      [
        {
          x: 0.4818953851492018,
          y: 0.18529755347139623
        },
        {
          x: 0.3167539902845246,
          y: 0.2606999044047578
        }
      ],
      [
        {
          x: 0.5280383992597733,
          y: 0.8574200419664915
        },
        {
          x: 0.6498458824890123,
          y: 0.6917293352712968
        }
      ]
    ]
  }
}

export const defaultControlPointsState1VP: ControlPointsState1VP = {
  horizon: [
    {
      x: 0.2,
      y: 0.5
    },
    {
      x: 0.8,
      y: 0.5
    }
  ]
}

export const defaultControlPointsState2VP: ControlPointsState2VP = {
  secondVanishingPoint: {
    lineSegments: [
      [
        {
          x: 0.34623259623259617,
          y: 0.659551470318368
        },
        {
          x: 0.49578722002635034,
          y: 0.8792706756358705
        }
      ],
      [
        {
          x: 0.5056920556920557,
          y: 0.17069050371693362
        },
        {
          x: 0.7026699426699425,
          y: 0.2689684285221547
        }
      ]
    ]
  },
  thirdVanishingPoint:
  {
    lineSegments: [
      [
        {
          x: 0.33624078624078624,
          y: 0.6067665545026896
        },
        {
          x: 0.30893837018837017,
          y: 0.3142575174095972
        }
      ],
      [
        {
          x: 0.6774662162162162,
          y: 0.6094667009961638
        },
        {
          x: 0.7070341932841933,
          y: 0.35057030079777063
        }
      ]
    ]
  }
}
