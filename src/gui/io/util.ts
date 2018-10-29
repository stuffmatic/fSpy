import { join } from 'path'

export function loadImage(
  imageBuffer: Buffer,
  onLoad: (width: number, height: number, url: string) => void,
  onError: () => void
) {
  let blob = new Blob([imageBuffer])
  let url = URL.createObjectURL(blob)
  let image = new Image()
  image.src = url
  image.onload = (_: Event) => {
    onLoad(image.width, image.height, url)
  }
  image.onerror = (_) => {
    onError()
  }
}

export function resourceURL(fileName: string): string {
  if (process.resourcesPath != null) {
    if (process.env.DEV) {
      return join(`file://${process.cwd()}`, 'assets/electron', fileName)
    } else {
      return join(process.resourcesPath, fileName)
    }
  }

  return ''
}

export function resourcePath(fileName: string): string {
  if (process.resourcesPath != null) {
    if (process.env.DEV) {
      return join(process.cwd(), 'assets/electron', fileName)
    } else {
      return join(process.resourcesPath, fileName)
    }
  }

  return ''
}
