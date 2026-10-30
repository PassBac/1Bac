export type FeedbackRating = 'bien' | 'passable' | 'non';

export interface StudentFeedback {
  id: string;
  submittedAt: string;
  ratings: Record<string, FeedbackRating>;
  comment: string;
}

export interface FeedbackCriterion {
  id: string;
  label: string;
}

const STORAGE_KEY = 'passbac_student_feedback_v1';
const validRatings: FeedbackRating[] = ['bien', 'passable', 'non'];

export class FeedbackSubmissionError extends Error {
  constructor(message: string, public readonly deliveryUnknown = false) {
    super(message);
    this.name = 'FeedbackSubmissionError';
  }
}

export const sendStudentFeedbackToGoogle = (
  endpoint: string,
  ratings: Record<string, FeedbackRating>,
  comment: string
): Promise<void> => {
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(endpoint)) {
    return Promise.reject(
      new FeedbackSubmissionError('L’adresse du récepteur Google Apps Script est invalide.')
    );
  }

  const submissionId = crypto.randomUUID();
  const frameName = `passbac-feedback-${submissionId}`;
  const frame = document.createElement('iframe');
  frame.name = frameName;
  frame.title = 'Confirmation sécurisée de l’envoi';
  frame.tabIndex = -1;
  frame.setAttribute('aria-hidden', 'true');
  frame.style.display = 'none';

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = endpoint;
  form.target = frameName;
  form.style.display = 'none';

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'payload';
  input.value = JSON.stringify({
    submissionId,
    ratings,
    comment: comment.trim(),
    website: '',
  });
  form.appendChild(input);
  document.body.append(frame, form);

  return new Promise<void>((resolve, reject) => {
    const finish = (error?: Error) => {
      window.clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
      form.remove();
      frame.remove();
      if (error) reject(error);
      else resolve();
    };

    const handleMessage = (event: MessageEvent) => {
      const isGoogleOrigin =
        event.origin === 'https://script.google.com' ||
        event.origin === 'https://script.googleusercontent.com' ||
        event.origin.endsWith('.script.googleusercontent.com');
      if (
        !isGoogleOrigin ||
        event.data?.type !== 'PASSBAC_FEEDBACK_RESULT' ||
        event.data.submissionId !== submissionId
      ) {
        return;
      }

      if (event.data.success !== true) {
        finish(new FeedbackSubmissionError(
          typeof event.data.message === 'string'
            ? event.data.message
            : 'Google n’a pas pu enregistrer votre réponse.'
        ));
        return;
      }

      finish();
    };

    const timeout = window.setTimeout(() => {
      finish(
        new FeedbackSubmissionError(
          'La page n’a pas reçu la confirmation de Google à temps.',
          true
        )
      );
    }, 25000);

    window.addEventListener('message', handleMessage);
    form.submit();
  });
};

const isStudentFeedback = (value: unknown): value is StudentFeedback => {
  if (!value || typeof value !== 'object') return false;
  const feedback = value as StudentFeedback;
  return (
    typeof feedback.id === 'string' &&
    typeof feedback.submittedAt === 'string' &&
    !Number.isNaN(Date.parse(feedback.submittedAt)) &&
    typeof feedback.comment === 'string' &&
    !!feedback.ratings &&
    typeof feedback.ratings === 'object' &&
    Object.values(feedback.ratings).every((rating) => validRatings.includes(rating))
  );
};

export const getStudentFeedback = (): StudentFeedback[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isStudentFeedback)) {
    throw new Error('Les remarques enregistrées sont dans un format inattendu.');
  }
  return parsed;
};

export const saveStudentFeedback = (
  ratings: Record<string, FeedbackRating>,
  comment: string
): StudentFeedback[] => {
  const feedback: StudentFeedback = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    ratings,
    comment: comment.trim(),
  };
  const updated = [feedback, ...getStudentFeedback()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
