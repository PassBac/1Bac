import React, { useState, useMemo, useRef } from 'react';
import { PersonnagesData, SyntheseData, PersonnageItem, KnowledgeItem, NovelId } from '../../types';
import {
  Users,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Sparkles,
  MapPin,
  X,
  Search,
  Eye,
  CheckCircle2,
  GitBranch,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

interface MindMapViewProps {
  personnagesData: PersonnagesData;
  syntheseData: SyntheseData;
  novelId: NovelId;
  novelTitle: string;
  novelAuthor: string;
  novelPublishYear: number;
}

export const MindMapView: React.FC<MindMapViewProps> = ({
  personnagesData,
  syntheseData,
  novelId,
  novelTitle,
  novelAuthor,
  novelPublishYear,
}) => {
  const [treeType, setTreeType] = useState<'personnages' | 'synthese'>('personnages');
  const [collapsedBranches, setCollapsedBranches] = useState<Record<string, boolean>>({});
  const [selectedPersonnage, setSelectedPersonnage] = useState<PersonnageItem | null>(null);
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeItem | null>(null);
  const [search, setSearch] = useState<string>('');
  const inspectorRef = useRef<HTMLDivElement>(null);

  const revealInspector = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      window.requestAnimationFrame(() => {
        inspectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  // Branch theme colors for rich visual distinction of tree limbs in both light and dark
  const branchColorPalette = [
    {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-300 dark:border-amber-800/60',
      accent: 'bg-amber-800 dark:bg-amber-600',
      text: 'text-amber-900 dark:text-amber-200',
      badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200',
    },
    {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-300 dark:border-emerald-800/60',
      accent: 'bg-emerald-800 dark:bg-emerald-600',
      text: 'text-emerald-950 dark:text-emerald-200',
      badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200',
    },
    {
      bg: 'bg-sky-50 dark:bg-sky-950/30',
      border: 'border-sky-300 dark:border-sky-800/60',
      accent: 'bg-sky-800 dark:bg-sky-600',
      text: 'text-sky-950 dark:text-sky-200',
      badge: 'bg-sky-100 dark:bg-sky-900/60 text-sky-900 dark:text-sky-200',
    },
    {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      border: 'border-indigo-300 dark:border-indigo-800/60',
      accent: 'bg-indigo-800 dark:bg-indigo-600',
      text: 'text-indigo-950 dark:text-indigo-200',
      badge: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200',
    },
    {
      bg: 'bg-stone-100/80 dark:bg-stone-800/40',
      border: 'border-stone-300 dark:border-stone-700',
      accent: 'bg-stone-800 dark:bg-stone-700',
      text: 'text-stone-900 dark:text-stone-200',
      badge: 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200',
    },
  ];

  const toggleBranch = (branchId: string) => {
    setCollapsedBranches((prev) => ({
      ...prev,
      [branchId]: !prev[branchId],
    }));
  };

  const expandAll = () => setCollapsedBranches({});
  const collapseAll = () => {
    if (treeType === 'personnages') {
      const all: Record<string, boolean> = {};
      personnagesData.categories.forEach((c) => (all[c.id] = true));
      setCollapsedBranches(all);
    } else {
      const all: Record<string, boolean> = {};
      const cats = Array.from(new Set(syntheseData.knowledgeItems.map((k) => k.category)));
      cats.forEach((c) => (all[c] = true));
      setCollapsedBranches(all);
    }
  };

  const syntheseCategories = useMemo(() => {
    return Array.from(new Set(syntheseData.knowledgeItems.map((k) => k.category)));
  }, [syntheseData]);

  // Exam hints for key characters
  const getExamRelevance = (charName: string) => {
    const q = charName.toLowerCase();
    if (novelId === 'dernier-jour') {
      if (q.includes('condamné à mort')) {
        return 'Analysez le monologue intérieur du narrateur, son angoisse face à l’exécution et la manière dont son témoignage dénonce la peine de mort.';
      }
      if (q.includes('marie')) {
        return 'Étudiez la visite où Marie ne reconnaît pas son père : cette scène montre les conséquences de la condamnation sur les proches et intensifie la douleur du condamné.';
      }
      if (q.includes('mère et l’épouse') || q.includes("mère et l'épouse")) {
        return 'Montrez comment la mère et l’épouse, évoquées comme victimes indirectes, illustrent le déshonneur et la souffrance que la condamnation fait peser sur la famille.';
      }
      if (q.includes('juges') || q.includes('magistrats') || q.includes('jurés')) {
        return 'Analysez le contraste entre la gravité du verdict et l’attitude routinière des juges et des jurés, qui renforce la critique de l’institution judiciaire.';
      }
      if (q.includes('avocat')) {
        return 'Relevez le décalage entre le rôle de défense de l’avocat et son attitude détachée au moment du verdict, qui accentue le sentiment d’abandon du condamné.';
      }
      if (q.includes('huissier')) {
        return 'Montrez comment la notification du rejet du pourvoi transforme la procédure judiciaire en annonce concrète de l’exécution imminente.';
      }
      if (q.includes('directeurs')) {
        return 'Étudiez la politesse administrative des directeurs face à la mort prochaine du prisonnier : ce contraste souligne la froideur de l’univers carcéral.';
      }
      if (q.includes('geôliers') || q.includes('gendarmes')) {
        return 'Comparez les attitudes des gardiens et des gendarmes pour montrer comment le récit dénonce l’indifférence et la déshumanisation en prison.';
      }
      if (q.includes('bourreau')) {
        return 'Analysez la routine technique du bourreau lors de la préparation à l’exécution : elle rend le supplice concret et dénonce la banalisation de la peine capitale.';
      }
      if (q.includes('aumônier') || q.includes('prêtre')) {
        return 'Montrez comment les paroles machinales de l’aumônier échouent à apaiser le condamné et soulignent son besoin d’une présence réellement humaine.';
      }
      if (q.includes('friauche')) {
        return 'Étudiez le récit du Friauche et l’échange de vêtements comme une illustration de l’engrenage de la misère, du crime et de la récidive.';
      }
      if (q.includes('forçats')) {
        return 'Analysez la scène du ferrage et les chants des forçats : le spectacle de leur dégradation révèle la violence du système pénal.';
      }
      if (q.includes('foule')) {
        return 'Montrez comment la foule transforme l’exécution en spectacle et participe à la dénonciation de la cruauté collective.';
      }
      return 'Reliez ce personnage à la situation du condamné et montrez comment son rôle contribue à la dénonciation de la peine de mort.';
    }

    if (q.includes('sidi mohammed')) {
      return 'Personnage central. Objet de toutes les questions sur la double énonciation (narrateur adulte vs enfant), la solitude, et la fonction salvatrice de la boîte à merveilles.';
    }
    if (q.includes('abdeslam')) {
      return 'Incarnation de la dignité ouvrière et de la piété. Sa ruine au souk des bijoutiers et son départ aux moissons constituent l\'élément perturbateur du roman.';
    }
    if (q.includes('zoubida')) {
      return 'Mère bavarde, fière de ses origines chérifiennes, sujette aux superstitions et aux visites maraboutiques. Protagoniste de la querelle des lessives.';
    }
    if (q.includes('aïcha')) {
      return 'Figure de l\'amie loyale et de l\'épouse sacrifiée. Elle vend tous ses bijoux pour racheter l\'atelier de son mari Moulay Larbi trahi par Abdelkader.';
    }
    if (q.includes('moulay larbi')) {
      return 'Symbole du drame social de la trahison commerciale et de la polygamie forcée qui brise la paix de son premier ménage.';
    }
    if (q.includes('kenza') || q.includes('chouafa')) {
      return 'Représente le monde ésotérique de la médina et les rituels de sorcellerie/Gnaoua qui ouvrent le roman au rez-de-chaussée de Dar Chouafa.';
    }
    if (q.includes('fqih')) {
      return 'Figure de l\'enseignement traditionnel autoritaire du Msid, associé à la baguette de cognassier et à la peur du mardi.';
    }
    return 'Personnage secondaire enrichissant la fresque sociale de la médina de Fès dans les années 1920.';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Controls Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-amber-800 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-400 uppercase tracking-wider font-mono">
              Carte Mentale Interactive · Structure en Arbre
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            {treeType === 'personnages'
              ? 'Arbre des Personnages & Réseau Relationnel'
              : 'Arbre des Thèmes & Synthèse des Connaissances'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
            Visualisez les ramifications de l'œuvre comme les branches d'un arbre. Dépliez les branches pour explorer les personnages et cliquez sur un nœud pour révéler son dossier d'examen.
          </p>
        </div>

        {/* Tree Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shrink-0">
          <button
            onClick={() => {
              setTreeType('personnages');
              setSelectedPersonnage(null);
              setSelectedKnowledge(null);
              setCollapsedBranches({});
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              treeType === 'personnages'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Users className="w-4 h-4 text-amber-800 dark:text-amber-400" />
            <span>Arbre des Personnages</span>
          </button>

          <button
            onClick={() => {
              setTreeType('synthese');
              setSelectedPersonnage(null);
              setSelectedKnowledge(null);
              setCollapsedBranches({});
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              treeType === 'synthese'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-800 dark:text-amber-400" />
            <span>Arbre des Thèmes</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Fold/Unfold & Style Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-100/70 dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors shadow-2xs"
          >
            Déplier toutes les branches
          </button>
          <button
            onClick={collapseAll}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors shadow-2xs"
          >
            Replier
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer dans les branches de l'arbre..."
            className="w-full sm:w-72 px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
          />
        </div>
      </div>

      {/* Main Interactive Tree Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Tree Anatomy Visualization */}
        <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-10 shadow-xs space-y-8 relative overflow-hidden transition-colors duration-200">
          {/* Subtle tree background rings watermark */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

          {/* 1. TRUNK / RACINE OF THE TREE */}
          <div className="relative">
            <div className="bg-stone-900 dark:bg-stone-950 text-white p-6 rounded-2xl max-w-lg shadow-md space-y-2 border border-stone-800 dark:border-stone-700">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                  🌳 Tronc Racine de l'Arbre
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  {novelAuthor} ({novelPublishYear})
                </span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-amber-50 dark:text-amber-100">
                {novelTitle}
              </h3>
              <p className="text-xs text-stone-300 dark:text-stone-300 leading-relaxed">
                {treeType === 'personnages'
                  ? `${personnagesData.genre} · ${personnagesData.cadre_spatial}`
                  : syntheseData.description}
              </p>
            </div>

            {/* Vertical trunk line descending to branches */}
            <div className="w-1.5 bg-amber-800/80 dark:bg-amber-600/80 h-10 ml-8" />
          </div>

          {/* 2. BRANCHES FOR PERSONNAGES */}
          {treeType === 'personnages' && (
            <div className="space-y-8 pl-4">
              {personnagesData.categories.map((cat, catIdx) => {
                const palette = branchColorPalette[catIdx % branchColorPalette.length];
                const isCollapsed = !!collapsedBranches[cat.id];
                const filteredChars = cat.personnages.filter((p) => {
                  if (!search.trim()) return true;
                  const q = search.toLowerCase();
                  return (
                    p.nom.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.role?.toLowerCase().includes(q)
                  );
                });

                if (search.trim() && filteredChars.length === 0) return null;

                return (
                  <div key={cat.id} className="relative pl-8 sm:pl-10">
                    {/* SVG Branch connector curve from trunk stem to this major limb */}
                    <div className="absolute top-6 left-0 w-8 sm:w-10 h-0.5 bg-amber-700/60 dark:bg-amber-500/60" />
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-stone-200 dark:bg-stone-800 rounded-full" />

                    {/* Major Branch Limb Hub */}
                    <div
                      onClick={() => toggleBranch(cat.id)}
                      className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 shadow-2xs hover:shadow-sm ${palette.bg} ${palette.border}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl ${palette.accent} text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs shrink-0`}>
                          B{catIdx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                              Branche Principale #{catIdx + 1}
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                              {cat.personnages.length} feuilles
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base sm:text-lg">
                            {cat.nom.replace(/^[0-9.]+\s*/, '')}
                          </h4>
                          <span className="text-xs text-stone-600 dark:text-stone-300 line-clamp-1">
                            {cat.description}
                          </span>
                        </div>
                      </div>

                      <button className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 bg-white/60 dark:bg-stone-800/60">
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Secondary Twigs & Leaves (Personnages) */}
                    {!isCollapsed && (
                      <div className="pl-6 sm:pl-8 mt-4 space-y-3 relative">
                        {/* Stem line running along leaves */}
                        <div className="absolute top-0 bottom-3 left-0 w-0.5 bg-stone-300/80 dark:bg-stone-700/80" />

                        {filteredChars.map((p, pIdx) => {
                          const isSelected = selectedPersonnage?.nom === p.nom;

                          return (
                            <div key={pIdx} className="relative flex items-center">
                              {/* Horizontal leaf stem connector */}
                              <div className="absolute -left-6 sm:-left-8 w-6 sm:w-8 h-0.5 bg-stone-300/80 dark:bg-stone-700/80" />

                              {/* Interactive Character Leaf Button */}
                              <button
                                onClick={() => {
                                  setSelectedKnowledge(null);
                                  setSelectedPersonnage(p);
                                  revealInspector();
                                }}
                                className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-4 w-full shadow-2xs group ${
                                  isSelected
                                    ? 'bg-amber-900 dark:bg-amber-800 text-white border-amber-900 dark:border-amber-700 shadow-md ring-2 ring-amber-400'
                                    : 'bg-white dark:bg-stone-800 hover:bg-stone-50/80 dark:hover:bg-stone-700/60 border-stone-200 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-500 text-stone-900 dark:text-stone-100'
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-serif font-bold text-sm sm:text-base">
                                      {p.nom}
                                    </span>
                                    {p.age && (
                                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                        isSelected ? 'bg-amber-950 text-amber-200' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                                      }`}>
                                        {p.age}
                                      </span>
                                    )}
                                  </div>

                                  <div className={`text-xs flex items-center gap-2 ${isSelected ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'}`}>
                                    {p.role && <span>{p.role}</span>}
                                    {p.emplacement && <span>· {p.emplacement}</span>}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${
                                    isSelected ? 'bg-amber-800 dark:bg-amber-700 text-amber-100' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/60 group-hover:text-amber-800 dark:group-hover:text-amber-300'
                                  }`}>
                                    Voir fiche
                                  </span>
                                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-200' : 'text-stone-400 dark:text-stone-500'}`} />
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. BRANCHES FOR SYNTHÈSE THÉMATIQUE */}
          {treeType === 'synthese' && (
            <div className="space-y-8 pl-4">
              {syntheseCategories.map((catName, catIdx) => {
                const palette = branchColorPalette[catIdx % branchColorPalette.length];
                const isCollapsed = !!collapsedBranches[catName];
                const itemsInCat = syntheseData.knowledgeItems.filter((k) => {
                  if (k.category !== catName) return false;
                  if (!search.trim()) return true;
                  const q = search.toLowerCase();
                  return k.title.toLowerCase().includes(q) || k.explanation.toLowerCase().includes(q);
                });

                if (search.trim() && itemsInCat.length === 0) return null;

                return (
                  <div key={catName} className="relative pl-8 sm:pl-10">
                    <div className="absolute top-6 left-0 w-8 sm:w-10 h-0.5 bg-amber-700/60 dark:bg-amber-500/60" />
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-stone-200 dark:bg-stone-800 rounded-full" />

                    <div
                      onClick={() => toggleBranch(catName)}
                      className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 shadow-2xs hover:shadow-sm ${palette.bg} ${palette.border}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl ${palette.accent} text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs shrink-0`}>
                          T{catIdx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                              Axe Thématique #{catIdx + 1}
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                              {itemsInCat.length} fiches
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base sm:text-lg capitalize">
                            {catName}
                          </h4>
                        </div>
                      </div>

                      <button className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 bg-white/60 dark:bg-stone-800/60">
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>

                    {!isCollapsed && (
                      <div className="pl-6 sm:pl-8 mt-4 space-y-3 relative">
                        <div className="absolute top-0 bottom-3 left-0 w-0.5 bg-stone-300/80 dark:bg-stone-700/80" />

                        {itemsInCat.map((item) => {
                          const isSelected = selectedKnowledge?.id === item.id;

                          return (
                            <div key={item.id} className="relative flex items-center">
                              <div className="absolute -left-6 sm:-left-8 w-6 sm:w-8 h-0.5 bg-stone-300/80 dark:bg-stone-700/80" />

                              <button
                                onClick={() => {
                                  setSelectedPersonnage(null);
                                  setSelectedKnowledge(item);
                                  revealInspector();
                                }}
                                className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-4 w-full shadow-2xs group ${
                                  isSelected
                                    ? 'bg-amber-900 dark:bg-amber-800 text-white border-amber-900 dark:border-amber-700 shadow-md ring-2 ring-amber-400'
                                    : 'bg-white dark:bg-stone-800 hover:bg-stone-50/80 dark:hover:bg-stone-700/60 border-stone-200 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-500 text-stone-900 dark:text-stone-100'
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <div className="font-semibold text-xs sm:text-sm">
                                    {item.title}
                                  </div>
                                  <div className={`text-[11px] line-clamp-1 ${isSelected ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'}`}>
                                    {item.explanation}
                                  </div>
                                </div>

                                <span className={`text-[11px] font-mono px-2 py-0.5 rounded shrink-0 ${
                                  isSelected ? 'bg-amber-950 text-amber-200' : 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                                }`}>
                                  #{item.id}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Leaf Inspector Side Dossier (Sticky) */}
        <div ref={inspectorRef} className="lg:col-span-4 lg:sticky lg:top-24 space-y-4 scroll-mt-4">
          {selectedPersonnage ? (
            <div key={selectedPersonnage.nom} className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-amber-400 dark:border-amber-600/70 p-6 sm:p-7 shadow-md space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300 transition-colors duration-200">
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1 rounded-md font-bold">
                    Feuille de Personnage · Arbre
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100 mt-2">
                    {selectedPersonnage.nom}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPersonnage(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Character Attributes Table */}
              <div className="space-y-2 text-xs divide-y divide-stone-100 dark:divide-stone-800 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700">
                {selectedPersonnage.role && (
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">Rôle littéraire :</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 text-right">{selectedPersonnage.role}</span>
                  </div>
                )}
                {selectedPersonnage.age && (
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">Âge dans le roman :</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{selectedPersonnage.age}</span>
                  </div>
                )}
                {selectedPersonnage.profession && (
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">Métier / Activité :</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{selectedPersonnage.profession}</span>
                  </div>
                )}
                {selectedPersonnage.emplacement && (
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">Lieu de résidence :</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{selectedPersonnage.emplacement}</span>
                  </div>
                )}
                {selectedPersonnage.statut && (
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">Statut familial :</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{selectedPersonnage.statut}</span>
                  </div>
                )}
              </div>

              {/* Literary Portrait */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-200 block">
                  Portrait & Rôle dans l'intrigue :
                </span>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 font-sans">
                  {selectedPersonnage.description}
                </p>
              </div>

              {/* Enjeu Régional pour ce personnage */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 space-y-1 text-xs">
                <span className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                  <span>Enjeu typique à l'Examen Régional :</span>
                </span>
                <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
                  {getExamRelevance(selectedPersonnage.nom)}
                </p>
              </div>
            </div>
          ) : selectedKnowledge ? (
            <div key={selectedKnowledge.id} className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-amber-400 dark:border-amber-600/70 p-6 sm:p-7 shadow-md space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300 transition-colors duration-200">
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1 rounded-md font-bold">
                    Feuille de Synthèse · {selectedKnowledge.category}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 mt-2">
                    {selectedKnowledge.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedKnowledge(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-200 block mb-1.5">
                  Explication de synthèse :
                </span>
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 font-sans">
                  {selectedKnowledge.explanation}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800">
                Source documentaire : {selectedKnowledge.source}
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 text-center text-stone-500 dark:text-stone-400 space-y-3">
              <Sparkles className="w-8 h-8 text-amber-800 dark:text-amber-400 mx-auto" />
              <h4 className="font-serif font-bold text-base text-stone-800 dark:text-stone-200">
                Inspecteur de Nœud d'Arbre
              </h4>
              <p className="text-xs leading-relaxed max-w-xs mx-auto">
                Cliquez sur n'importe quel personnage ou concept dans les branches de l'arbre pour afficher sa fiche d'examen complète ici.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
