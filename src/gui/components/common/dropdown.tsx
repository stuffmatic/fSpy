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

import React, { createRef } from 'react'
import { Palette } from '../../style/palette'

export interface DropdownProps<T> {
  options: DropdownOption<T>[]
  selectedOptionId: string
  disabled?: boolean
  onOptionSelected(value: T): void
}

interface DropdownState {
  menuIsVisible: boolean
}

interface DropdownOption<T> {
  id: string
  value: T
  title: string
  circleColor?: string
  strokeCircle?: boolean
}

const menuHeight = 24

const circleStyle = {
  display: 'inline-block',
  marginRight: '5px'
}

const filledCircleStyle = {
  ...circleStyle,
  width: '10px',
  height: '10px',
  borderRadius: '5px'
}

const strokedCircleStyle = {
  ...circleStyle,
  width: '8px',
  height: '8px',
  borderRadius: '5px'
}

const menuContainerStyle = {
  width: '100%'
}

const menuCellStyle: any = {
  textAlign: 'left',
  backgroundColor: Palette.white,
  width: '100%',
  padding: 0,
  paddingLeft: '5px',
  height: menuHeight + 'px',
  lineHeight: menuHeight + 'px',
  border: 'none',
  outline: 'none'
}

const menuTitleStyle = {
  border: '1px solid ' + Palette.gray
}

// https://blog.logrocket.com/building-a-custom-dropdown-menu-component-for-react-e94f02ced4a1
// https://stackoverflow.com/questions/7855590/preventing-scroll-bars-from-being-hidden-for-macos-trackpad-users-in-webkit-blin
export default class Dropdown<T> extends React.PureComponent<DropdownProps<T>, DropdownState> {

  private topContainerRef: React.RefObject<HTMLDivElement>
  private scrollContainerRef: React.RefObject<HTMLDivElement>

  constructor(props: DropdownProps<T>) {
    super(props)

    this.state = {
      menuIsVisible: false
    }

    this.topContainerRef = createRef()
    this.scrollContainerRef = createRef()
  }

  componentDidMount() {
    document.addEventListener('mousedown', (event) => {
      this.handleClickOutside(event)
    })
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', (event) => {
      this.handleClickOutside(event)
    })
  }

  handleClickOutside(event: any) {
    if (this.topContainerRef.current && event.target) {
      if (!this.topContainerRef.current.contains(event.target)) {
        this.hideMenu()
      }
    }
  }

  render() {
    let selectedOption: DropdownOption<T> | undefined
    for (let option of this.props.options) {
      if (option.id == this.props.selectedOptionId) {
        selectedOption = option
        break
      }
    }
    return (
      <div ref={this.topContainerRef} style={{ ...menuContainerStyle, ...menuTitleStyle }}>
        {selectedOption !== undefined ? this.renderOption(selectedOption, -1, () => { this.toggleMenu() }) : null}
        {this.renderMenu()}
      </div>
    )
  }

  private renderMenu() {
    let scrollContainerStyle: any = {
      border: '1px solid ' + Palette.gray,
      maxHeight: '133px',
      overflowX: 'hidden',
      overflowY: 'scroll',
      position: 'absolute',
      width: '100%',
      left: -1,
      top: 0
    }
    if (!this.state.menuIsVisible) {
      scrollContainerStyle = {
        ...scrollContainerStyle,
        display: 'none'
      }
    }

    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <div ref={this.scrollContainerRef} style={scrollContainerStyle}>
          {this.props.options.map((option: DropdownOption<T>, index: number) => {
            return this.renderOption(option, index, () => { this.onOptionSelected(option.value) })
          })}
        </div>
      </div>
    )
  }

  private renderOption(option: DropdownOption<T>, index: number, clickHandler: () => void) {
    let markerStyle = {
      //
    }
    if (option.circleColor) {
      if (option.strokeCircle) {
        markerStyle = {
          ...markerStyle,
          ...strokedCircleStyle,
          border: '1px solid ' + option.circleColor
        }
      } else {
        markerStyle = {
          ...markerStyle,
          ...filledCircleStyle,
          backgroundColor: option.circleColor
        }
      }
    } else {
      markerStyle = {
        display: 'none'
      }
    }

    let titleStyle: any = {
      display: 'inline-block'
    }

    if (this.props.disabled) {
      titleStyle = {
        ...titleStyle,
        color: Palette.disabledTextColor
      }
    }

    return (
      <button style={ { ...menuCellStyle, display: 'flex', alignItems: 'center' }} key={index} onClick={(_) => clickHandler()}>
        <div style={{ ...circleStyle, ...markerStyle }} />
        <div style={{ ...titleStyle, flexGrow: '100' }}>{option.title}</div>
        <svg style={{ display: 'inline-block', width: 12, height: 5 }}>
          <polyline points={'0,0, 3,3, 6,0'} stroke={ index < 0 ? (this.props.disabled ? Palette.disabledTextColor : Palette.black) : 'none' } fill={ 'none' } />
        </svg>
      </button>
    )
  }

  private onOptionSelected(value: T) {
    this.props.onOptionSelected(value)
    this.hideMenu()
  }

  private hideMenu() {
    this.setState(
      {
        ...this.state,
        menuIsVisible: false
      }
    )

    if (this.scrollContainerRef.current) {
      this.scrollContainerRef.current.scrollTop = 0
    }
  }

  private showMenu() {
    if (this.props.disabled) {
      return
    }

    this.setState(
      {
        ...this.state,
        menuIsVisible: true
      }
    )

    // flash scrollers (for macos with touchpad)
    setTimeout(() => {
      if (this.scrollContainerRef.current) {
        this.scrollContainerRef.current.scrollTop = 1
        this.scrollContainerRef.current.scrollTop = 0
      }
    },
      200)
  }

  private toggleMenu() {
    if (this.state.menuIsVisible) {
      this.hideMenu()
    } else {
      this.showMenu()
    }
  }
}
