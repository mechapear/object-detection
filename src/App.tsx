import FileUploader from './components/FileUploader.tsx'

export default function App() {
  return (
    <div className="mx-6 my-10 grid place-content-center">
      <h1 className="mb-6 text-center text-2xl font-bold">Object Detector</h1>
      <FileUploader />
    </div>
  )
}
