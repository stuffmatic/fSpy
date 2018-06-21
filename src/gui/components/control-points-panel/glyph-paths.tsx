import * as React from 'react'
import Point2D from '../../solver/point-2d'
import { Axis } from '../../types/calibration-settings'
import { Group, Line } from 'react-konva'
import { Palette } from '../../style/palette'

const glyphPaths = {
  figure1: [
    [
      [
        -0.14017857500000003,
        -0.2017857499999991
      ],
      [
        0.14017857500000003,
        -0.5
      ],
      [
        0.14017857500000003,
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
        0.1616765309894487,
        -0.44311359142521106
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
    <Group>
      {scaled.map((path) => {
        return (<Line points={path} strokeWidth={1} stroke={color} />)
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
  let glyphPath = num == 1 ? glyphPaths.figure1 : glyphPaths.figure2
  return glyph(glyphPath, position, height, color)
}
