import * as React from 'react';

interface TableRowProps {
  title: string
  value: string
}

export default function TableRow(props: TableRowProps) {
  return (
    <div className="panel-row" >
      <div style={{display: "flex"}}>
        <span style={{flexGrow: 1}}>{props.title}</span>
        <span style={{ textAlign: "right" }}> {props.value} </span>
      </div>
    </div>
  )
}