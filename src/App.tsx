import { ChangeEventHandler, useRef, useState } from 'react'

export type ImageDimension = {
  width: number
  height: number
}

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
  parent: string
}

export type DetectedInfo = {
  service_id: string
  detected_objects: DetectedObject[]
}

export default function App() {
  const [image, setImage] = useState<string | null>(null)
  const [imageDimension, setImageDimension] = useState<ImageDimension | null>(
    null,
  )
  const [detectedInfo, setDetectedInfo] = useState<DetectedInfo | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const imageInput = event.target.files?.[0]
    if (!imageInput) return

    const base64 = await convertFileToBase64String(imageInput)
    if (!base64) return
    setImage(base64)

    const dimension = getImageDimension(imageRef.current)
    if (!dimension) return
    setImageDimension(dimension)

    try {
      const data = await postImage(base64).then((res) => res.json())
      setDetectedInfo(data)
      return data
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div>
        <label>Select image: </label>
        <input type="file" accept="image/*" onChange={handleUploadImage} />
      </div>
      {image && (
        <img
          ref={imageRef}
          src={image}
          alt="preview"
          height="300px"
          width="300px"
        />
      )}
      {detectedInfo && <pre>{JSON.stringify(detectedInfo, null, 2)}</pre>}
      {imageDimension && <pre>{JSON.stringify(imageDimension, null, 2)}</pre>}
    </>
  )
}

async function postImage(imageBase64: string): Promise<Response> {
  return fetch('https://nvision.nipa.cloud/api/v1/object-detection', {
    method: 'POST',
    headers: {
      Authorization:
        'cdb29f355cb4059995e05420dc8d963f657898bf3a5f2f5e7a88c58279f5e4a0a1c4c4cf874594b42e413fc45c425425ac',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw_data: removeBase64Header(imageBase64),
      configurations: [
        {
          parameter: 'OutputCroppedImage',
          value: 'false',
        },
        {
          parameter: 'ConfidenceThreshold',
          value: '0.1',
        },
      ],
    }),
  })
}

function removeBase64Header(str: string): string {
  // get base64 string after 'data:image/jpeg;base64,'
  const startIndex = 'data:image/jpeg;base64,'.length
  return str.substr(startIndex)
}

function convertFileToBase64String(file: File): Promise<string | void> {
  return new Promise<string>((resolve, reject) => {
    // create new FileReader
    const reader = new FileReader()
    // convert the file to base64 text
    reader.readAsDataURL(file)

    reader.onloadend = () => {
      resolve(reader.result as string)
    }

    reader.onerror = (error) => {
      reject(error)
    }
  })
    .then((base64) => {
      console.log('success!\nbase64 string is: ' + base64)
      return base64
    })
    .catch((error) => console.log(error))
}

function getImageDimension(dom: HTMLImageElement | null): ImageDimension {
  if (!dom) return { width: 0, height: 0 }
  return { width: dom.naturalWidth, height: dom.naturalHeight }
}
