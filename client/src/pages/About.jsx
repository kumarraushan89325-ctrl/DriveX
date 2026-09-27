export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display text-4xl font-bold">About DriveNow</h1>
      <p className="mt-4 text-lg text-slate-600">
        DriveNow is a modern car rental platform built for travellers who want a reliable car without the
        agency queue. We partner with verified fleets across major Indian cities so you can search, compare
        and book in minutes.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          ['2018', 'Founded'],
          ['40+', 'Cities served'],
          ['12k+', 'Trips completed'],
        ].map(([value, label]) => (
          <div key={label} className="card p-6 text-center">
            <p className="font-display text-3xl font-bold text-accent-600">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
