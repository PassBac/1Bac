import React, { useState } from 'react';
import { QuizChapterBank, LexiqueData, UserStudyProgress, ChapterDossier } from '../../types';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  HelpCircle,
  Sparkles,
  BookOpen,
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  Layers,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  Award
} from 'lucide-react';

interface ChaptersOverviewViewProps {
  quizBanks: QuizChapterBank[];
  lexiqueData: LexiqueData;
  progress: UserStudyProgress;
  onOpenQuiz: (chapterIndex: number) => void;
  onToggleChapter: (chapterId: string) => void;
  onOpenFlashcards: () => void;
  chaptersSyllabus?: ChapterDossier[];
  unitLabel?: string;
  unitLabelSingular?: string;
  unitCompletedAdjective?: 'étudié' | 'étudiée';
  completedHeading?: string;
  unitShortLabel?: string;
  unitHeading?: string;
}

export const ChaptersOverviewView: React.FC<ChaptersOverviewViewProps> = ({
  quizBanks,
  lexiqueData,
  progress,
  onOpenQuiz,
  onToggleChapter,
  onOpenFlashcards,
  chaptersSyllabus: providedChaptersSyllabus,
  unitLabel = 'chapitres',
  unitLabelSingular = 'Chapitre',
  unitCompletedAdjective = 'étudié',
  completedHeading,
  unitShortLabel = 'Chap',
  unitHeading = "Dossiers d'Étude Chapitre par Chapitre",
}) => {
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(
    providedChaptersSyllabus?.[0]?.id ?? 'chapitre-1'
  );

  // Comprehensive professional syllabus data according to Moroccan Regional Exam reference framework
  const boiteChaptersSyllabus: ChapterDossier[] = [
    {
      id: 'chapitre-1',
      number: 1,
      season: 'Hiver',
      spatialFrame: 'Dar Chouafa & Le Bain Maure',
      title: 'La Solitude, Dar Chouafa, le Bain Maure et la Querelle de lessive',
      narrativeArc:
        'Incipit marquant sur la solitude nocturne de l\'enfant. Présentation de Dar Chouafa et de ses locataires. Visite étouffante au bain maure avec la mère (enfer dantesque). Querelle violente entre Lalla Zoubida et Rahma le lendemain pour l\'usage de la terrasse.',
      regionalExamKeys: [
        'Situation du passage : Incipit du roman, présentation du narrateur et du cadre spatial.',
        'Thèmes dominants : La solitude existentielle, la promiscuité sociale, l\'univers des femmes.',
        'Figures de style types : Comparaison ("seul comme un petit moineau"), métaphore, hyperbole lors de la dispute.',
        'La Boîte à merveilles : Premier refuge contre la solitude, monde féerique opposé au réel.'
      ],
      themes: ['Solitude de l\'enfant', 'Dar Chouafa', 'Bain maure', 'Querelle des lessives', 'Objets-talismans'],
      keyCharacters: [
        { name: 'Sidi Mohammed', role: 'Narrateur (6 ans)' },
        { name: 'Lalla Zoubida', role: 'Mère du narrateur' },
        { name: 'Lalla Kenza', role: 'La Chouafa (rez-de-chaussée)' },
        { name: 'Rahma & Driss', role: 'Voisins du 2e étage' },
        { name: 'Fatma Bziouya', role: 'Voisine du 1er étage' }
      ],
      examQuestionsHint: 'Très fréquent au régional : Situer le passage de l\'incipit ou analyser la tonalité polémique de la dispute.'
    },
    {
      id: 'chapitre-2',
      number: 2,
      season: 'Hiver',
      spatialFrame: 'Le Msid & Le Sanctuaire Sidi Ali Boughaleb',
      title: 'Le Msid, le Mardi Funeste et la Visite au Sanctuaire',
      narrativeArc:
        'L\'angoisse du mardi au Msid sous l\'œil sévère du Fqih armé de sa baguette de cognassier. Lalla Zoubida trouve son fils fiévreux et pâle. Accompagnée de son amie intime Lalla Aïcha, elle emmène Sidi Mohammed au mausolée de Sidi Ali Boughaleb. Sidi Mohammed est griffé par un chat.',
      regionalExamKeys: [
        'Situation du passage : Lendemain de la fièvre, visite maraboutique pour guérir le narrateur.',
        'Thèmes dominants : L\'angoisse scolaire traditionnelle, les croyances populaires (maraboutisme, baraka).',
        'Figures de style types : Hyperbole de la peur du fqih, personnification du sanctuaire et des chats sacrés.',
        'Rôle de Lalla Aïcha : Apparition de la confidente fidèle de la mère.'
      ],
      themes: ['Le Msid', 'Le Fqih', 'Baguette de cognassier', 'Maraboutisme', 'Le chat griffon'],
      keyCharacters: [
        { name: 'Le Fqih', role: 'Maître d\'école coranique' },
        { name: 'Lalla Aïcha', role: 'Amie fidèle et confidente' },
        { name: 'Sidi Ali Boughaleb', role: 'Saint patron protecteur' },
        { name: 'Lalla Zoubida', role: 'Mère protectrice et croyante' }
      ],
      examQuestionsHint: 'Sujet classique : L\'opposition entre l\'enfermement du Msid et la liberté imaginaire de l\'enfant.'
    },
    {
      id: 'chapitre-3',
      number: 3,
      season: 'Hiver',
      spatialFrame: 'Dar Chouafa & Dar Kitoun',
      title: 'La Lampe à Pétrole, la Disparition de Zineb et la Sadaqa',
      narrativeArc:
        'Fatma Bziouya s\'équipe d\'une lampe à pétrole qui suscite l\'admiration jalouse de Lalla Zoubida. Maâlem Abdeslam achète lui aussi une lampe identique le soir même. Peu après, panique collective : Zineb se perd dans la foule d\'un baptême. Retrouvée au sanctuaire des aveugles (Dar Kitoun), sa mère Rahma organise un grand repas de charité (sadaqa) pour les mendiants.',
      regionalExamKeys: [
        'Situation du passage : Disparition tragique de Zineb et réconciliation solidaire des voisins.',
        'Thèmes dominants : La solidarité communautaire traditionnelle, l\'émulation matérielle, la charité.',
        'Larmes de Sidi Mohammed : Il pleure non par amour pour Zineb, mais par contagion émotionnelle et faim.',
        'Portée morale : Le malheur efface la rancune entre Zoubida et Rahma.'
      ],
      themes: ['Lampe à pétrole', 'Disparition de Zineb', 'Solidarité fassie', 'Repas d\'aumône (Sadaqa)', 'Dar Kitoun'],
      keyCharacters: [
        { name: 'Rahma', role: 'Mère éplorée de Zineb' },
        { name: 'Zineb', role: 'Enfant égarée puis retrouvée' },
        { name: 'Fatma Bziouya', role: 'Initiatrice de la modernité (lampe)' },
        { name: 'Maâlem Abdeslam', role: 'Père généreux et digne' }
      ],
      examQuestionsHint: 'Question d\'examen : Pourquoi Sidi Mohammed pleure-t-il lors de la disparition de Zineb ?'
    },
    {
      id: 'chapitre-4',
      number: 4,
      season: 'Printemps',
      spatialFrame: 'Quartier Hajjama & Foyer familial',
      title: 'Le Printemps, les Malheurs de Moulay Larbi et Abdallah l\'Épicier',
      narrativeArc:
        'Arrivée du printemps dans la médina. Visite matinale de Lalla Zoubida et de son fils chez Lalla Aïcha au quartier Hajjama. Lalla Aïcha s\'effondre en larmes et confie la trahison de son époux Moulay Larbi, spolié par son ouvrier Abdelkader lors d\'un procès inique. Le soir, le père raconte l\'histoire fascinante d\'Abdallah l\'épicier et ses contes.',
      regionalExamKeys: [
        'Situation du passage : Début des saisons chaudes, premier grand drame social touchant les proches.',
        'Thèmes dominants : La trahison commerciale, l\'amitié féminine sincère, la tradition orale des contes.',
        'Récit enchâssé : L\'histoire d\'Abdallah l\'épicier, poète et philosophe incompris.',
        'Procédé narratif : La double énonciation et le portrait moral des personnages.'
      ],
      themes: ['Arrivée du Printemps', 'Trahison d\'Abdelkader', 'Ruine de Moulay Larbi', 'Abdallah l\'épicier', 'Contes oraux'],
      keyCharacters: [
        { name: 'Lalla Aïcha', role: 'Épouse dévouée et éprouvée' },
        { name: 'Moulay Larbi', role: 'Babouchier victime d\'injustice' },
        { name: 'Abdelkader', role: 'Associé perfide et ingrat' },
        { name: 'Abdallah l\'Épicier', role: 'Conteur mystique de la médina' }
      ],
      examQuestionsHint: 'Sujet récurrent : L\'injustice subie par Moulay Larbi et la réaction solidaire de son épouse.'
    },
    {
      id: 'chapitre-5',
      number: 5,
      season: 'Printemps',
      spatialFrame: 'Dar Chouafa & le quartier',
      title: 'La mort du coiffeur, le dévouement de Lalla Aïcha et la fièvre de l’enfant',
      narrativeArc:
        'La mort de Sidi Mohamed ben Tahar et le passage du cortège funèbre bouleversent Sidi Mohammed, qui découvre avec effroi la réalité de la mort. En parallèle, Lalla Aïcha vend ses bijoux pour aider Moulay Larbi à reprendre son activité après sa ruine. Marqué par ces événements, l’enfant tombe malade et fait une forte fièvre ; sa Boîte à merveilles perd alors son pouvoir rassurant et prend une apparence funèbre.',
      regionalExamKeys: [
        'Situation du passage : Annonce de la mort de Sidi Mohamed ben Tahar et réaction de l’enfant au cortège funèbre.',
        'Personnages en action : Sidi Mohammed, Lalla Zoubida, Maâlem Abdeslam, Lalla Aïcha, Moulay Larbi et Sidi Mohamed ben Tahar.',
        'Thèmes dominants : La mort, la peur enfantine, la maladie, l’amitié et le dévouement conjugal.',
        'Symbole : Les objets de la Boîte à merveilles reflètent l’état psychologique de l’enfant et deviennent comme de petits cercueils.'
      ],
      themes: ['La mort et le deuil', 'La peur de l’enfant', 'La fièvre', 'Le dévouement de Lalla Aïcha', 'La Boîte à merveilles'],
      keyCharacters: [
        { name: 'Sidi Mohammed ben Tahar', role: 'Coiffeur du quartier dont la mort bouleverse l’enfant' },
        { name: 'Sidi Mohammed', role: 'Enfant sensible, saisi par la peur puis atteint de fièvre' },
        { name: 'Lalla Aïcha', role: 'Épouse dévouée qui vend ses biens pour aider son mari' },
        { name: 'Moulay Larbi', role: 'Babouchier ruiné qui tente de reprendre son activité' },
        { name: 'Lalla Zoubida & Maâlem Abdeslam', role: 'Parents qui parlent du drame et soutiennent leur entourage' }
      ],
      examQuestionsHint: 'À l’examen : situer l’épisode du cortège funèbre, expliquer la peur de la mort et analyser la transformation symbolique de la boîte.'
    },
    {
      id: 'chapitre-6',
      number: 6,
      season: 'Printemps',
      spatialFrame: 'Le Msid, la Kissaria & Dar Chouafa',
      title: 'Les préparatifs de l’Achoura au Msid, la Kissaria et l’histoire d’Oncle Othman',
      narrativeArc:
        'À l’approche de l’Achoura, les élèves nettoient et blanchissent le Msid ; le Fqih nomme Sidi Mohammed chef des balayeurs, ce qui le rend très fier. Lalla Zoubida emmène ensuite son fils à la Kissaria pour acheter ses habits de fête, mais la foule et les achats fatiguent l’enfant et provoquent une dispute au sujet des babouches. À Dar Chouafa, Rahma divertit les voisines en racontant l’histoire d’Oncle Othman et de sa jeune épouse Lalla Khadija.',
      regionalExamKeys: [
        'Situation du passage : Préparatifs collectifs de l’Achoura au Msid ou sortie de Lalla Zoubida et de son fils à la Kissaria.',
        'Personnages en action : Sidi Mohammed, le Fqih, Lalla Zoubida, Rahma, Oncle Othman et Lalla Khadija.',
        'Thèmes dominants : Les traditions de l’Achoura, la vie collective, la fierté enfantine et les récits oraux.',
        'Récit enchâssé : Rahma raconte aux femmes l’histoire d’Oncle Othman et de Lalla Khadija.'
      ],
      themes: ['Les préparatifs de l’Achoura', 'Le Msid', 'La Kissaria', 'Les habits neufs', 'Le récit oral d’Oncle Othman'],
      keyCharacters: [
        { name: 'Sidi Mohammed', role: 'Chef des balayeurs au Msid, puis enfant fatigué par les achats' },
        { name: 'Le Fqih', role: 'Maître qui confie à l’enfant la responsabilité des balayeurs' },
        { name: 'Lalla Zoubida', role: 'Mère qui accompagne son fils à la Kissaria' },
        { name: 'Rahma', role: 'Voisine qui raconte l’histoire d’Oncle Othman' },
        { name: 'Oncle Othman & Lalla Khadija', role: 'Couple au centre du récit raconté par Rahma' }
      ],
      examQuestionsHint: 'À l’examen : situer les préparatifs de la fête ou la visite à la Kissaria, puis distinguer le récit principal du récit enchâssé de Rahma.'
    },
    {
      id: 'chapitre-7',
      number: 7,
      season: 'Printemps',
      spatialFrame: 'Le Msid & Dar Chouafa',
      title: 'La fête de l’Achoura, la cérémonie au Msid et les cadeaux',
      narrativeArc:
        'Le jour de l’Achoura, Sidi Mohammed se lève à l’aube et revêt ses habits neufs avant de rejoindre le Msid illuminé de bougies. Le Fqih, habituellement sévère, se montre bienveillant pendant la cérémonie. De retour chez lui, l’enfant reçoit un tambourin de son père ; les femmes de Dar Chouafa célèbrent la fête en chantant et en jouant, tandis que Lalla Aïcha rend visite à Lalla Zoubida. Après cette journée d’effervescence, le calme et la routine reprennent.',
      regionalExamKeys: [
        'Situation du passage : Matin de l’Achoura au Msid, remise des cadeaux à la maison ou célébrations des femmes à Dar Chouafa.',
        'Personnages en action : Sidi Mohammed, le Fqih, Maâlem Abdeslam, Lalla Zoubida, Lalla Aïcha et les femmes de Dar Chouafa.',
        'Thèmes dominants : La fête religieuse, les traditions populaires, la joie enfantine et le partage communautaire.',
        'Évolution du regard de l’enfant : Pour la fête, le Fqih se montre souriant et indulgent, à l’opposé de sa sévérité habituelle.'
      ],
      themes: ['L’Achoura', 'La cérémonie au Msid', 'Les habits neufs', 'Le tambourin', 'La joie collective'],
      keyCharacters: [
        { name: 'Sidi Mohammed', role: 'Enfant qui participe à la cérémonie et reçoit un tambourin' },
        { name: 'Le Fqih', role: 'Maître exceptionnellement souriant et bienveillant' },
        { name: 'Maâlem Abdeslam', role: 'Père qui offre un tambourin à son fils' },
        { name: 'Lalla Zoubida', role: 'Mère qui prépare son fils pour la fête' },
        { name: 'Lalla Aïcha', role: 'Amie qui rend visite à Lalla Zoubida' }
      ],
      examQuestionsHint: 'À l’examen : situer la cérémonie de l’Achoura, expliquer le changement d’attitude du Fqih et relever les signes de la joie collective.'
    },
    {
      id: 'chapitre-8',
      number: 8,
      season: 'Été',
      spatialFrame: 'Le Msid, le souk des bijoutiers & le quartier Hajjama',
      title: 'L’été au Msid, le souk des bijoutiers et le second mariage de Moulay Larbi',
      narrativeArc:
        'Avec les fortes chaleurs, le Msid est transféré dans un sanctuaire plus frais près du tombeau de Sidi El Tazi, et Sidi Mohammed progresse dans ses récitations. Maâlem Abdeslam emmène sa famille au souk des bijoutiers pour acheter des bracelets à Lalla Zoubida ; une altercation éclate avec le courtier, et la mère finit par refuser les bijoux, qu’elle associe au mauvais sort. Lalla Aïcha apprend ensuite que Moulay Larbi a épousé la fille du coiffeur Si Abderrahmane, malgré les sacrifices qu’elle a consentis pour lui.',
      regionalExamKeys: [
        'Situation du passage : Transfert estival du Msid, altercation au souk des bijoutiers ou annonce du second mariage à Lalla Aïcha.',
        'Personnages en action : Sidi Mohammed, Maâlem Abdeslam, Lalla Zoubida, le courtier (dellal), Lalla Aïcha et Moulay Larbi.',
        'Thèmes dominants : La chaleur et le changement de cadre, les croyances populaires, la polygamie et l’ingratitude.',
        'Symbole : Les bracelets refusés par Lalla Zoubida deviennent des bijoux de mauvais augure et annoncent les épreuves à venir.'
      ],
      themes: ['L’été au Msid', 'Le souk des bijoutiers', 'Les bracelets d’argent', 'La polygamie', 'L’ingratitude'],
      keyCharacters: [
        { name: 'Sidi Mohammed', role: 'Élève qui progresse au Msid et accompagne ses parents au souk' },
        { name: 'Maâlem Abdeslam', role: 'Père qui achète des bracelets à son épouse' },
        { name: 'Lalla Zoubida', role: 'Mère qui refuse finalement les bijoux, les croyant de mauvais augure' },
        { name: 'Lalla Aïcha', role: 'Première épouse bouleversée par le second mariage' },
        { name: 'Moulay Larbi & la fille de Si Abderrahmane', role: 'Époux et jeune seconde épouse au cœur du conflit' }
      ],
      examQuestionsHint: 'À l’examen : situer la scène de la dispute au souk ou l’annonce du mariage, puis analyser les présages associés aux bracelets et la souffrance de Lalla Aïcha.'
    },
    {
      id: 'chapitre-9',
      number: 9,
      season: 'Été',
      spatialFrame: 'Le souk des haïks & Dar Chouafa',
      title: 'La perte du capital, le départ du père et la détresse familiale',
      narrativeArc:
        'Maâlem Abdeslam annonce qu’il a perdu tout son capital dans la foule du souk des haïks. Pour subvenir aux besoins de sa famille, il décide de partir travailler comme moissonneur dans la campagne. Son départ plonge Lalla Zoubida et Sidi Mohammed dans le chagrin ; la mère vend les bracelets d’argent pour faire face aux dépenses. Lalla Aïcha vient réconforter son amie et lui propose d’aller consulter Sidi El Arafi.',
      regionalExamKeys: [
        'Situation du passage : Annonce de la perte du capital, décision du père de partir aux moissons ou scène d’adieux à Dar Chouafa.',
        'Personnages en action : Maâlem Abdeslam, Lalla Zoubida, Sidi Mohammed et Lalla Aïcha.',
        'Thèmes dominants : La pauvreté, la dignité du père, la séparation, la solitude de l’enfant et la solidarité féminine.',
        'Symbole : Les bracelets d’argent, vendus pour nourrir la famille, sont associés au malheur ; la boîte reflète la détresse de l’enfant.'
      ],
      themes: ['La perte du capital', 'Le départ aux moissons', 'La pauvreté', 'La séparation', 'La solidarité féminine'],
      keyCharacters: [
        { name: 'Maâlem Abdeslam', role: 'Tisserand qui perd son capital et part travailler aux moissons' },
        { name: 'Lalla Zoubida', role: 'Mère qui vend ses bracelets pour subvenir aux besoins du foyer' },
        { name: 'Sidi Mohammed', role: 'Enfant accablé par l’absence de son père et la crise familiale' },
        { name: 'Lalla Aïcha', role: 'Amie qui soutient Lalla Zoubida et propose la visite à Sidi El Arafi' }
      ],
      examQuestionsHint: 'À l’examen : situer l’annonce de la perte ou le départ du père, et expliquer comment la crise transforme l’atmosphère de la maison et le regard de l’enfant.'
    },
    {
      id: 'chapitre-10',
      number: 10,
      season: 'Été',
      spatialFrame: 'La demeure de Sidi El Arafi & Dar Chouafa',
      title: 'Le pèlerinage chez Sidi El Arafi, les prédictions et les nouvelles du père',
      narrativeArc:
        'Pour réconforter Lalla Zoubida après le départ de son mari, Lalla Aïcha l’accompagne avec Sidi Mohammed chez Sidi El Arafi, le voyant aveugle. Accueillies dans une atmosphère paisible, les visiteuses entendent des prédictions rassurantes au sujet de leurs époux ; le voyant remet à l’enfant un petit talisman. À leur retour, un messager apporte des nouvelles de Maâlem Abdeslam et de l’argent, confirmant une partie des paroles du voyant.',
      regionalExamKeys: [
        'Situation du passage : Arrivée chez Sidi El Arafi, consultation et prédictions, ou retour du messager envoyé par le père.',
        'Personnages en action : Sidi El Arafi, Lalla Zoubida, Lalla Aïcha, Sidi Mohammed et le messager de Maâlem Abdeslam.',
        'Thèmes dominants : Le recours aux croyances populaires, l’espoir dans l’épreuve et le réconfort apporté par l’amitié.',
        'Symbole : L’aveuglement physique de Sidi El Arafi contraste avec sa « vision intérieure » ; le talisman matérialise la bénédiction et l’espoir.'
      ],
      themes: ['Le pèlerinage', 'Sidi El Arafi', 'Les prédictions', 'Le talisman', 'L’espoir et le réconfort'],
      keyCharacters: [
        { name: 'Sidi El Arafi', role: 'Voyant aveugle qui accueille les visiteuses et les rassure' },
        { name: 'Lalla Zoubida', role: 'Mère inquiète qui cherche du réconfort au sujet de son mari' },
        { name: 'Lalla Aïcha', role: 'Amie fidèle qui accompagne Zoubida' },
        { name: 'Sidi Mohammed', role: 'Enfant apaisé par la visite et destinataire d’un talisman' },
        { name: 'Le messager', role: 'Porte des nouvelles et de l’argent envoyés par le père' }
      ],
      examQuestionsHint: 'À l’examen : situer la consultation ou l’arrivée du messager, puis analyser le contraste entre la cécité du voyant et son rôle d’espoir.'
    },
    {
      id: 'chapitre-11',
      number: 11,
      season: 'Été',
      spatialFrame: 'La maison de Lalla Aïcha',
      title: 'Les bavardages chez Lalla Aïcha, la marieuse Salama et le désastre du second mariage',
      narrativeArc:
        'Lors d’une visite chez Lalla Aïcha, Lalla Zoubida et Sidi Mohammed rencontrent Salama, la marieuse qui avait arrangé le second mariage de Moulay Larbi. Salama présente ses excuses et raconte l’échec de cette union, marqué par les disputes du jeune couple et les interventions de la belle-mère. La voisine Zhor apporte d’autres détails ; Moulay Larbi a décidé de divorcer de sa seconde épouse, ce qui laisse espérer son retour auprès de Lalla Aïcha. Pendant ces échanges, Sidi Mohammed s’ennuie et reste à l’écart des conversations d’adultes.',
      regionalExamKeys: [
        'Situation du passage : Réunion chez Lalla Aïcha, arrivée de Salama et récit des difficultés du second mariage.',
        'Personnages en action : Lalla Aïcha, Lalla Zoubida, Sidi Mohammed, Salama, Zhor, Moulay Larbi et sa seconde épouse.',
        'Thèmes dominants : La polygamie, les mariages arrangés, les conflits familiaux et la condition des femmes.',
        'Fonction de Salama : D’abord impliquée dans le mariage douloureux, elle devient porteuse de la nouvelle du divorce et d’un espoir de réconciliation.'
      ],
      themes: ['Les conversations de femmes', 'Salama la marieuse', 'La polygamie', 'Le divorce', 'L’ennui de l’enfant'],
      keyCharacters: [
        { name: 'Lalla Aïcha', role: 'Première épouse qui écoute le récit de l’échec du second mariage' },
        { name: 'Salama', role: 'Marieuse venue présenter ses excuses et annoncer le divorce' },
        { name: 'Zhor', role: 'Voisine qui complète le récit des disputes' },
        { name: 'Moulay Larbi', role: 'Mari qui décide de divorcer de sa seconde épouse' },
        { name: 'Sidi Mohammed', role: 'Enfant ennuyé et exclu des conversations des adultes' }
      ],
      examQuestionsHint: 'À l’examen : situer la réunion chez Lalla Aïcha, caractériser le rôle de Salama ou expliquer le regard distant de l’enfant sur les bavardages adultes.'
    },
    {
      id: 'chapitre-12',
      number: 12,
      season: 'Été',
      spatialFrame: 'Dar Chouafa',
      title: 'Le retour du père, la joie à Dar Chouafa et la réouverture de la Boîte à merveilles',
      narrativeArc:
        'Après un mois de travail aux moissons, Maâlem Abdeslam revient à Dar Chouafa avec de l’argent et des provisions. Les voisines accueillent la famille avec joie ; Lalla Zoubida raconte à son mari les épreuves traversées et la vente de ses bracelets. Driss El Aouad vient rendre visite au père et apporte des nouvelles de Moulay Larbi, dont la situation conjugale s’est dénouée. À l’écart des conversations d’adultes, Sidi Mohammed rouvre sa Boîte à merveilles et retrouve ses trésors, dans un dénouement heureux mais empreint de nostalgie.',
      regionalExamKeys: [
        'Situation du passage : Retour de Maâlem Abdeslam, accueil des voisines, visite de Driss El Aouad ou scène finale de la boîte.',
        'Personnages en action : Maâlem Abdeslam, Lalla Zoubida, Sidi Mohammed, Driss El Aouad et les voisines de Dar Chouafa.',
        'Dénouement : Le retour du père apaise la crise matérielle, mais ne fait pas disparaître entièrement la solitude de l’enfant.',
        'Symbole et tonalité : La réouverture de la boîte rétablit le lien avec l’imaginaire ; le récit se clôt sur une tonalité apaisée et nostalgique.'
      ],
      themes: ['Le retour du père', 'La solidarité du voisinage', 'L’apaisement', 'La solitude de l’enfant', 'La Boîte à merveilles'],
      keyCharacters: [
        { name: 'Maâlem Abdeslam', role: 'Père qui revient des moissons avec argent et provisions' },
        { name: 'Lalla Zoubida', role: 'Mère qui retrouve son mari et lui raconte les épreuves vécues' },
        { name: 'Sidi Mohammed', role: 'Enfant qui se retire et rouvre sa boîte à la fin du récit' },
        { name: 'Driss El Aouad', role: 'Voisin qui rend visite au père et apporte des nouvelles' },
        { name: 'Les voisines de Dar Chouafa', role: 'Communauté qui partage la joie du retour' }
      ],
      examQuestionsHint: 'À l’examen : situer le retour du père ou la scène finale, analyser la personnification des objets et expliquer pourquoi la solitude de l’enfant demeure.'
    },
  ];

  const chaptersSyllabus = providedChaptersSyllabus?.length
    ? providedChaptersSyllabus
    : boiteChaptersSyllabus;
  const availableSeasons = Array.from(
    new Set(chaptersSyllabus.map((chapter) => chapter.season).filter(Boolean))
  );

  const filteredChapters = chaptersSyllabus.filter((c) => {
    if (selectedSeason !== 'all' && c.season !== selectedSeason) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchNarrative = c.narrativeArc.toLowerCase().includes(q);
      const matchThemes = c.themes.some((t) => t.toLowerCase().includes(q));
      const matchChars = c.keyCharacters.some((ch) => ch.name.toLowerCase().includes(q));
      if (!matchTitle && !matchNarrative && !matchThemes && !matchChars) return false;
    }
    return true;
  });

  const completedCount = chaptersSyllabus.filter((chapter) =>
    progress.completedChapters.includes(chapter.id)
  ).length;
  const totalChapterCount = chaptersSyllabus.length;
  const progressPct = totalChapterCount
    ? Math.round((completedCount / totalChapterCount) * 100)
    : 0;
  const progressLabel = completedHeading || `${unitLabel[0].toLocaleUpperCase()}${unitLabel.slice(1)} étudiés`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Academic Syllabus Header */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-800 dark:bg-amber-500" />
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-400 uppercase tracking-wider font-mono">
              Programme Officiel · 1ère Année du Baccalauréat
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            {unitHeading}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
            Consultez le fil conducteur, les repères d’analyse et les enjeux de chaque {unitLabelSingular.toLocaleLowerCase()} pour préparer l’épreuve régionale.
          </p>
        </div>

        {/* Academic Progress Summary Box */}
        <div className="bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-2xl p-5 shrink-0 min-w-[260px] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 dark:text-stone-300">{progressLabel} :</span>
            <span className="font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
              {completedCount} / {totalChapterCount} ({progressPct}%)
            </span>
          </div>

          <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-800 dark:bg-amber-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-0.5">
            <span>État d'avancement du programme</span>
            {completedCount === totalChapterCount ? (
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tous étudiés</span>
              </span>
            ) : (
              <span className="text-amber-800 dark:text-amber-400 font-medium">
                {totalChapterCount - completedCount} restant{totalChapterCount - completedCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-100/70 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-3.5 transition-colors duration-200">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedSeason('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              selectedSeason === 'all'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Toutes les {unitLabel} ({chaptersSyllabus.length})
          </button>
          {availableSeasons.map((season) => (
            <button
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                selectedSeason === season
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Saison {season}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par thème, événement ou personnage..."
            className="w-full sm:w-72 px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
          />
        </div>
      </div>

      {/* Chapters Syllabus List */}
      <div className="space-y-6">
        {filteredChapters.map((chap) => {
          const isCompleted = progress.completedChapters.includes(chap.id);
          const isExpanded = expandedChapterId === chap.id;
          const quizBankIndex = quizBanks.findIndex((quizBank) => quizBank.chapterId === chap.id);
          const bank = quizBanks[quizBankIndex];
          const quizRecord = progress.quizScores[`quiz-${chap.id}`];
          const chapterWords = lexiqueData.entries.filter((e) => e.chapterId === chap.id);

          return (
            <article
              key={chap.id}
              className={`bg-white dark:bg-stone-900 rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs ${
                isCompleted
                  ? 'border-emerald-300/80 dark:border-emerald-800/80 bg-emerald-50/10 dark:bg-emerald-950/20'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              {/* Chapter Card Header Header */}
              <div className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-start sm:items-center gap-4">
                  {/* Distinctive Chapter Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-stone-900 dark:bg-stone-800 text-amber-50 dark:text-amber-300 border dark:border-stone-700 flex flex-col items-center justify-center font-serif shrink-0 shadow-xs">
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">{unitShortLabel}</span>
                    <span className="text-lg font-bold leading-none">{chap.number}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono text-amber-900 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded">
                        {chap.season ? `Saison : ${chap.season}` : chap.seasonLabel}
                      </span>
                      <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                        <span>{chap.spatialFrame}</span>
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-100">
                      {chap.title}
                    </h3>
                  </div>
                </div>

                {/* Top Actions: Toggle Mastery & Accordion */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => onToggleChapter(chap.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        <span>{unitLabelSingular} {unitCompletedAdjective}</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-stone-400 dark:text-stone-500" />
                        <span>Marquer comme {unitCompletedAdjective}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setExpandedChapterId(isExpanded ? null : chap.id)}
                    className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
                    title={isExpanded ? 'Réduire' : 'Déplier les détails'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Chapter Card Body */}
              <div className="p-6 sm:p-7 space-y-6">
                {/* 1. Résumé Analytique */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                    <span>Fil conducteur des événements (Incontournables) :</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700/80 font-sans">
                    {chap.narrativeArc}
                  </p>
                </div>

                {/* 2. Expanded Study Section */}
                {isExpanded && (
                  <div className="space-y-6 pt-2 border-t border-stone-100 dark:border-stone-800 animate-in fade-in duration-200">
                    {/* Points clés pour l'examen régional */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                        <Award className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                        <span>Enjeux & Questions Types à l'Examen Régional :</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {chap.regionalExamKeys.map((keyPoint, kIdx) => (
                          <div
                            key={kIdx}
                            className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs text-stone-800 dark:text-stone-200 space-y-1"
                          >
                            <span className="font-bold text-amber-950 dark:text-amber-300 block">Point #{kIdx + 1} :</span>
                            <span className="leading-relaxed">{keyPoint}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key characters in this chapter */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                        <Users className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                        <span>Personnages en action dans cette {unitLabelSingular.toLocaleLowerCase()} :</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {chap.keyCharacters.map((char, cIdx) => (
                          <div
                            key={cIdx}
                            className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 shadow-2xs"
                          >
                            <span className="font-semibold text-stone-900 dark:text-stone-100">{char.name}</span>
                            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-serif italic">({char.role})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vocabulary and Themes */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-stone-500 dark:text-stone-400 font-medium">Thèmes d'étude :</span>
                        {chap.themes.map((th, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2.5 py-0.5 rounded-md text-[11px] font-medium"
                          >
                            {th}
                          </span>
                        ))}
                      </div>

                      {chapterWords.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-400">
                          <span className="text-stone-400 dark:text-stone-500">Lexique :</span>
                          {chapterWords.map((w) => (
                            <span key={w.id} className="font-serif italic font-medium">
                              « {w.word} »
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Chapter Bottom Bar: Evaluation & Quiz Button */}
                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    {quizRecord ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>
                          Dernier score au quiz officiel :{' '}
                          <strong className="text-stone-900 dark:text-stone-100 font-mono">
                            {quizRecord.score} / {quizRecord.total} ({Math.round((quizRecord.score / quizRecord.total) * 100)}%)
                          </strong>
                        </span>
                      </span>
                    ) : (
                      <span className="text-stone-500 dark:text-stone-400">
                        Évaluation : {bank?.questions.length ?? 0} questions types baccalauréat (QCM, Vrai/Faux, analyse)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenQuiz(quizBankIndex)}
                      disabled={quizBankIndex < 0}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      <span>Passer le Quiz officiel · {unitLabelSingular} {chap.number} ({bank?.questions.length ?? 0} Q)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
