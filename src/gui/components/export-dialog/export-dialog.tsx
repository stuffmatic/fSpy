import * as React from 'react'

import Button from './../common/button'
import { Palette } from '../../style/palette'
import Exporter from '../../exporters/exporter'
import BlenderExporter from '../../exporters/blender-exporter'
import JSONExporter from '../../exporters/json-exporter'
import hljs from 'highlight.js'
import { CameraParameters } from '../../solver/solver-result'
import { ImageState } from '../../types/image-state'
import { clipboard } from 'electron'

interface ExportDialogProps {
  isVisible: boolean
  cameraParameters: CameraParameters | null
  image: ImageState
  onOpen(): void
  onClose(): void
}

interface ExportDialogState {
  selectedExporterIndex: number
  exporters: Exporter[]
}

export default class ExportDialog extends React.Component<ExportDialogProps, ExportDialogState> {
  constructor(props: ExportDialogProps) {
    super(props)
    this.state = {
      exporters: [
        new BlenderExporter(),
        new JSONExporter()
      ],
      selectedExporterIndex: 0
    }
  }

  componentDidMount() {
    hljs.configure(
      {
        languages: this.state.exporters.map((exporter: Exporter) => exporter.codeLanguage)
      }
    )
  }

  render() {
    if (!this.props.cameraParameters) {
      return null
    }

    let modalColumnStyle: React.CSSProperties = {
      flexBasis: '50%',
      padding: '25px'
    }

    let modalColumnContentStyle: React.CSSProperties = {
      overflow: 'auto',
      height: '100%'
    }

    let modalColumnCodeContentStyle: React.CSSProperties = {
      overflow: 'auto',
      height: '100%',
      whiteSpace: 'pre',
      backgroundColor: Palette.black,
      color: Palette.white,
      fontFamily: 'monospace',
      fontSize: '12px'
    }

    this.state.exporters[this.state.selectedExporterIndex].refresh(
      this.props.cameraParameters
    )

    return (
      <div id='modal-container' style={{
        position: 'fixed',
        zIndex: 1,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: this.props.isVisible ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }
      }>
        <div id='modal-top-buttons' style={{ display: 'flex' }}>
          {this.state.exporters.map((exporter: Exporter, index: number) => {
            return (
              <button
                style={ {
                  width: '100px',
                  height: '24px',
                  border: 'none',
                  boxShadow: 'none',
                  outline: 'none',
                  backgroundColor: index == this.state.selectedExporterIndex ? Palette.lightGray : Palette.gray
                }}
                key={index}
                onClick={() => {
                  this.setState(
                    { ...this.state, selectedExporterIndex: index }
                  )
                }}
              >
              {exporter.name}
              </button>
            )
          })}
        </div>
        <div id='modal-content' style={{
          backgroundColor: Palette.lightGray,
          width: '700px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div id='modal-columns' style={{
            height: '450px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
            <div style={modalColumnStyle}>
              <div style={modalColumnContentStyle} >

                {this.state.exporters[this.state.selectedExporterIndex].instructions}
              </div>
            </div>

            <div style={modalColumnStyle}>
              <div style={modalColumnCodeContentStyle}>
                <div
                  dangerouslySetInnerHTML={
                    {
                      __html: hljs.highlight(
                        this.state.exporters[this.state.selectedExporterIndex].codeLanguage,
                        this.state.exporters[this.state.selectedExporterIndex].generateCode(this.props.cameraParameters)
                      ).value
                    }
                  }
                  id='code'
                  style={{ padding: '10px' }} />

              </div>
              <Button title='Copy to clipboard' onClick={() => {
                clipboard.writeText(
                  this.state.exporters[this.state.selectedExporterIndex].generateCode(this.props.cameraParameters!)
                )
              }} />
            </div>
          </div>
          <div id='modal-bottom-button' style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1
          }}>
            <Button title='Close' onClick={() => { this.props.onClose() }} />
          </div>
        </div>
      </div>
    )
  }
}
