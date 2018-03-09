class CameraData {
  id:string
  displayName:string
  sensorWidth:number
  sensorHeight:number

  constructor(id:string, displayName:string, sensorWidth:number, sensorHeight:number) {
    this.id = id
    this.displayName = displayName
    this.sensorWidth = sensorWidth
    this.sensorHeight = sensorHeight
  }

  static readonly presets:CameraData[] = [
    new CameraData(
      "blender",
      "Blender default camera",
      32,
      24
    ),
    new CameraData(
      "aps-c",
      "APS-C DSLR",
      22.3,
      14.9
    ),
    new CameraData(
      "canon_1d",
      "Canon 1D",
      27.9,
      18.6
    ),
    new CameraData(
      "canon_1ds",
      "Canon 1DS",
      36,
      24
    ),
    new CameraData(
      "canon_5d",
      "Canon 5D",
      36,
      24
    ),
    new CameraData(
      "canon_7d",
      "Canon 7D",
      22.3,
      14.9
    ),
    new CameraData(
      "canon_60d",
      "Canon 60D",
      22.3,
      14.9
    ),
    new CameraData(
      "canon_500d",
      "Canon 500D",
      22.3,
      14.9
    ),
    new CameraData(
      "canon_550d",
      "Canon 550D",
      22.3,
      14.9
    ),
    new CameraData(
      "canon_600d",
      "Canon 600D",
      22.3,
      14.9
    ),
    new CameraData(
      "canon_1100d",
      "Canon 1100D",
      22.2,
      14.7
    ),
    new CameraData(
      "35_mm_film",
      "35 mm film",
      36,
      24
    ),
    new CameraData(
      "micro_4_3rds",
      "Micro four thirds",
      17.3,
      14
    ),
    new CameraData(
      "nikon_d3s",
      "Nikon D3S",
      36,
      23.9
    ),
    new CameraData(
      "nikon_d90",
      "Nikon D90",
      23.6,
      15.8
    ),
    new CameraData(
      "nikon_d300s",
      "Nikon D300S",
      23.6,
      15.8
    ),
    new CameraData(
      "nikon_d3100",
      "Nikon D3100",
      23.1,
      15.4
    ),
    new CameraData(
      "nikon_d5000",
      "Nikon D5000",
      23.6,
      15.8
    ),
    new CameraData(
      "nikon_d5100",
      "Nikon D5100",
      23.6,
      15.6
    ),
    new CameraData(
      "nikon_d7000",
      "Nikon D7000",
      23.6,
      15.6
    ),
    new CameraData(
      "red_epic",
      "Red Epic",
      30,
      15
    ),
    new CameraData(
      "red_epic_2k",
      "Red Epic 2k",
      11.1,
      6.24
    ),
    new CameraData(
      "red_epic_3k",
      "Red Epic 3k",
      16.65,
      9.36
    ),
    new CameraData(
      "red_epic_4k",
      "Red Epic 4k",
      22.2,
      12.6
    ),
    new CameraData(
      "sony_a55",
      "Sony A55",
      23.4,
      15.6
    ),
    new CameraData(
      "super_16",
      "Super 16 film",
      12.52,
      7.41
    ),
    new CameraData(
      "super_32",
      "Super 35 film",
      24.89,
      18.66
    )
  ]
}