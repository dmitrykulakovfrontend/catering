export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-wine-700 via-wine-600 to-wine-700">
      {children}
    </div>
  )
}
