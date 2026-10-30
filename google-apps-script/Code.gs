const FEEDBACK_SHEET_PROPERTY = 'PASSBAC_FEEDBACK_SPREADSHEET_ID';
const FEEDBACK_CRITERIA = [
  { id: 'lexique', label: 'Lexique facile à comprendre' },
  { id: 'clarte', label: 'Clarté des idées et des explications' },
  { id: 'organisation', label: 'Organisation et présentation des contenus' },
  { id: 'navigation', label: 'Facilité de navigation sur la plateforme' },
  { id: 'ressources', label: 'Utilité des résumés, fiches et quiz' },
  { id: 'examen', label: 'Aide apportée à la préparation de l’examen' },
];
const FEEDBACK_RATINGS = ['bien', 'passable', 'non'];

function setupPassBacFeedback() {
  const properties = PropertiesService.getScriptProperties();
  const savedId = properties.getProperty(FEEDBACK_SHEET_PROPERTY);
  if (savedId) {
    const savedSpreadsheet = SpreadsheetApp.openById(savedId);
    console.log(`Feuille de réponses : ${savedSpreadsheet.getUrl()}`);
    return savedSpreadsheet.getUrl();
  }

  const spreadsheet = SpreadsheetApp.create('PassBac — Avis des élèves');
  const sheet = spreadsheet.getSheets()[0];
  sheet.setName('Réponses');
  sheet.setRightToLeft(false);
  sheet.getRange(1, 1, sheet.getMaxRows(), 9)
    .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  sheet.appendRow([
    'Date de réception',
    ...FEEDBACK_CRITERIA.map((criterion) => criterion.label),
    'Remarques et suggestions',
    'Identifiant technique',
  ]);
  sheet.getRange(1, 1, 1, 9)
    .setBackground('#854d0e')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setWrap(true)
    .setVerticalAlignment('middle');
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 42);
  sheet.setColumnWidth(1, 155);
  FEEDBACK_CRITERIA.forEach((criterion, index) => sheet.setColumnWidth(index + 2, 220));
  sheet.setColumnWidth(8, 420);
  sheet.setColumnWidth(9, 180);
  sheet.getRange('A:I').setVerticalAlignment('top').setWrap(true);
  sheet.hideColumns(9);

  const ratingColors = [
    { value: 'Bien', color: '#dcfce7' },
    { value: 'Passable', color: '#fef3c7' },
    { value: 'Non', color: '#ffe4e6' },
  ];
  const formattingRules = FEEDBACK_CRITERIA.flatMap((criterion, index) =>
    ratingColors.map(({ value, color }) =>
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(value)
        .setBackground(color)
        .setRanges([sheet.getRange(2, index + 2, sheet.getMaxRows() - 1, 1)])
        .build()
    )
  );
  sheet.setConditionalFormatRules(formattingRules);

  properties.setProperty(FEEDBACK_SHEET_PROPERTY, spreadsheet.getId());
  console.log(`Feuille de réponses : ${spreadsheet.getUrl()}`);
  return spreadsheet.getUrl();
}

function doPost(event) {
  let submissionId = '';
  try {
    const payloadText = event && event.parameter && event.parameter.payload;
    if (!payloadText || payloadText.length > 10000) {
      throw new Error('Données absentes ou trop volumineuses.');
    }

    const payload = JSON.parse(payloadText);
    submissionId = String(payload.submissionId || '');

    if (payload.website) {
      return feedbackResponse({ submissionId, success: true });
    }
    if (!/^[\w-]{20,80}$/.test(submissionId)) {
      throw new Error('Identifiant de réponse invalide.');
    }
    if (
      typeof payload.comment !== 'string' ||
      payload.comment.length > 1500 ||
      !payload.ratings ||
      typeof payload.ratings !== 'object'
    ) {
      throw new Error('Le contenu de la réponse est invalide.');
    }

    const ratings = FEEDBACK_CRITERIA.map((criterion) => {
      const rating = payload.ratings[criterion.id];
      if (!FEEDBACK_RATINGS.includes(rating)) {
        throw new Error(`Évaluation invalide pour le critère « ${criterion.label} ».`);
      }
      return rating.charAt(0).toUpperCase() + rating.slice(1);
    });

    const spreadsheetId = PropertiesService.getScriptProperties()
      .getProperty(FEEDBACK_SHEET_PROPERTY);
    if (!spreadsheetId) {
      throw new Error('La feuille de réponses n’a pas encore été créée.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Réponses');
      if (!sheet) {
        throw new Error('L’onglet « Réponses » est introuvable.');
      }

      const idColumn = 9;
      const lastRow = sheet.getLastRow();
      const alreadySaved = lastRow > 1 &&
        sheet.getRange(2, idColumn, lastRow - 1, 1)
          .createTextFinder(submissionId)
          .matchEntireCell(true)
          .findNext();

      if (!alreadySaved) {
        const comment = payload.comment.trim();
        const safeComment = /^[=+\-@\t\r]/.test(comment) ? `'${comment}` : comment;
        sheet.appendRow([new Date(), ...ratings, safeComment, submissionId]);
      }
    } finally {
      lock.releaseLock();
    }

    return feedbackResponse({ submissionId, success: true });
  } catch (error) {
    console.error(error);
    return feedbackResponse({
      submissionId,
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors de l’enregistrement.',
    });
  }
}

function feedbackResponse(result) {
  const message = JSON.stringify({
    type: 'PASSBAC_FEEDBACK_RESULT',
    ...result,
  }).replace(/</g, '\\u003c');
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><script>
    const result = ${message};
    window.parent.postMessage(result, '*');
    if (window.top !== window.parent) {
      window.top.postMessage(result, '*');
    }
  </script></body></html>`;
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
