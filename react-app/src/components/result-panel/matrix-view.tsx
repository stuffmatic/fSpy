import * as React from 'react';
import Transform from '../../solver/transform';

interface MatrixViewProps {
  transform: Transform
}

export default function MatrixView(props: MatrixViewProps) {
  return (
    <div >
      {props.transform.matrix[0][0]}, {props.transform.matrix[0][1]}, {props.transform.matrix[0][2]}, {props.transform.matrix[0][3]} <br />
      {props.transform.matrix[1][0]}, {props.transform.matrix[1][1]}, {props.transform.matrix[1][2]}, {props.transform.matrix[1][3]} <br />
      {props.transform.matrix[2][0]}, {props.transform.matrix[2][1]}, {props.transform.matrix[2][2]}, {props.transform.matrix[2][3]} <br />
      {props.transform.matrix[3][0]}, {props.transform.matrix[2][1]}, {props.transform.matrix[3][2]}, {props.transform.matrix[3][3]}
    </div>
  )
}