import React from 'react'
import { resourceURL } from '../io/util'
import { Palette } from '../style/palette'

interface SplashScreenProps {
  onClickedLoadExampleProject(): void
}

export default function SplashScreen(props: SplashScreenProps) {
  return (
    <div style={{ backgroundColor: Palette.imagePanelBackgroundColor, width: '100vw', height: '100vh', position: 'absolute' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', marginTop: '50px', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', alignSelf: 'center' }}>
          <img
            style={{ width: '100px', height: '100px', paddingBottom: '20px' }}
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
