import { Dispatch, SetStateAction, useState } from 'react'
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
  setFocusedObject: Dispatch<SetStateAction<DetectedObject | null>>
  activeCategory: ObjectCategory | null
  setActiveCategory: Dispatch<SetStateAction<ObjectCategory | null>>
}

export default function DetectedDetail({
  detectedInfo,
  setFocusedObject,
  activeCategory,
  setActiveCategory,
}: DetectedDetailProps) {
  const [isShow, setIsShow] = useState(true)

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
      <section className="mb-3 mt-4 grid grid-cols-3 items-center gap-2 md:grid-cols-4">
        {/*display category button when there are more than 1 category*/}
        {categories.size > 1 &&
          Array.from(categories).map((category) => {
            const Icon = objectCategoryIcon[category]
            return (
              <button
                className="mx-auto flex w-20 cursor-pointer flex-col items-center rounded-lg border border-gray-100 bg-gray-100 py-2.5 text-xs hover:bg-gray-600 hover:text-white"
                style={{
                  backgroundColor:
                    activeCategory === category
                      ? objectCategoryColor[category]
                      : undefined,
                }}
                onClick={() => {
                  setIsShow(true)
                  setActiveCategory((prevCategory) => {
                    if (prevCategory === category) return null
                    return category
                  })
                }}
              >
                {Icon && <Icon />}
                <p>{category}</p>
              </button>
            )
          })}
      </section>

      <section className="max-h-60 overflow-y-auto">
        {isShow &&
          sortedDetectedObjects.map((detectedObject) => {
            const category = detectedObject.parent

            // show only active category
            if (activeCategory && category !== activeCategory) return null

            // display only selected category
            const name = detectedObject.name
            const confidenceInPercent = roundToTwoDigit(
              detectedObject.confidence * 100,
            )
            const Icon = objectCategoryIcon[category]
            const color = objectCategoryColor[category]

            return (
              <div
                className="my-2.5 flex rounded-lg border-2 bg-white"
                style={{
                  borderColor: color,
                }}
                onMouseEnter={() => setFocusedObject(detectedObject)}
                onMouseLeave={() => setFocusedObject(null)}
              >
                {/* Icon section */}
                <div
                  className="flex min-w-[100px] flex-col items-center p-4 text-xs"
                  style={{
                    backgroundColor: color,
                  }}
                >
                  {Icon && <Icon />}
                  <span className="text-gray-900">{capitalize(category)}</span>
                </div>
                {/* Detail section */}
                <div className="w-full p-4 pl-5">
                  <div className="mb-2 flex justify-between">
                    <span className="text-base font-bold text-gray-900">
                      {capitalize(name)}
                    </span>
                    <span className="text-sm text-gray-700">
                      {confidenceInPercent}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        backgroundColor: color,
                        width: `${confidenceInPercent}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
      </section>
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
