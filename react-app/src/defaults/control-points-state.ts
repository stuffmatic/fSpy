import { ControlPointsStateBase, ControlPointsState1VP, ControlPointsState2VP } from "../types/control-points-state";

const defaultControlPointsStateBase: ControlPointsStateBase = {
  principalPoint: {
    x: 0.5, y: 0.5
  },
  origin: {
    x: 0.3, y: 0.3
  },
}

export const defaultControlPointsState1VP: ControlPointsState1VP = {
  ...defaultControlPointsStateBase,
  horizon: [
    { x: 0.2, y: 0.5 },
    { x: 0.8, y: 0.5 }
  ],
  vanishingPoints: [
    {
      vanishingLines: [
        [
          { x: 0.3, y: 0.9 },
          { x: 0.35, y: 0.7 }
        ],
        [
          { x: 0.5, y: 0.7 },
          { x: 0.55, y: 0.8 }
        ]
      ]
    }
  ]
}

export const defaultControlPointsState2VP: ControlPointsState2VP = {
  ...defaultControlPointsStateBase,
  vanishingPoints: [
    {
      vanishingLines: [
        [
          {
            x: 0.0901207729468599,
            y: 0.5736714975845411
          },
          {
            x: 0.0318719806763285,
            y: 0.06521739130434782
          }
        ],
        [
          {
            x: 0.966050724637681,
            y: 0.16908212560386474
          },
          {
            x: 0.8660386473429951,
            y: 0.7367149758454107
          }
        ]
      ]
    },
    {
      vanishingLines: [
        [
          {
            x: 0.4714855072463767,
            y: 0.9758454106280193
          },
          {
            x: 0.893514492753623,
            y: 0.7065217391304348
          }
        ],
        [
          {
            x: 0.4626932367149758,
            y: 0.3103864734299517
          },
          {
            x: 0.992427536231884,
            y: 0.1751207729468599
          }
        ]
      ]
    },
    {
      vanishingLines: [
        [
          {
            x: 0.5813888888888888,
            y: 0.3285024154589372
          },
          {
            x: 0.021980676328502414,
            y: 0.08333333333333333
          }
        ],
        [
          {
            x: 0.0692391304347826,
            y: 0.538647342995169
          },
          {
            x: 0.501159420289855,
            y: 0.9842995169082126
          }
        ]
      ]
    }
  ]
}