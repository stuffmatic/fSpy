import { ControlPointsStateBase, ControlPointsState1VP, ControlPointsState2VP, GlobalSettings, CalibrationMode } from "./store-state";

//TODO: move this to a better place

export const defaultGlobalSettings:GlobalSettings = {
  calibrationMode: CalibrationMode.TwoVanishingPoints,
  imageOpacity: 1
}

const defaultControlPointsStateBase: ControlPointsStateBase = {
  principalPoint: {
    x: 0.4, y: 0.2
  },
  origin: {
    x: 0.5, y: 0.5
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
          { x: 0.3, y: 0.9 },
          { x: 0.35, y: 0.7 }
        ],
        [
          { x: 0.5, y: 0.7 },
          { x: 0.55, y: 0.8 }
        ]
      ]
    },
    {
      vanishingLines: [
        [
          { x: 0.3, y: 0.3 },
          { x: 0.35, y: 0.1 }
        ],
        [
          { x: 0.5, y: 0.1 },
          { x: 0.55, y: 0.3 }
        ]
      ]
    },
    {
      vanishingLines: [
        [
          { x: 0.7, y: 0.9 },
          { x: 0.75, y: 0.7 }
        ],
        [
          { x: 0.9, y: 0.7 },
          { x: 0.95, y: 0.8 }
        ]
      ]
    }
  ]
}