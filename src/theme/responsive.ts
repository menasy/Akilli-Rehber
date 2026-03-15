import { useMemo } from "react"
import { PixelRatio, useWindowDimensions } from "react-native"

const BASE_WIDTH = 375
const BASE_HEIGHT = 812

type Responsive = {
  width: number
  height: number
  scale: (size: number) => number
  verticalScale: (size: number) => number
  moderateScale: (size: number, factor?: number) => number
  fontScale: (size: number) => number
}

export function createResponsive(width: number, height: number): Responsive {
  const widthScale = width / BASE_WIDTH
  const heightScale = height / BASE_HEIGHT

  const scale = (size: number) =>
    PixelRatio.roundToNearestPixel(size * widthScale)

  const verticalScale = (size: number) =>
    PixelRatio.roundToNearestPixel(size * heightScale)

  const moderateScale = (size: number, factor = 0.5) =>
    PixelRatio.roundToNearestPixel(size + (size * widthScale - size) * factor)

  const fontScale = (size: number) =>
    PixelRatio.roundToNearestPixel(size * widthScale)

  return {
    width,
    height,
    scale,
    verticalScale,
    moderateScale,
    fontScale,
  }
}

export function useResponsive(): Responsive {
  const { width, height } = useWindowDimensions()
  return useMemo(() => createResponsive(width, height), [width, height])
}
