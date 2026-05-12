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

import * as React from 'react'
import Point2D from '../../solver/point-2d'
import { Circle, Group } from 'react-konva'
import ControlPolyline from './control-polyline'
import MathUtil from '../../solver/math-util'

interface ControlPointProps {
  hidden?: boolean
  absolutePosition: Point2D
  fill?: string | undefined
  stroke?: string | undefined
  isDragDisabled?: boolean
  lineNormal?: Point2D // TODO: less cryptic API to draw line control points
  onControlPointDrag(absolutePosition: Point2D): void
}

interface ControlPointState {
  isDragging: boolean
  dragPosition: Point2D
  previousDragPosition: Point2D
  dragDamping: number
}

export default class ControlPoint extends React.Component<ControlPointProps, ControlPointState> {

  readonly HIT_RADIUS = 8
  readonly RADIUS = 3
  readonly SHIFT_DRAG_DAMING = 0.1

  private circleRef = React.createRef<any>()

  constructor(props: ControlPointProps) {
    super(props)

    this.state = {
      isDragging: false,
      dragPosition: { x: 0, y: 0 },
      previousDragPosition: { x: 0, y: 0 },
      dragDamping: 1
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('mouseup', this.handleWindowMouseUp)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('mouseup', this.handleWindowMouseUp)
  }

  private handleWindowMouseUp = () => {
    if (this.state.isDragging) {
      const node = this.circleRef.current
      if (node) {
        node.stopDrag()
      }
    }
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key == 'Shift') {
      this.setState({
        ...this.state,
        dragDamping: this.SHIFT_DRAG_DAMING
      })
    }
  }

  handleKeyUp = (event: KeyboardEvent) => {
    if (event.key == 'Shift') {
      this.setState({
        ...this.state,
        dragDamping: 1
      })
    }
  }

  render() {
    if (this.props.hidden) {
      return null
    }

    return (
      <Group>
        <Circle
          ref={this.circleRef}
          draggable={!this.props.isDragDisabled}
          radius={this.HIT_RADIUS}
          x={this.props.absolutePosition.x}
          y={this.props.absolutePosition.y}
          onDragStart={(event: any) => {
            this.setState({
              ...this.state,
              isDragging: true,
              dragPosition: { x: event.target.x(), y: event.target.y() },
              previousDragPosition: { x: event.target.x(), y: event.target.y() }
            })
            this.onDragPositionChanged()
          }}
          onDragMove={(event: any) => {
            // Compute the drag delta
            const dx = event.target.x() - this.state.previousDragPosition.x
            const dy = event.target.y() - this.state.previousDragPosition.y
            // Compute the new drag position by adding the delta multiplied
            // by the damping factor
            const newDragPosition = {
              x: this.state.dragPosition.x + this.state.dragDamping * dx,
              y: this.state.dragPosition.y + this.state.dragDamping * dy
            }
            this.setState({
              ...this.state,
              dragPosition: newDragPosition,
              previousDragPosition: { x: event.target.x(), y: event.target.y() }
            })
            this.onDragPositionChanged()
          }}
          onDragEnd={(_event: any) => {
            // Reset the Konva node position to match React props.
            // During drag, Konva internally moves the node to follow the pointer.
            // If the pointer moved outside the stage, the node's internal position
            // can be far from the visible area. react-konva may skip updating it
            // if props haven't changed (e.g. clamped to the same boundary), leaving
            // the hit area desynchronized from the visual representation.
            const node = this.circleRef.current
            if (node) {
              node.x(this.props.absolutePosition.x)
              node.y(this.props.absolutePosition.y)
            }
            this.setState({
              ...this.state,
              isDragging: false
            })
            this.onDragPositionChanged()
          }}
        />
        {this.renderVisualRepresentation()}
      </Group>
    )
  }

  private renderVisualRepresentation() {
    let normal = this.props.lineNormal
    if (normal) {
      normal = MathUtil.normalized(normal)
      let width = 6
      return (
        <ControlPolyline
          color={this.props.stroke}
          points={[
            {
              x: this.props.absolutePosition.x + width * normal.x,
              y: this.props.absolutePosition.y + width * normal.y
            },
            {
              x: this.props.absolutePosition.x - width * normal.x,
              y: this.props.absolutePosition.y - width * normal.y
            }
          ]}
        />
      )
    } else {
      return (
        <Circle
          listening={false}
          radius={this.RADIUS}
          strokeWidth={1.5}
          fill={this.props.fill}
          stroke={this.props.stroke}
          x={this.props.absolutePosition.x}
          y={this.props.absolutePosition.y}
        />
      )
    }
  }

  private onDragPositionChanged() {
    this.props.onControlPointDrag(this.state.dragPosition)
  }
}
