import * as React from 'react';

import Button from './../common/button'
import { Palette } from '../../style/palette';
import Exporter from '../../exporters/exporter';
import BlenderExporter from '../../exporters/blender-exporter';
import JSONExporter from '../../exporters/json-exporter';
import * as hljs from 'highlight.js'

interface ExportDialogProps {
  isVisible: boolean
  onOpen(): void
  onClose(): void
}

interface ExportDialogState {
  selectedExporterIndex: number
  exporters: Exporter[]
}

export default class ExportDialog extends React.Component<ExportDialogProps, ExportDialogState> {

  state = {
    exporters: [
      new JSONExporter(),
      new BlenderExporter()
    ],
    selectedExporterIndex: 0
  }

  constructor(props: ExportDialogProps) {
    super(props)
  }

  componentDidMount() {
    hljs.configure(
      {
        languages: this.state.exporters.map((exporter:Exporter) => exporter.codeLanguage)
      }
    )
  }


  render() {
    let modalColumnStyle: React.CSSProperties = {
      flexBasis: "50%",
      padding: "25px",
    }

    let modalColumnContentStyle: React.CSSProperties = {
      overflow: "auto",
      height: "100%"
    }

    let modalColumnCodeContentStyle: React.CSSProperties = {
      overflow: "auto",
      height: "100%",
      whiteSpace: "pre",
      backgroundColor: Palette.black,
      color: Palette.white,
      fontFamily: "Roboto Mono",
      userSelect: "text"
    }


    return (
      <div id="modal-container" style={{
        position: "fixed",
        zIndex: 1,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: this.props.isVisible ? "flex" : "none",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }
      }>
        <div id="modal-top-buttons" style={{ display: "flex" }}>
          { this.state.exporters.map((exporter:Exporter, index:number) => {
            return (
              <Button
                isSelected= {index == this.state.selectedExporterIndex}
                title={exporter.name}
                onClick={() => {
                  this.setState(
                    {...this.state, selectedExporterIndex: index}
                  )
                }}
              />
            )
          })}
        </div>
        <div id="modal-content" style={{
          backgroundColor: "#fefefe",
          width: "700px",
          height: "500px",
          display: "flex",
          flexDirection: "column"
        }}>
          <div id="modal-columns" style={{
            height: "450px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center"
          }}>
            <div style={modalColumnStyle}>
              <div style={modalColumnContentStyle} >
                {  this.state.exporters[this.state.selectedExporterIndex].instructions }
              </div>
            </div>

            <div style={modalColumnStyle}>
              <div style={modalColumnCodeContentStyle}>
                <div
                  dangerouslySetInnerHTML={
                    {
                      __html: hljs.highlight(
                        this.state.exporters[this.state.selectedExporterIndex].codeLanguage,
                          this.state.exporters[this.state.selectedExporterIndex].code
                        ).value
                    }
                  }
                  id="code"
                  style={{ padding: "10px" }} />

              </div>
            </div>
          </div>
          <div id="modal-bottom-button" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1
          }}>
            <Button title="Close" onClick={() => { this.props.onClose() }} />
          </div>
        </div>
      </div>
    )
  }
}