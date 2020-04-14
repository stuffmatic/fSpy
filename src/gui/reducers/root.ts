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

import { combineReducers } from 'redux'
import { StoreState } from '../types/store-state'
import { calibrationSettingsBase } from './calibration-settings-base'
import { calibrationSettings1VP } from './calibration-settings-1-vp'
import { calibrationSettings2VP } from './calibration-settings-2-vp'
import { controlPointsStateBase } from './control-points-base'
import { controlPointsState1VP } from './control-points-1-vp'
import { controlPointsState2VP } from './control-points-2-vp'
import { resultDisplaySettings } from './result-display-settings'
import { solverResult } from './solver-result'
import { globalSettings } from './global-settings'
import { imageState } from './image-state'
import { uiState } from './ui-state'

const rootReducer = combineReducers<StoreState>({
  globalSettings,
  calibrationSettingsBase,
  calibrationSettings1VP,
  calibrationSettings2VP,
  controlPointsStateBase,
  controlPointsState1VP,
  controlPointsState2VP,
  solverResult,
  image: imageState,
  resultDisplaySettings,
  uiState
})

export default rootReducer
