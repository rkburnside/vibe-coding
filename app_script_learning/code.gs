/**
 * Homepage shown when no email is open.
 */
function buildHomepage(e) {
  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle('Email Brief')
        .setSubtitle('Open an email to see the summary card')
    )
    .addSection(
      CardService.newCardSection().addWidget(
        CardService.newTextParagraph().setText(
          'This add-on shows the subject, sender, and a short preview.'
        )
      )
    )
    .build();

  return [card];
}

/**
 * Contextual trigger: runs when a Gmail message is open.
 */
function buildMessageCard(e) {
  // Required for Gmail current-message scopes.
  const accessToken = e.gmail && e.gmail.accessToken;
  if (accessToken) {
    GmailApp.setCurrentMessageAccessToken(accessToken);
  }

  const messageId = e.gmail && e.gmail.messageId;
  const message = GmailApp.getMessageById(messageId);

  const subject = message.getSubject() || '(no subject)';
  const from = message.getFrom() || '(unknown sender)';
  const plainBody = message.getPlainBody() || '';
  const snippet = plainBody.slice(0, 300);

  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle('Email Brief')
        .setSubtitle('Minimal Gmail add-on demo')
    )
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newKeyValue().setTopLabel('Subject').setContent(subject))
        .addWidget(CardService.newKeyValue().setTopLabel('From').setContent(from))
        .addWidget(
          CardService.newTextParagraph().setText(
            `<b>Preview</b><br>${escapeHtml(snippet || '(empty message)')}`
          )
        )
        .addWidget(
          CardService.newTextButton()
            .setText('Generate summary')
            .setOnClickAction(
              CardService.newAction()
                .setFunctionName('generateSummary')
                .setParameters({ messageId })
            )
        )
    )
    .build();

  return [card];
}

/**
 * Button handler. Returns a new card with a fake summary.
 */
function generateSummary(e) {
  const accessToken = e.gmail && e.gmail.accessToken;
  if (accessToken) {
    GmailApp.setCurrentMessageAccessToken(accessToken);
  }

  const messageId = e.commonEventObject.parameters.messageId;
  const message = GmailApp.getMessageById(messageId);

  const subject = message.getSubject() || '(no subject)';
  const body = message.getPlainBody() || '';
  const preview = body.slice(0, 500);

  const summary = fakeSummary(subject, preview);

  const card = CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle('Summary')
        .setSubtitle(subject)
    )
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(summary))
    )
    .build();

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}

/**
 * Replace this later with real LLM/API logic.
 */
function fakeSummary(subject, body) {
  const clean = body.replace(/\s+/g, ' ').trim();
  const shortBody = clean.slice(0, 220) || 'No body text found.';

  return `
<b>Summary</b>
<ul>
  <li>This email is about: ${escapeHtml(subject)}</li>
  <li>Main content preview: ${escapeHtml(shortBody)}</li>
  <li>Next step: replace this fake summary with real logic.</li>
</ul>
`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}