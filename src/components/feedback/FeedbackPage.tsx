import React, { useEffect, useRef, useState } from 'react';
import { MessageSquareText, Send } from 'lucide-react';
import {
  FeedbackCriterion,
  FeedbackRating,
  getStudentFeedback,
  sendStudentFeedbackToGoogle,
  saveStudentFeedback,
  StudentFeedback,
} from '../../services/feedback';
import { GOOGLE_APPS_SCRIPT_URL } from '../../config/feedback';

const criteria: FeedbackCriterion[] = [
  { id: 'lexique', label: 'Lexique facile à comprendre' },
  { id: 'clarte', label: 'Clarté des idées et des explications' },
  { id: 'organisation', label: 'Organisation et présentation des contenus' },
  { id: 'navigation', label: 'Facilité de navigation sur la plateforme' },
  { id: 'ressources', label: 'Utilité des résumés, fiches et quiz' },
  { id: 'examen', label: 'Aide apportée à la préparation de l’examen' },
];

const ratingOptions: Array<{ value: FeedbackRating; label: string }> = [
  { value: 'bien', label: 'Bien' },
  { value: 'passable', label: 'Passable' },
  { value: 'non', label: 'Non' },
];

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));

export const FeedbackPage: React.FC = () => {
  const [ratings, setRatings] = useState<Record<string, FeedbackRating>>({});
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState<StudentFeedback[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      setFeedback(getStudentFeedback());
    } catch (error) {
      console.error('Erreur de lecture des avis des élèves :', error);
      setStorageError(
        'Les avis enregistrés ne peuvent pas être lus. Vos nouvelles réponses ne seront pas enregistrées.'
      );
    }
  }, []);

  const allCriteriaRated = criteria.every((criterion) => ratings[criterion.id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);
    if (!allCriteriaRated) {
      setNotice('Merci de choisir une réponse pour chaque critère.');
      return;
    }
    if (honeypotRef.current?.value) return;

    setIsSubmitting(true);
    let receivedByGoogle = false;
    try {
      if (GOOGLE_APPS_SCRIPT_URL) {
        await sendStudentFeedbackToGoogle(GOOGLE_APPS_SCRIPT_URL, ratings, comment);
        receivedByGoogle = true;
      }

      const updated = saveStudentFeedback(ratings, comment);
      setFeedback(updated);
      setRatings({});
      setComment('');
      setNotice(
        receivedByGoogle
          ? 'Merci ! Votre évaluation a bien été reçue par Google et ajoutée à la feuille de réponses.'
          : 'Merci ! Votre évaluation est enregistrée sur cet appareil. La réception centralisée Google n’est pas encore configurée.'
      );
      setStorageError(null);
    } catch (error) {
      console.error('Erreur d’enregistrement de l’avis :', error);
      if (receivedByGoogle) {
        setNotice('Votre réponse a bien été reçue par Google.');
        setStorageError(
          'La copie locale de votre réponse n’a pas pu être enregistrée sur cet appareil.'
        );
        setRatings({});
        setComment('');
      } else if (GOOGLE_APPS_SCRIPT_URL) {
        try {
          setFeedback(saveStudentFeedback(ratings, comment));
          setStorageError(
            'Google n’a pas confirmé la réception. Une copie de secours est conservée sur cet appareil uniquement ; elle n’a pas été envoyée à l’enseignante.'
          );
        } catch (storageError) {
          console.error('Erreur d’enregistrement local de secours :', storageError);
          setStorageError(
            'Google n’a pas confirmé la réception et la copie locale a échoué. Gardez cette page ouverte et vérifiez votre connexion avant de réessayer.'
          );
        }
      } else {
        setStorageError(
          'L’enregistrement a échoué. Vérifiez l’espace disponible et les paramètres de stockage du navigateur.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-300">
      <header className="space-y-3">
        <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
          Votre avis compte
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Évaluation de la plateforme
        </h1>
        <p className="max-w-3xl text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          Évaluez chaque aspect avec « Bien », « Passable » ou « Non », puis partagez
          vos remarques pour nous aider à améliorer PassBac.
        </p>
      </header>

      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-relaxed text-sky-950 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100">
        {GOOGLE_APPS_SCRIPT_URL
          ? 'Les réponses sont anonymes et envoyées à la feuille Google de la plateforme. Une confirmation s’affiche après réception.'
          : 'La réception Google n’est pas encore configurée. Pour le moment, les réponses restent enregistrées sur cet appareil.'}
      </div>

      {storageError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
        >
          {storageError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs dark:border-stone-800 dark:bg-stone-900 sm:p-6"
      >
        <div
          aria-hidden="true"
          className="fixed left-[-10000px] h-px w-px overflow-hidden"
        >
          <label htmlFor="student-feedback-website">Ne pas remplir</label>
          <input
            id="student-feedback-website"
            name="website"
            ref={honeypotRef}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700">
                <th scope="col" className="px-3 py-3 font-semibold text-stone-800 dark:text-stone-100">
                  Critère
                </th>
                {ratingOptions.map((option) => (
                  <th
                    key={option.value}
                    scope="col"
                    className="w-24 px-3 py-3 text-center font-semibold text-stone-800 dark:text-stone-100"
                  >
                    {option.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((criterion) => (
                <tr
                  key={criterion.id}
                  className="border-b border-stone-100 last:border-0 dark:border-stone-800"
                >
                  <th
                    scope="row"
                    className="px-3 py-4 font-medium text-stone-700 dark:text-stone-200"
                  >
                    {criterion.label}
                  </th>
                  {ratingOptions.map((option) => (
                    <td key={option.value} className="px-3 py-4 text-center">
                      <label className="inline-flex cursor-pointer items-center justify-center">
                        <input
                          type="radio"
                          name={criterion.id}
                          value={option.value}
                          aria-label={`${criterion.label} : ${option.label}`}
                          checked={ratings[criterion.id] === option.value}
                          onChange={() =>
                            setRatings((current) => ({
                              ...current,
                              [criterion.id]: option.value,
                            }))
                          }
                          className="h-4 w-4 accent-amber-800"
                        />
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="student-feedback-comment"
            className="flex items-center gap-2 text-sm font-semibold text-stone-800 dark:text-stone-100"
          >
            <MessageSquareText className="h-4 w-4 text-amber-800 dark:text-amber-400" />
            Vos remarques et suggestions
            <span className="font-normal text-stone-500 dark:text-stone-400">(facultatif)</span>
          </label>
          <textarea
            id="student-feedback-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={1500}
            rows={4}
            placeholder="Qu’avez-vous apprécié ? Que faudrait-il clarifier ou améliorer ?"
            className="w-full resize-y rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          />
          <p className="text-right text-xs text-stone-500 dark:text-stone-400">
            {comment.length}/1500 caractères
          </p>
        </div>

        {notice && (
          <p role="status" className="text-sm font-medium text-amber-900 dark:text-amber-300">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-900 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? 'Envoi en cours…' : 'Ajouter mon évaluation'}
        </button>
      </form>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Tableau des retours
            </h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              {feedback.length} évaluation{feedback.length > 1 ? 's' : ''} enregistrée
              {feedback.length > 1 ? 's' : ''} sur cet appareil
            </p>
          </div>
        </div>

        {feedback.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
            Les évaluations ajoutées apparaîtront ici sous forme de tableau.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-stone-100 dark:bg-stone-800">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Évaluation</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Remarques et suggestions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white dark:divide-stone-800 dark:bg-stone-900">
                {feedback.map((entry) => (
                  <tr key={entry.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-4 text-stone-600 dark:text-stone-300">
                      {formatDate(entry.submittedAt)}
                    </td>
                    <td className="px-4 py-4">
                      <ul className="space-y-1">
                        {criteria.map((criterion) => (
                          <li key={criterion.id} className="text-xs text-stone-600 dark:text-stone-300">
                            <span className="font-medium text-stone-800 dark:text-stone-100">
                              {criterion.label} :
                            </span>{' '}
                            {ratingOptions.find(
                              (option) => option.value === entry.ratings[criterion.id]
                            )?.label || '—'}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="max-w-md whitespace-pre-wrap break-words px-4 py-4 text-stone-700 dark:text-stone-200">
                      {entry.comment || 'Aucune remarque laissée.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
