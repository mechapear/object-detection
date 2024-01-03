export type ObjectCategory =
  | 'human'
  | 'vehicle'
  | 'object'
  | 'animal'
  | 'accessory'
  | 'sport'
  | 'kitchenware'
  | 'food'
  | 'furniture'
  | 'electronic'

export type BoundingBox = {
  bottom: number
  left: number
  right: number
  top: number
}

export type DetectedObject = {
  bounding_box: BoundingBox
  name: string
  confidence: number
  parent: ObjectCategory
}

export type DetectedInfo = {
  service_id: string
  detected_objects: DetectedObject[]
}
