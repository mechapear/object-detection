import { useState } from 'react'
import { DetectedInfo, ObjectCategory } from '../domain/detectedInfo.ts'
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

  // get all uniqe category
  const categories = new Set<ObjectCategory>()
  detectedInfo?.detected_objects.map((detectedObject) => {
    categories.add(detectedObject.parent)
  })

  return (
    <>
      <div className="grid grid-flow-col items-center justify-evenly">
        {Array.from(categories).map((category) => {
          const Icon = objectCategoryIcon[category]
          return (
            <button
              className="flex w-fit cursor-pointer flex-col items-center rounded-lg border border-gray-100 bg-gray-100 p-2.5 hover:bg-gray-900 hover:text-white"
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
        detectedInfo?.detected_objects.map((detectedObject) => {
          const category = detectedObject.parent

          // if category is not selected, return null
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
              className="my-2 flex rounded-lg border-2 bg-white"
              style={{
                borderColor: color,
              }}
            >
              <div
                className="flex w-[120px] flex-col items-center border-r-2 p-4"
                style={{
                  backgroundColor: color,
                  borderColor: color,
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
