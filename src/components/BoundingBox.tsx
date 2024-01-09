import {
  BoundingBox,
  DetectedInfo,
  DetectedObject,
  ObjectCategory,
} from '../domain/detectedInfo'
import { roundToTwoDigit } from '../utils/roundToTwoDigit'
import { PREVIEW_IMAGE_SIZE } from './FileUploader.tsx'

export type ImageDimension = {
  width: number
  height: number
}

export const objectCategoryColor = {
  human: '#B275F0',
  vehicle: '#2CCE90',
  object: '#8F8FFF',
  animal: '#FAB62E',
  accessory: '#15E0D6',
  sport: '#FF8E42',
  kitchenware: '#8FD65C',
  food: '#8FD65C',
  furniture: '#FC82AF',
  electronic: '#4EBDFD',
} satisfies Record<ObjectCategory, string>

export type BoundingBoxProps = {
  imageDomRef: HTMLImageElement | null
  detectedInfo: DetectedInfo | null
  focusedObject: DetectedObject | null
  activeCategory: ObjectCategory | null
}
export default function BoundingBox({
  imageDomRef,
  detectedInfo,
  focusedObject,
  activeCategory,
}: BoundingBoxProps) {
  const naturalDimension = getNaturalImageDimension(imageDomRef)
  const renderDimension = getRenderImageDimension(naturalDimension)
  const focusedBoundingBoxStyle = focusedObject
    ? getBoundingBoxStyle(
        getBoundingBoxRatio(
          naturalDimension,
          renderDimension,
          focusedObject.bounding_box,
        ),
        renderDimension,
      )
    : null

  return (
    <>
      {detectedInfo?.detected_objects.map((detectedObject: DetectedObject) => {
        // show only active category
        if (activeCategory && detectedObject.parent !== activeCategory)
          return null

        const boundingBoxRatio = getBoundingBoxRatio(
          naturalDimension,
          renderDimension,
          detectedObject.bounding_box,
        )
        const boundingBoxStyle = getBoundingBoxStyle(
          boundingBoxRatio,
          renderDimension,
        )
        const color = objectCategoryColor[detectedObject.parent]

        return (
          <>
            <div
              className="absolute rounded border-2"
              style={{ ...boundingBoxStyle, borderColor: color }}
            />
          </>
        )
      })}

      {/*add extra bounding box for focused object*/}
      {focusedObject && (
        <div
          className="absolute rounded border-4"
          style={{
            ...focusedBoundingBoxStyle,
            borderColor: objectCategoryColor[focusedObject.parent],
          }}
        />
      )}
    </>
  )
}

function getNaturalImageDimension(
  dom: HTMLImageElement | null,
): ImageDimension {
  if (!dom) return { width: 0, height: 0 }
  return { width: dom.naturalWidth, height: dom.naturalHeight }
}

// cannot get render image dimension from DOM, so we need to calculate it base on natural dimension
function getRenderImageDimension(
  naturalDimension: ImageDimension,
): ImageDimension {
  const { width: naturalWidth, height: naturalHeight } = naturalDimension
  const ratio = naturalWidth / naturalHeight
  let width, height

  if (naturalWidth > naturalHeight) {
    width = PREVIEW_IMAGE_SIZE
    height = roundToTwoDigit(PREVIEW_IMAGE_SIZE / ratio)
    return { width, height }
  }

  width = roundToTwoDigit(PREVIEW_IMAGE_SIZE * ratio)
  height = PREVIEW_IMAGE_SIZE
  return { width, height }
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

// adjust bounding box to fit render image
function getBoundingBoxStyle(
  boundingBoxRation: BoundingBox,
  renderDimension: ImageDimension,
): BoundingBox {
  const { bottom, left, right, top } = boundingBoxRation
  const { width: renderWidth, height: renderHeight } = renderDimension

  const diffHeight = (PREVIEW_IMAGE_SIZE - renderHeight) / 2
  const diffWidth = (PREVIEW_IMAGE_SIZE - renderWidth) / 2

  return {
    bottom: roundToTwoDigit(renderHeight + diffHeight - bottom),
    left: diffWidth + left,
    right: roundToTwoDigit(renderWidth + diffWidth - right),
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
