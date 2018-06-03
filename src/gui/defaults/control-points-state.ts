import { ControlPointsStateBase, ControlPointsState1VP, ControlPointsState2VP } from '../types/control-points-state'

const defaultControlPointsStateBase: ControlPointsStateBase = {
  principalPoint: {
    x: 0.5, y: 0.5
  },
  origin: {
    x: 0.4235593220338983,
    y: 0.04302477183833116
  },
  referenceDistanceAnchor: {
    x: 0.08661016949152542,
    y: 0.5671447196870926
  },
  referenceDistanceHandleOffsets: [
    -0.2772282099685266,
    -0.2020170948124077
  ]
}

export const defaultControlPointsState1VP: ControlPointsState1VP = {
  ...defaultControlPointsStateBase,
  horizon: [
    {
      x: 0.2,
      y: 0.5
    },
    {
      x: 0.8,
      y: 0.5
    }
  ],
  vanishingPoints: [
    {
      lineSegments: [
        [
          {
            x: 0.3218575063613231,
            y: 0.7964376590330788
          },
          {
            x: 0.14819338422391856,
            y: 0.6208651399491094
          }
        ],
        [
          {
            x: 0.16440203562340966,
            y: 0.15012722646310434
          },
          {
            x: 0.39132315521628497,
            y: 0.24681933842239187
          }
        ]
      ]
    }
  ]
}

export const defaultControlPointsState2VP: ControlPointsState2VP = {
  ...defaultControlPointsStateBase,
  vanishingPoints: [
    {
      lineSegments: [
        [
          {
            x: 0.0318719806763285,
            y: 0.06521739130434782
          },
          {
            x: 0.060900900900900896,
            y: 0.3127413127413127
          }
        ],
        [
          {
            x: 0.9369369369369368,
            y: 0.33719433719433717
          },
          {
            x: 0.9076576576576576,
            y: 0.5057915057915058
          }
        ]
      ]
    },
    {
      lineSegments: [
        [
          {
            x: 0.4977477477477477,
            y: 0.9626769626769627
          },
          {
            x: 0.893514492753623,
            y: 0.7065217391304348
          }
        ],
        [
          {
            x: 0.5738738738738738,
            y: 0.28314028314028317
          },
          {
            x: 0.8163063063063062,
            y: 0.22007722007722008
          }
        ]
      ]
    },
    {
      lineSegments: [
        [
          {
            x: 0.48018018018018016,
            y: 0.2857142857142857
          },
          {
            x: 0.3326126126126126,
            y: 0.22136422136422138
          }
        ],
        [
          {
            x: 0.22954954954954954,
            y: 0.703989703989704
          },
          {
            x: 0.4087387387387387,
            y: 0.8867438867438867
          }
        ]
      ]
    }
  ]
}
