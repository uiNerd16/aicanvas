import { RadialToolbar } from '../../components-workspace/radial-toolbar'

export default function PreviewPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-sand-950">
      <div style={{ width: 480, height: 480 }}>
        <RadialToolbar />
      </div>
    </div>
  )
}
