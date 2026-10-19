import React, { useState } from 'react';
import { QuizChapterBank, QuizQuestionItem, UserStudyProgress } from '../../types';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { recordQuizScore } from '../../services/storage';
import { playCorrectSound, playIncorrectSound } from '../../services/sound';

interface QuizTabProps {
  quizBanks: QuizChapterBank[];
  initialChapterIndex: number;
  progress: UserStudyProgress;
  onScoreRecorded: (updated: UserStudyProgress) => void;
}

export const QuizTab: React.FC<QuizTabProps> = ({
  quizBanks,
  initialChapterIndex,
  progress,
  onScoreRecorded,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(initialChapterIndex);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showOpenAnswer, setShowOpenAnswer] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const currentBank = quizBanks[activeChapterIndex] || quizBanks[0];
  const questions = currentBank.questions;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectChapter = (idx: number) => {
    setActiveChapterIndex(idx);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowOpenAnswer(false);
    setSessionScore(0);
    setIsQuizCompleted(false);
  };

  const handleAnswerQCM = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
    const isCorrect = optionIndex === currentQ.correctAnswer;
    if (isCorrect) {
      playCorrectSound();
      setSessionScore((prev) => prev + 1);
    } else {
      playIncorrectSound();
    }
  };

  const handleAnswerVraiFaux = (val: boolean) => {
    if (isAnswered) return;
    setSelectedAnswer(val);
    setIsAnswered(true);
    const isCorrect = val === currentQ.correctAnswer;
    if (isCorrect) {
      playCorrectSound();
      setSessionScore((prev) => prev + 1);
    } else {
      playIncorrectSound();
    }
  };

  const handleOpenSelfValidate = (understood: boolean) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(understood);
    if (understood) {
      playCorrectSound();
      setSessionScore((prev) => prev + 1);
    } else {
      playIncorrectSound();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowOpenAnswer(false);
    } else {
      // Completed chapter quiz!
      const total = questions.length;
      const finalScore = sessionScore;
      const updated = recordQuizScore(`quiz-${currentBank.chapterId}`, finalScore, total);
      onScoreRecorded(updated);
      setIsQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowOpenAnswer(false);
    setSessionScore(0);
    setIsQuizCompleted(false);
  };

  const savedRecord = progress.quizScores[`quiz-${currentBank.chapterId}`];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Chapter Selection Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-xs space-y-3 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              Banque Officielle de Quiz
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Choisissez un chapitre à évaluer
            </h3>
          </div>

          {savedRecord && (
            <div className="text-xs text-stone-600 dark:text-stone-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 px-3 py-1.5 rounded-lg">
              Meilleur score :{' '}
              <span className="font-semibold text-amber-900 dark:text-amber-300">
                {savedRecord.score}/{savedRecord.total} ({Math.round((savedRecord.score / savedRecord.total) * 100)}%)
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {quizBanks.map((bank, idx) => (
            <button
              key={bank.chapterId}
              onClick={() => handleSelectChapter(idx)}
              className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-all ${
                activeChapterIndex === idx
                  ? 'bg-amber-800 text-white border-amber-800 shadow-xs font-semibold'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              {bank.chapterTitle.split(':')[0]} ({bank.questions.length} questions)
            </button>
          ))}
        </div>
      </div>

      {/* Main Quiz Card */}
      {!isQuizCompleted && currentQ ? (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors duration-200">
          {/* Header */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pb-3 border-b border-stone-100 dark:border-stone-800">
            <span className="font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              {currentBank.chapterTitle.split(':')[0]} · Type : {currentQ.type.replace(/_/g, ' ')}
            </span>
            <span className="font-mono tabular-nums">
              Question {currentQuestionIndex + 1} sur {questions.length}
            </span>
          </div>

          {/* Question title */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
            {currentQ.question}
          </h3>

          {/* QCM Type Questions */}
          {currentQ.type === 'qcm' && currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                let style = 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-stone-50/50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200';
                if (isAnswered) {
                  if (idx === currentQ.correctAnswer) {
                    style = 'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                  } else if (idx === selectedAnswer) {
                    style = 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 line-through';
                  } else {
                    style = 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40 text-stone-400 dark:text-stone-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswerQCM(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all duration-150 flex items-start justify-between gap-3 ${style}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center font-mono text-xs font-semibold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{option}</span>
                    </div>

                    {isAnswered && idx === currentQ.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && idx === selectedAnswer && idx !== currentQ.correctAnswer && (
                      <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Vrai / Faux Questions */}
          {currentQ.type === 'vrai_faux' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[true, false].map((val) => {
                const label = val ? 'Vrai' : 'Faux';
                let style = 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-stone-50/50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200';
                if (isAnswered) {
                  if (val === currentQ.correctAnswer) {
                    style = 'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                  } else if (val === selectedAnswer) {
                    style = 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 line-through';
                  } else {
                    style = 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40 text-stone-400 dark:text-stone-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={label}
                    disabled={isAnswered}
                    onClick={() => handleAnswerVraiFaux(val)}
                    className={`p-5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-3 ${style}`}
                  >
                    <span>{label}</span>
                    {isAnswered && val === currentQ.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && val === selectedAnswer && val !== currentQ.correctAnswer && (
                      <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Open / Comprehension / Chronologie / Themes Questions */}
          {currentQ.type !== 'qcm' && currentQ.type !== 'vrai_faux' && (
            <div className="space-y-4">
              <button
                onClick={() => setShowOpenAnswer(!showOpenAnswer)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 transition-colors"
              >
                {showOpenAnswer ? (
                  <>
                    <EyeOff className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                    <span>Masquer la réponse attendue & critères</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                    <span>Révéler la réponse attendue & barème officiel</span>
                  </>
                )}
              </button>

              {showOpenAnswer && (
                <div className="p-5 rounded-xl bg-amber-50/50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 space-y-3 text-xs animate-in fade-in duration-200">
                  {currentQ.expectedAnswer && (
                    <div>
                      <span className="font-bold text-amber-900 dark:text-amber-300 block uppercase tracking-wider mb-1">
                        Réponse modèle attendue à l'examen :
                      </span>
                      <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-serif text-sm">
                        {currentQ.expectedAnswer}
                      </p>
                    </div>
                  )}

                  {currentQ.gradingCriteria && (
                    <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/60">
                      <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                        Critères d'évaluation de l'épreuve :
                      </span>
                      <ul className="space-y-1 text-stone-600 dark:text-stone-400">
                        {currentQ.gradingCriteria.map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-700 dark:text-amber-400 font-bold">·</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!isAnswered && (
                    <div className="pt-3 border-t border-amber-200/60 dark:border-amber-800/60 flex items-center justify-between">
                      <span className="text-stone-700 dark:text-stone-300 font-medium">Avez-vous su répondre ?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenSelfValidate(true)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                        >
                          Oui, maîtrisé (+1 pt)
                        </button>
                        <button
                          onClick={() => handleOpenSelfValidate(false)}
                          className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 font-semibold text-xs transition-colors"
                        >
                          À revoir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Explanation after answer */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 space-y-1.5 animate-in fade-in duration-200">
              <div className="font-semibold text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>Explication officielle :</span>
              </div>
              <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                {currentQ.explanation}
              </p>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 pt-1">
                Source : {currentQ.source}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <div className="text-xs text-stone-500 dark:text-stone-400">
              Score du chapitre :{' '}
              <span className="font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                {sessionScore} / {currentQuestionIndex + (isAnswered ? 1 : 0)}
              </span>
            </div>

            {isAnswered && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 dark:bg-stone-800 text-white text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-700 transition-colors"
              >
                <span>
                  {currentQuestionIndex < questions.length - 1
                    ? 'Question suivante'
                    : 'Terminer le chapitre'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Screen */
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 sm:p-10 text-center space-y-6 shadow-xs animate-in zoom-in-95 duration-200 transition-colors duration-200">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
              Évaluation du {currentBank.chapterTitle.split(':')[0]} terminée !
            </h3>
            <p className="text-stone-600 dark:text-stone-300 text-sm">
              Votre score a été enregistré automatiquement dans votre progression.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 max-w-sm mx-auto space-y-2">
            <div className="font-mono text-4xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
              {sessionScore} / {questions.length}
            </div>
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {Math.round((sessionScore / questions.length) * 100)}% de réussite
            </div>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 dark:bg-stone-800 text-white text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer ce chapitre</span>
            </button>

            {activeChapterIndex < quizBanks.length - 1 && (
              <button
                onClick={() => handleSelectChapter(activeChapterIndex + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition-colors"
              >
                <span>Passer au {quizBanks[activeChapterIndex + 1].chapterTitle.split(':')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
