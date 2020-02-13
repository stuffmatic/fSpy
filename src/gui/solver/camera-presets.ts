/**
 * fSpy
 * Copyright (C) 2018 - Per Gantelius
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

export interface CameraPreset {
  displayName: string
  sensorWidth: number
  sensorHeight: number
  focalLength?: number
}

export const cameraPresets: { [id: string]: CameraPreset } = {
  'aps-c': {
    displayName: 'APS-C DSLR',
    sensorWidth: 22.3,
    sensorHeight: 14.9
  },
  'canon_1d': {
    displayName: 'Canon 1D',
    sensorWidth: 27.9,
    sensorHeight: 18.6
  },
  'canon_1ds': {
    displayName: 'Canon 1DS',
    sensorWidth: 36,
    sensorHeight: 24
  },
  'canon_5d': {
    displayName: 'Canon 5D',
    sensorWidth: 36,
    sensorHeight: 24
  },
  'canon_7d': {
    displayName: 'Canon 7D',
    sensorWidth: 22.3,
    sensorHeight: 14.9
  },
  'canon_60d': {
    displayName: 'Canon 60D',
    sensorWidth: 22.3,
    sensorHeight: 14.9
  },
  'canon_500d': {
    displayName: 'Canon 500D',
    sensorWidth: 22.3,
    sensorHeight: 14.9
  },
  'canon_550d': {
    displayName: 'Canon 550D',
    sensorWidth: 22.3,
    sensorHeight: 14.9
  },
  'canon_600d': {
    displayName: 'Canon 600D',
    sensorWidth: 22.3,
    sensorHeight: 14.9
  },
  'canon_1100d': {
    displayName: 'Canon 1100D',
    sensorWidth: 22.2,
    sensorHeight: 14.7
  },
  'canon_g7x_mk2': {
    displayName: 'Canon G7X Mark II',
    sensorWidth: 13.2,
    sensorHeight: 8.8
  },
  'canon_eos_rebel_t6': {
    displayName: 'Canon EOS Rebel T6',
    sensorWidth: 22.3,
    sensorHeight: 14.9
  },
  '35_mm_film': {
    displayName: '35 mm film',
    sensorWidth: 36,
    sensorHeight: 24
  },
  'micro_4_3rds': {
    displayName: 'Micro four thirds',
    sensorWidth: 17.3,
    sensorHeight: 14
  },
  'nikon_d3s': {
    displayName: 'Nikon D3S',
    sensorWidth: 36,
    sensorHeight: 23.9
  },
  'nikon_d90': {
    displayName: 'Nikon D90',
    sensorWidth: 23.6,
    sensorHeight: 15.8
  },
  'nikon_d300s': {
    displayName: 'Nikon D300S',
    sensorWidth: 23.6,
    sensorHeight: 15.8
  },
  'nikon_d850': {
    displayName: 'Nikon D850',
    sensorWidth: 35.9,
    sensorHeight: 23.9
  },
  'nikon_d3100': {
    displayName: 'Nikon D3100',
    sensorWidth: 23.1,
    sensorHeight: 15.4
  },
  'nikon_d5000': {
    displayName: 'Nikon D5000',
    sensorWidth: 23.6,
    sensorHeight: 15.8
  },
  'nikon_d5100': {
    displayName: 'Nikon D5100',
    sensorWidth: 23.6,
    sensorHeight: 15.6
  },
  'nikon_d7000': {
    displayName: 'Nikon D7000',
    sensorWidth: 23.6,
    sensorHeight: 15.6
  },
  'red_epic': {
    displayName: 'Red Epic',
    sensorWidth: 30,
    sensorHeight: 15
  },
  'red_epic_2k': {
    displayName: 'Red Epic 2k',
    sensorWidth: 11.1,
    sensorHeight: 6.24
  },
  'red_epic_3k': {
    displayName: 'Red Epic 3k',
    sensorWidth: 16.65,
    sensorHeight: 9.36
  },
  'red_epic_4k': {
    displayName: 'Red Epic 4k',
    sensorWidth: 22.2,
    sensorHeight: 12.6
  },
  'sony_a55': {
    displayName: 'Sony A55',
    sensorWidth: 23.4,
    sensorHeight: 15.6
  },
  'iphone_6s': {
    displayName: 'iPhone 6S',
    sensorWidth: 4.8,
    sensorHeight: 3.6,
    focalLength: 4.15
  },
  'iphone_7s': {
    displayName: 'iPhone 7',
    sensorWidth: 4.8,
    sensorHeight: 3.6,
    focalLength: 4.15
  },
  'iphone_8': {
    displayName: 'iPhone 8',
    sensorWidth: 5.76,
    sensorHeight: 3.6,
    focalLength: 3.99
  },
  'iphone_xs': {
    displayName: 'iPhone XS',
    sensorWidth: 5.76,
    sensorHeight: 3.6,
    focalLength: 4.25
  },
  'google_pixel': {
    displayName: 'Google Pixel/Pixel XL',
    sensorWidth: 7.66,
    sensorHeight: 6.17,
    focalLength: 3.88
  },
  'galaxy_s10': {
    displayName: 'Samsung Galaxy S10',
    sensorWidth: 4.919,
    sensorHeight: 3.689
  },
  'sony_a7ii': {
    displayName: 'Sony A7II',
    sensorWidth: 35.8,
    sensorHeight: 23.9
  },
  'sony_a7iii': {
    displayName: 'Sony A7 III',
    sensorWidth: 35.6,
    sensorHeight: 23.8
  },
  'alpha_7r_iv': {
    displayName: 'Sony A7R IV',
    sensorWidth: 35.7,
    sensorHeight: 23.8
  },
  'fujifilm_x_t30': {
    displayName: 'Fujifilm X-T30',
    sensorWidth: 23.5,
    sensorHeight: 15.6
  },
  'fujifilm_gfx_50r': {
    displayName: 'Fujifilm GFX 50R',
    sensorWidth: 43.8,
    sensorHeight: 32.9
  },
  'nikonz6': {
    displayName: 'Nikon Z 6',
    sensorWidth: 35.9,
    sensorHeight: 23.9
  },
  'canon_eos_rebel_sl3': {
    displayName: 'Canon EOS Rebel S13',
    sensorWidth: 22.3,
    sensorHeight: 14.9
  },
  'canon_eos_6d_ii': {
    displayName: 'Canon EOS 6D II',
    sensorWidth: 35.9,
    sensorHeight: 24.0
  },
  'panasonic_lumix_zs20': {
    displayName: 'Panasonic Lumix ZS20',
    sensorWidth: 13.2,
    sensorHeight: 8.8
  },
  'panasonic_lumix_g95': {
    displayName: 'Panasonic Lumix G95',
    sensorWidth: 17.3,
    sensorHeight: 13
  },
  'panasonic_tz200': {
    displayName: 'Panasonic TZ200',
    sensorWidth: 13.2,
    sensorHeight: 8.8
  },
  'olympus_tough_tg5': {
    displayName: 'Olympus Tough TG-5',
    sensorWidth: 6.17,
    sensorHeight: 4.55
  },
  'olympus_OM_D_e_m10_iii': {
    displayName: 'Olympus OM-D E-M10 III',
    sensorWidth: 17.3,
    sensorHeight: 13
  }
}
