"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  Pill,
  RefreshCw,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";

type YesNo = boolean | null;

type MedicationKey =
  | "antiplatelets"
  | "anticoagulants"
  | "ssri"
  | "corticosteroids"
  | "bisphosphonate";

type RiskFactorKey =
  | "previousGIBleedingOrComplicatedUlcer"
  | "activePepticUlcer"
  | "ageOver60to65"
  | "historyOfUncomplicatedPUD"
  | "concomitantLowDoseASA"
  | "concomitantOtherAntiplatelet"
  | "concomitantAnticoagulant"
  | "concomitantGlucocorticoid"
  | "concomitantSSRI"
  | "highDoseNSAIDTherapy"
  | "severeComorbidDiseases";

type GuidanceBox = {
  title: string;
  text: string;
};

export default function TargetAppPage() {
  const [takesNSAIDs, setTakesNSAIDs] = useState<YesNo>(null);
  const [showAlternativesModal, setShowAlternativesModal] = useState(false);
const [showBewegungRezept, setShowBewegungRezept] = useState(false);
const [showNsaidRiskScript, setShowNsaidRiskScript] = useState(false);
  const [riskFactors, setRiskFactors] = useState<Record<RiskFactorKey, boolean>>(
    {
      previousGIBleedingOrComplicatedUlcer: false,
      activePepticUlcer: false,
      ageOver60to65: false,
      historyOfUncomplicatedPUD: false,
      concomitantLowDoseASA: false,
      concomitantOtherAntiplatelet: false,
      concomitantAnticoagulant: false,
      concomitantGlucocorticoid: false,
      concomitantSSRI: false,
      highDoseNSAIDTherapy: false,
      severeComorbidDiseases: false,
    }
  );

  const [medications, setMedications] = useState<Record<MedicationKey, YesNo>>({
    antiplatelets: null,
    anticoagulants: null,
    ssri: null,
    corticosteroids: null,
    bisphosphonate: null,
  });

  function resetAssessment() {
    setTakesNSAIDs(null);
    setShowAlternativesModal(false);
    setShowBewegungRezept(false);
    setShowNsaidRiskScript(false);
    setRiskFactors({
      previousGIBleedingOrComplicatedUlcer: false,
      activePepticUlcer: false,
      ageOver60to65: false,
      historyOfUncomplicatedPUD: false,
      concomitantLowDoseASA: false,
      concomitantOtherAntiplatelet: false,
      concomitantAnticoagulant: false,
      concomitantGlucocorticoid: false,
      concomitantSSRI: false,
      highDoseNSAIDTherapy: false,
      severeComorbidDiseases: false,
    });
    setMedications({
      antiplatelets: null,
      anticoagulants: null,
      ssri: null,
      corticosteroids: null,
      bisphosphonate: null,
    });
  }

  function toggleRiskFactor(field: RiskFactorKey) {
    setRiskFactors((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  function setMedication(field: MedicationKey, value: YesNo) {
    setMedications((prev) => ({ ...prev, [field]: value }));
  }

 const nsaidRiskResult = useMemo(() => {
  if (takesNSAIDs !== true) return null;

  const hasHighRiskFactor =
    riskFactors.previousGIBleedingOrComplicatedUlcer ||
    riskFactors.activePepticUlcer;

  const moderateRiskCount = [
    riskFactors.ageOver60to65,
    riskFactors.historyOfUncomplicatedPUD,
    riskFactors.concomitantLowDoseASA,
    riskFactors.concomitantOtherAntiplatelet,
    riskFactors.concomitantAnticoagulant,
    riskFactors.concomitantGlucocorticoid,
    riskFactors.concomitantSSRI,
    riskFactors.highDoseNSAIDTherapy,
    riskFactors.severeComorbidDiseases,
  ].filter(Boolean).length;

  const isHighRisk =
    hasHighRiskFactor || moderateRiskCount >= 3;

  if (isHighRisk) {
    return {
      level:
        moderateRiskCount >= 3 && !hasHighRiskFactor
          ? "High risk for GI bleeding: 3 or more moderate risk factors selected"
          : "High risk for GI bleeding",
      shortLevel: "High risk",
      emoji: "🔴",
      icon: ShieldAlert,
      panelClass:
        "border-rose-200 bg-gradient-to-br from-rose-50 to-white text-rose-900",
      badgeClass: "border-rose-200 bg-rose-100 text-rose-800",
      specificRecommendationsTooltip: `Avoid NSAIDs if possible, try to use alternatives.
If NSAID therapy is unavoidable, use a COX-2 inhibitor + PPI (or misoprostol).`,
    };
  }

  if (moderateRiskCount >= 1) {
    return {
      level: "Moderate risk for GI bleeding",
      shortLevel: "Moderate risk",
      emoji: "🟡",
      icon: AlertTriangle,
      panelClass:
        "border-amber-200 bg-gradient-to-br from-amber-50 to-white text-amber-900",
      badgeClass: "border-amber-200 bg-amber-100 text-amber-800",
      specificRecommendationsTooltip: `Avoid chronic use of NSAIDs unless other alternatives are not effective and the patient can take gastroprotective agent.
If no alternatives, prescribe Cox 2 inhibitor, or non-Cox2 selective NSAID + PPI (or misoprostol).
Avoid non-Cox 2 selective NSAIDs and Aspirin > 325mg/day in patients > 75 y.
Avoid (short-term scheduled) concomitant use of non-Cox 2 selective NSAIDs and Aspirin > 325mg/day with other NSAIDs, antiplatelets, anticoagulants (vitamin K antagonist, direct thrombin inhibitor or factor Xa inhibitors), or corticosteroids, or SSRIs (limited evidence also for SNRI), unless alternatives are not effective and the patient can take gastroprotective agent.
Avoid prescribing NSAIDs Indomethacin and Ketorolac, especially in patients of older age; avoid NSAIDs Phenylbutazon and Nabumeton (Priscus).
In patients at risk of CVD, if NSAID is necessary, Naproxen is recommended.`,
    };
  }

  return {
    level: "Low risk for GI bleeding",
    shortLevel: "Low risk",
    emoji: "🟢",
    icon: CheckCircle2,
    panelClass:
      "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white text-emerald-900",
    badgeClass: "border-emerald-200 bg-emerald-100 text-emerald-800",
    specificRecommendationsTooltip: `If NSAIDs are required, use the lowest effective NSAID dose without routine gastroprotection.
Wenn nur der Risikofaktor Alter > 60 Jahren und sonst kein Risikofaktor vorliegt, ist eine Prophylaxe nicht erforderlich. (DGVS S2k-Leitlinie 2023)`,
  };
}, [takesNSAIDs, riskFactors]);

  const medicationBoxes = useMemo(() => {
    const boxes: GuidanceBox[] = [];

    if (medications.antiplatelets === true) {
      boxes.push({
        title: "Antiplatelets",
        text: `Antiplatelets (ASA, including low dose, and P2Y12 inhibitors, e.g. clopidogrel) is an independent factor for GI bleed; recommended to check indications.

Patients with a history of Gastric Antral Vascular Ectasia (GAVE) receiving either antiplatelets or anticoagulants are at increased risk for GI bleed (STOP criteria); monitoring for the signs of gastric toxicity is recommended.`,
      });
    }

    if (medications.anticoagulants === true) {
      boxes.push({
        title: "Anticoagulants",
        text: `Anticoagulants is an independent risk factor for GI bleed; recommended to check indications.

Anticoagulant Direct Factor Xa Inhibitor (DOAC) Rivaroxaban, often prescribed long term for NVAFib and VTE: high risk in older age even without concurrent NSAIDs; monitoring for the signs of gastric toxicity is recommended.

Anticoagulant Direct Factor IIa inhibitor / Direct thrombin inhibitor / DOAC Dabigatran, prescribed long term for NVAFib and VTE, is higher risk compared with warfarin and apixaban; consider replacing with lower-risk alternatives, and/or monitoring for the signs of gastric toxicity is recommended.

Link to the Heidelberg tool.`,
      });
    }

    if (medications.ssri === true) {
      boxes.push({
        title: "SSRI or SNRI Venlafaxine",
        text: `SSRI is an independent risk factor as stated by DGVS S2k-Leitlinie 2023; recommended to check indications.

If no current indications, recommended consider deprescribing.

Link to tapering tool.`,
      });
    }

    if (medications.corticosteroids === true) {
      boxes.push({
        title: "Corticosteroids",
        text: `Corticosteroids is not a risk factor for GI bleed on its own, only in combination with other GI-toxic meds, e.g. NSAIDs; recommended to do medication analysis and check indications for corticosteroids and NSAIDs.`,
      });
    }

    if (medications.bisphosphonate === true) {
      boxes.push({
        title: "Bisphosphonate",
        text: `Avoid oral bisphosphonates in patients with a current or recent history of upper gastrointestinal disease i.e. dysphagia, oesophagitis, gastritis, duodenitis, or peptic ulcer disease, or upper gastrointestinal bleeding (risk of relapse/exacerbation of oesophagitis, oesophageal ulcer, oesophageal stricture) – consider "holidays" when appropriate.`,
      });
    }

    return boxes;
  }, [medications]);

  const selectedCountAmongFour = useMemo(() => {
    return [
      medications.anticoagulants === true,
      medications.antiplatelets === true,
      medications.corticosteroids === true,
      medications.ssri === true,
    ].filter(Boolean).length;
  }, [medications]);

  const showMultiMedicationWarning = selectedCountAmongFour > 1;

  const allFourCoreMedsNo = useMemo(() => {
    return (
      takesNSAIDs === false &&
      medications.anticoagulants === false &&
      medications.antiplatelets === false &&
      medications.corticosteroids === false &&
      medications.ssri === false
    );
  }, [medications, takesNSAIDs]);

  const statusCard = useMemo(() => {
    if (takesNSAIDs === true && nsaidRiskResult) {
      return {
        emoji: nsaidRiskResult.emoji,
        title: nsaidRiskResult.shortLevel,
        subtitle: nsaidRiskResult.level,
        className: nsaidRiskResult.panelClass,
        icon: nsaidRiskResult.icon,
      };
    }

    if (takesNSAIDs === false && allFourCoreMedsNo) {
      return {
        emoji: "🟢",
        title: "Low risk",
        subtitle: "No core GI-risk medications selected",
        className:
          "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white text-emerald-900",
        icon: CheckCircle2,
      };
    }

  

    return {
      emoji: "🩺",
      title: "Assessment in progress",
      subtitle: "Answer the questions to see guidance",
      className:
        "border-slate-200 bg-gradient-to-br from-slate-50 to-white text-slate-800",
      icon: Stethoscope,
    };
  }, [takesNSAIDs, nsaidRiskResult, allFourCoreMedsNo, medicationBoxes.length]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <header className="mb-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <Stethoscope className="h-7 w-7" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  TARGET App
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  GI bleeding risk and medication review dashboard
                </p>

                
              </div>
            </div>

            <button
              type="button"
              onClick={resetAssessment}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Reset assessment
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_380px]">
          <section className="space-y-6">
            <Panel>
              <SectionHeader
                icon={<Pill className="h-5 w-5" />}
                eyebrow="Step 1"
                title="Does your patient take NSAIDs?"
                description="Select the pathway to continue the assessment."
              />

              <div className="mt-5">
                <SegmentedChoice value={takesNSAIDs} onChange={setTakesNSAIDs} />
              </div>
            </Panel>

            {takesNSAIDs === true && (
              <Panel>
                <SectionHeader
                  icon={<ShieldAlert className="h-5 w-5" />}
                  eyebrow="NSAID pathway"
                  title="Risk factors for GI bleeding"
                  description="Select all applicable factors."
                />

                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                  <div className="space-y-3">
                    {/* <CategoryPill tone="rose">High-risk factors</CategoryPill>*/}

                    <RiskItem
                      label="Previous GI bleeding or complicated peptic ulcer (e.g., perforation)"
                      checked={riskFactors.previousGIBleedingOrComplicatedUlcer}
                      onChange={() =>
                        toggleRiskFactor("previousGIBleedingOrComplicatedUlcer")
                      }
                    />

                    <RiskItem
                      label="Active peptic ulcer"
                      checked={riskFactors.activePepticUlcer}
                      onChange={() => toggleRiskFactor("activePepticUlcer")}
                    />
                  </div>

                  <div className="space-y-3">
                    {/* <CategoryPill tone="amber">Moderate-risk factors</CategoryPill> */}

                    <RiskItem
                      label="Age >60–65 y"
                      checked={riskFactors.ageOver60to65}
                      onChange={() => toggleRiskFactor("ageOver60to65")}
                    />
                    <RiskItem
                      label="History of uncomplicated peptic ulcer (PUD)"
                      checked={riskFactors.historyOfUncomplicatedPUD}
                      onChange={() => toggleRiskFactor("historyOfUncomplicatedPUD")}
                    />
                    <RiskItem
                      label="Concomitant low-dose ASA (Acetylsalicylic acid)"
                      checked={riskFactors.concomitantLowDoseASA}
                      onChange={() => toggleRiskFactor("concomitantLowDoseASA")}
                    />
                    <RiskItem
                      label="Concomitant other antiplatelet therapy (e.g., Clopidogrel)"
                      checked={riskFactors.concomitantOtherAntiplatelet}
                      onChange={() =>
                        toggleRiskFactor("concomitantOtherAntiplatelet")
                      }
                    />
                    <RiskItem
                      label="Concomitant anticoagulant therapy (e.g., Rivaroxaban)"
                      checked={riskFactors.concomitantAnticoagulant}
                      onChange={() => toggleRiskFactor("concomitantAnticoagulant")}
                    />
                    <RiskItem
                      label="Concomitant glucocorticoid therapy (e.g., Prednisone)"
                      checked={riskFactors.concomitantGlucocorticoid}
                      onChange={() =>
                        toggleRiskFactor("concomitantGlucocorticoid")
                      }
                    />

                    <RiskItem
                      label="Concomitant SSRI therapy"
                      checked={riskFactors.concomitantSSRI}
                      onChange={() => 
                        toggleRiskFactor("concomitantSSRI")}
                    />
                    <RiskItem
                      label="High-dose NSAID therapy"
                      checked={riskFactors.highDoseNSAIDTherapy}
                      onChange={() => toggleRiskFactor("highDoseNSAIDTherapy")}
                    />
                    <RiskItem
                      label="Severe comorbid diseases?"
                      checked={riskFactors.severeComorbidDiseases}
                      onChange={() => toggleRiskFactor("severeComorbidDiseases")}
                    />
                  </div>
                </div>
              </Panel>
            )}

            {takesNSAIDs === false && (
              <Panel>
                <SectionHeader
                  icon={<Activity className="h-5 w-5" />}
                  eyebrow="Non-NSAID pathway"
                  title="Does your patient take at least one of the following medications?"
                  description="Choose Yes or No for each medication group."
                />

                <div className="mt-6 space-y-4">
                  <MedicationRow
                    label="Antiplatelets (Aspirin (ASS)), P2Y12 inhibitors (clopidogrel)"
                    value={medications.antiplatelets}
                    onChange={(value) => setMedication("antiplatelets", value)}
                  />

                  <MedicationRow
                    label="Anticoagulants (DOAC, Vit K antagonists, Factors Xa inhibitors, Heparins)"
                    value={medications.anticoagulants}
                    onChange={(value) => setMedication("anticoagulants", value)}
                  />

                  <MedicationRow
                    label="SSRI or SNRI Venlafaxine"
                    value={medications.ssri}
                    onChange={(value) => setMedication("ssri", value)}
                  />

                  <MedicationRow
                    label="Corticosteroids"
                    value={medications.corticosteroids}
                    onChange={(value) =>
                      setMedication("corticosteroids", value)
                    }
                  />

                  <MedicationRow
                    label="Bisphosphonate"
                    value={medications.bisphosphonate}
                    onChange={(value) => setMedication("bisphosphonate", value)}
                  />
                </div>

                {showMultiMedicationWarning && (
                  <div className="mt-6">
                    <InfoCard
                      title="Combined medication warning"
                      icon={<AlertTriangle className="h-4 w-4" />}
                      tone="amber"
                    >
                      More than one of abovementioned medications: Avoid
                      concomitant use of corticosteroids and antiplatelets, or
                      antiplatelets and anticoagulants, in patients with the
                      history of peptic ulcer, even uncomplicated. If unavoidable,
                      add gastroprotection. Link to algorithm.
                    </InfoCard>
                  </div>
                )}

                {allFourCoreMedsNo && (
                  <div className="mt-6 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 text-emerald-900">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                        <CheckCircle2 className="h-7 w-7 text-emerald-700" />
                      </div>
                      <div>
                        <div className="text-lg font-bold">Low risk</div>
                        <div className="text-sm text-emerald-800">
                          No core GI-risk medications selected.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Panel>
            )}
          </section>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="space-y-4">
              <div className={`rounded-3xl border p-5 shadow-sm ${statusCard.className}`}>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70">
                    <statusCard.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{statusCard.title}</div>
                    <div className="mt-1 text-sm opacity-90">{statusCard.subtitle}</div>
                  </div>
                </div>
              </div>

              <Panel className="bg-white">
                <div className="flex items-center gap-2">
                  <CircleHelp className="h-4 w-4 text-slate-500" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Guidance
                  </h2>
                </div>

                <div className="mt-4 space-y-3">
                  {takesNSAIDs === true && nsaidRiskResult && (
                    <>
                      <QuickAction>
                        <TooltipLabel
                          label="General recommendations"
                          tooltipText={nsaidRiskResult.specificRecommendationsTooltip}
                        />
                      </QuickAction>
                   
                      <QuickAction>
                        <button
                          type="button"
                          onClick={() => setShowAlternativesModal(true)}
                          className="font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-900"
                        >
                          Alternative ways to manage pain
                        </button>
                      </QuickAction>
                      <QuickAction>
  <button
    type="button"
    onClick={() => setShowBewegungRezept(true)}
    className="font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-900"
  >
    Bewegungs recept
  </button>
</QuickAction>

   {nsaidRiskResult.shortLevel !== "Low risk" && (
  <QuickAction>
    <button
      type="button"
      onClick={() => setShowNsaidRiskScript(true)}
      className="font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-900"
    >
      Gespräch über NSAR-Risiko
    </button>
  </QuickAction>
)}
                    </>
                  )}

                  {takesNSAIDs === false &&
                    medicationBoxes.length === 0 &&
                    !allFourCoreMedsNo && (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                        Medication guidance will appear here.
                      </div>
                    )}
                </div>
              </Panel>

              {takesNSAIDs === true && nsaidRiskResult && (
                <Panel className="bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Current risk
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${nsaidRiskResult.badgeClass}`}
                    >
                      {nsaidRiskResult.shortLevel}
                    </span>
                  </div>

                  <div className="mt-4 text-sm text-slate-600">
                    The current result is based on the selected NSAID-related risk factors.
                  </div>
                </Panel>
              )}

              {takesNSAIDs === false &&
                medicationBoxes.map((box) => (
                  <InfoCard
                    key={box.title}
                    title={box.title}
                    icon={<Pill className="h-4 w-4" />}
                  >
                    <div className="whitespace-pre-line">{box.text}</div>
                  </InfoCard>
                ))}
            </div>
          </aside>
        </div>
      </div>

      {showAlternativesModal && (
  <PainScaleModal
    onClose={() => setShowAlternativesModal(false)}
    onOpenBewegungRezept={() => setShowBewegungRezept(true)}
  />
)}

{showBewegungRezept && (
  <BewegungRezeptModal onClose={() => setShowBewegungRezept(false)} />
)}

{showNsaidRiskScript && nsaidRiskResult && (
  <NsaidRiskScriptModal
    riskLevel={nsaidRiskResult.shortLevel}
    onClose={() => setShowNsaidRiskScript(false)}
  />
)}
    </main>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        <span className="text-sky-600">{icon}</span>
        <span>{eyebrow}</span>
      </div>
      <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
    </div>
  );
}

function CategoryPill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "rose" | "amber";
}) {
  const toneClass =
    tone === "rose"
      ? "bg-rose-100 text-rose-700"
      : "bg-amber-100 text-amber-700";

  return (
    <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${toneClass}`}>
      {children}
    </div>
  );
}

function SegmentedChoice({
  value,
  onChange,
}: {
  value: YesNo;
  onChange: (value: YesNo) => void;
}) {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1.5">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
          value === true
            ? "bg-sky-600 text-white shadow-sm"
            : "text-slate-700 hover:bg-white"
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
          value === false
            ? "bg-sky-600 text-white shadow-sm"
            : "text-slate-700 hover:bg-white"
        }`}
      >
        No
      </button>
    </div>
  );
}

function RiskItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border-slate-300"
      />
      <span className="text-sm text-slate-800">{label}</span>
    </label>
  );
}

function MedicationRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
}) {
  const isYes = value === true;

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between ${
        isYes
          ? "border-rose-200 bg-rose-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div
        className={`pr-4 text-sm font-medium ${
          isYes ? "text-rose-900" : "text-slate-800"
        }`}
      >
        {label}
      </div>

      <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            value === true
              ? "bg-rose-600 text-white shadow-sm"
              : "text-slate-700 hover:bg-slate-50"
          }`}
        >
          Yes
        </button>

        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            value === false
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-700 hover:bg-slate-50"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

function QuickAction({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      {children}
    </div>
  );
}

function InfoCard({
  title,
  children,
  icon,
  tone = "slate",
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "slate" | "amber";
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
      : "border-slate-200 bg-white";

  return (
    <div className={`rounded-3xl border p-4 shadow-sm ${toneClass}`}>
      <div className="mb-2 flex items-center gap-2">
        {icon && <span className="text-slate-500">{icon}</span>}
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="text-sm leading-6 text-slate-700">{children}</div>
    </div>
  );
}

function TooltipLabel({
  label,
  tooltipText,
}: {
  label: string;
  tooltipText: string;
}) {
  return (
    <div className="group relative inline-block">
      <span className="cursor-help font-semibold text-slate-900 underline decoration-dotted">
        {label}
      </span>

      <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-[28rem] max-w-[90vw] rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-6 text-slate-700 shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <div className="whitespace-pre-line">{tooltipText}</div>
      </div>
    </div>
  );
}

function ImageModal({
  title,
  imageSrc,
  imageAlt,
  onClose,
}: {
  title: string;
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
}) {
  return (
    <div
  className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
  onClick={onClose}
>
  <div
    className="relative w-full max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl"
    onClick={(e) => e.stopPropagation()}
  >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="overflow-auto rounded-3xl border border-slate-200 bg-slate-50 p-2">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1600}
            height={900}
            className="h-auto w-full rounded-2xl object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

function PainScaleModal({
  onClose,
  onOpenBewegungRezept,
}: {
  onClose: () => void;
  onOpenBewegungRezept: () => void;
}) {
  const [pain, setPain] = useState(0);
  const [showSDMScript, setShowSDMScript] = useState(false);
  const [showNonPharmaOptions, setShowNonPharmaOptions] = useState(false);

  const painData = [
    { value: 0, emoji: "😊", title: "No pain", description: "No hurt or discomfort.", bg: "bg-emerald-100", text: "text-emerald-800" },
    { value: 1, emoji: "🙂", title: "Very mild pain", description: "Hurts a little bit but is easily tolerated.", bg: "bg-green-100", text: "text-green-800" },
    { value: 2, emoji: "🙂", title: "Mild pain", description: "Discomforting pain. Noticeable but manageable.", bg: "bg-yellow-100", text: "text-yellow-800" },
    { value: 3, emoji: "😐", title: "Tolerable pain", description: "Hurts more. Pain is present but still tolerable.", bg: "bg-yellow-200", text: "text-yellow-900" },
    { value: 4, emoji: "😐", title: "Moderate pain", description: "Distressing pain. It starts to interfere with comfort.", bg: "bg-amber-100", text: "text-amber-800" },
    { value: 5, emoji: "😕", title: "Very distressing pain", description: "Moderate pain that is harder to ignore.", bg: "bg-amber-200", text: "text-amber-900" },
    { value: 6, emoji: "☹️", title: "Intense pain", description: "Hurts even more. Pain interferes with normal activity.", bg: "bg-orange-100", text: "text-orange-800" },
    { value: 7, emoji: "☹️", title: "Very intense pain", description: "Strong pain. Difficult to tolerate.", bg: "bg-orange-200", text: "text-orange-900" },
    { value: 8, emoji: "😣", title: "Utterly horrible pain", description: "Hurts a whole lot. Severe pain.", bg: "bg-red-100", text: "text-red-800" },
    { value: 9, emoji: "😖", title: "Excruciating pain", description: "Almost unbearable pain.", bg: "bg-red-200", text: "text-red-900" },
    { value: 10, emoji: "😭", title: "Worst pain", description: "Unimaginable and unspeakable pain.", bg: "bg-red-300", text: "text-red-950" },
  ];

  const current = painData[pain];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
        <div className="relative w-full max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Alternative ways to manage pain
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <div className={`rounded-3xl border p-6 ${current.bg} ${current.text}`}>
            <div className="flex flex-col items-center text-center">
              <div className="text-7xl">{current.emoji}</div>
              <div className="mt-3 text-4xl font-bold">{pain}</div>
              <div className="mt-2 text-xl font-bold">{current.title}</div>
              <p className="mt-2 max-w-2xl text-sm leading-6">
                {current.description}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={pain}
              onChange={(e) => setPain(Number(e.target.value))}
              className="w-full cursor-pointer"
            />

            <div className="mt-3 grid grid-cols-11 text-center text-xs font-semibold text-slate-600">
              {painData.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPain(item.value)}
                  className={`rounded-lg py-2 ${
                    pain === item.value
                      ? "bg-sky-600 text-white"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {item.value}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2 text-center text-xs font-semibold">
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
              No pain<br />0
            </div>
            <div className="rounded-xl bg-green-100 p-2 text-green-800">
              Mild<br />1–3
            </div>
            <div className="rounded-xl bg-amber-100 p-2 text-amber-800">
              Moderate<br />4–5
            </div>
            <div className="rounded-xl bg-orange-100 p-2 text-orange-800">
              Intense<br />6–7
            </div>
            <div className="rounded-xl bg-red-100 p-2 text-red-800">
              Severe<br />8–10
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-4">
           <button
           type="button"
           onClick={onOpenBewegungRezept}
           className="block font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-900"
           >
            Bewegungs recept
          </button>

          <button
           type="button"
           onClick={() => setShowSDMScript(true)}
           className="block font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-900"
         >
           Share Decision Making Script
        </button>

        <button
  type="button"
  onClick={() => setShowNonPharmaOptions(true)}
  className="block font-semibold text-sky-700 underline underline-offset-2 hover:text-sky-900"
>
  Options for non-pharmacological management of pain
</button>
        </div>

          {showSDMScript && (
           <SDMScriptModal onClose={() => setShowSDMScript(false)} />
           )}

           {showNonPharmaOptions && (
  <NonPharmaOptionsModal onClose={() => setShowNonPharmaOptions(false)} />
)}
        </div>
      </div>

    </>
  );
}

function BewegungRezeptModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    krankenkasse: "",
    patientName: "",
    geburtsdatum: "",
    kostentraegerkennung: "",
    versichertenNr: "",
    status: "",
    betriebsstaettenNr: "",
    arztNr: "",
    datum: "",
    trainingHerzKreislauf: false,
    trainingHaltungBewegung: false,
    trainingStressEntspannung: false,
    trainingAllgemein: false,
    hinweiseUebungsleitung: "",
    adresseArzt: "",
    mitteilungUebungsleitung: "",
  });

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div
  className="fixed inset-0 z-[60] overflow-auto bg-slate-950/80 p-4"
  onClick={onClose}
>
  <div
    className="mx-auto max-w-[1220px] rounded-3xl bg-white p-4 shadow-2xl"
    onClick={(e) => e.stopPropagation()}
  >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Bewegungs recept
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="grid gap-0 overflow-hidden rounded-2xl border border-neutral-800 bg-white text-neutral-950 md:grid-cols-2">
          {/* Left side */}
          <section className="border-r-2 border-dotted border-neutral-700 p-6">
            <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="mb-5 border border-neutral-800">
                  <WritableBox
                    label="Krankenkasse bzw. Kostenträger"
                    value={form.krankenkasse}
                    onChange={(value) => updateField("krankenkasse", value)}
                  />

                  <div className="grid grid-cols-[1fr_120px] border-t border-neutral-800">
                    <WritableBox
                      label="Name, Vorname der*des Versicherten"
                      value={form.patientName}
                      onChange={(value) => updateField("patientName", value)}
                      className="border-r border-neutral-800"
                    />

                    <WritableBox
                      label="geb. am"
                      value={form.geburtsdatum}
                      onChange={(value) => updateField("geburtsdatum", value)}
                      type="date"
                    />
                  </div>

                  <div className="grid grid-cols-3 border-t border-neutral-800">
                    <WritableBox
                      label="Kostenträgererkennung"
                      value={form.kostentraegerkennung}
                      onChange={(value) =>
                        updateField("kostentraegerkennung", value)
                      }
                      className="border-r border-neutral-800"
                    />

                    <WritableBox
                      label="Versicherten-Nr."
                      value={form.versichertenNr}
                      onChange={(value) => updateField("versichertenNr", value)}
                      className="border-r border-neutral-800"
                    />

                    <WritableBox
                      label="Status"
                      value={form.status}
                      onChange={(value) => updateField("status", value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 border-t border-neutral-800">
                    <WritableBox
                      label="Betriebsstätten-Nr."
                      value={form.betriebsstaettenNr}
                      onChange={(value) =>
                        updateField("betriebsstaettenNr", value)
                      }
                      className="border-r border-neutral-800"
                    />

                    <WritableBox
                      label="Arzt-Nr."
                      value={form.arztNr}
                      onChange={(value) => updateField("arztNr", value)}
                      className="border-r border-neutral-800"
                    />

                    <WritableBox
                      label="Datum"
                      value={form.datum}
                      onChange={(value) => updateField("datum", value)}
                      type="date"
                    />
                  </div>
                </div>

                <p className="mb-2 text-[12px] font-semibold">
                  Ich empfehle Ihnen ein Training mit folgendem Schwerpunkt:
                </p>

                <div className="space-y-2 text-[11px]">
                  <WritableCheckBox
                    label="Herz-Kreislaufsystem"
                    checked={form.trainingHerzKreislauf}
                    onChange={(value) =>
                      updateField("trainingHerzKreislauf", value)
                    }
                  />

                  <WritableCheckBox
                    label="Haltungs- und Bewegungssystem"
                    checked={form.trainingHaltungBewegung}
                    onChange={(value) =>
                      updateField("trainingHaltungBewegung", value)
                    }
                  />

                  <WritableCheckBox
                    label="Stressbewältigung und Entspannung"
                    checked={form.trainingStressEntspannung}
                    onChange={(value) =>
                      updateField("trainingStressEntspannung", value)
                    }
                  />

                  <WritableCheckBox
                    label="Allgemeines Gesundheitstraining"
                    checked={form.trainingAllgemein}
                    onChange={(value) =>
                      updateField("trainingAllgemein", value)
                    }
                  />
                </div>

                <WritableTextArea
                  label="Hinweise an die Übungsleitung:"
                  value={form.hinweiseUebungsleitung}
                  onChange={(value) =>
                    updateField("hinweiseUebungsleitung", value)
                  }
                  className="mt-5 h-56"
                />
              </div>

              <div className="flex flex-col">
                <h1 className="text-[34px] font-black uppercase leading-[0.95] tracking-tight">
                  Rezept für
                  <br />
                  Bewegung
                </h1>

                <p className="mt-4 text-[13px] font-extrabold leading-tight">
                  Regelmäßige körperliche Aktivität tut Ihnen und Ihrer
                  Gesundheit gut!
                </p>

                <p className="mt-4 text-[12px] leading-[1.45]">
                  Bewegung kann Krankheiten des Herz-Kreislauf- und des
                  Stoffwechselsystems sowie des Bewegungsapparates verhindern.
                  Zudem reduziert Bewegung das Risiko für Krebs, Diabetes Typ II
                  und Demenz und trägt zur Entspannung bei.
                </p>

                <p className="mt-3 text-[12px] leading-[1.45]">
                  Daher empfehle ich Ihnen die Teilnahme an einem
                  Bewegungsangebot in einem Sportverein. Das kann ein Angebot
                  sein, dass mit dem Qualitätssiegel{" "}
                  <b>SPORT PRO GESUNDHEIT</b> zertifiziert ist.
                </p>

                <p className="mt-3 text-[12px] font-bold leading-[1.45]">
                  Darüber hinaus empfehle ich, täglich mehr Bewegung in Ihren
                  Alltag zu integrieren!
                </p>

                <WritableTextArea
                  label="Adresse Arzt / Ärztin"
                  value={form.adresseArzt}
                  onChange={(value) => updateField("adresseArzt", value)}
                  className="mt-6 h-24"
                />

                <div className="mt-auto pt-10 text-[10px] leading-tight">
                  Stempel und Unterschrift
                  <br />
                  Arzt*Ärztin
                </div>
              </div>
            </div>
          </section>

          {/* Right side */}
          <section className="p-6">
            <p className="text-[13px] leading-tight">
              Sie haben die ärztliche Empfehlung, an einem Bewegungsangebot
              teilzunehmen. Sämtliche Angebote in Ihrer Nähe finden Sie im
              Internet unter:
            </p>

            <p className="mt-1 text-[14px] font-bold">
              www.bewegungslandkarte.de
            </p>

            <div className="mt-5 grid grid-cols-[1fr_1.1fr] text-[12px] leading-tight">
              <div>
                <p className="font-bold">Bei Fragen wenden Sie sich bitte an:</p>
                <p className="mt-2 font-bold">
                  Deutscher Olympischer Sportbund
                </p>
                <p>Ressort Breiten- und Gesundheitssport</p>
              </div>

              <div className="pt-7">
                <p>
                  E-Mail: <span className="ml-8">gesundheit@dosb.de</span>
                </p>
                <p>
                  Internet: <span className="ml-7">gesundheit.dosb.de</span>
                </p>
              </div>
            </div>

            <h2 className="mt-5 text-[14px] font-black">
              Wöchentliche Bewegungsempfehlungen für Erwachsene und ältere
              Erwachsene
            </h2>

            <div className="mt-3 border-b border-neutral-800 pb-3">
              <div className="grid grid-cols-[70px_120px_1fr_140px] items-center gap-3">
                <div className="text-[11px] font-bold">
                  Ausdauer
                  <br />
                  <span className="text-2xl">♥</span>
                </div>

                <div className="text-3xl font-black italic">150–300</div>

                <p className="text-[11px] leading-tight">
                  Minuten pro Woche
                  <br />
                  <span className="text-[10px]">
                    Ausdauerorientierte Bewegung, die etwas anstrengend ist,
                    z. B. Nordic Walking, Tanzen, Skilanglauf
                  </span>
                </p>

                <div className="flex justify-around text-3xl">⛷︎ 🧘 🚣</div>
              </div>

              <div className="my-2 text-center text-[10px] font-bold">
                ODER EINE KOMBINATION
              </div>

              <div className="grid grid-cols-[70px_120px_1fr_140px] items-center gap-3">
                <div />
                <div className="text-3xl font-black italic">75–150</div>

                <p className="text-[11px] leading-tight">
                  Minuten pro Woche
                  <br />
                  <span className="text-[10px]">
                    Ausdauerorientierte Bewegung, die anstrengend ist, z. B.
                    Laufen, schnelles Rad fahren, schnelles Schwimmen
                  </span>
                </p>

                <div className="flex justify-around text-3xl">🏃 🚴 🏊</div>
              </div>
            </div>

            <div className="grid grid-cols-2 border-b border-neutral-800">
              <div className="border-r border-neutral-800 p-3">
                <p className="text-[10px] font-bold uppercase">Zusätzlich</p>
                <div className="grid grid-cols-[70px_1fr_36px] items-center gap-2">
                  <div className="text-3xl font-black italic">2</div>
                  <p className="text-[10px] leading-tight">
                    <b>Tage pro Woche</b>
                    <br />
                    Muskelkräftigende Aktivitäten, z. B. funktionsgymnastische
                    Übungen oder Bewegen von Lasten
                  </p>
                  <div className="text-2xl">🏋</div>
                </div>
              </div>

              <div className="p-3">
                <p className="text-[10px] font-bold uppercase">Zusätzlich</p>
                <div className="grid grid-cols-[70px_1fr_36px] items-center gap-2">
                  <div className="text-3xl font-black italic">3</div>
                  <p className="text-[10px] leading-tight">
                    <b>Tage pro Woche</b>
                    <br />
                    Gleichgewichtsübungen, für ältere Erwachsene ab 65 Jahren
                    zur Sturzprävention
                  </p>
                  <div className="text-2xl">⚖</div>
                </div>
              </div>
            </div>

            <p className="mt-2 text-[10px] leading-tight">
              Lange Sitzphasen vermeiden und Sitzen durch körperliche
              Aktivitäten unterbrechen – z. B. kleine Spaziergänge, Arbeiten im
              Stehen
            </p>

            <p className="mt-1 text-[8px] leading-tight">
              Quelle: modifiziert nach WHO: Bull et al., 2020
              <span className="float-right">
                Piktogramme: © DOSB/Sportdeutschland
              </span>
            </p>

            <div className="mt-4 grid grid-cols-[1.1fr_0.7fr] gap-4">
              <WritableTextArea
                label="Mitteilung der Übungsleitung an den*die Arzt*Ärztin:"
                value={form.mitteilungUebungsleitung}
                onChange={(value) =>
                  updateField("mitteilungUebungsleitung", value)
                }
                className="h-52"
              />

              <div className="flex flex-col justify-end pb-4 text-[12px] font-semibold leading-tight">
                <p>
                  Ihr*e Patient*in hat an unserem Bewegungsangebot teilgenommen.
                </p>
                <p className="mt-16 text-[10px] font-normal">
                  Stempel und Unterschrift des Vereins
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => console.log("REDCap-ready data:", form)}
              className="mt-6 rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Save form data
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function WritableBox({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block p-2 ${className}`}>
      <div className="mb-1 text-[10px] leading-tight text-neutral-800">
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-0 bg-transparent text-[12px] outline-none"
      />
    </label>
  );
}

function WritableTextArea({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`block border border-neutral-800 bg-white p-2 ${className}`}>
      <div className="mb-2 text-[11px] font-bold leading-tight">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full resize-none border-0 bg-transparent text-[12px] outline-none"
      />
    </label>
  );
}

function WritableCheckBox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[11px] leading-tight">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3 w-3"
      />
      {label}
    </label>
  );
}

function SDMScriptModal({ onClose }: { onClose: () => void }) {
  return (
    <div
  className="fixed inset-0 z-[70] overflow-auto bg-slate-950/80 p-4"
  onClick={onClose}
>
  <div
    className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-2xl"
    onClick={(e) => e.stopPropagation()}
  >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Share Decision Making Script
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="space-y-5 text-sm leading-7 text-slate-800">
            <h3 className="text-base font-bold">
              Gespräche mit Patienten über nicht-medikamentöse Therapien zur
              Schmerzbehandlung
            </h3>

            <p>
              Ärzte können Patienten dabei helfen, nicht-medikamentöse Therapien
              in Betracht zu ziehen, indem sie offene und kooperative Gespräche
              führen. Eine klare Kommunikation und die aktive Beteiligung der
              Patienten sind entscheidend für den Aufbau einer vertrauensvollen
              Beziehung und helfen den Patienten dabei, nicht-medikamentöse
              Therapien zur Schmerzbehandlung in Betracht zu ziehen.
            </p>

            <p>
              Schaffen Sie ein Umfeld, in dem Patienten gemeinsam mit Ihnen
              nichtmedikamentöse Therapien erkunden und fundierte Entscheidungen
              treffen können, die ihren individuellen Bedürfnissen und
              Präferenzen entsprechen.
            </p>

            <ScriptSection title="Zum Beispiel:">
              <li>
                „Neben (z.B. NSAIDs Medikament) gibt es viele
                nicht-medikamentöse Therapien, die Schmerzen wirksam und mit
                geringerem Risiko behandeln können. Ich halte es für wichtig,
                dass wir diese Optionen gemeinsam prüfen.“
              </li>
              <li>
                „Nach sorgfältiger Beurteilung Ihres Zustands und Überprüfung
                Ihres Behandlungsfortschritts halte ich es für sinnvoll,
                nicht-medikamentöse Therapien in Betracht zu ziehen. Diese
                Optionen können eine wirksame Schmerzlinderung mit geringerem
                Risiko bieten. Lassen Sie uns über diese Optionen sprechen und
                prüfen, ob sie Ihren Zielen für die Schmerzbehandlung und Ihrem
                allgemeinen Wohlbefinden entsprechen.“
              </li>
            </ScriptSection>

            <p className="font-semibold">
              Beziehen Sie Patienten in Entscheidungen und Zielsetzungen mit
              ein.
            </p>

            <ScriptSection title="Zum Beispiel:">
              <li>
                „Ihre Meinung und Ihre Präferenzen sind wichtig. Lassen Sie uns
                über Ihre Behandlungsziele sprechen und darüber, wie
                nicht-medikamentöse Therapien Ihnen helfen können. Mit Ihrer
                Hilfe können wir einen Plan erstellen, der zu Ihrem Lebensstil
                passt und die Vorteile nicht-medikamentöser-Behandlungen
                maximiert.“
              </li>
              <li>
                „Ich glaube daran, dass wir gemeinsam Ihre Ziele bei der
                Schmerzbehandlung erreichen können. Ihre Meinung ist wichtig, um
                die für Sie besten nicht-medikamentöse Therapien zu bestimmen.
                Wir werden Ihre Präferenzen, Ihre täglichen Aktivitäten und
                alles, was die Behandlung erschweren könnte, berücksichtigen und
                einen umfassenden Plan entwickeln, der Ihre Schmerzen behandelt
                und gleichzeitig Ihre Sicherheit und Ihr Wohlbefinden
                gewährleistet.“
              </li>
            </ScriptSection>

            <p className="font-semibold">
              Gehen Sie auf die Bedenken oder falschen Vorstellungen der
              Patienten hinsichtlich nicht-medikamentöser Therapien ein und
              fördern Sie ein offenes Gespräch.
            </p>

            <ScriptSection title="Zum Beispiel:">
              <li>
                „Ich verstehe, dass Sie möglicherweise Zweifel an
                nicht-medikamentösen Therapien haben. Lassen Sie uns über alle
                Bedenken sprechen, und ich werde Ihnen einige Informationen
                geben, die Ihnen bei Ihrer Entscheidung helfen.“
              </li>
            </ScriptSection>

            <p className="font-semibold">
              Bitten Sie den Patienten um seine Fragen, Meinungen und sonstigen
              Beiträge, um ihn in den Entscheidungsprozess einzubeziehen.
            </p>

            <ScriptSection title="Zum Beispiel:">
              <li>
                „Was halten Sie davon, bei Ihrer Schmerzbehandlung auch einige
                nicht-medikamentöse Therapien einzusetzen? Ich schätze Ihre
                Meinung sehr und möchte sicherstellen, dass wir Ihre Präferenzen
                und Ziele während des gesamten Behandlungsprozesses
                berücksichtigen.“
              </li>
              <li>
                „Können Sie mir Ihre Meinung dazu sagen, ob Sie die derzeitige
                Vorgehensweise fortsetzen oder nicht-medikamentöse Optionen
                ausprobieren möchten?“
              </li>
            </ScriptSection>

            <div className="mt-8 border-t border-slate-300 pt-4 text-xs leading-6 text-slate-600">
  <p>
    Originale Quelle: CDC Overdose Resource Exchange (ORE):
  </p>

  <a
    href="https://www.cdc.gov/overdose-resources/hcp/files/conversation-starter-nonopioid-therapies.html"
    target="_blank"
    rel="noopener noreferrer"
    className="break-all text-sky-700 underline hover:text-sky-900"
  >
    https://www.cdc.gov/overdose-resources/hcp/files/conversation-starter-nonopioid-therapies.html
  </a>

  <p className="mt-2">
    Angepasst auf unsere Zielmedikation und auf Deutsch übersetzt.
  </p>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScriptSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 font-semibold">{title}</p>
      <ul className="list-disc space-y-2 pl-6">{children}</ul>
    </div>
  );
}

type NonPharmaOption = {
  category:
    | "Exercise"
    | "Devices"
    | "Procedures"
    | "Cognitive and behavioural therapies"
    | "Other";
  name: string;
  summary: string;
  firstPublished: string;
  website: string;
  websiteUrl: string;
};

const nonPharmaOptions: NonPharmaOption[] = [
  {
    category: "Exercise",
    name: "Aquatic exercise for knee and hip osteoarthritis",
    summary:
      "Physical exercise while immersed in water, typically 32–36°C. The intervention comprises two to three 30–60 minute sessions per week, for a mean duration of 12 weeks.",
    firstPublished: "Keine Angabe",
    website: "Aquatic exercise for knee and hip osteoarthritis",
    websiteUrl:
      "https://www.racgp.org.au/clinical-resources/clinical-guidelines/handi/handi-interventions/exercise/aquatic-exercise-for-knee-and-hip-osteoarthritis",
  },
  {
    category: "Exercise",
    name: "Exercise for acute lower back pain",
    summary:
      "Advising patients with acute low-back pain to stay active, rather than to rest in bed. Staying active does not mean participating in any specific exercises.",
    firstPublished: "Keine Angabe",
    website: "Exercise for acute lower back pain",
    websiteUrl:
      "https://www.racgp.org.au/clinical-resources/clinical-guidelines/handi/handi-interventions/exercise/exercise-for-acute-lower-back-pain",
  },
  {
    category: "Exercise",
    name: "Exercise for chronic low back pain",
    summary:
      "Exercise therapy has been reported as an effective intervention for chronic low back pain. It can be supervised, group-based, or unsupervised home exercise.",
    firstPublished: "2016",
    website: "Exercise for chronic low back pain",
    websiteUrl:
      "https://www.racgp.org.au/clinical-resources/clinical-guidelines/handi/handi-interventions/exercise/exercise-for-chronic-low-back-pain",
  },
  {
    category: "Exercise",
    name: "Exercise for knee osteoarthritis",
    summary:
      "Regular land- or water-based therapeutic exercise for adults with knee osteoarthritis. Exercise programs may be delivered face to face or via the internet.",
    firstPublished: "2014, updated 2017",
    website: "Exercise for knee osteoarthritis",
    websiteUrl:
      "https://www.racgp.org.au/clinical-resources/clinical-guidelines/handi/handi-interventions/exercise/exercise-for-knee-osteoarthritis",
  },
  {
    category: "Exercise",
    name: "Exercise for patellofemoral pain syndrome",
    summary:
      "Hip and knee strengthening exercises can lead to improvement in pain and function.",
    firstPublished: "2021",
    website: "Hip and knee strengthening exercises for patellofemoral pain",
    websiteUrl:
      "https://www.racgp.org.au/clinical-resources/clinical-guidelines/handi/handi-interventions/exercise/exercise-for-patellofemoral-pain-syndrome",
  },
  {
    category: "Devices",
    name: "Splints for the reduction of pain from hand osteoarthritis",
    summary:
      "Prefabricated or custom-made splints may be worn at night or during the day to support or immobilise affected joints.",
    firstPublished: "2014",
    website: "Splints for the reduction of pain from hand osteoarthritis",
    websiteUrl:
      "https://www.racgp.org.au/clinical-resources/clinical-guidelines/handi/handi-interventions/device/splints-for-the-reduction-of-pain-from-hand-osteoa",
  },
  {
    category: "Devices",
    name: "Walking cane for knee osteoarthritis",
    summary:
      "Daily use of a walking cane or stick to decrease the load through the affected knee and improve pain and function.",
    firstPublished: "Keine Angabe",
    website: "Walking cane for knee osteoarthritis",
    websiteUrl:
      "https://www.racgp.org.au/clinical-resources/clinical-guidelines/handi/handi-interventions/device/walking-cane-for-knee-osteoarthritis",
  },
  {
    category: "Devices",
    name: "Knee taping for osteoarthritis",
    summary:
      "Strong adhesive tape or strapping is applied before painful activities to unload painful soft tissues.",
    firstPublished: "Keine Angabe",
    website: "Knee taping for osteoarthritis",
    websiteUrl:
      "https://www.racgp.org.au/clinical-resources/clinical-guidelines/handi/handi-interventions/device/knee-taping-for-osteoarthritis",
  },
  {
    category: "Procedures",
    name: "Physiotherapy for tennis elbow",
    summary:
      "A physiotherapy program including exercise, elbow manipulation, self-manipulation, and progressive wrist extensor exercises.",
    firstPublished: "Keine Angabe",
    website: "Physiotherapy for tennis elbow",
    websiteUrl:
      "https://www.racgp.org.au/clinical-resources/clinical-guidelines/handi/handi-interventions/procedures/physiotherapy-for-tennis-elbow",
  },
  {
    category: "Procedures",
    name: "Compression for venous leg ulcers",
    summary:
      "Medical compression therapy applied externally to the lower leg to improve venous return and reduce oedema.",
    firstPublished: "2017",
    website: "Compression for venous leg ulcers",
    websiteUrl:
      "https://www.racgp.org.au/clinical-resources/clinical-guidelines/handi/handi-interventions/procedures/compression-for-venous-leg-ulcers",
  },
  {
    category: "Cognitive and behavioural therapies",
    name: "Mindfulness and CBT for chronic low back pain",
    summary:
      "Mindfulness-based stress reduction and cognitive behavioural therapy delivered in group format over 8 weeks with home practice.",
    firstPublished: "2017",
    website: "Mindfulness and CBT for chronic low back pain",
    websiteUrl:
      "https://www.racgp.org.au/clinical-resources/clinical-guidelines/handi/handi-interventions/cogntive-and-behavioural-therapies/mindfulness-and-cbt-for-chronic-low-back-pain",
  },
  {
    category: "Other",
    name: "Elevating the head of the bed for GERD",
    summary:
      "Elevating the head of the bed using blocks under the legs or wedge pillows. In the research, elevation was 20 cm.",
    firstPublished: "2021",
    website: "RACGP - Elevating the head of the bed for GERD",
    websiteUrl:
      "https://www.racgp.org.au/clinical-resources/clinical-guidelines/handi/conditions/gastroesophageal/elevating-the-head-of-the-bed-for-gerd",
  },
];

function NonPharmaOptionsModal({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [openCard, setOpenCard] = useState<string | null>(null);

  const categories = [
    "All",
    "Exercise",
    "Devices",
    "Procedures",
    "Cognitive and behavioural therapies",
    "Other",
  ];

  const filteredOptions = nonPharmaOptions.filter((option) => {
    const matchesCategory = category === "All" || option.category === category;
    const searchText = search.toLowerCase();

    const matchesSearch =
      option.name.toLowerCase().includes(searchText) ||
      option.summary.toLowerCase().includes(searchText) ||
      option.category.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  return (
    <div
  className="fixed inset-0 z-[80] overflow-auto bg-slate-950/80 p-4"
  onClick={onClose}
>
  <div
    className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-2xl"
    onClick={(e) => e.stopPropagation()}
  ><div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Options for non-pharmacological management of pain
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search and filter alternatives by intervention type.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="mb-5 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search e.g. knee, back pain, CBT, walking cane..."
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  category === item
                    ? "border-sky-600 bg-sky-600 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredOptions.map((option) => {
            const isOpen = openCard === option.name;

            return (
              <div
                key={option.name}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md"
              >
                <div className="mb-3 flex items-start gap-4">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl ${getCategoryImageStyle(
                      option.category
                    )}`}
                  >
                    {getCategoryImage(option.category)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getCategoryStyle(
                          option.category
                        )}`}
                      >
                        {option.category}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {option.firstPublished}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-slate-900">
                      {option.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  {isOpen
                    ? option.summary
                    : option.summary.length > 150
                    ? `${option.summary.slice(0, 150)}...`
                    : option.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenCard(isOpen ? null : option.name)}
                    className="rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {isOpen ? "Show less" : "Read summary"}
                  </button>

                  <a
  href={option.websiteUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="rounded-2xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700"
>
  Website
</a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOptions.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No options found.
          </div>
        )}
      </div>
    </div>
  );
}

function getCategoryStyle(category: NonPharmaOption["category"]) {
  switch (category) {
    case "Exercise":
      return "bg-emerald-100 text-emerald-800";
    case "Devices":
      return "bg-sky-100 text-sky-800";
    case "Procedures":
      return "bg-amber-100 text-amber-800";
    case "Cognitive and behavioural therapies":
      return "bg-purple-100 text-purple-800";
    case "Other":
      return "bg-slate-100 text-slate-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

function getCategoryImage(category: NonPharmaOption["category"]) {
  switch (category) {
    case "Exercise":
      return "🏃";
    case "Devices":
      return "🦯";
    case "Procedures":
      return "🩺";
    case "Cognitive and behavioural therapies":
      return "🧠";
    case "Other":
      return "💡";
    default:
      return "💡";
  }
}

function getCategoryImageStyle(category: NonPharmaOption["category"]) {
  switch (category) {
    case "Exercise":
      return "bg-emerald-100 text-emerald-700";
    case "Devices":
      return "bg-sky-100 text-sky-700";
    case "Procedures":
      return "bg-amber-100 text-amber-700";
    case "Cognitive and behavioural therapies":
      return "bg-purple-100 text-purple-700";
    case "Other":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function NsaidRiskScriptModal({
  riskLevel,
  onClose,
}: {
  riskLevel: string;
  onClose: () => void;
}) {
  const isHighRisk = riskLevel === "High risk";

  const highRiskSpecificText = `Bei hohem Risiko:

„Die von mir beschriebenen Risiken sind nicht immer für jeden gleich, und die Wahrscheinlichkeit von Nebenwirkungen kann von Person zu Person variieren.“

„Das Risiko einer Magen- oder Darm-Blutung unter ihrem Medikament wird durch bestimmte andere Medikamente gesteigert.“

„Zum Beispiel können weitere Medikamente, die Sie einnehmen (…), dieses Risiko erhöhen.“

„Und wenn zusätzliche Risikofaktoren vorliegen – zum Beispiel früher oder aktuell ein Magengeschwür – kann das Risiko weiter steigen. Deshalb setzen wir diese Medikamente gezielt und vorsichtig ein und wägen gemeinsam Nutzen und Risiken ab.“

Wenn bei Ihnen weitere Risikofaktoren vorliegen – zum Beispiel eine frühere Magen- oder Darmblutung, ein Magengeschwür, eine schwere chronische Erkrankung oder wenn Sie andere Medikamente einnehmen, die den Magen oder Darm belasten – dann kann das Risiko noch weiter ansteigen.`;

  const moderateRiskSpecificText = `Zusätzliche Informationen:

„Mit zunehmendem Alter können körperliche Veränderungen ohne Symptome verlaufen. Das bedeutet auch, dass Blutungen manchmal ohne deutliche Warnsignale auftreten können. Wir können das Risiko, dass so eine Blutung überhaupt auftritt, senken, indem wir die Dosis des Medikaments reduzieren, das das Risiko erhöht, oder eine Alternative für das Medikament suchen, das ihnen ebenfalls bei ihren Schmerzen helfen kann.“`;

  const commonText = `Sprechen Sie mit Ihrem Patienten über das Risiko einer GI-Blutung
(aufgrund von NSARs wie Ibuprofen, Diclofenac, ASS, etc.)

Modifiziert aus dem SHARE Approach, den Formulierungshilfen aus dem Tool Ariba MediQuit 2.0. und den Patientenbroschüren des Canadian Deprescribing Network (CaDeN)

Helfen Sie Ihrem Patienten, die Vor- und Nachteile der Behandlungsoptionen abzuwägen.

Allgemeiner Teil (Für alle Patienten):

„Lassen Sie mich Ihnen sagen, was die Forschung über die Vorteile und Risiken ihrer Schmerzmittel/Entzündungshemmer sagt, die Sie einnehmen.“

„Das Risiko, eine Blutung im Magen- oder Darmtrakt zu erleiden, nimmt mit steigendem Alter zu, insbesondere, wenn man Schmerzmittel/Entzündungshemmer wie zum Beispiel [Name des spezifischen Medikaments] einnimmt.“

„Das bedeutet, selbst wenn Sie das Medikament in den letzten Monaten gut vertragen haben, kann eine Einnahme über Jahre durchaus zu Nebenwirkungen führen.“

Schmerz- und Entzündungsmedikamente wie Ibuprofen, Diclofenac, Naproxen oder Etoricoxib (NSAR) können die Schleimhäute in ihrem Magen und Darm reizen und das Risiko für eine Magen- oder Darm-Blutung erhöhen – vor allem bei höherer Dosierung und längerer Einnahme.

„Sie können sich das wie eine wunde Stelle im Mund vorstellen, nur an der Innenwand des Magen oder Darms. Jedoch kann diese im Magen durch die Säure viel mehr Probleme bereiten.“

${isHighRisk ? highRiskSpecificText : moderateRiskSpecificText}

Nur wenn der Patient nach konkreten Zahlen fragt:

Diese Schmerzmittel, NSAR (z. B. Ibuprofen oder Diclofenac), können das Risiko für Komplikationen etwas erhöhen. Das Risiko ist insgesamt niedrig, aber etwa 5-mal höher als bei Menschen, die keine NSAR einnehmen.

Bei Menschen ab 75 Jahren ist der Risikoanstieg deutlicher: Ohne diese Medikamente haben etwa 3 von 1.000 Personen innerhalb eines Jahres eine Magen- oder Darm-Blutung. Mit NSAR sind es etwa 15 von 1.000 Personen innerhalb eines Jahres.

Also entwickeln etwa 12 zusätzliche Patientinnen und Patienten pro 1.000 innerhalb eines Jahres eine Magen- oder Darm-Blutung, wenn sie NSAR einnehmen.

Vorstellung von Entscheidungshilfen:

„Dies ist eine Broschüre, die Magen- und Darm-Blutungen noch einmal genau erklärt. Sie soll Ihnen dabei helfen, die Vor- und Nachteile abzuwägen und eine Entscheidung zu treffen. Wir können gemeinsam darüber sprechen.“

Bitten Sie Ihren Patienten um Mithilfe:

„Nachdem wir nun das Problem erkannt haben, können wir über Ihre Optionen und die nächsten Schritte sprechen. Ich möchte Ihre Meinung dazu hören, was Sie für richtig halten.“

„Bevor wir eine Entscheidung treffen, möchte ich gerne mehr darüber erfahren, was Ihnen wichtig ist.“

Treffen Sie gemeinsam mit Ihrem Patienten eine Entscheidung:

„Es ist in Ordnung, sich mehr Zeit zu nehmen, um über die Behandlungsmöglichkeiten nachzudenken. Möchten Sie in Ruhe darüber nachdenken oder sich vorher mit Angehörigen austauschen, oder sind Sie bereit, eine Entscheidung zu treffen?“

„Welche weiteren Fragen haben Sie an mich, damit ich Ihnen bei Ihrer Entscheidung helfen kann?“

Beurteilen Sie die Entscheidung Ihres Patienten:

„Wenn Sie das Gefühl haben, dass dieser Plan für Sie nicht funktioniert, vereinbaren Sie bitte einen Folgetermin, damit wir ${isHighRisk ? "einen anderen Ansatz planen können" : "eine andere Möglichkeit finden können"}.“`;

  return (
    <div
  className="fixed inset-0 z-[85] overflow-auto bg-slate-950/80 p-4"
  onClick={onClose}
>
  <div
    className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-2xl"
    onClick={(e) => e.stopPropagation()}
  ><div className="mb-5 flex items-center justify-between gap-4">
  <div>
    <h2 className="text-lg font-semibold text-slate-900">
      Gespräch über NSAR-Risiko –{" "}
      {isHighRisk ? "Hohes Risiko" : "Moderates Risiko"}
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Gesprächsleitfaden zur gemeinsamen Entscheidungsfindung
    </p>
  </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div
          className={`rounded-3xl border p-5 ${
            isHighRisk
              ? "border-rose-200 bg-rose-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="whitespace-pre-line text-sm leading-7 text-slate-800">
            {commonText}
          </div>

          <div className="mt-8 border-t border-slate-300 pt-4 text-xs leading-6 text-slate-600">
            <h4 className="mb-3 text-sm font-bold text-slate-800">Quellen:</h4>

            <div className="space-y-4">
              <div>
                <p>
                  1AHRQ. The SHARE Approach: Conversation Starters Pub. No.
                  25-0005-2-EF, October 2024:
                </p>
                <a
                  href="https://www.ahrq.gov/sdm/share-approach/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sky-700 underline hover:text-sky-900"
                >
                  https://www.ahrq.gov/sdm/share-approach/index.html
                </a>
              </div>

              <div>
                <p>
                  1AHRQ. The SHARE Approach: Communicate numbers clearly Pub.
                  No. 25-0005-4-EF, October 2024:
                </p>
                <a
                  href="https://www.ahrq.gov/sdm/share-approach/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sky-700 underline hover:text-sky-900"
                >
                  https://www.ahrq.gov/sdm/share-approach/index.html
                </a>
              </div>

              <div>
                <p>2Ariba MediQuit 2.0</p>
              </div>

              <div>
                <p>3Canadian Deprescribing Network (CaDeN)</p>
                <a
                  href="https://www.deprescribingnetwork.ca/patient-handouts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sky-700 underline hover:text-sky-900"
                >
                  https://www.deprescribingnetwork.ca/patient-handouts
                </a>
              </div>

              <div>
                <p>4 Selbst hinzugefügt</p>
              </div>

              <div>
                <p>
                  5Angel L, A review of the gastrointestinal safety data—a
                  gastroenterologist’s perspective, Rheumatology, Volume 49,
                  Issue suppl_2, May 2010, Pages ii3–ii10
                </p>
                <a
                  href="https://doi.org/10.1093/rheumatology/keq058"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sky-700 underline hover:text-sky-900"
                >
                  https://doi.org/10.1093/rheumatology/keq058
                </a>
              </div>

              <div>
                <p>
                  6Tawfik AG, Gomez-Lumbreras A, Del Fiol G, Kawamoto K,
                  Trinkley KE, Reese T, Jones A, Malone DC. Nonsteroidal
                  Anti-Inflammatory Drugs and Risk of Gastrointestinal Bleeding:
                  A Systematic Review and Meta-Analysis. Clin Pharmacol Ther.
                  2026 Jan;119(1):46-62. doi: 10.1002/cpt.70054.
                </p>
                <a
                  href="https://doi.org/10.1002/cpt.70054"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sky-700 underline hover:text-sky-900"
                >
                  https://doi.org/10.1002/cpt.70054
                </a>
              </div>

              <div>
                <p>
                  7Hallas J, Lauritsen J, Villadsen HD, Gram LF. Nonsteroidal
                  anti-inflammatory drugs and upper gastrointestinal bleeding,
                  identifying high-risk groups by excess risk estimates. Scand J
                  Gastroenterol. 1995 May;30(5):438-44.
                </p>
                <a
                  href="https://doi.org/10.3109/00365529509093304"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sky-700 underline hover:text-sky-900"
                >
                  https://doi.org/10.3109/00365529509093304
                </a>
              </div>

              <div>
                <p>
                  8Davis A und Robson J. The dangers of NSAIDs: look both ways.
                  British Journal of General Practice 2016; 66 (645):172-173.
                </p>
                <a
                  href="https://doi.org/10.3399/bjgp16X684433"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sky-700 underline hover:text-sky-900"
                >
                  https://doi.org/10.3399/bjgp16X684433
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}