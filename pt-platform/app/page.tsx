import Image from "next/image";
import Link from "next/link";

const features = [
  { label: "Strength", copy: "Build a strong foundation." },
  { label: "Discipline", copy: "Consistent habits. Relentless drive." },
  { label: "Focus", copy: "Block out noise. Stay locked in." },
  { label: "Results", copy: "Real work. Real results." },
];

const programs = [
  {
    title: "1:1 Coaching",
    copy: "Personalized training, nutrition, and mindset coaching. Fully custom. Fully dedicated.",
  },
  {
    title: "Training Programs",
    copy: "Structured programs built for all levels. Train with purpose, anywhere.",
  },
  {
    title: "Check-ins & Accountability",
    copy: "Weekly check-ins that keep you honest and moving forward, every week.",
  },
];

export default function Home() {
  return (
    <main>
      {/* NAV */}
      <header className="flex items-center justify-between px-6 md:px-12 py-5 bg-brand-cream">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="T Martin Training" width={44} height={44} className="rounded-full" />
          <span className="font-display font-semibold text-lg tracking-wide">
            T MARTIN <span className="text-brand">TRAINING</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="#about" className="hover:text-brand transition">ABOUT</a>
          <a href="#programs" className="hover:text-brand transition">COACHING</a>
          <Link href="/login" className="hover:text-brand transition">LOG IN</Link>
        </nav>
        <Link
          href="/signup"
          className="bg-brand text-white text-sm font-semibold tracking-wide px-5 py-2.5 hover:bg-brand-dark transition"
        >
          APPLY FOR COACHING
        </Link>
      </header>

      {/* HERO */}
      <section className="relative bg-brand-black text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <h1 className="font-display italic font-semibold uppercase leading-[0.95] text-5xl md:text-7xl">
            Stronger.<br />
            Bolder.<br />
            <span className="text-brand">Built to perform.</span>
          </h1>
          <p className="mt-6 max-w-md text-neutral-300">
            Coaching built on discipline, mindset, and proven training.{" "}
            <span className="text-white font-semibold">Built around you.</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="bg-brand text-white font-semibold px-6 py-3 tracking-wide hover:bg-brand-dark transition"
            >
              APPLY FOR COACHING →
            </Link>
            <a
              href="#programs"
              className="border border-white/40 text-white font-semibold px-6 py-3 tracking-wide hover:border-white transition"
            >
              VIEW PROGRAMS →
            </a>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.label} className="text-center md:text-left">
              <p className="font-display font-semibold uppercase tracking-wide text-brand-black">
                {f.label}
              </p>
              <p className="text-sm text-neutral-500 mt-1">{f.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-6xl mx-auto px-6 md:px-12 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] bg-brand-black rounded-lg flex items-center justify-center">
          <Image src="/logo.png" alt="T Martin Training" width={160} height={160} className="rounded-full opacity-90" />
        </div>
        <div>
          <p className="text-brand font-semibold tracking-widest text-sm mb-2">ABOUT ME</p>
          <h2 className="font-display italic font-semibold uppercase text-3xl md:text-4xl leading-tight mb-4">
            Coach. Mentor. Built different.
          </h2>
          <p className="text-neutral-600 mb-4">
            I know what it's like to struggle with your weight, confidence, and consistency.
            I built my life through discipline, training, and the right mindset — and now I
            help others do the same.
          </p>
          <p className="text-neutral-600">
            This isn't just about workouts or meal plans. It's about becoming the best
            version of yourself and building a standard you never want to lower.
          </p>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <p className="text-brand font-semibold tracking-widest text-sm mb-2 text-center">
            COACHING PROGRAMS
          </p>
          <h2 className="font-display italic font-semibold uppercase text-3xl md:text-4xl text-center mb-12">
            Built around you.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((p) => (
              <div key={p.title} className="border rounded-lg p-6 hover:border-brand transition">
                <h3 className="font-display font-semibold uppercase text-lg mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-neutral-500 mb-4">{p.copy}</p>
                <Link href="/signup" className="text-brand text-sm font-semibold">
                  LEARN MORE →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-brand-black text-white py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="font-display italic font-semibold uppercase text-3xl md:text-4xl leading-tight mb-6">
            You don't rise to the occasion.<br />
            <span className="text-brand">You build for it.</span>
          </h2>
          <Link
            href="/signup"
            className="inline-block bg-brand text-white font-semibold px-6 py-3 tracking-wide hover:bg-brand-dark transition"
          >
            APPLY FOR COACHING →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-cream border-t py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image src="/logo.png" alt="T Martin Training" width={32} height={32} className="rounded-full" />
              <span className="font-display font-semibold">T MARTIN TRAINING</span>
            </div>
            <p className="text-neutral-500">Training. Nutrition. Mindset. Built around you.</p>
          </div>
          <div>
            <p className="font-semibold mb-2">QUICK LINKS</p>
            <ul className="text-neutral-500 space-y-1">
              <li><Link href="/">Home</Link></li>
              <li><a href="#about">About</a></li>
              <li><a href="#programs">Coaching</a></li>
              <li><Link href="/login">Log In</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">READY TO TRANSFORM?</p>
            <p className="text-neutral-500 mb-3">Let's build your stronger, better, more confident future.</p>
            <Link href="/signup" className="bg-brand text-white font-semibold px-5 py-2.5 inline-block hover:bg-brand-dark transition">
              APPLY FOR COACHING
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-neutral-400 mt-10">
          © {new Date().getFullYear()} T Martin Training. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
