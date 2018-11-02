import * as React from 'react'

import Button from './../common/button'
import Dropdown from './../common/dropdown'
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
  showClipboardMessage: boolean
  exporters: Exporter[]
}

export default class ExportDialog extends React.Component<ExportDialogProps, ExportDialogState> {
  constructor(props: ExportDialogProps) {
    super(props)
    this.state = {
      showClipboardMessage: false,
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

    return (
      <div id='modal-container' style={{
        position: 'fixed',
        zIndex: 1,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: this.props.isVisible ? 'flex' : 'none',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }
      }>
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: 'magenta' }} >
          <div style={{ flexBasis: '50%', backgroundColor: Palette.lightGray }} >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} >
              <div style={{ textAlign: 'center', paddingTop: '75px', paddingBottom: '7px' }}>
                Export to
              </div>
              <div style={{ margin: 'auto', width: '200px', textAlign: 'center' }} >
              <Dropdown
                options={
                  this.state.exporters.map((exporter: Exporter, index: number) => {
                    return { value: index, id: index.toString(), title: exporter.name }
                  })
                }
                selectedOptionId={this.state.selectedExporterIndex.toString()}
                onOptionSelected={(selectedValue: number) => {
                  this.setState({
                    selectedExporterIndex: selectedValue
                  })
                }}
              />
              </div>
              <div className={'exporter-instructions-container'} style={{ flex: 1, maxWidth: '400px', width: '70%', margin: 'auto', padding: '25px' }} >
                {this.state.exporters[this.state.selectedExporterIndex].instructions}
              </div>
              <div style={{ textAlign: 'center', paddingBottom: '75px', paddingLeft: 0, paddingRight: 0 }}>
                <div style={{ padding: '15px', color: '#c0c0c0' }} > { this.state.showClipboardMessage ? 'Copied code to clipboard' : '' }</div>
                <Button title='Close' onClick={() => {
                  this.props.onClose()
                  this.setState({
                    showClipboardMessage: false
                  })
                }} /> &nbsp; &nbsp;
                <Button title='Copy code' onClick={() => {
                  clipboard.writeText(
                      this.state.exporters[this.state.selectedExporterIndex].generateCode(this.props.cameraParameters!)
                  )
                  this.setState({
                    showClipboardMessage: true
                  })
                }} />
              </div>
            </div>
          </div>
          <div style={{ flexBasis: '50%', overflow: 'auto', backgroundColor: '#252b2e' /* TODO: make color constant */ }} >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} >
              <div
                style={{ position: 'relative', flex: 1, color: Palette.white, whiteSpace: 'pre', fontFamily: 'monospace', fontSize: '13px', padding: '25px' }}
                dangerouslySetInnerHTML={
                  {
                    __html: hljs.highlight(
                      this.state.exporters[this.state.selectedExporterIndex].codeLanguage,
                      this.state.exporters[this.state.selectedExporterIndex].generateCode(this.props.cameraParameters)
                    ).value
                  }
                }
                id='code'
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
