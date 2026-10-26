export interface LessonDefinition {
  id: string;
  title: string;
  summary: string;
  loadData: () => Promise<unknown>;
}

export interface LoadedLesson extends Omit<LessonDefinition, 'loadData'> {
  data: unknown;
}

export interface LessonQuestion {
  id: string;
  question: string;
  consigne?: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

export const LESSONS: LessonDefinition[] = [
  {
    id: 'champs-lexicaux',
    title: 'Les champs lexicaux',
    summary: 'Repérer les mots d’un même thème et expliquer leur effet.',
    loadData: () =>
      import('./lessons/cours_et_quiz_champs_lexicaux.json').then((module) => module.default),
  },
  {
    id: 'registres-de-langue',
    title: 'Les registres littéraires',
    summary: 'Distinguer les tonalités et leurs procédés caractéristiques.',
    loadData: () =>
      import('./lessons/cours_et_quiz_registres_de_langue.json').then((module) => module.default),
  },
  {
    id: 'focalisation',
    title: 'La focalisation et le point de vue',
    summary: 'Identifier ce que le narrateur sait et choisit de montrer.',
    loadData: () =>
      import('./lessons/cours_et_quiz_focalisation_ou_point_de_vue.json').then((module) => module.default),
  },
  {
    id: 'enonciation',
    title: 'La situation d’énonciation',
    summary: 'Reconnaître les indices, les déictiques et les repères.',
    loadData: () =>
      import('./lessons/cours_et_quiz_enonciation.json').then((module) => module.default),
  },
  {
    id: 'figures-de-style',
    title: 'Les figures de style',
    summary: 'Identifier les procédés d’écriture et interpréter leurs effets.',
    loadData: () =>
      import('./lessons/cours_et_quiz_figures_de_style.json').then((module) => module.default),
  },
  {
    id: 'niveaux-de-langue',
    title: 'Les niveaux de langue',
    summary: 'Comparer les niveaux familier, courant et soutenu.',
    loadData: () =>
      import('./lessons/cours_et_quiz_niveaux_de_langue.json').then((module) => module.default),
  },
  {
    id: 'recit-et-discours',
    title: 'Récit et discours',
    summary: 'Étudier les temps, les personnes et les repères du texte.',
    loadData: () =>
      import('./lessons/cours_et_quiz_recit_et_discours.json').then((module) => module.default),
  },
  {
    id: 'discours-rapporte',
    title: 'Le discours rapporté',
    summary: 'Transformer et analyser les paroles rapportées.',
    loadData: () =>
      import('./lessons/cours_et_quiz_discours_rapporte.json').then((module) => module.default),
  },
];

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeAnswer = (value: string) =>
  value
    .replace(/^\s*[A-D][).:\-]\s*/i, '')
    .trim()
    .toLocaleLowerCase('fr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getAnswerIndex = (answer: unknown, options: string[]): number => {
  if (typeof answer === 'number' && Number.isInteger(answer)) {
    return answer >= 0 && answer < options.length ? answer : -1;
  }

  if (typeof answer !== 'string') return -1;
  const letterAnswer = answer.trim().match(/^([A-D])(?:[).:\-]|\s|$)/i)?.[1];
  if (letterAnswer) {
    const index = letterAnswer.toUpperCase().charCodeAt(0) - 65;
    if (index < options.length) return index;
  }

  const normalizedAnswer = normalizeAnswer(answer);
  const matchingIndex = options.findIndex(
    (option) => normalizeAnswer(option) === normalizedAnswer
  );
  if (matchingIndex >= 0) return matchingIndex;

  const partialMatches = options
    .map((option, index) => ({ option: normalizeAnswer(option), index }))
    .filter(({ option }) =>
      option.includes(normalizedAnswer) || normalizedAnswer.includes(option)
    );
  return partialMatches.length === 1 ? partialMatches[0].index : -1;
};

const getStringProperty = (record: JsonRecord, keys: string[]) => {
  for (const key of keys) {
    if (typeof record[key] === 'string') return record[key];
  }
  return undefined;
};

export const getLessonQuestions = (lesson: LoadedLesson): LessonQuestion[] => {
  const questions: LessonQuestion[] = [];

  const visit = (value: unknown, path: string) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${path}-${index + 1}`));
      return;
    }
    if (!isRecord(value)) return;

    const options = Array.isArray(value.options)
      ? value.options.filter((option): option is string => typeof option === 'string')
      : [];
    const question = getStringProperty(value, ['question', 'enonce']);
    const answerIndex = getAnswerIndex(
      value.reponse_correcte ?? value.correctAnswer,
      options
    );

    if (question && options.length > 1 && answerIndex >= 0) {
      questions.push({
        id: `${lesson.id}-${String(value.id ?? path)}`,
        question,
        consigne: getStringProperty(value, ['consigne']),
        options,
        answerIndex,
        explanation: getStringProperty(value, [
          'explication',
          'explanation',
          'explication_et_effet',
        ]),
      });
      return;
    }

    Object.entries(value).forEach(([key, item]) => visit(item, `${path}-${key}`));
  };

  visit(lesson.data, lesson.id);
  return questions;
};

export const getLessonTitle = (lesson: LoadedLesson): string => {
  if (!isRecord(lesson.data)) return lesson.title;
  const title = getStringProperty(lesson.data, ['titre', 'titre_cours']);
  return title
    ?.replace(/^cours et (?:banque de )?quiz\s*:\s*/i, '')
    .replace(/\s*\(1ère BAC\)\s*/gi, '')
    .replace(/\s*-\s*1ère BAC\s*/gi, '')
    .trim() || lesson.title;
};

export const getLessonCourse = (lesson: LoadedLesson): unknown => {
  if (!isRecord(lesson.data)) return null;
  return lesson.data.cours ?? lesson.data.fiche_de_cours ?? null;
};

export const getLessonExercises = (lesson: LoadedLesson): unknown => {
  if (!isRecord(lesson.data)) return null;
  return (
    lesson.data.quiz_et_exercices ??
    lesson.data.quiz_interactif ??
    lesson.data.banque_de_quiz ??
    lesson.data.banque_exercices ??
    lesson.data.quiz ??
    null
  );
};
