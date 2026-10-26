import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  BookOpenCheck,
  Check,
  ChevronRight,
  CircleHelp,
  Eye,
  EyeOff,
  Lightbulb,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  getLessonCourse,
  getLessonExercises,
  getLessonQuestions,
  getLessonTitle,
  LESSONS,
  LessonDefinition,
  LessonQuestion,
  LoadedLesson,
} from '../../data/lessons';

interface LessonsViewProps {
  onBackToHome: () => void;
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
}

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const formatLabel = (value: string) =>
  value
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (letter) => letter.toLocaleUpperCase('fr'));

const isAnswerField = (key: string) =>
  /(reponse|solution|correct|corrige|attendu|indices|bareme|justification|analyse|explication)/i.test(
    key
  );

const StructuredContent: React.FC<{
  value: unknown;
  revealAnswers?: boolean;
  omitMultipleChoice?: boolean;
  depth?: number;
}> = ({ value, revealAnswers = true, omitMultipleChoice = false, depth = 0 }) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return <p className="whitespace-pre-line text-sm leading-relaxed text-stone-700 dark:text-stone-300">{value}</p>;
  }

  if (typeof value === 'boolean' || value === null || value === undefined) {
    return null;
  }

  if (Array.isArray(value)) {
    const items = value.filter((item) => {
      if (item === null || item === undefined) return false;
      return !(
        omitMultipleChoice &&
        isRecord(item) &&
        Array.isArray(item.options) &&
        ('reponse_correcte' in item || 'correctAnswer' in item)
      );
    });
    if (!items.length) return null;
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-stone-200/80 bg-white/70 p-4 dark:border-stone-700/80 dark:bg-stone-900/60"
          >
            <StructuredContent
              value={item}
              revealAnswers={revealAnswers}
              omitMultipleChoice={omitMultipleChoice}
              depth={depth + 1}
            />
          </div>
        ))}
      </div>
    );
  }

  if (!isRecord(value) || depth > 7) return null;

  const fields = Object.entries(value).filter(([key, fieldValue]) => {
    if (fieldValue === null || fieldValue === undefined || key === 'id') return false;
    if (!revealAnswers && isAnswerField(key)) return false;
    if (
      omitMultipleChoice &&
      key.toLocaleLowerCase('fr').includes('qcm')
    ) return false;
    return true;
  });

  if (!fields.length) return null;

  const headingEntry = fields.find(([key]) =>
    /^(nom|titre|type|categorie|niveau|concept|registre|figure|domaine|formule)$/i.test(key)
  );

  return (
    <div className="space-y-3">
      {headingEntry && typeof headingEntry[1] === 'string' && (
        <h4 className="font-semibold text-stone-900 dark:text-stone-100">
          {headingEntry[1]}
        </h4>
      )}
      {fields.map(([key, fieldValue]) => {
        if (headingEntry?.[0] === key && typeof fieldValue === 'string') return null;
        const valueIsNested = Array.isArray(fieldValue) || isRecord(fieldValue);
        return (
          <div key={key} className={valueIsNested ? 'space-y-2' : 'space-y-1'}>
            {!/^(exemple|extrait|texte|definition|description|consigne|question|phrase|effet_produit)$/i.test(key) && (
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-800 dark:text-amber-400">
                {formatLabel(key)}
              </div>
            )}
            <StructuredContent
              value={fieldValue}
              revealAnswers={revealAnswers}
              omitMultipleChoice={omitMultipleChoice}
              depth={depth + 1}
            />
          </div>
        );
      })}
    </div>
  );
};

const MultipleChoiceQuestion: React.FC<{
  question: LessonQuestion;
  number: number;
  selectedAnswer?: number;
  onSelect: (answer: number) => void;
}> = ({ question, number, selectedAnswer, onSelect }) => {
  const answered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === question.answerIndex;

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-stone-800 dark:bg-stone-900 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 font-mono text-xs font-bold text-amber-900 dark:bg-amber-950/70 dark:text-amber-300">
          {String(number).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          {question.consigne && question.consigne !== question.question && (
            <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              {question.consigne}
            </p>
          )}
          <h4 className="font-semibold leading-relaxed text-stone-900 dark:text-stone-100">
            {question.question}
          </h4>
        </div>
      </div>

      <div className="mt-4 space-y-2 pl-0 sm:pl-11">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isAnswer = question.answerIndex === index;
          const optionClass = answered && isAnswer
            ? 'border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
            : answered && isSelected
              ? 'border-rose-400 bg-rose-50 text-rose-950 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200'
              : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-amber-300 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-800/70 dark:text-stone-300 dark:hover:border-amber-800 dark:hover:bg-amber-950/30';
          return (
            <button
              key={`${question.id}-${index}`}
              type="button"
              disabled={answered}
              onClick={() => onSelect(index)}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm leading-relaxed transition-colors disabled:cursor-default ${optionClass}`}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current/30 text-[10px] font-bold">
                {answered && isAnswer ? <Check className="h-3.5 w-3.5" /> : String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm leading-relaxed ${
            isCorrect
              ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200'
          }`}
          role="status"
        >
          <p className="font-semibold">{isCorrect ? 'Bonne réponse !' : 'À retenir'}</p>
          {!isCorrect && (
            <p className="mt-1">
              Réponse : {question.options[question.answerIndex]}
            </p>
          )}
          {question.explanation && <p className="mt-1">{question.explanation}</p>}
        </div>
      )}
    </article>
  );
};

const LessonSelector: React.FC<{
  selectedLesson: LessonDefinition;
  onSelect: (lessonId: string) => void;
}> = ({ selectedLesson, onSelect }) => {
  const [search, setSearch] = useState('');
  const filteredLessons = LESSONS.filter((lesson) =>
    `${lesson.title} ${lesson.summary}`.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr'))
  );

  return (
    <aside className="space-y-3">
      <label className="relative block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une leçon"
          className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-800 outline-none transition focus:border-amber-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        />
      </label>
      <nav aria-label="Leçons de langue" className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-2 lg:overflow-visible">
        {filteredLessons.map((lesson, index) => {
          const active = lesson.id === selectedLesson.id;
          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => onSelect(lesson.id)}
              aria-current={active ? 'page' : undefined}
              className={`min-w-[210px] flex-1 rounded-xl border p-3 text-left transition-colors lg:w-full ${
                active
                  ? 'border-amber-400 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40'
                  : 'border-stone-200 bg-white hover:border-amber-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-amber-900'
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-start gap-3">
                  <span className={`font-mono text-[10px] font-bold ${active ? 'text-amber-800 dark:text-amber-400' : 'text-stone-400'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-xs font-semibold leading-relaxed ${active ? 'text-amber-950 dark:text-amber-200' : 'text-stone-700 dark:text-stone-300'}`}>
                    {lesson.title}
                  </span>
                </span>
                {active && <ChevronRight className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />}
              </span>
            </button>
          );
        })}
      </nav>
      {!filteredLessons.length && (
        <p className="rounded-xl bg-white p-4 text-sm text-stone-500 dark:bg-stone-900 dark:text-stone-400">
          Aucune leçon ne correspond à cette recherche.
        </p>
      )}
    </aside>
  );
};

const LessonContent: React.FC<{ lesson: LessonDefinition }> = ({ lesson }) => {
  const [lessonData, setLessonData] = useState<unknown>(null);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showCorrections, setShowCorrections] = useState(false);
  const loadedLesson = useMemo<LoadedLesson | null>(
    () => lessonData === null ? null : { ...lesson, data: lessonData },
    [lesson, lessonData]
  );
  const questions = useMemo(
    () => loadedLesson ? getLessonQuestions(loadedLesson) : [],
    [loadedLesson]
  );
  const course = loadedLesson ? getLessonCourse(loadedLesson) : null;
  const exercises = loadedLesson ? getLessonExercises(loadedLesson) : null;
  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter(
    (question) => answers[question.id] === question.answerIndex
  ).length;

  useEffect(() => {
    setAnswers({});
    setShowCorrections(false);
    setLessonData(null);
    setLoadError(false);

    let isCurrentRequest = true;
    lesson.loadData()
      .then((data) => {
        if (isCurrentRequest) setLessonData(data);
      })
      .catch((error: unknown) => {
        console.error(`Erreur de chargement de la leçon « ${lesson.title} » :`, error);
        if (isCurrentRequest) setLoadError(true);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [lesson, retryCount]);

  return (
    <div className="space-y-8">
      <header className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="h-1.5 bg-gradient-to-r from-amber-800 via-amber-500 to-orange-300 dark:from-amber-700 dark:via-amber-500 dark:to-orange-900" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800 dark:text-amber-400">
            <span>Leçon de langue</span>
            <span aria-hidden="true">·</span>
            <span>Français · 1ère Bac</span>
          </div>
          <h1 className="mt-3 font-serif text-2xl font-bold leading-tight text-stone-900 dark:text-stone-100 sm:text-3xl">
            {loadedLesson ? getLessonTitle(loadedLesson) : lesson.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            {lesson.summary}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 dark:bg-stone-800">
              <BookOpen className="h-3.5 w-3.5" />
              Cours structuré
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 dark:bg-stone-800">
              <CircleHelp className="h-3.5 w-3.5" />
              {loadedLesson ? `${questions.length} questions interactives` : 'Chargement du cours…'}
            </span>
            {answeredCount > 0 && (
              <span className="rounded-full bg-amber-100 px-3 py-1.5 font-semibold text-amber-950 dark:bg-amber-950/60 dark:text-amber-200">
                Score : {correctCount}/{answeredCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {!loadedLesson && !loadError && (
        <p className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400" role="status">
          Chargement de la leçon…
        </p>
      )}

      {loadError && (
        <div className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <p>Cette leçon n’a pas pu être chargée. Vérifiez votre connexion puis réessayez.</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="self-start rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-950/60 sm:self-auto"
          >
            Réessayer
          </button>
        </div>
      )}

      {course !== null && course !== undefined && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300">
              <BookOpenCheck className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                Fiche de cours
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Définitions, repères et exemples
              </p>
            </div>
          </div>
          <div className="space-y-5 rounded-2xl border border-stone-200 bg-stone-50/70 p-5 dark:border-stone-800 dark:bg-stone-900/60 sm:p-7">
            <p className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs leading-relaxed text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-200">
              Les exemples liés aux œuvres servent à l’entraînement : vérifiez le libellé exact dans votre édition avant de présenter un passage comme une citation.
            </p>
            <StructuredContent value={course} />
          </div>
        </section>
      )}

      {questions.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-800 dark:text-amber-400">
                <Sparkles className="h-4 w-4" />
                Entraînement
              </div>
              <h2 className="mt-1 font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                Vérifiez vos acquis
              </h2>
            </div>
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={() => setAnswers({})}
                className="inline-flex items-center gap-1.5 self-start rounded-lg px-2 py-1 text-xs font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200 sm:self-auto"
              >
                Recommencer
              </button>
            )}
          </div>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <MultipleChoiceQuestion
                key={question.id}
                question={question}
                number={index + 1}
                selectedAnswer={answers[question.id]}
                onSelect={(answer) =>
                  setAnswers((previous) => ({ ...previous, [question.id]: answer }))
                }
              />
            ))}
          </div>
        </section>
      )}

      {exercises !== null && exercises !== undefined && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-800 dark:text-amber-400">
                <Lightbulb className="h-4 w-4" />
                Pour aller plus loin
              </div>
              <h2 className="mt-1 font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                Exercices et analyses
              </h2>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                Prenez le temps de répondre avant de consulter les pistes de correction.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCorrections((shown) => !shown)}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-amber-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 sm:self-auto"
            >
              {showCorrections ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showCorrections ? 'Masquer les corrigés' : 'Afficher les corrigés'}
            </button>
          </div>
          <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-900/60 sm:p-6">
            <StructuredContent
              value={exercises}
              revealAnswers={showCorrections}
              omitMultipleChoice
            />
          </div>
        </section>
      )}
    </div>
  );
};

export const LessonsView: React.FC<LessonsViewProps> = ({
  onBackToHome,
  selectedLessonId,
  onSelectLesson,
}) => {
  const selectedLesson = LESSONS.find((lesson) => lesson.id === selectedLessonId) || LESSONS[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <button
        type="button"
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-stone-600 transition hover:text-amber-900 dark:text-stone-400 dark:hover:text-amber-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l’accueil
      </button>

      <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        <LessonSelector
          selectedLesson={selectedLesson}
          onSelect={onSelectLesson}
        />
        <LessonContent key={selectedLesson.id} lesson={selectedLesson} />
      </div>
    </div>
  );
};
