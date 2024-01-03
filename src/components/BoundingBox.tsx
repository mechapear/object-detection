import {
  BoundingBox,
  DetectedInfo,
  DetectedObject,
  objectCategoryConfig,
} from '../domain/detectedInfo'
import { roundToTwoDigit } from '../utils/roundToTwoDigit'
import { PREVIEW_IMAGE_SIZE } from './FileUploader.tsx'

export type ImageDimension = {
  width: number
  height: number
}

export type BoundingBoxProps = {
  imageDomRef: HTMLImageElement | null
  detectedInfo: DetectedInfo | null
}
export default function BoundingBox({
  imageDomRef,
  detectedInfo,
}: BoundingBoxProps) {
  const naturalDimension = getNaturalImageDimension(imageDomRef)
  const renderDimension = getRenderImageDimension(imageDomRef)

  return (
    <>
      {detectedInfo?.detected_objects.map((detectedObject: DetectedObject) => {
        const boundingBoxRatio = getBoundingBoxRatio(
          naturalDimension,
          renderDimension,
          detectedObject.bounding_box,
        )
        const boundingBoxStyle = getBoundingBoxStyle(
          boundingBoxRatio,
          renderDimension,
        )
        const color = objectCategoryConfig[detectedObject.parent].color
        console.log('color', color)

        return (
          <>
            <div
              className="absolute rounded border-2"
              style={{ ...boundingBoxStyle, borderColor: color }}
            />
          </>
        )
      })}
    </>
  )
}

function getNaturalImageDimension(
  dom: HTMLImageElement | null,
): ImageDimension {
  if (!dom) return { width: 0, height: 0 }
  return { width: dom.naturalWidth, height: dom.naturalHeight }
}

function getRenderImageDimension(dom: HTMLImageElement | null): ImageDimension {
  if (!dom) return { width: 0, height: 0 }
  return { width: dom.width, height: dom.height }
}

function getBoundingBoxRatio(
  imageDimension: ImageDimension,
  renderDimension: ImageDimension,
  boundingBox: BoundingBox,
): BoundingBox {
  if (!boundingBox) return { bottom: 0, left: 0, right: 0, top: 0 }
  const { width: imageWidth, height: imageHeight } = imageDimension
  const { width: renderWidth, height: renderHeight } = renderDimension
  const { bottom, left, right, top } = boundingBox

  return {
    bottom: calculateRatio(imageHeight, renderHeight, bottom),
    left: calculateRatio(imageWidth, renderWidth, left),
    right: calculateRatio(imageWidth, renderWidth, right),
    top: calculateRatio(imageHeight, renderHeight, top),
  }
}

function getBoundingBoxStyle(
  boundingBoxRation: BoundingBox,
  renderDimension: ImageDimension,
): BoundingBox {
  const { bottom, left, right, top } = boundingBoxRation
  const { width: renderWidth, height: renderHeight } = renderDimension

  const diffHeight = (PREVIEW_IMAGE_SIZE - renderHeight) / 2
  return {
    bottom: roundToTwoDigit(renderHeight + diffHeight - bottom),
    left: left,
    right: renderWidth - right,
    top: roundToTwoDigit(diffHeight + top),
  }
}

function calculateRatio(
  natureSize: number,
  renderSize: number,
  targetSize: number,
): number {
  return roundToTwoDigit((targetSize * renderSize) / natureSize)
}
