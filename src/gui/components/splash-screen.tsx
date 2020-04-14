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

import React from 'react'
import { resourceURL } from '../io/util'
import { Palette } from '../style/palette'
import { remote } from 'electron'

interface SplashScreenProps {
  onClickedLoadExampleProject(): void
}

export default function SplashScreen(props: SplashScreenProps) {
  return (
    <div style={{ backgroundColor: Palette.imagePanelBackgroundColor, width: '100vw', height: '100vh', position: 'absolute' }}>
      <div style={{ position: 'absolute', right: '0px', padding: '10px', color: 'white', opacity: 0.1 }}>{ remote.app.getVersion() }</div>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', alignSelf: 'center' }}>
          <img
            style={{ width: '100px', marginTop: '100px', marginBottom: '30px', height: '100px' }}
            src={resourceURL('icon.svg')}
          />
          <div style={{ color: 'white', opacity: 0.3 }}>Drop an image or project here</div>
        </div>
        <div style={{ alignSelf: 'center' }}>
          <button
            style={{
              color: '#a0a0a0',
              marginTop: '100px',
              height: '28px',
              width: '150px',
              border: 'none',
              boxShadow: 'none',
              outline: 'none',
              backgroundColor: '#374146'
            }}
            onClick={props.onClickedLoadExampleProject}>
            Load example project
          </button>
        </div>

      </div>
    </div>
  )
}
