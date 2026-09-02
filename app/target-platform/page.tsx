import Link from "next/link";
import {
  ClipboardCheck,
  FileText,
  ArrowRight,
  Home,
  Sparkles,
} from "lucide-react";

export default function TargetPlatformPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">

      {/* Header */}
      <header className="bg-[#0a4279]">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                <Sparkles className="h-3.5 w-3.5" />
                TARGET-ADE
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                TARGET Platform
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Zentrale Materialien und digitale Hilfen zur Vorbereitung,
                Durchführung und Unterstützung der TARGET-ADE Studie.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <Home className="h-4 w-4" />
              Zur Startseite
            </Link>
          </div>
        </div>
      </header>

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Materialien auf einen Blick
          </h2>

          <p className="mt-3 text-base leading-7 text-slate-600">
            Wählen Sie den Bereich aus, den Sie benötigen. Die Plattform
            bündelt Materialien für die Vorbereitung auf die Studie sowie
            Informationsmaterialien für Patient*innen.
          </p>
        </div>

        {/* Main Feature Cards */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* Vorbereitung */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-[5rem] bg-blue-50" />

            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <ClipboardCheck className="h-8 w-8" />
              </div>

              <div className="mt-6">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Bereich 01
                </span>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Vorbereitung
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
                  Materialien zur Vorbereitung auf die TARGET-ADE Studie,
                  einschließlich relevanter Informationen, Arbeitsunterlagen
                  und unterstützender Dokumente für die Durchführung.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                <span className="text-sm font-medium text-slate-500">
                  Studienvorbereitung
                </span>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Materialien anzeigen
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Patientenmaterialien */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-[5rem] bg-emerald-50" />

            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <FileText className="h-8 w-8" />
              </div>

              <div className="mt-6">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Bereich 02
                </span>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Patientenmaterialien
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
                  Informations- und Unterstützungsmaterialien für Patient*innen,
                  die im Rahmen der TARGET-ADE Studie eingesetzt werden können.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                <span className="text-sm font-medium text-slate-500">
                  Informationen für Patient*innen
                </span>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Materialien anzeigen
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hint Section */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm leading-6 text-slate-600">
            Weitere Bereiche und Materialien können schrittweise ergänzt werden.
            Die Plattform ist so aufgebaut, dass neue Dokumente, Links und
            digitale Werkzeuge flexibel integriert werden können.
          </p>
        </div>
      </section>
    </main>
  );
}