import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TARGET-ADE Studie",
  description:
    "TARGET-ADE Studie – Prävention von Hospitalisierungen aufgrund von unerwünschten Arzneimittelereignissen: Gastrointestinale Blutungen.",
};

const logos = {
  left: {
    src: "https://www.uni-bielefeld.de/fakultaeten/medizin/fakultaet/arbeitsgruppen/allgemeinmedizin/forschung/target/Fly_Bild2.png",
    alt: "Allgemein- und Familienmedizin Universität Bielefeld",
    href: "https://www.uni-bielefeld.de/fakultaeten/medizin/fakultaet/arbeitsgruppen/allgemeinmedizin/forschung/target/Fly_Bild2.png",
    width: 720,
    height: 300,
  },
  center: {
    src: "https://www.uni-bielefeld.de/fakultaeten/medizin/fakultaet/arbeitsgruppen/allgemeinmedizin/forschung/target/Bild2.png",
    alt: "TARGET-ADE logo",
    href: "https://www.uni-bielefeld.de/fakultaeten/medizin/fakultaet/arbeitsgruppen/allgemeinmedizin/forschung/target/Bild2.png",
    width: 260,
    height: 260,
  },
  right: {
    src: "https://www.uni-bielefeld.de/fakultaeten/medizin/fakultaet/arbeitsgruppen/allgemeinmedizin/forschung/target/Fly_Bild3.png",
    alt: "Gemeinsamer Bundesausschuss Innovationsausschuss",
    href: "https://www.uni-bielefeld.de/fakultaeten/medizin/fakultaet/arbeitsgruppen/allgemeinmedizin/forschung/target/Fly_Bild3.png",
    width: 520,
    height: 250,
  },
};

type LogoLinkProps = {
  href: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

function LogoLink({
  href,
  src,
  alt,
  width,
  height,
  className,
}: LogoLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={alt}
      className={`transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        className="h-auto w-full object-contain"
      />
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#efefef] text-slate-900">
      <header className="bg-[#0a4279] pb-8 pt-4 sm:pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="rounded-[1.25rem] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.08)] sm:px-6 sm:py-4">
            <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
              <div className="w-[180px] lg:w-[220px]">
                <LogoLink {...logos.left} />
              </div>

              <div className="w-[90px] sm:w-[110px] lg:w-[120px]">
                <LogoLink {...logos.center} />
              </div>

              <div className="w-[150px] sm:w-[180px] lg:w-[200px]">
                <LogoLink {...logos.right} />
              </div>
            </div>

            <div className="mx-auto mt-4 max-w-3xl text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                TARGET-ADE Studie
              </h1>

              <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
                Prävention von Hospitalisierungen aufgrund von unerwünschten
                Arzneimittelereignissen
              </p>

              <p className="mt-1 text-base leading-relaxed text-slate-600 sm:text-lg">
                Gastrointestinale Blutungen
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-10 lg:py-6">
        <div className="rounded-[1.5rem] bg-white px-6 py-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)] sm:px-8 lg:px-10 lg:py-6">
          <div className="max-w-5xl">
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              Die TARGET-ADE Intervention wurde partizipativ mit
              Gesundheitsfachpersonen (Hausärzt*innen, Spezialist*innen,
              Apotheker*innen und MFAs) und Patient*innen entwickelt. Um Sie
              optimal auf die Studie vorzubereiten und Sie beim Absetzen von
              Wirkstoffen, die das Risiko für GI-Blutungen erhöhen
              (Deprescribing), bei der Überwachung ihrer Wirkung sowie bei der
              Bereitstellung von Materialien zur Patient*innenedukation und zum
              Selbstmanagement zu unterstützen, haben wir auf dieser Plattform
              ein digitales Toolkit für Sie zusammengestellt. Über die direkten
              Links gelangen Sie zu den jeweiligen Dokumenten. Wir empfehlen
              Ihnen, sich direkt zu Beginn alles anzuschauen, um das Spektrum
              unserer Unterlagen kennenzulernen.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}