export type RegionalExamSession = 'normale' | 'rattrapage';

export interface RegionalExam {
  id: string;
  year: number;
  region: string;
  session: RegionalExamSession;
  subjectPdf: string;
  correctionPdf?: string;
}

export const REGIONAL_EXAMS: RegionalExam[] = [
  {
    id: '2017-marrakech-safi-normale',
    year: 2017,
    region: 'Marrakech-Safi',
    session: 'normale',
    subjectPdf: '2017/sujet/examen-regional-francais-session-normale-marrakech-safi-2017-sujet.pdf',
    correctionPdf: '2017/corrige/examen-regional-francais-session-normale-marrakech-safi-2017-corrige.pdf',
  },
  {
    id: '2017-souss-massa-normale',
    year: 2017,
    region: 'Souss-Massa',
    session: 'normale',
    subjectPdf: '2017/sujet/examen-regional-francais-session-normale-souss-massa-2017-sujet.pdf',
    correctionPdf: '2017/corrige/examen-regional-francais-session-normale-souss-massa-2017-corrige.pdf',
  },
  {
    id: '2017-tanger-tetouan-al-hoceima-normale',
    year: 2017,
    region: 'Tanger-Tétouan-Al Hoceïma',
    session: 'normale',
    subjectPdf: '2017/sujet/examen-regional-francais-session-normale-tanger-tetouan-al-hoceima-2017-sujet.pdf',
    correctionPdf: '2017/corrige/examen-regional-francais-session-normale-tanger-tetouan-al-hoceima-2017-corrige.pdf',
  },
  {
    id: '2017-marrakech-safi-rattrapage',
    year: 2017,
    region: 'Marrakech-Safi',
    session: 'rattrapage',
    subjectPdf: '2017/sujet/examen-regional-francais-session-rattrapage-marrakech-safi-2017-sujet.pdf',
    correctionPdf: '2017/corrige/examen-regional-francais-session-rattrapage-marrakech-safi-2017-corrige.pdf',
  },
  {
    id: '2017-souss-massa-rattrapage',
    year: 2017,
    region: 'Souss-Massa',
    session: 'rattrapage',
    subjectPdf: '2017/sujet/examen-regional-francais-session-rattrapage-souss-massa-2017-sujet.pdf',
    correctionPdf: '2017/corrige/examen-regional-francais-session-rattrapage-souss-massa-2017-corrige.pdf',
  },
  {
    id: '2022-casablanca-settat-normale',
    year: 2022,
    region: 'Casablanca-Settat',
    session: 'normale',
    subjectPdf: '2022/sujet/examen-regional-francais-session-normale-casablanca-settat-2022-sujet.pdf',
    correctionPdf: '2022/corrige/examen-regional-francais-session-normale-casablanca-settat-2022-corrige.pdf',
  },
  {
    id: '2022-fes-meknes-normale',
    year: 2022,
    region: 'Fès-Meknès',
    session: 'normale',
    subjectPdf: '2022/sujet/examen-regional-francais-session-normale-fes-meknes-2022-sujet.pdf',
    correctionPdf: '2022/corrige/examen-regional-francais-session-normale-fes-meknes-2022-corrige.pdf',
  },
  {
    id: '2022-guelmim-oued-noun-normale',
    year: 2022,
    region: 'Guelmim-Oued Noun',
    session: 'normale',
    subjectPdf: '2022/sujet/examen-regional-francais-session-normale-guelmim-oued-noun-2022-sujet.pdf',
    correctionPdf: '2022/corrige/examen-regional-francais-session-normale-guelmim-oued-noun-2022-corrige.pdf',
  },
  {
    id: '2022-marrakech-safi-normale',
    year: 2022,
    region: 'Marrakech-Safi',
    session: 'normale',
    subjectPdf: '2022/sujet/examen-regional-francais-session-normale-marrakech-safi-2022-sujet.pdf',
    correctionPdf: '2022/corrige/examen-regional-francais-session-normale-marrakech-safi-2022-corrige.pdf',
  },
  {
    id: '2022-tanger-tetouan-al-hoceima-normale',
    year: 2022,
    region: 'Tanger-Tétouan-Al Hoceïma',
    session: 'normale',
    subjectPdf: '2022/sujet/examen-regional-francais-session-normale-tanger-tetouan-al-hoceima-2022-sujet.pdf',
    correctionPdf: '2022/corrige/examen-regional-francais-session-normale-tanger-tetouan-al-hoceima-2022-corrige.pdf',
  },
];
