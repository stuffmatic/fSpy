import * as React from 'react';

interface WarningsListProps {
  warnings:string[]
}

export default function WarningsList(props: WarningsListProps) {
  //TODO: use some other key= value here?
  return (
    <ul >
      { props.warnings.map((warning) => <li key={warning}>{warning}</li>) }
    </ul>
  )
}