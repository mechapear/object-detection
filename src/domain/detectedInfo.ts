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

export const objectCategoryConfig = {
  human: {
    color: '#3747CE',
  },
  vehicle: {
    color: '#289B6B',
  },
  object: {
    color: '#24AFFD',
  },
  animal: {
    color: '#F3A433',
  },
  accessory: {
    color: '#3747CE',
  },
  sport: {
    color: '#FF556E',
  },
  kitchenware: {
    color: '#7C31AD',
  },
  food: {
    color: '#7C31AD',
  },
  furniture: {
    color: '#FC72A4',
  },
  electronic: {
    color: '#FC72A4',
  },
} satisfies Record<ObjectCategory, { color: string }>
