
/* EasyWordPress MVP — Chat e logica commerciale */

const chat = document.getElementById('chat');
const options = document.getElementById('options');
const typing = document.getElementById('typing');
const resultBox = document.getElementById('result');
const contactForm = document.getElementById('contact-form');

const progressBar = document.getElementById('progress-bar');
const progressCount = document.getElementById('progress-count');

const submitContact = document.getElementById('submit-contact');
const restartContainer = document.getElementById('restart-container');
const restartButton = document.getElementById('restart-button');

/* STATO DEL QUESTIONARIO */

let caseData = {};
let currentQuestion = 'start';
let questionCount = 0;
let interactionLocked = true;
let session = 0;
let resultShown = false;
let resultTier = '';
let summaryShown = false;

/* UTILITY */

const wait = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

const escapeHtml = text => {
  const el = document.createElement('div');
  el.textContent = String(text ?? '');
  return el.innerHTML;
};

function scrollToBottom() {
  requestAnimationFrame(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  });
}

/* MESSAGGI */

function addMessage(text, type = 'bot') {
  const el = document.createElement('div');

  el.className = 'message ' + type;
  el.textContent = text;

  chat.appendChild(el);
  scrollToBottom();
}

function setTyping(visible) {
  typing.classList.toggle('hidden', !visible);

  if (visible) {
    scrollToBottom();
  }
}

/* AVANZAMENTO */

function updateProgress() {
  questionCount++;

  progressCount.textContent =
    `${questionCount} ${
      questionCount === 1
        ? 'informazione'
        : 'informazioni'
    } raccolte`;

  progressBar.style.width =
    `${Math.min(8 + questionCount * 8, 92)}%`;
}

/* OPZIONI */

function renderOptions(list) {
  options.innerHTML = '';

  for (const [i, item] of list.entries()) {
    const btn = document.createElement('button');

    btn.type = 'button';
    btn.className = 'option';
    btn.textContent = item.label;
    btn.style.animationDelay = `${i * 50}ms`;

    btn.addEventListener('click', () => {
      handleAnswer(item);
    });

    options.appendChild(btn);
  }

  interactionLocked = false;
  scrollToBottom();
}

/* DOMANDE */

async function showQuestion(id) {
  const stamp = session;
  const q = questions[id];

  if (!q) {
    console.error('Domanda assente', id);
    return;
  }

  currentQuestion = id;
  interactionLocked = true;
  options.innerHTML = '';

  if (q.result) {
    showDetailsPrompt(q.result);
    return;
  }

  updateProgress();

  setTyping(true);
  await wait(300);

  if (stamp !== session) return;

  setTyping(false);
  addMessage(q.text);

  if (q.next && !q.options) {
    await wait(180);

    if (stamp === session) {
      showQuestion(q.next);
    }

    return;
  }

  if (!q.options) {
    console.error('Domanda senza opzioni', id);
    return;
  }

  renderOptions(q.options);
}

/* RISPOSTE */

async function handleAnswer(item) {
  if (interactionLocked) return;

  interactionLocked = true;

  const stamp = session;

  options.innerHTML = '';
  addMessage(item.label, 'user');

  const q = questions[currentQuestion];

  if (q && q.saveAs) {
    caseData[q.saveAs] = item.value;
  }

  await wait(180);

  if (stamp !== session) return;

  if (item.next) {
    showQuestion(item.next);
  } else if (item.result) {
    showDetailsPrompt(item.result);
  }
}

/* ======================================
   CLASSIFICAZIONE COMMERCIALE
====================================== */

function resolveResult(raw) {

  // Prima distinguiamo le richieste
  // che NON riguardano la riparazione.

  if (
    raw === 'OUT' ||
    (
      caseData.requestType &&
      caseData.requestType !== 'small_change' &&
      caseData.requestType !== 'repair'
    )
  ) {
    return 'OUT';
  }

  if (caseData.requestType === 'small_change') {
    return 'QUOTE';
  }

  // WooCommerce: sempre TIER 2.
  // Controlliamo tutti i percorsi
  // dai quali è possibile arrivarci.

  const woo =
    caseData.mainProblem === 'woocommerce' ||
    caseData.wooProblem !== undefined ||
    caseData.sitePartialProblem === 'woocommerce' ||
    caseData.functionProblem === 'woocommerce' ||
    caseData.emailType === 'woocommerce' ||
    caseData.slowArea === 'woocommerce';

  if (woo) {
    return 'COMPLEX';
  }

  // Risultati già determinati.

  if (
    raw === 'COMPLEX' ||
    raw === 'FIX' ||
    raw === 'QUOTE'
  ) {
    return raw;
  }

  /* SITO NON ACCESSIBILE */

  if (raw === 'SMART_SITE') {

    if (
      ['500', 'database'].includes(caseData.errorType)
    ) {
      return 'COMPLEX';
    }

    if (
      ['hosting', 'other_error', 'unknown']
        .includes(caseData.errorType)
    ) {
      return 'QUOTE';
    }

    if (caseData.siteBehaviour === 'white_screen') {
      return (
        caseData.recentChange === 'wordpress_update' ||
        caseData.recentChange === 'theme_update'
      )
        ? 'COMPLEX'
        : 'QUOTE';
    }

    if (caseData.errorType === '403') {
      return 'QUOTE';
    }

    if (
      caseData.errorType === '404' &&
      caseData.adminAccess === 'yes'
    ) {
      return 'FIX';
    }

    return 'QUOTE';
  }

  /* SITO PARZIALMENTE ROTTO */

  if (raw === 'SMART_PARTIAL') {

    if (caseData.partialAdminAccess === 'no') {
      return 'COMPLEX';
    }

    if (
      ['multiple_pages', 'whole_site']
        .includes(caseData.partialScope)
    ) {
      return 'COMPLEX';
    }

    if (
      caseData.partialScope === 'unknown' ||
      caseData.sitePartialProblem === 'other'
    ) {
      return 'QUOTE';
    }

    return 'FIX';
  }

  /* ACCESSO WORDPRESS */

  if (raw === 'SMART_ADMIN') {

    if (
      caseData.adminProblem === 'password' &&
      caseData.publicSite === 'yes'
    ) {
      return 'FIX';
    }

    if (
      caseData.publicSite === 'no' ||
      ['login_loop', 'login_page', 'error']
        .includes(caseData.adminProblem) ||
      ['update', 'change']
        .includes(caseData.adminChange)
    ) {
      return 'COMPLEX';
    }

    return caseData.adminProblem === 'password'
      ? 'FIX'
      : 'QUOTE';
  }

  /* EMAIL WORDPRESS */

  if (raw === 'SMART_EMAIL') {

    if (
      caseData.emailType === 'all' &&
      caseData.emailDirection === 'both'
    ) {
      return 'COMPLEX';
    }

    if (
      caseData.emailType === 'unknown' ||
      caseData.emailDirection === 'unknown'
    ) {
      return 'QUOTE';
    }

    return 'FIX';
  }

  /* PAGINE, IMMAGINI E FUNZIONALITÀ */

  if (raw === 'SMART_FUNCTION') {

    if (caseData.functionAdminAccess === 'no') {
      return 'COMPLEX';
    }

    if (
      ['multiple_pages', 'whole_site']
        .includes(caseData.functionScope)
    ) {
      return 'COMPLEX';
    }

    if (
      caseData.functionScope === 'unknown' ||
      caseData.functionProblem === 'other'
    ) {
      return 'QUOTE';
    }

    if (
      caseData.functionChange === 'wordpress_update' ||
      caseData.functionChange === 'theme_update'
    ) {
      return 'COMPLEX';
    }

    return 'FIX';
  }

  // Se il sistema non riesce a
  // determinare il problema, non
  // propone automaticamente €99.

  return 'QUOTE';
}

/* ======================================
   DESCRIZIONE LIBERA DEL PROBLEMA
====================================== */

function showDetailsPrompt(raw) {

  if (resultShown) return;

  interactionLocked = true;
  setTyping(false);

  options.innerHTML = '';

  addMessage(
    'Ultima domanda: vuoi descrivere meglio il problema? ' +
    'È facoltativo, ma ci aiuta a capire cosa succede.'
  );

  const wrapper = document.createElement('div');

  wrapper.style.cssText =
    'padding:8px 24px 26px;' +
    'display:flex;' +
    'flex-direction:column;' +
    'gap:10px';

  const field = document.createElement('textarea');

  field.id = 'problem-details';
  field.rows = 4;
  field.maxLength = 2000;

  field.placeholder =
    'Cosa succede, cosa dovrebbe succedere, da quando? ' +
    'Non inserire password o dati sensibili.';

  field.style.cssText =
    'width:100%;' +
    'padding:14px;' +
    'border:1px solid #deded9;' +
    'border-radius:12px;' +
    'font:inherit;' +
    'font-size:13px;' +
    'resize:vertical;' +
    'line-height:1.5';

  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'result-button';
  button.style.marginTop = '0';

  button.textContent =
    'Visualizza la valutazione →';

  wrapper.append(field, button);
  options.appendChild(wrapper);

  button.addEventListener('click', () => {

    if (resultShown) return;

    caseData.problemDetails = field.value.trim();

    options.innerHTML = '';

    if (caseData.problemDetails) {
      addMessage(caseData.problemDetails, 'user');
    }

    showResult(raw);
  });

  interactionLocked = false;
  scrollToBottom();
}

/* ======================================
   RISULTATO
====================================== */

async function showResult(raw) {

  if (resultShown) return;

  resultShown = true;
  interactionLocked = true;

  const stamp = session;

  setTyping(true);
  await wait(400);

  if (stamp !== session) return;

  setTyping(false);

  const key = resolveResult(raw);
  const r = results[key];

  if (!r) {
    console.error('Risultato assente', key);
    return;
  }

  resultTier = key;
  caseData.tier = key;

  progressBar.style.width = '100%';
  progressCount.textContent = 'Analisi completata';

  addMessage(
    'Ho analizzato le informazioni che mi hai fornito.'
  );

  resultBox.innerHTML = `
    <div class="result-icon">
      ${r.icon}
    </div>

    <div class="result-label">
      ${escapeHtml(r.label)}
    </div>

    <h2>
      ${escapeHtml(r.title)}
    </h2>

    <p class="result-description">
      ${escapeHtml(r.description)}
    </p>

    <div class="result-price">
      ${escapeHtml(r.price)}
    </div>

    <div class="result-meta">
      ${escapeHtml(r.meta)}
    </div>

    <button
      type="button"
      id="result-button"
      class="result-button"
    >
      ${escapeHtml(r.button)}
    </button>
  `;

  resultBox.classList.remove('hidden');

  // Ripristina il pulsante di riavvio.
  restartContainer?.classList.remove('hidden');

  document
    .getElementById('result-button')
    .addEventListener('click', () => {

      if (key === 'OUT') {
        showCaseSummary();
        return;
      }

      // Il form si apre SOLO dopo il clic.

      contactForm.classList.remove('hidden');

      contactForm.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    });

  if (key === 'OUT') {

    addMessage(
      'Puoi ricominciare la diagnosi oppure ' +
      'visualizzare il riepilogo.'
    );

  } else {

    addMessage(
      'Il prezzo è indicativo e sarà confermato ' +
      'dopo una valutazione. Se vuoi proseguire, ' +
      'usa il pulsante nella scheda.'
    );
  }

  interactionLocked = false;
  scrollToBottom();
}

/* ======================================
   RIEPILOGO DELLE RISPOSTE
====================================== */

function caseRows() {

  const labels = {
    mainProblem: 'Problema principale',
    requestType: 'Tipo di richiesta',

    siteBehaviour: 'Comportamento del sito',
    errorType: 'Errore',
    recentChange: 'Modifica recente',
    adminAccess: 'Accesso WordPress',
    hostingAccess: 'Accesso hosting',

    sitePartialProblem: 'Problema del sito',
    partialScope: 'Estensione',
    partialChange: 'Modifica precedente',
    partialAdminAccess: 'Accesso WordPress',

    adminProblem: 'Problema di accesso',
    publicSite: 'Sito pubblico',
    adminChange: 'Modifica recente',

    wooProblem: 'Problema WooCommerce',
    wooDetail: 'Dettaglio WooCommerce',
    wooUpdate: 'Aggiornamento WooCommerce',
    wooAdminAccess: 'Accesso WordPress',

    slowArea: 'Zona lenta',
    slowHistory: 'Storia lentezza',
    slowChange: 'Modifica recente',

    emailType: 'Tipo di email',
    emailDirection: 'Problema di invio/ricezione',
    emailChange: 'Modifica recente',

    functionProblem: 'Elemento interessato',
    functionScope: 'Estensione',
    imageBehavior: 'Problema grafico',
    functionChange: 'Modifica recente',
    functionAdminAccess: 'Accesso WordPress',

    unknownBehaviour: 'Stato del sito',
    unknownScope: 'Estensione',
    unknownChange: 'Modifica recente',
    unknownAdminAccess: 'Accesso WordPress',

    problemDetails: 'Descrizione aggiuntiva'
  };

  const valueLabels = {
    yes: 'Sì',
    no: 'No',
    unknown: 'Non lo so',
    wordpress_update: 'Aggiornamento WordPress',
    plugin_update: 'Aggiornamento plugin',
    theme_update: 'Aggiornamento tema',
    site_change: 'Modifiche al sito',
    one_page: 'Una pagina',
    multiple_pages: 'Più pagine',
    whole_site: 'Tutto il sito',
    woocommerce: 'WooCommerce'
  };

  // Recupera dalle domande le etichette
  // leggibili delle risposte scelte.

  const lookup = {};

  Object.values(questions).forEach(q => {

    if (q.saveAs && q.options) {

      for (const o of q.options) {

        lookup[q.saveAs + '|' + o.value] =
          o.label
            .replace(/^[^\p{L}\p{N}]+/u, '')
            .trim();
      }
    }
  });

  return Object.entries(caseData)

    .filter(([key]) => labels[key])

    .map(([key, value]) => {

      const readable =
        lookup[key + '|' + value] ||
        valueLabels[value] ||
        value;

      return `
        <div
          class="data-item"
          style="margin-bottom:9px"
        >

          <span
            style="
              display:block;
              color:#777;
              font-size:11px;
            "
          >
            ${escapeHtml(labels[key])}
          </span>

          <strong
            style="
              display:block;
              font-size:13px;
              white-space:pre-wrap;
            "
          >
            ${escapeHtml(readable)}
          </strong>

        </div>
      `;
    })

    .join('');
}

/* ======================================
   MOSTRA RIEPILOGO
====================================== */

function showCaseSummary() {

  if (summaryShown) return;

  summaryShown = true;

  const div = document.createElement('div');

  div.className = 'case-summary';

  div.style.cssText =
    'background:#fafaf8;' +
    'border:1px solid #e2e2dd;' +
    'border-radius:16px;' +
    'padding:22px;' +
    'margin:0 0 18px';

  const r = results[resultTier];

  const contactInfo = caseData.name
    ? `
        <p>
          ${escapeHtml(caseData.name)}
          · ${escapeHtml(caseData.email)}
          · ${escapeHtml(caseData.website)}
        </p>

        <hr
          style="
            margin:12px 0;
            border:0;
            border-top:1px solid #e2e2dd;
          "
        >
      `
    : '';

  div.innerHTML = `

    <h3 style="margin-bottom:14px">
      📋 Riepilogo della diagnosi
    </h3>

    <p style="margin-bottom:14px">
      <strong>
        ${escapeHtml(r?.label || resultTier)}
      </strong>
      —
      ${escapeHtml(r?.price || '')}
    </p>

    ${contactInfo}

    ${caseRows()}

    <p
      style="
        margin-top:14px;
        font-size:11px;
        color:#777;
      "
    >
      Anteprima locale: nessun dato è stato
      inviato o salvato su un server.
    </p>
  `;

  chat.appendChild(div);
  scrollToBottom();
}

/* ======================================
   FORM CONTATTI — SOLO SIMULAZIONE MVP
====================================== */

submitContact?.addEventListener('click', () => {

  const name = document
    .getElementById('name')
    .value
    .trim();

  const email = document
    .getElementById('email')
    .value
    .trim();

  const website = document
    .getElementById('website')
    .value
    .trim();

  if (!name) {
    alert('Inserisci il nome.');
    return;
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    alert('Inserisci un indirizzo email valido.');
    return;
  }

  if (
    !/^https?:\/\/[^\s.]+(?:\.[^\s]+)+/i.test(website)
  ) {
    alert(
      'Inserisci un URL completo, ' +
      'ad esempio https://iltuosito.it'
    );
    return;
  }

  Object.assign(caseData, {
    name,
    email,
    website
  });

  contactForm.classList.add('hidden');

  addMessage(
    'Riepilogo pronto. Questa è una simulazione: ' +
    'la richiesta non è ancora inviata.'
  );

  showCaseSummary();
});

/* ======================================
   RICOMINCIA LA DIAGNOSI
====================================== */

function restart() {

  // Invalida eventuali animazioni
  // e operazioni asincrone precedenti.

  session++;

  caseData = {};
  currentQuestion = 'start';
  questionCount = 0;
  interactionLocked = true;

  resultShown = false;
  resultTier = '';
  summaryShown = false;

  chat.innerHTML = '';
  options.innerHTML = '';
  resultBox.innerHTML = '';

  resultBox.classList.add('hidden');
  contactForm.classList.add('hidden');

  restartContainer?.classList.add('hidden');

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const website = document.getElementById('website');

  if (name) name.value = '';
  if (email) email.value = '';
  if (website) website.value = '';

  setTyping(false);

  progressBar.style.width = '0%';
  progressCount.textContent = '';

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  showQuestion('start');
}

/* EVENTO DEL PULSANTE RICOMINCIA */

restartButton?.addEventListener('click', restart);

/* AVVIO DELLA CHAT */

showQuestion('start');
