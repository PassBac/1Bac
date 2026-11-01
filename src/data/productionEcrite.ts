import antigoneData from './production_ecrite/antigone.json';
import boiteData from './production_ecrite/boite_merveille.json';
import dernierJourData from './production_ecrite/dernier_jour.json';

export interface ProductionWritingSubject {
  id: string;
  theme: string;
  title: string;
  prompt: string;
  plan: string;
  outline: unknown;
  vocabulary: string[];
}

export interface ProductionWritingWork {
  id: string;
  title: string;
  author: string;
  subjects: ProductionWritingSubject[];
}

export const PRODUCTION_WRITING_WORKS: ProductionWritingWork[] = [
  {
    id: 'boite-a-merveilles',
    title: 'La Boîte à merveilles',
    author: 'Ahmed Sefrioui',
    subjects: boiteData.sujets_par_theme.flatMap((theme) =>
      theme.sujets.map((subject) => ({
        id: subject.id_sujet,
        theme: theme.nom_theme,
        title: subject.titre,
        prompt: subject.enonce,
        plan: subject.type_plan,
        outline: subject.structure_recommandee,
        vocabulary: subject.vocabulaire_utile,
      }))
    ),
  },
  {
    id: 'antigone',
    title: 'Antigone',
    author: 'Jean Anouilh',
    subjects: antigoneData.sujets.map((subject) => ({
      id: `antigone-${subject.id}`,
      theme: subject.theme,
      title: subject.titre_sujet,
      prompt: subject['énoncé_type_examen'],
      plan: subject.type_de_plan,
      outline: subject['plan_détaillé'],
      vocabulary: subject.vocabulaire_et_connecteurs_conseillés,
    })),
  },
  {
    id: 'dernier-jour',
    title: "Le Dernier Jour d'un condamné",
    author: 'Victor Hugo',
    subjects: dernierJourData.sujets.map((subject) => ({
      id: subject.id,
      theme: subject.theme,
      title: subject.theme,
      prompt: subject.enonce,
      plan: subject.plan_recommande,
      outline: subject.structure_detaillee,
      vocabulary:
        subject.vocabulaire_et_connecteurs ??
        subject.vocabulaire_utile ??
        [],
    })),
  },
];
