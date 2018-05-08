import * as React from 'react';
import Button from './../common/button'
import { Palette } from '../../style/palette';


export default function ExportDialog() {
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
    backgroundColor: Palette.black,
    color: Palette.white,
    fontFamily: "Roboto Mono"
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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
    }>
      <div id="modal-top-buttons" style={{ display: "flex" }}>
        <Button title="Herro" onClick={() => { }} />
        <Button title="Herro" onClick={() => { }} />
        <Button title="Herro" onClick={() => { }} />
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
              Det är ett välkänt faktum att läsare distraheras av läsbar text på en sida när man skall studera layouten. Poängen med Lorem
              Ipsum är att det ger ett normalt ordflöde, till skillnad från "Text här, Text här", och ger intryck av att
              efter "Lorem Ipsum" avslöjar många webbsidor under uteckling. Olika versioner har dykt upp under åren, ibland
              av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska).
              vara läsbar text. Många publiseringprogram och webbutvecklare använder Lorem Ipsum som test-text, och en sökning
              avslöjar många webbsidor under uteckling. Olika versioner har dykt upp under åren, ibland
              av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska).
              vara läsbar text. Många publiseringprogram och webbutvecklare använder Lorem Ipsum som test-text, och en sökning
              Det är ett välkänt faktum att läsare distraheras av läsbar text på en sida när man skall studera layouten. Poängen med Lorem
              Ipsum är att det ger ett normalt ordflöde, till skillnad från "Text här, Text här", och ger intryck av att
              efter "Lorem Ipsum" avslöjar många webbsidor under uteckling. Olika versioner har dykt upp under åren, ibland
              av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska).
              vara läsbar text. Många publiseringprogram och webbutvecklare använder Lorem Ipsum som test-text, och en sökning
              avslöjar många webbsidor under uteckling. Olika versioner har dykt upp under åren, ibland
              av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska).
              vara läsbar text. Många publiseringprogram och webbutvecklare använder Lorem Ipsum som test-text, och en sökning
              Det är ett välkänt faktum att läsare distraheras av läsbar text på en sida när man skall studera layouten. Poängen med Lorem
              Ipsum är att det ger ett normalt ordflöde, till skillnad från "Text här, Text här", och ger intryck av att
              efter "Lorem Ipsum" avslöjar många webbsidor under uteckling. Olika versioner har dykt upp under åren, ibland
              av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska).
              vara läsbar text. Många publiseringprogram och webbutvecklare använder Lorem Ipsum som test-text, och en sökning
              avslöjar många webbsidor under uteckling. Olika versioner har dykt upp under åren, ibland
              av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska).
              vara läsbar text. Många publiseringprogram och webbutvecklare använder Lorem Ipsum som test-text, och en sökning

            </div>
          </div>

          <div style={modalColumnStyle}>
            <div style={modalColumnCodeContentStyle}>
            <div style={ {padding: "10px"} }>
            lyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska).
              vara läsbar text. Många publiseringprogram och webbutvecklare använder Lorem Ipsum som test-text, och en sökning
              Det är ett välkänt faktum att läsare distraheras av läsbar text på en sida när man skall studera layouten. Poängen med Lorem
              Ipsum är att det ger ett normalt ordflöde, till skillnad från "Text här, Text här", och ger intryck av att
              efter "Lorem Ipsum" avslöjar många webbsidor under uteckling. Olika versioner har dykt upp under åren, ibland
              av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska).
              vara läsbar text. Många publiseringprogram och webbutvecklare använder Lorem Ipsum som test-text, och en sökning
              avslöjar många webbsidor under uteckling. Olika versioner har dykt upp under åren, ibland
              av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska).
              vara läsbar text. Många publiseringprogram och webbutvecklare använder Lorem Ipsum som test-text, och en sökning
              Det är ett välkänt faktum att läsare distraheras av läsbar text på en sida när man skall studera layouten. Poängen med Lorem
              Ipsum är att det ger ett normalt ordflöde, till skillnad från "Text här, Text här", och ger intryck av att
              efter "Lorem Ipsum" avslöjar många webbsidor under uteckling. Olika versioner har dykt upp under åren, ibland
              av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska).
              vara läsbar text. Många publiseringprogram och webbutvecklare använder Lorem Ipsum som test-text, och en sökning
              avslöjar många webbsidor under uteckling. Olika versioner har dykt upp under åren, ibland
              av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska). av olyckshändelse, ibland med flit (mer eller mindre humoristiska).
              vara läsbar text. Många publiseringprogram
              </div>
            </div>
          </div>
        </div>
        <div id="modal-bottom-button" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1
        }}>
          <Button title="Close" onClick={() => { }} />
        </div>
      </div>
    </div>
  )
}