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

import * as React from 'react'
import Point2D from '../../solver/point-2d'
import { Axis } from '../../types/calibration-settings'
import { Group, Line } from 'react-konva'
import { Palette } from '../../style/palette'

const glyphPaths = {
  figure1: [
    [
      [
        -0.1709821374999999,
        -0.17589274999999988
      ],
      [
        0.17098213750000008,
        -0.5
      ],
      [
        0.17098213750000008,
        0.5
      ]
    ]
  ],
  figure2: [
    [
      [
        -0.3263473330761437,
        -0.3682634531760995
      ],
      [
        -0.18263476887466107,
        -0.4730539312612278
      ],
      [
        -0.0029940339836018125,
        -0.5
      ],
      [
        0.1743789460156247,
        -0.42194266260127244
      ],
      [
        0.25449087314016877,
        -0.25149707627021006
      ],
      [
        0.19758905217851647,
        -0.05237164623497866
      ],
      [
        -0.005988162812661348,
        0.19760470167902497
      ],
      [
        -0.34131738443733,
        0.5
      ],
      [
        0.3413173844373297,
        0.49700596601639885
      ]
    ]
  ],
  figure3: [
    [
      [
        -0.2996154278146203,
        -0.5
      ],
      [
        0.29947643427758486,
        -0.5
      ],
      [
        -0.0047942240463503425,
        -0.1229716069431239
      ],
      [
        0.23889560976979463,
        -0.0032272708127613968
      ],
      [
        0.3039342892843939,
        0.23476335999326287
      ],
      [
        0.19365929735725046,
        0.4326920286972525
      ],
      [
        -0.010173320728757339,
        0.5
      ],
      [
        -0.19275115944945523,
        0.423699334047801
      ],
      [
        -0.3039342892843946,
        0.2220440473794813
      ]
    ]
  ],
  x: [
    [
      [
        -0.4,
        -0.5
      ],
      [
        0.4,
        0.5
      ]
    ],
    [
      [
        -0.4,
        0.5
      ],
      [
        0.4,
        -0.5
      ]
    ]
  ],
  y: [
    [
      [
        -0.4,
        -0.5
      ],
      [
        0.0,
        -0.0071427499999998645
      ],
      [
        0.4,
        -0.5
      ]
    ],
    [
      [
        0.0,
        -0.01607150000000104
      ],
      [
        0.0,
        0.5
      ]
    ]
  ],
  z: [
    [
      [
        -0.4,
        -0.5
      ],
      [
        0.4,
        -0.5
      ],
      [
        -0.4,
        0.5
      ],
      [
        0.4,
        0.5
      ]
    ]
  ]
}

function scaledGlyphPath(position: Point2D, height: number, path: number[][][]): number[][] {
  let result: number[][] = []
  for (let subpath of path) {
    let scaledSubpath: number[] = []
    for (let coord of subpath) {
      scaledSubpath.push(position.x + height * coord[0])
      scaledSubpath.push(position.y + height * coord[1])
    }
    result.push(scaledSubpath)
  }

  return result
}

function glyph(glyphPath: number[][][], position: Point2D, height: number, color: string) {
  let scaled = scaledGlyphPath(position, height, glyphPath)

  return (
    <Group listening={false}>
      {scaled.map((path, i) => {
        return (<Line key={i} points={path} strokeWidth={1} stroke={color} />)
      })}
    </Group>
  )
}

export function axisGlyph(axis: Axis, position: Point2D, height: number) {
  let glyphPath: number[][][] = []
  switch (axis) {
    case Axis.PositiveX:
      glyphPath = glyphPaths.x
      break
    case Axis.PositiveY:
      glyphPath = glyphPaths.y
      break
    case Axis.PositiveZ:
      glyphPath = glyphPaths.z
      break
    default:
      break
  }

  return glyph(glyphPath, position, height, Palette.colorForAxis(axis))
}

export function numberGlyph(num: number, color: string, position: Point2D, height: number) {
  let glyphPath: number[][][] = []
  switch (num) {
    case 1:
      glyphPath = glyphPaths.figure1
      break
    case 2:
      glyphPath = glyphPaths.figure2
      break
    case 3:
      glyphPath = glyphPaths.figure3
      break
    default:
      break
  }
  return glyph(glyphPath, position, height, color)
}
