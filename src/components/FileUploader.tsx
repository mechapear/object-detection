import { ChangeEventHandler, useRef, useState } from 'react'
import { DetectedInfo } from '../domain/detectedInfo.ts'
import BoundingBox from './BoundingBox.tsx'
import DetectedDetail from './DetectedDetail.tsx'

export const PREVIEW_IMAGE_SIZE = 300

export default function FileUploader() {
  const [image, setImage] = useState<string | null>(null)
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
    setDetectedInfo(null)

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
      <div className="rounded-lg border border-gray-200 p-5 shadow-md">
        <label className="mb-2 ml-2 block text-sm font-medium text-gray-900">
          Select image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleUploadImage}
          className="block w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 pr-2.5 text-sm text-gray-900 file:mr-4 file:rounded-l-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-100 focus:outline-none"
        />
      </div>

      {image && (
        <>
          <div className="grid place-content-center">
            <div
              className="relative my-6 flex rounded-lg bg-gray-100 shadow-md"
              style={{
                width: PREVIEW_IMAGE_SIZE,
                height: PREVIEW_IMAGE_SIZE,
              }}
            >
              <BoundingBox
                imageDomRef={imageRef.current}
                detectedInfo={detectedInfo}
              />
              <img
                key={detectedInfo?.service_id}
                ref={imageRef}
                src={image}
                alt="preview"
                className="max-h-full w-full object-contain"
              />
            </div>
          </div>
          <div className="mt-4">
            <DetectedDetail detectedInfo={detectedInfo} />
          </div>
        </>
      )}
      {/*{detectedInfo && <pre>{JSON.stringify(detectedInfo, null, 2)}</pre>}*/}
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
