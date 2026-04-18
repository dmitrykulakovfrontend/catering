export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-royal-700 via-royal-600 to-royal-700">
      {children}
    </div>
  )
}
