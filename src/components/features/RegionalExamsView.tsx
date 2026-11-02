import React, { useState } from 'react';
import { ArrowUpRight, FileText, Search } from 'lucide-react';
import { REGIONAL_EXAMS, RegionalExamSession } from '../../data/regionalExams';

const sessionLabels: Record<RegionalExamSession, string> = {
  normale: 'Session normale',
  rattrapage: 'Session de rattrapage',
};

const getPdfUrl = (filePath: string): string =>
  `${import.meta.env.BASE_URL}examens-reg/${filePath}`;

export const RegionalExamsView: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('tous');
  const [selectedSession, setSelectedSession] = useState('toutes');
  const [regionSearch, setRegionSearch] = useState('');
  const years = Array.from(new Set(REGIONAL_EXAMS.map((exam) => exam.year))).sort(
    (first, second) => second - first
  );
  const normalizedSearch = regionSearch.trim().toLocaleLowerCase('fr');
  const filteredExams = REGIONAL_EXAMS.filter((exam) => {
    const matchesYear =
      selectedYear === 'tous' || String(exam.year) === selectedYear;
    const matchesSession =
      selectedSession === 'toutes' || exam.session === selectedSession;
    const matchesRegion = exam.region
      .toLocaleLowerCase('fr')
      .includes(normalizedSearch);
    return matchesYear && matchesSession && matchesRegion;
  });
  const correctionCount = REGIONAL_EXAMS.filter(
    (exam) => exam.correctionPdf
  ).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <header className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-white via-amber-50/70 to-orange-50/70 p-6 shadow-xs dark:border-amber-900/60 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/30 sm:p-9">
        <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full border-[24px] border-amber-100/70 dark:border-amber-900/20" />
        <div className="relative max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-400">
            <FileText className="h-4 w-4" />
            Annales · Examen régional
          </span>
          <h1 className="font-serif text-3xl font-bold leading-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
            Examens régionaux
          </h1>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300 sm:text-base">
            Essayez d’abord le sujet, puis ouvrez son corrigé lorsqu’il est
            disponible. Les documents s’ouvrent au format PDF.
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {REGIONAL_EXAMS.length} sujets · {correctionCount} corrigés disponibles
            · 2017 et 2022
          </p>
        </div>
      </header>

      <section className="space-y-5">
        <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900 sm:grid-cols-[1fr_1fr_1.2fr]">
          <label className="space-y-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
            Année
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm font-normal text-stone-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:focus:ring-amber-900"
            >
              <option value="tous">Toutes les années</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
            Session
            <select
              value={selectedSession}
              onChange={(event) => setSelectedSession(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm font-normal text-stone-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:focus:ring-amber-900"
            >
              <option value="toutes">Toutes les sessions</option>
              <option value="normale">Session normale</option>
              <option value="rattrapage">Session de rattrapage</option>
            </select>
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
            Région
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={regionSearch}
                onChange={(event) => setRegionSearch(event.target.value)}
                placeholder="Rechercher une région"
                className="min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-sm font-normal text-stone-800 outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:focus:ring-amber-900"
              />
            </span>
          </label>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400" aria-live="polite">
          {filteredExams.length} {filteredExams.length === 1 ? 'examen trouvé' : 'examens trouvés'}
        </p>

        {filteredExams.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredExams.map((exam) => (
              <article
                key={exam.id}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs transition-colors hover:border-amber-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-amber-800"
              >
                <div className="h-1 bg-gradient-to-r from-amber-700 via-amber-500 to-orange-300 dark:from-amber-600 dark:via-amber-400 dark:to-orange-900" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                      {exam.year}
                    </span>
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                      {sessionLabels[exam.session]}
                    </span>
                  </div>

                  <h2 className="mt-4 break-words font-serif text-xl font-bold leading-snug text-stone-900 dark:text-stone-100">
                    {exam.region}
                  </h2>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    Français · 1ère année du baccalauréat
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={getPdfUrl(exam.subjectPdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-800 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:bg-amber-700 dark:hover:bg-amber-600 dark:focus:ring-offset-stone-900"
                    >
                      <FileText className="h-4 w-4" />
                      Ouvrir le sujet PDF
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                    {exam.correctionPdf ? (
                      <a
                        href={getPdfUrl(exam.correctionPdf)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-semibold text-stone-700 transition-colors hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:border-stone-700 dark:text-stone-200 dark:hover:border-amber-800 dark:hover:bg-amber-950/30 dark:focus:ring-offset-stone-900"
                      >
                        <FileText className="h-4 w-4" />
                        Ouvrir le corrigé PDF
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="inline-flex min-h-11 items-center rounded-xl bg-stone-100 px-4 py-2.5 text-xs text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                        Corrigé non fourni
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-900">
            <p className="font-semibold text-stone-800 dark:text-stone-100">
              Aucun examen ne correspond à ces filtres.
            </p>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Modifiez l’année, la session ou la région recherchée.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
