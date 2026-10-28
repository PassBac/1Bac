import {
  ChapterDossier,
  KnowledgeItem,
  LexiqueData,
  PersonnagesData,
  QuizChapterBank,
  QuizQuestionItem,
  SyntheseData,
} from '../types';
import { NovelId } from '../types';
import boiteLexique from './boite-a-merveilles/lexique.json';
import boitePersonnages from './boite-a-merveilles/personnages.json';
import boiteQuiz from './boite-a-merveilles/quiz.json';
import boiteSynthese from './boite-a-merveilles/synthese.json';
import dernierJourLexique from './dernier-jour/lexique.json';
import dernierJourPersonnages from './dernier-jour/personnages.json';
import dernierJourQuiz from './dernier-jour/quiz.json';
import dernierJourResume from './dernier-jour/resumé.json';
import dernierJourSynthese from './dernier-jour/synthese.json';
import antigoneQuiz from './antigone/quiz.json';
import antigonePeople from './antigone/personnages_antigone.json';
import antigoneSummary from './antigone/resumes_et_situations_passage_antigone.json';
import antigoneSynthesis from './antigone/synthese_antigone.json';
import antigoneVocabulary from './antigone/vocabulaire_antigone.json';
import antigoneMemoryCards from './antigone/cartes_memoires_antigone.json';

interface RawDernierJourQuizQuestion {
  id?: string | number;
  chapterId?: string;
  chapter?: string;
  chapitre?: string;
  type?: string;
  question: string;
  options?: string[];
  correctAnswer?: number | boolean;
  answer?: string | number | boolean;
  reponse_correcte?: string | number | boolean;
  expectedAnswer?: string;
  gradingCriteria?: string[];
  explanation?: string;
  explication?: string;
  source?: string;
  verified?: boolean;
}

interface RawDernierJourQuizBank {
  bankTitle?: string;
  targetAudience?: string;
  chapterId?: string;
  chapterTitle?: string;
  chapters?: string;
  chapitres?: string;
  chapitres_couverts?: string;
  sequence?: number | string;
  titre?: string;
  nombre_questions?: number;
  title?: string;
  questions: RawDernierJourQuizQuestion[];
}

interface RawPassageContext {
  situation_generale: string;
  evenements_precedents: string;
  evenement_cle: string;
  suite_des_evenements: string;
}

interface RawSequence {
  id: string;
  titre_sequence: string;
  chapitres: string;
  lieu_principal: string;
  resume_detaille: string;
  situation_de_passage: RawPassageContext;
  themes_cles: string[];
  tonalitess_et_figures: string[];
}

interface RawDernierJourCharacter {
  id: string;
  name: string;
  role?: string;
  status?: string;
  description: string;
  keyTraits?: string[];
  source?: string;
}

interface RawDernierJourCharacterCategory {
  categoryId: string;
  categoryName: string;
  description: string;
  characters: RawDernierJourCharacter[];
}

interface RawDernierJourQuizData {
  bankTitle: string;
  targetAudience: string;
  questions: Array<RawDernierJourQuizQuestion | RawDernierJourQuizBank>;
}

interface RawDernierJourPeopleData {
  title: string;
  description: string;
  targetAudience: string;
  categories: RawDernierJourCharacterCategory[];
}

interface RawDernierJourLexiconData {
  title: string;
  description: string;
  targetAudience: string;
  vocabulary: Array<{
    id: string;
    word: string;
    definition: string;
    synonymes?: string[] | null;
    context?: string | null;
    category?: string;
    source?: string;
    verified?: boolean;
  }>;
}

interface RawDernierJourSynthesisData {
  title: string;
  description: string;
  targetAudience: string;
  cartes: Array<{
    id: string | number;
    categorie: string;
    recto: string;
    verso: string;
    mots_cles?: string[];
  }>;
}

interface RawDernierJourSummaryData {
  sequencage_chapitres: RawSequence[];
}

interface RawAntigoneQuizQuestion {
  id?: string | number;
  type?: string;
  categorie?: string;
  theme?: string;
  question: string;
  options?: string[];
  reponse_correcte?: string | number | boolean;
  reponses_correctes?: string[];
  modele_reponse?: string;
  elements_de_reponse?: string | string[];
  explication?: string;
  texte?: string;
  texte_a_trous?: string;
  mots_a_placer?: string[];
  mot_a_placer?: string;
  extrait?: string;
  source?: string;
}

interface RawAntigoneQuizBank {
  titre?: string;
  sequence?: string;
  questions: RawAntigoneQuizQuestion[];
}

interface RawAntigoneQuizData {
  titre: string;
  oeuvre: string;
  auteur: string;
  sequence: string;
  description: string;
  questions: Array<RawAntigoneQuizQuestion | RawAntigoneQuizBank>;
}

interface RawAntigoneSequence {
  sequence_numero: number;
  titre_sequence: string;
  scenes_couvertes: string;
  resume_detaille: string;
  situation_de_passage: {
    cadre_general: string;
    evenements_precedents: string;
    evenement_cle: string;
    suite_narrative: string;
  };
  themes_principaux: string[];
  registres_et_procedes: string[];
}

interface RawAntigoneSummaryData {
  oeuvre: string;
  auteur: string;
  cadre_spatio_temporel: string;
  sequences: RawAntigoneSequence[];
}

interface RawAntigoneCharacter {
  nom: string;
  statut_social?: string;
  portrait_physique_et_moral?: string;
  role_dans_la_tragedie?: string;
  valeur_symbolique?: string;
  relations_cles?: string[];
}

interface RawAntigonePeopleData {
  titre_oeuvre: string;
  auteur: string;
  genre: string;
  arbre_des_personnages: Record<string, RawAntigoneCharacter | RawAntigoneCharacter[]>;
}

interface RawAntigoneVocabularyData {
  titre: string;
  niveau: string;
  categories: Array<{
    nom_categorie: string;
    termes: Array<{
      id: string;
      terme: string;
      definition: string;
      contexte_antigone?: string;
      categorie?: string;
    }>;
  }>;
}

interface RawAntigoneSynthesisData {
  titre_general: string;
  niveau: string;
  fiche_de_lecture: Record<string, string>;
  resumes_synthetiques_par_sequence: Array<{
    sequence: string;
    contenu: string;
  }>;
  conflit_central_et_enjeux: Record<string, string>;
  specificites_de_la_tragedie_moderne: Record<string, string>;
  axes_de_production_ecrite: string[];
}

interface RawAntigoneMemoryCardsData {
  cartes: Array<{
    id: string | number;
    categorie: string;
    recto: string;
    verso: string;
    mots_cles?: string[];
  }>;
}

export interface NovelStudyData {
  quizBanks: QuizChapterBank[];
  lexiqueData: LexiqueData;
  personnagesData: PersonnagesData;
  syntheseData: SyntheseData;
  chaptersSyllabus: ChapterDossier[];
  spatialFrame: string;
  unitLabel: string;
  unitLabelSingular: string;
  unitCompletedAdjective: 'étudié' | 'étudiée';
  completedHeading: string;
  unitShortLabel: string;
  unitHeading: string;
}

const dernierJourQuizData = dernierJourQuiz as unknown as RawDernierJourQuizData;
const dernierJourPeopleData = dernierJourPersonnages as unknown as RawDernierJourPeopleData;
const dernierJourLexiconData = dernierJourLexique as unknown as RawDernierJourLexiconData;
const dernierJourSynthesisData = dernierJourSynthese as unknown as RawDernierJourSynthesisData;
const dernierJourSummaryData = dernierJourResume as unknown as RawDernierJourSummaryData;

const sequences = dernierJourSummaryData.sequencage_chapitres;
const sequenceByQuizChapter: Record<string, number> = {
  'chapitres-6-a-13': 2,
  'chapitres-14-a-22': 3,
};

const sequenceId = (number: number) => `dernier-jour-seq_${number}`;
const getSequenceTitle = (sequence: RawSequence) => sequence.titre_sequence;

const normalizeQuizQuestion = (
  question: RawDernierJourQuizQuestion,
  chapterId: string
): QuizQuestionItem => {
  const rawAnswer = question.correctAnswer ?? question.reponse_correcte ?? question.answer;
  const sourceType = (question.type || (question.options ? 'qcm' : 'analyse')).trim().toLowerCase();
  const type =
    sourceType === 'qcm'
      ? 'qcm'
      : sourceType === 'vrai/faux' || sourceType === 'vrai_faux' || sourceType === 'vrai-faux'
        ? 'vrai_faux'
        : sourceType.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'analyse';

  let correctAnswer = question.correctAnswer;
  let expectedAnswer = question.expectedAnswer;

  if (rawAnswer !== undefined) {
    if (type === 'qcm') {
      if (typeof rawAnswer === 'number') {
        if (!question.options || rawAnswer < 0 || rawAnswer >= question.options.length) {
          throw new Error(`L'index de réponse du QCM ${question.id || question.question} est invalide.`);
        }
        correctAnswer = rawAnswer;
      } else {
        const answerIndex = question.options?.findIndex(
          (option) =>
            option.trim().toLocaleLowerCase() === String(rawAnswer).trim().toLocaleLowerCase()
        );
        if (answerIndex === undefined || answerIndex < 0) {
          throw new Error(`La réponse du QCM ${question.id || question.question} est absente des choix.`);
        }
        correctAnswer = answerIndex;
      }
    } else if (type === 'vrai_faux') {
      if (typeof rawAnswer === 'boolean') {
        correctAnswer = rawAnswer;
      } else {
        const answer = String(rawAnswer).trim().toLocaleLowerCase();
        if (answer !== 'vrai' && answer !== 'faux') {
          throw new Error(`La réponse vrai/faux ${question.id || question.question} est invalide.`);
        }
        correctAnswer = answer === 'vrai';
      }
    } else {
      expectedAnswer = String(rawAnswer);
    }
  }

  return {
    id: String(question.id ?? `djc-${chapterId}-${question.question.slice(0, 20)}`),
    chapterId,
    type,
    question: question.question,
    options: question.options,
    correctAnswer,
    expectedAnswer,
    gradingCriteria: question.gradingCriteria,
    explanation: question.explanation || question.explication || '',
    source: question.source || 'Banque de quiz du Dernier Jour d’un condamné',
    verified: question.verified ?? false,
  };
};

const buildDernierJourQuizBanks = (): QuizChapterBank[] => {
  const questionItems = dernierJourQuizData.questions;
  const directQuestions = questionItems.filter(
    (item): item is RawDernierJourQuizQuestion =>
      'question' in item && typeof item.question === 'string'
  );
  const groupedBanks = questionItems.filter(
    (item): item is RawDernierJourQuizBank =>
      'questions' in item && Array.isArray(item.questions)
  );

  const firstSequence = sequences[0];
  const banks: QuizChapterBank[] = [
    {
      bankTitle: dernierJourQuizData.bankTitle,
      targetAudience: dernierJourQuizData.targetAudience,
      chapterId: sequenceId(1),
      chapterTitle: getSequenceTitle(firstSequence),
      totalQuestions: directQuestions.length,
      questions: directQuestions.map((question) =>
        normalizeQuizQuestion(question, sequenceId(1))
      ),
    },
  ];

  groupedBanks.forEach((bank) => {
    const sequenceLabel = `${bank.sequence ?? ''} ${bank.chapters || bank.chapitres || bank.chapitres_couverts || ''}`;
    const sequenceFromLabel = sequenceLabel.match(/(?:séquence|sequence)\s*(\d+)/i)?.[1];
    const sequenceNumber =
      (bank.chapterId ? sequenceByQuizChapter[bank.chapterId] : undefined) ||
      (typeof bank.sequence === 'number' ? bank.sequence : undefined) ||
      (sequenceFromLabel ? Number(sequenceFromLabel) : undefined) ||
      (/XXIII\s*à\s*XXXII/i.test(sequenceLabel) ? 4 : undefined) ||
      (/XXXIII\s*à\s*XLI/i.test(sequenceLabel) ? 5 : undefined) ||
      (/XLII\s*à\s*XLIX/i.test(sequenceLabel) ? 6 : undefined);
    if (!sequenceNumber) {
      throw new Error(`Impossible d'identifier la séquence de la banque ${bank.chapterId || sequenceLabel}.`);
    }
    const sequence = sequences[sequenceNumber - 1];
    if (!sequence) {
      throw new Error(`Aucune séquence trouvée pour la banque ${bank.chapterId || sequenceLabel}.`);
    }

    banks.push({
      bankTitle: bank.bankTitle || dernierJourQuizData.bankTitle,
      targetAudience: bank.targetAudience || dernierJourQuizData.targetAudience,
      chapterId: sequenceId(sequenceNumber),
      chapterTitle: getSequenceTitle(sequence),
      totalQuestions: bank.questions.length,
      questions: bank.questions.map((question) =>
        normalizeQuizQuestion(question, sequenceId(sequenceNumber))
      ),
    });
  });

  return banks;
};

const buildDernierJourDossiers = (): ChapterDossier[] => {
  const characters = dernierJourPeopleData.categories.flatMap((category) =>
    category.characters
  );
  const normalizeTokens = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
  const ignoredNameTokens = new Set([
    'le', 'la', 'les', 'de', 'des', 'du', 'et', 'un', 'une', 'a', 'au', 'aux',
    'dans', 'par', 'pour', 'ses', 'son', 'sa', 'mort',
  ]);

  return sequences.map((sequence, index) => {
    const passage = sequence.situation_de_passage;
    const passageText = Object.values(passage).join(' ');
    const sceneTokens = new Set(
      normalizeTokens(`${sequence.resume_detaille} ${passageText}`).map((token) =>
        token.length > 4 && token.endsWith('s') ? token.slice(0, -1) : token
      )
    );
    const keyCharacters = characters
      .filter((character) => {
        const nameTokens = normalizeTokens(character.name)
          .filter((token) => !ignoredNameTokens.has(token) && token.length >= 4)
          .map((token) =>
            token.length > 4 && token.endsWith('s') ? token.slice(0, -1) : token
          );
        const matchedTokens = new Set(nameTokens.filter((token) => sceneTokens.has(token)));
        const requiredMatches = nameTokens.length > 1 ? 2 : 1;
        return matchedTokens.size >= requiredMatches;
      })
      .map((character) => ({
        name: character.name,
        role: character.role || character.status || character.description,
      }));
    const protagonist = characters.find((character) =>
      character.name.toLocaleLowerCase().includes('condamné')
    );
    if (
      protagonist &&
      !keyCharacters.some((character) => character.name === protagonist.name)
    ) {
      keyCharacters.unshift({
        name: protagonist.name,
        role: protagonist.role || protagonist.description,
      });
    }

    return {
      id: sequenceId(index + 1),
      number: index + 1,
      season: '',
      seasonLabel: 'Repères chronologiques',
      spatialFrame: sequence.lieu_principal,
      title: getSequenceTitle(sequence),
      narrativeArc: sequence.resume_detaille,
      regionalExamKeys: [
        `Situation générale : ${passage.situation_generale}`,
        `Événements antérieurs : ${passage.evenements_precedents}`,
        `Passage clé : ${passage.evenement_cle}`,
        `Suite du récit : ${passage.suite_des_evenements}`,
        `Tonalités et figures de style : ${sequence.tonalitess_et_figures.join(' · ')}`,
      ],
      themes: sequence.themes_cles,
      keyCharacters,
      examQuestionsHint: `À l'examen : situer un extrait des chapitres ${sequence.chapitres}, le rattacher à l'évolution du condamné et analyser les thèmes et procédés propres à cette séquence.`,
    };
  });
};

const buildDernierJourLexicon = (): LexiqueData => ({
  bankTitle: dernierJourLexiconData.title,
  targetAudience: dernierJourLexiconData.targetAudience,
  sourceDocument: 'Lexique fourni pour Le Dernier Jour d’un condamné',
  totalEntries: dernierJourLexiconData.vocabulary.length,
  entries: dernierJourLexiconData.vocabulary.map((entry) => ({
    id: entry.id,
    word: entry.word,
    definition: entry.definition,
    synonymes: entry.synonymes || null,
    context: entry.context || null,
    chapterId: null,
    category: entry.category,
    source: entry.source || 'Lexique du Dernier Jour d’un condamné',
    verified: entry.verified ?? false,
  })),
});

const buildDernierJourCharacters = (): PersonnagesData => ({
  titre: dernierJourPeopleData.title,
  auteur: 'Victor Hugo',
  genre: 'Roman à thèse',
  cadre_spatial: 'Bicêtre, la Conciergerie et l’Hôtel de Ville',
  categories: dernierJourPeopleData.categories.map((category) => ({
    id: category.categoryId,
    nom: category.categoryName,
    description: category.description,
    personnages: category.characters.map((character) => ({
      nom: character.name,
      role: character.role,
      statut: character.status,
      description: character.keyTraits?.length
        ? `${character.description} Traits : ${character.keyTraits.join(', ')}.`
        : character.description,
    })),
  })),
});

const buildDernierJourSynthesis = (): SyntheseData => {
  const knowledgeItems: KnowledgeItem[] = dernierJourSynthesisData.cartes.map((card) => ({
    id: `djc_syn_${card.id}`,
    category: card.categorie,
    title: card.recto,
    explanation: card.verso,
    source: '',
    verified: false,
    keywords: card.mots_cles || [],
  }));

  return {
    title: dernierJourSynthesisData.title,
    description: dernierJourSynthesisData.description,
    targetAudience: dernierJourSynthesisData.targetAudience,
    totalCategories: new Set(knowledgeItems.map((item) => item.category)).size,
    totalItems: knowledgeItems.length,
    knowledgeItems,
  };
};

const dernierJourStudyData: NovelStudyData = {
  quizBanks: buildDernierJourQuizBanks(),
  lexiqueData: buildDernierJourLexicon(),
  personnagesData: buildDernierJourCharacters(),
  syntheseData: buildDernierJourSynthesis(),
  chaptersSyllabus: buildDernierJourDossiers(),
  spatialFrame: 'Bicêtre · Conciergerie · Hôtel de Ville',
  unitLabel: 'séquences',
  unitLabelSingular: 'Séquence',
  unitCompletedAdjective: 'étudiée',
  completedHeading: 'Séquences étudiées',
  unitShortLabel: 'Seq.',
  unitHeading: 'Dossiers d’étude des séquences',
};

const boiteStudyData: NovelStudyData = {
  quizBanks: boiteQuiz as QuizChapterBank[],
  lexiqueData: boiteLexique as LexiqueData,
  personnagesData: boitePersonnages as PersonnagesData,
  syntheseData: boiteSynthese as SyntheseData,
  chaptersSyllabus: [],
  spatialFrame: 'Médina de Fès · Années 1920',
  unitLabel: 'chapitres',
  unitLabelSingular: 'Chapitre',
  unitCompletedAdjective: 'étudié',
  completedHeading: 'Chapitres étudiés',
  unitShortLabel: 'Chap.',
  unitHeading: 'Dossiers d’Étude Chapitre par Chapitre',
};

const antigoneQuizData = antigoneQuiz as unknown as RawAntigoneQuizData;
const antigoneSummaryData = antigoneSummary as unknown as RawAntigoneSummaryData;
const antigonePeopleData = antigonePeople as unknown as RawAntigonePeopleData;
const antigoneVocabularyData = antigoneVocabulary as unknown as RawAntigoneVocabularyData;
const antigoneSynthesisData = antigoneSynthesis as unknown as RawAntigoneSynthesisData;
const antigoneMemoryCardsData = antigoneMemoryCards as unknown as RawAntigoneMemoryCardsData;

const antigoneSequenceId = (number: number) => `antigone-seq_${number}`;

const normalizeAntigoneQuizQuestion = (
  question: RawAntigoneQuizQuestion,
  chapterId: string,
  sequenceNumber: number
): QuizQuestionItem => {
  const sourceType = (question.type || (question.options ? 'qcm' : 'analyse')).toLowerCase();
  const type =
    question.options?.length && !sourceType.includes('vrai')
      ? 'qcm'
      : sourceType.includes('vrai') || sourceType.includes('faux')
        ? 'vrai_faux'
        : sourceType.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'analyse';
  const rawAnswer =
    question.reponse_correcte ??
    question.reponses_correctes ??
    question.modele_reponse ??
    question.mot_a_placer ??
    question.mots_a_placer;
  let correctAnswer: number | boolean | undefined;
  let expectedAnswer: string | undefined;

  if (type === 'qcm') {
    if (!question.options?.length || rawAnswer === undefined) {
      throw new Error(`Le QCM ${question.id ?? question.question} d'Antigone est incomplet.`);
    }

    if (typeof rawAnswer === 'number') {
      correctAnswer = rawAnswer;
    } else {
      const answerText = String(rawAnswer).trim();
      const answerLetter = answerText.match(/^([A-Z])(?:\s*[\).:\-]|$)/i)?.[1];
      const answerIndex = answerLetter
        ? answerLetter.toUpperCase().charCodeAt(0) - 65
        : question.options.findIndex(
            (option) => option.trim().toLocaleLowerCase() === answerText.toLocaleLowerCase()
          );
      if (answerIndex < 0 || answerIndex >= question.options.length) {
        throw new Error(`La réponse du QCM ${question.id ?? question.question} est invalide.`);
      }
      correctAnswer = answerIndex;
    }
  } else if (type === 'vrai_faux') {
    if (typeof rawAnswer === 'boolean') {
      correctAnswer = rawAnswer;
    } else if (rawAnswer !== undefined) {
      const answer = String(rawAnswer).trim().toLocaleLowerCase();
      if (!['vrai', 'faux', 'true', 'false'].includes(answer)) {
        throw new Error(`La réponse vrai/faux ${question.id ?? question.question} est invalide.`);
      }
      correctAnswer = answer === 'vrai' || answer === 'true';
    }
  } else if (rawAnswer !== undefined) {
    expectedAnswer = Array.isArray(rawAnswer) ? rawAnswer.join(' · ') : String(rawAnswer);
  }

  if (!expectedAnswer && question.elements_de_reponse) {
    expectedAnswer = Array.isArray(question.elements_de_reponse)
      ? question.elements_de_reponse.join(' · ')
      : question.elements_de_reponse;
  }

  const text = question.texte || question.texte_a_trous || question.extrait;
  const questionText = text ? `${question.question}\n\n${text}` : question.question;
  const criteria = Array.isArray(question.elements_de_reponse)
    ? question.elements_de_reponse
    : undefined;

  return {
    id: String(question.id ?? `${chapterId}-${question.question.slice(0, 20)}`),
    chapterId,
    type,
    question: questionText,
    options: question.options,
    correctAnswer,
    expectedAnswer,
    gradingCriteria: criteria,
    explanation: question.explication || '',
    source: question.source || `Antigone de Jean Anouilh, séquence ${sequenceNumber}`,
    verified: false,
  };
};

const buildAntigoneQuizBanks = (): QuizChapterBank[] => {
  const firstSequenceQuestions: RawAntigoneQuizQuestion[] = [];
  const groupedQuestions = new Map<number, RawAntigoneQuizQuestion[]>();

  for (const item of antigoneQuizData.questions) {
    if ('questions' in item && Array.isArray(item.questions)) {
      const sequenceNumber = Number(item.sequence?.match(/(\d+)/)?.[1]);
      if (!sequenceNumber || !antigoneSummaryData.sequences[sequenceNumber - 1]) {
        throw new Error(`Séquence inconnue dans une banque de quiz Antigone : ${item.sequence}.`);
      }
      groupedQuestions.set(sequenceNumber, item.questions);
    } else if ('question' in item && typeof item.question === 'string') {
      firstSequenceQuestions.push(item);
    }
  }

  groupedQuestions.set(1, firstSequenceQuestions);

  return antigoneSummaryData.sequences.map((sequence) => {
    const chapterId = antigoneSequenceId(sequence.sequence_numero);
    const questions = groupedQuestions.get(sequence.sequence_numero) || [];
    if (!questions.length) {
      throw new Error(`Aucune question trouvée pour la séquence ${sequence.sequence_numero} d'Antigone.`);
    }

    return {
      bankTitle: antigoneQuizData.titre,
      targetAudience: '1ère BAC · Examen Régional',
      chapterId,
      chapterTitle: sequence.titre_sequence,
      totalQuestions: questions.length,
      questions: questions.map((question) =>
        normalizeAntigoneQuizQuestion(question, chapterId, sequence.sequence_numero)
      ),
    };
  });
};

const buildAntigoneCharacters = (): PersonnagesData => {
  const categories = Object.entries(antigonePeopleData.arbre_des_personnages).map(
    ([categoryName, value], index) => {
      const characters = Array.isArray(value) ? value : [value];
      return {
        id: `antigone-characters-${index + 1}`,
        nom: categoryName.replace(/_/g, ' '),
        description: `Personnages de l'œuvre ${antigonePeopleData.titre_oeuvre}.`,
        personnages: characters.map((character) => ({
          nom: character.nom,
          role: character.statut_social,
          statut: character.valeur_symbolique,
          description: [
            character.portrait_physique_et_moral,
            character.role_dans_la_tragedie,
            character.relations_cles?.length
              ? `Relations : ${character.relations_cles.join(' ; ')}.`
              : undefined,
          ]
            .filter(Boolean)
            .join(' '),
        })),
      };
    }
  );

  return {
    titre: antigonePeopleData.titre_oeuvre,
    auteur: antigonePeopleData.auteur,
    genre: antigonePeopleData.genre,
    cadre_spatial: 'Thèbes · Palais royal',
    categories,
  };
};

const buildAntigoneLexicon = (): LexiqueData => {
  const entries = antigoneVocabularyData.categories.flatMap((category) =>
    category.termes.map((term) => ({
      id: term.id,
      word: term.terme,
      definition: term.definition,
      synonymes: null,
      context: term.contexte_antigone || null,
      chapterId: null,
      category: category.nom_categorie,
      source: `Lexique d'Antigone de Jean Anouilh · ${term.categorie || category.nom_categorie}`,
      verified: false,
    }))
  );

  return {
    bankTitle: antigoneVocabularyData.titre,
    targetAudience: antigoneVocabularyData.niveau,
    sourceDocument: 'Vocabulaire d’Antigone de Jean Anouilh',
    totalEntries: entries.length,
    entries,
  };
};

const buildAntigoneSynthesis = (): SyntheseData => {
  const knowledgeItems: KnowledgeItem[] = [
    ...antigoneMemoryCardsData.cartes.map((card) => ({
      id: `antigone-card-${card.id}`,
      category: card.categorie,
      title: card.recto,
      explanation: card.verso,
      source: 'Cartes mémoires d’Antigone',
      verified: false,
      keywords: card.mots_cles || [],
    })),
    ...antigoneSynthesisData.resumes_synthetiques_par_sequence.map((sequence, index) => ({
      id: `antigone-summary-${index + 1}`,
      category: 'Résumés des séquences',
      title: sequence.sequence,
      explanation: sequence.contenu,
      source: 'Synthèse d’Antigone',
      verified: false,
    })),
    ...Object.entries(antigoneSynthesisData.fiche_de_lecture).map(([title, explanation]) => ({
      id: `antigone-reading-${title}`,
      category: 'Repères sur l’œuvre',
      title: title.replace(/_/g, ' '),
      explanation,
      source: 'Fiche de lecture d’Antigone',
      verified: false,
    })),
    ...Object.entries(antigoneSynthesisData.conflit_central_et_enjeux).map(
      ([title, explanation]) => ({
        id: `antigone-conflict-${title}`,
        category: 'Conflit et enjeux',
        title: title.replace(/_/g, ' '),
        explanation,
        source: 'Synthèse d’Antigone',
        verified: false,
      })
    ),
    ...Object.entries(antigoneSynthesisData.specificites_de_la_tragedie_moderne).map(
      ([title, explanation]) => ({
        id: `antigone-theatre-${title}`,
        category: 'La tragédie moderne',
        title: title.replace(/_/g, ' '),
        explanation,
        source: 'Synthèse d’Antigone',
        verified: false,
      })
    ),
    ...antigoneSynthesisData.axes_de_production_ecrite.map((axis, index) => ({
      id: `antigone-writing-${index + 1}`,
      category: 'Axes de production écrite',
      title: `Sujet de réflexion ${index + 1}`,
      explanation: axis,
      source: 'Synthèse d’Antigone',
      verified: false,
    })),
  ];

  return {
    title: antigoneSynthesisData.titre_general,
    description:
      'Repères, résumés des quatre séquences, personnages, enjeux et pistes de réflexion pour réviser Antigone.',
    targetAudience: antigoneSynthesisData.niveau,
    totalCategories: new Set(knowledgeItems.map((item) => item.category)).size,
    totalItems: knowledgeItems.length,
    knowledgeItems,
  };
};

const buildAntigoneDossiers = (): ChapterDossier[] => {
  const characterRoles: Record<number, string[]> = {
    1: ['Antigone', 'Ismène', 'Nourrice', 'Prologue'],
    2: ['Antigone', 'Hémon', 'Ismène', 'Créon', 'Jonas'],
    3: ['Antigone', 'Créon', 'Ismène', 'Gardes'],
    4: ['Antigone', 'Hémon', 'Créon', 'Eurydice', 'Messager'],
  };
  const people = Object.values(antigonePeopleData.arbre_des_personnages).flatMap((value) =>
    Array.isArray(value) ? value : [value]
  );

  return antigoneSummaryData.sequences.map((sequence) => {
    const passage = sequence.situation_de_passage;
    const chapterId = antigoneSequenceId(sequence.sequence_numero);

    return {
      id: chapterId,
      number: sequence.sequence_numero,
      season: '',
      seasonLabel: 'Séquences de la pièce',
      spatialFrame: 'Thèbes · Palais royal',
      title: sequence.titre_sequence,
      narrativeArc: sequence.resume_detaille,
      regionalExamKeys: [
        `Cadre : ${passage.cadre_general}`,
        `Événements précédents : ${passage.evenements_precedents}`,
        `Passage clé : ${passage.evenement_cle}`,
        `Suite : ${passage.suite_narrative}`,
        `Scènes couvertes : ${sequence.scenes_couvertes}`,
        `Procédés : ${sequence.registres_et_procedes.join(' · ')}`,
      ],
      themes: sequence.themes_principaux,
      keyCharacters: (characterRoles[sequence.sequence_numero] || []).map((name) => {
        const character = people.find((item) =>
          item.nom.toLocaleLowerCase().includes(name.toLocaleLowerCase())
        );
        return {
          name,
          role: character?.role_dans_la_tragedie || character?.statut_social || 'Personnage de la séquence',
        };
      }),
      examQuestionsHint: `Pour l’examen : situez un extrait de la séquence ${sequence.sequence_numero}, résumez les événements et analysez les thèmes et procédés littéraires.`,
    };
  });
};

const antigoneStudyData: NovelStudyData = {
  quizBanks: buildAntigoneQuizBanks(),
  lexiqueData: buildAntigoneLexicon(),
  personnagesData: buildAntigoneCharacters(),
  syntheseData: buildAntigoneSynthesis(),
  chaptersSyllabus: buildAntigoneDossiers(),
  spatialFrame: 'Thèbes · Palais royal',
  unitLabel: 'séquences',
  unitLabelSingular: 'Séquence',
  unitCompletedAdjective: 'étudiée',
  completedHeading: 'Séquences étudiées',
  unitShortLabel: 'Seq.',
  unitHeading: 'Dossiers d’étude des séquences',
};

export const getNovelStudyData = (novelId: NovelId): NovelStudyData | undefined => {
  if (novelId === 'boite-a-merveilles') return boiteStudyData;
  if (novelId === 'dernier-jour') return dernierJourStudyData;
  if (novelId === 'antigone') return antigoneStudyData;
  return undefined;
};
