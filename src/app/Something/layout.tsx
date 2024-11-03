export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section className="container mx-auto max-w-7xl flex md:flex-col">
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav className="row md:flex md:justify-between">
        <h1>My dashboard</h1>
        <ul className="md:flex gap-2">
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/dashboard/settings">Settings</a>
          </li>
          <li>
            <a href="/dashboard/logout">Logout</a>
          </li>
        </ul>
      </nav>

      <div className="m-5">
        {children}
      </div>
    </section>

  )
}