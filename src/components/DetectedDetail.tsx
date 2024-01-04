import { useState } from 'react'
import {
  DetectedInfo,
  DetectedObject,
  ObjectCategory,
} from '../domain/detectedInfo.ts'
import { capitalize } from '../utils/capitalize.ts'
import { roundToTwoDigit } from '../utils/roundToTwoDigit.ts'
import { objectCategoryColor } from './BoundingBox.tsx'
import { objectCategoryIcon } from './icon.tsx'

export type DetectedDetailProps = {
  detectedInfo: DetectedInfo | null
}

export default function DetectedDetail({ detectedInfo }: DetectedDetailProps) {
  const [isShow, setIsShow] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')

  const sortedDetectedObjects = sortDetectedObjectsByConfidence(
    detectedInfo?.detected_objects ?? [],
  )

  // get all uniqe category
  const categories = new Set<ObjectCategory>()
  sortedDetectedObjects.map((detectedObject) => {
    categories.add(detectedObject.parent)
  })

  return (
    <>
      <h2 className="text-center text-xl font-bold text-gray-900">
        Detected Detail
      </h2>
      <div className="my-4 grid grid-cols-3 items-center gap-2 md:grid-cols-4">
        {/*display category button when there are more than 1 category*/}
        {categories.size > 1 &&
          Array.from(categories).map((category) => {
            const Icon = objectCategoryIcon[category]
            return (
              <button
                className="flex w-24 cursor-pointer flex-col items-center rounded-lg border border-gray-100 bg-gray-100 py-2.5 text-sm hover:bg-gray-900 hover:text-white"
                onClick={() => {
                  setIsShow(true)
                  setSelectedCategory(category)
                }}
              >
                {Icon && <Icon />}
                <p className="text-sm">{category}</p>
              </button>
            )
          })}
      </div>

      {isShow &&
        sortedDetectedObjects.map((detectedObject) => {
          const category = detectedObject.parent

          // show only selected category
          if (category !== selectedCategory) return null

          // display only selected category
          const name = detectedObject.name
          const confidenceInPercent = roundToTwoDigit(
            detectedObject.confidence * 100,
          )
          const Icon = objectCategoryIcon[category]
          const color = objectCategoryColor[category]

          return (
            <div
              className="my-4 flex rounded-lg border-2 bg-white"
              style={{
                borderColor: color,
              }}
            >
              <div
                className="flex w-[120px] flex-col items-center p-4"
                style={{
                  backgroundColor: color,
                }}
              >
                {Icon && <Icon />}
                <span className="text-sm text-gray-900">
                  {capitalize(category)}
                </span>
              </div>
              <div className="p-4 pl-5">
                <h5 className="text-base font-bold text-gray-900">
                  {capitalize(name)}
                </h5>
                <p className="text-base text-gray-700">
                  {confidenceInPercent}%
                </p>
              </div>
            </div>
          )
        })}
    </>
  )
}

// sort detected objects by confidence from max to min
function sortDetectedObjectsByConfidence(detectedObjects: DetectedObject[]) {
  return detectedObjects.toSorted((a, b) => {
    if (a.confidence > b.confidence) return -1
    if (a.confidence < b.confidence) return 1
    return 0
  })
}
