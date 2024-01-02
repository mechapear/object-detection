import { ChangeEventHandler, useState } from 'react'

export default function App() {
  const [image, setImage] = useState<string | null>(null)

  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const imageInput = event.target.files?.[0]
    if (!imageInput) return

    const base64 = await getBase64String(imageInput)
    if (!base64) return
    setImage(base64)
  }

  return (
    <>
      <form onSubmit={(event) => event.preventDefault()}>
        <label>Select image: </label>
        <input type="file" accept="image/*" onChange={handleUploadImage} />
        <button type="submit">Submit</button>
      </form>
      {image && <img src={image} alt="preview" height="100px" width="100px" />}
    </>
  )
}

function getBase64String(file: File): Promise<string | void> {
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
