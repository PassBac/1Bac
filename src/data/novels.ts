import { NovelSummary } from '../types';

export const NOVELS: NovelSummary[] = [
  {
    id: 'boite-a-merveilles',
    title: 'La Boîte à merveilles',
    author: 'Ahmed Sefrioui',
    authorLife: '1915 - 2004 (Fès, Maroc)',
    genre: 'Roman autobiographique',
    publishYear: 1954,
    century: 'XXe siècle',
    period: 'Littérature marocaine d\'expression française',
    coverImage: '/src/assets/images/hero_boite_a_merveilles_1792349766936.jpg',
    shortDescription:
      'À travers le regard sensible et solitaire de Sidi Mohammed, âgé de six ans, ce chef-d\'œuvre de la littérature marocaine dépeint la vie quotidienne de la médina de Fès dans les années 1920, ses rituels, ses croyances et la poésie secrète d\'une boîte d\'objets ordinaires.',
    status: 'active',
    totalChapters: 12,
    estimatedStudyTime: '6 à 8 heures',
  },
  {
    id: 'dernier-jour',
    title: 'Le Dernier Jour d\'un Condamné',
    author: 'Victor Hugo',
    authorLife: '1802 - 1885 (France)',
    genre: 'Roman à thèse',
    publishYear: 1829,
    century: 'XIXe siècle',
    period: 'Romantisme / Combat humaniste',
    coverImage: '',
    shortDescription:
      'Un plaidoyer vibrant et universel contre la peine de mort, consignant les dernières pensées et angoisses d\'un condamné anonyme attendant son exécution à Bicêtre, la Conciergerie et l\'Hôtel de Ville.',
    status: 'active',
    totalChapters: 49,
    estimatedStudyTime: '6 séquences de révision',
  },
  {
    id: 'antigone',
    title: 'Antigone',
    author: 'Jean Anouilh',
    authorLife: '1910 - 1987 (France)',
    genre: 'Tragédie moderne',
    publishYear: 1944,
    century: 'XXe siècle',
    period: 'Théâtre de la révolte / Seconde Guerre mondiale',
    coverImage: '',
    shortDescription:
      'La confrontation intemporelle entre le devoir moral d\'Antigone qui refuse le compromis pour enterrer son frère Polynice, et la raison d\'État implacable incarnée par le roi Créon.',
    status: 'active',
    totalChapters: 4,
    estimatedStudyTime: '4 séquences de révision',
  },
];
