const chat = document.getElementById("chat");
const options = document.getElementById("options");
const typing = document.getElementById("typing");

const resultBox = document.getElementById("result");
const contactForm = document.getElementById("contact-form");

const progressBar = document.getElementById("progress-bar");
const progressCount = document.getElementById("progress-count");

const submitContact = document.getElementById("submit-contact");


/* =====================================================
   STATO
===================================================== */

const caseData = {};

let currentQuestion = "start";
let questionCount = 0;
let interactionLocked = false;


/* =====================================================
   MESSAGGI
===================================================== */

function addMessage(text, type = "bot") {

    const message = document.createElement("div");

    message.className = `message ${type}`;

    message.innerHTML = text;

    chat.appendChild(message);

    requestAnimationFrame(() => {
        message.classList.add("visible");
    });

    scrollToBottom();
}


function addUserMessage(text) {
    addMessage(text, "user");
}


/* =====================================================
   TYPING
===================================================== */

function showTyping() {

    typing.classList.remove("hidden");

    scrollToBottom();
}


function hideTyping() {

    typing.classList.add("hidden");
}


function wait(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });

}


/* =====================================================
   PROGRESS
===================================================== */

function updateProgress() {

    questionCount++;

    progressCount.textContent =
        `${questionCount} ${questionCount === 1 ? "informazione" : "informazioni"} raccolte`;

    const width =
        Math.min(
            8 + questionCount * 8,
            92
        );

    progressBar.style.width =
        `${width}%`;
}


/* =====================================================
   MOSTRA DOMANDA
===================================================== */

async function showQuestion(id) {

    const question = questions[id];

    if (!question) {

        console.error(
            "Nodo non trovato:",
            id
        );

        return;
    }

    currentQuestion = id;

    interactionLocked = true;


    /* Risultato diretto */

    if (question.result) {

        showResult(question.result);

        return;
    }


    updateProgress();


    showTyping();

    await wait(550);

    hideTyping();


    addMessage(question.text);


    /*
     * Domanda introduttiva senza risposte.
     */

    if (
        question.next &&
        !question.options
    ) {

        await wait(350);

        showQuestion(question.next);

        return;
    }


    await wait(300);


    renderOptions(question.options);

    interactionLocked = false;
}


/* =====================================================
   OPZIONI
===================================================== */

function renderOptions(questionOptions) {

    options.innerHTML = "";

    options.classList.remove("show");


    questionOptions.forEach((option, index) => {

        const button =
            document.createElement("button");

        button.className = "option";

        button.textContent = option.label;

        button.style.animationDelay =
            `${index * 60}ms`;


        button.addEventListener(
            "click",
            () => {

                if (interactionLocked) {
                    return;
                }

                handleAnswer(option);

            }
        );


        options.appendChild(button);

    });


    requestAnimationFrame(() => {

        options.classList.add("show");

    });


    scrollToBottom();
}


/* =====================================================
   RISPOSTA
===================================================== */

async function handleAnswer(option) {

    if (interactionLocked) {
        return;
    }

    interactionLocked = true;


    options.classList.remove("show");

    await wait(120);

    options.innerHTML = "";


    addUserMessage(option.label);


    const question =
        questions[currentQuestion];


    if (
        question &&
        question.saveAs
    ) {

        caseData[question.saveAs] =
            option.value;

    }


    await wait(400);


    if (option.result) {

        showResult(option.result);

        return;
    }


    if (option.next) {

        await wait(250);

        showQuestion(option.next);

        return;
    }


    interactionLocked = false;
}


/* =====================================================
   DETERMINAZIONE INTELLIGENTE DEL TIER
===================================================== */

function resolveResult(resultId) {

    /*
     * -------------------------------------------------
     * SITO NON RAGGIUNGIBILE / ERRORI
     * -------------------------------------------------
     */

    if (resultId === "SMART_SITE") {

        const errorType =
            caseData.errorType;

        const recentChange =
            caseData.recentChange;

        /*
         * Errori tecnici importanti
         */

        if (
            errorType === "500" ||
            errorType === "database"
        ) {
            return "COMPLEX";
        }


        /*
         * Errori generici non identificabili
         */

        if (
            errorType === "other_error" ||
            errorType === "unknown"
        ) {
            return "QUOTE";
        }


        /*
         * 403 può essere semplice,
         * ma se il problema è comparso
         * dopo modifiche importanti lo trattiamo
         * come possibile intervento complesso.
         */

        if (
            errorType === "403" &&
            (
                recentChange === "wordpress_update" ||
                recentChange === "theme_update" ||
                recentChange === "installation"
            )
        ) {
            return "COMPLEX";
        }


        /*
         * 404 / 403 / problemi circoscritti
         */

        return "FIX";
    }


    /* -------------------------------------------------
       SITO PARZIALMENTE FUNZIONANTE
       ------------------------------------------------- */

    if (resultId === "SMART_PARTIAL") {

        const scope =
            caseData.partialScope;

        const problem =
            caseData.sitePartialProblem;

        const change =
            caseData.partialChange;


        /*
         * WooCommerce viene trattato
         * più attentamente.
         */

        if (
            problem === "woocommerce"
        ) {
            return "COMPLEX";
        }


        /*
         * Più pagine = maggiore complessità.
         */

        if (
            scope === "multiple_pages" ||
            scope === "whole_site"
        ) {

            if (
                change === "update" ||
                change === "site_change"
            ) {
                return "COMPLEX";
            }

            return "QUOTE";
        }


        /*
         * Una singola pagina / funzione
         */

        return "FIX";
    }


    /* -------------------------------------------------
       ACCESSO WORDPRESS
       ------------------------------------------------- */

    if (resultId === "SMART_ADMIN") {

        const problem =
            caseData.adminProblem;

        const publicSite =
            caseData.publicSite;

        const change =
            caseData.adminChange;


        /*
         * Login loop, errore o pagina login
         * non accessibile possono richiedere
         * debugging.
         */

        if (
            problem === "login_loop" ||
            problem === "error" ||
            problem === "login_page"
        ) {
            return "COMPLEX";
        }


        /*
         * Password semplice = fix standard.
         */

        if (
            problem === "password" &&
            publicSite === "yes"
        ) {
            return "FIX";
        }


        /*
         * Se l'accesso problematico è comparso
         * dopo un aggiornamento/modifica,
         * aumentiamo il livello.
         */

        if (
            change === "update" ||
            change === "change"
        ) {
            return "COMPLEX";
        }


        return "FIX";
    }


    /* -------------------------------------------------
       WOOCOMMERCE
       ------------------------------------------------- */

    if (resultId === "SMART_WOO") {

        const problem =
            caseData.wooProblem;


        /*
         * Funzioni commerciali critiche:
         * checkout e pagamenti.
         */

        if (
            problem === "checkout"
        ) {
            return "COMPLEX";
        }


        /*
         * Ordini possono coinvolgere
         * più componenti WooCommerce.
         */

        if (
            problem === "orders"
        ) {
            return "COMPLEX";
        }


        /*
         * Carrello: se circoscritto può
         * essere ancora un fix.
         */

        if (
            problem === "cart"
        ) {
            return "FIX";
        }


        /*
         * Prodotti/prezzi possono essere
         * semplici problemi circoscritti.
         */

        if (
            problem === "products"
        ) {
            return "FIX";
        }


        /*
         * Email WooCommerce semplici.
         */

        if (
            problem === "emails"
        ) {
            return "FIX";
        }


        /*
         * "Altro" è troppo generico.
         */

        return "QUOTE";
    }


    /* -------------------------------------------------
       EMAIL
       ------------------------------------------------- */

    if (resultId === "SMART_EMAIL") {

        const type =
            caseData.emailType;

        const direction =
            caseData.emailDirection;


        /*
         * Email WordPress semplici
         */

        if (
            type === "wordpress" ||
            type === "contact_form"
        ) {
            return "FIX";
        }


        /*
         * WooCommerce email:
         * possono essere semplici, ma se
         * riguardano tutto il sistema
         * preferiamo una valutazione.
         */

        if (
            type === "woocommerce"
        ) {
            return "FIX";
        }


        /*
         * Tutte le email + entrambi i versi
         * è un problema più ampio.
         */

        if (
            type === "all" &&
            direction === "both"
        ) {
            return "COMPLEX";
        }


        /*
         * Problema non determinabile
         */

        if (
            type === "unknown" ||
            direction === "unknown"
        ) {
            return "QUOTE";
        }


        return "FIX";
    }


    /* -------------------------------------------------
       FUNZIONALITÀ / ELEMENTI
       ------------------------------------------------- */

    if (resultId === "SMART_FUNCTION") {

        const problem =
            caseData.functionProblem;

        const scope =
            caseData.functionScope;

        const change =
            caseData.functionChange;


        /*
         * WooCommerce viene trattato come
         * intervento commerciale/tecnico.
         */

        if (
            problem === "woocommerce"
        ) {
            return "COMPLEX";
        }


        /*
         * Tutto il sito + modifica recente
         */

        if (
            scope === "whole_site" &&
            (
                change === "wordpress_update" ||
                change === "plugin_update" ||
                change === "theme_update" ||
                change === "installation"
            )
        ) {
            return "COMPLEX";
        }


        /*
         * Più pagine + aggiornamento
         */

        if (
            scope === "multiple_pages" &&
            (
                change === "wordpress_update" ||
                change === "plugin_update" ||
                change === "theme_update"
            )
        ) {
            return "COMPLEX";
        }


        /*
         * Problema circoscritto
         */

        if (
            scope === "one_page"
        ) {
            return "FIX";
        }


        return "FIX";
    }


    /*
     * Se abbiamo già un risultato esplicito,
     * lo manteniamo.
     */

    return resultId;
}


/* =====================================================
   RISULTATO
===================================================== */

async function showResult(resultId) {

    interactionLocked = true;

    showTyping();

    await wait(850);

    hideTyping();


    /*
     * Risolviamo il risultato effettivo
     * in base alle risposte raccolte.
     */

    const resolvedResultId =
        resolveResult(resultId);


    const result =
        results[resolvedResultId];


    if (!result) {

        console.error(
            "Risultato non trovato:",
            resolvedResultId
        );

        return;
    }


    progressBar.style.width = "100%";

    progressCount.textContent =
        "Analisi completata";


    addMessage(
        "Ho analizzato le informazioni che mi hai fornito."
    );


    await wait(500);


    resultBox.innerHTML = `

        <div class="result-icon">
            ${result.icon}
        </div>

        <div class="result-label">
            ${result.label}
        </div>

        <h2>
            ${result.title}
        </h2>

        <p class="result-description">
            ${result.description}
        </p>

        <div class="result-price">
            ${result.price}
        </div>

        <div class="result-price-label">
            ${result.meta}
        </div>

        <button
            id="result-button"
            class="result-button primary"
        >
            ${result.button}
        </button>

    `;


    resultBox.classList.remove("hidden");


    await wait(500);


    addMessage(
        "Se vuoi procedere, lasciaci i tuoi dati e prepariamo la richiesta."
    );


    await wait(350);


    contactForm.classList.remove("hidden");


    const resultButton =
        document.getElementById("result-button");


    if (resultButton) {

        resultButton.addEventListener(
            "click",
            () => {

                contactForm.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }
        );

    }


    interactionLocked = false;

    scrollToBottom();
}


/* =====================================================
   FORM CONTATTO
===================================================== */

submitContact.addEventListener(
    "click",
    () => {

        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const website =
            document
                .getElementById("website")
                .value
                .trim();


        if (!name) {

            alert(
                "Inserisci il tuo nome."
            );

            return;
        }


        if (!email) {

            alert(
                "Inserisci la tua email."
            );

            return;
        }


        if (!isValidEmail(email)) {

            alert(
                "Inserisci un indirizzo email valido."
            );

            return;
        }


        if (!website) {

            alert(
                "Inserisci l'indirizzo del tuo sito."
            );

            return;
        }


        caseData.name = name;

        caseData.email = email;

        caseData.website = website;


        contactForm.classList.add("hidden");


        addMessage(
            `Perfetto ${escapeHtml(name)} 👋`,
            "bot"
        );


        setTimeout(() => {

            addMessage(
                "La tua richiesta è pronta per essere inviata."
            );

        }, 600);


        setTimeout(() => {

            showCaseSummary();

        }, 1200);

    }
);


/* =====================================================
   RIEPILOGO
===================================================== */

function showCaseSummary() {

    const summary =
        document.createElement("div");

    summary.className =
        "case-summary";


    summary.innerHTML = `

        <div class="summary-title">
            📋 Riepilogo richiesta
        </div>

        <div class="summary-row">

            <span>
                Nome
            </span>

            <strong>
                ${escapeHtml(caseData.name)}
            </strong>

        </div>

        <div class="summary-row">

            <span>
                Email
            </span>

            <strong>
                ${escapeHtml(caseData.email)}
            </strong>

        </div>

        <div class="summary-row">

            <span>
                Sito
            </span>

            <strong>
                ${escapeHtml(caseData.website)}
            </strong>

        </div>

        <div class="summary-divider">
        </div>

        <div class="summary-data">

            ${formatCaseData()}

        </div>

    `;


    chat.appendChild(summary);

    scrollToBottom();
}


/* =====================================================
   FORMAT DATI
===================================================== */

function formatCaseData() {

    const labels = {

        mainProblem:
            "Problema principale",

        siteBehaviour:
            "Comportamento del sito",

        errorType:
            "Errore",

        recentChange:
            "Modifica recente",

        adminAccess:
            "Accesso WordPress",

        hostingAccess:
            "Accesso hosting",

        adminProblem:
            "Problema WordPress",

        publicSite:
            "Sito pubblico",

        adminChange:
            "Modifica recente",

        wooProblem:
            "Problema WooCommerce",

        wooUpdate:
            "Aggiornamento WooCommerce",

        wooAdminAccess:
            "Accesso WordPress",

        sitePartialProblem:
            "Problema del sito",

        partialScope:
            "Ambito",

        partialChange:
            "Modifica recente",

        slowArea:
            "Area lenta",

        slowHistory:
            "Storia lentezza",

        slowChange:
            "Modifica recente",

        emailType:
            "Tipo email",

        emailDirection:
            "Direzione email",

        emailChange:
            "Modifica email",

        functionProblem:
            "Elemento non funzionante",

        functionScope:
            "Ambito",

        imageBehavior:
            "Problema elemento grafico",

        functionChange:
            "Modifica recente",

        functionAdminAccess:
            "Accesso WordPress",

        unknownBehaviour:
            "Comportamento del sito",

        unknownScope:
            "Ambito",

        unknownChange:
            "Modifica recente",

        unknownAdminAccess:
            "Accesso WordPress"

    };


    return Object.entries(caseData)

        .filter(
            ([key]) =>
                labels[key]
        )

        .map(
            ([key, value]) => `

                <div class="data-item">

                    <span>
                        ${labels[key]}
                    </span>

                    <strong>
                        ${escapeHtml(
                            formatValue(value)
                        )}
                    </strong>

                </div>

            `
        )

        .join("");
}


/* =====================================================
   FORMAT VALORI
===================================================== */

function formatValue(value) {

    const map = {

        yes:
            "Sì",

        no:
            "No",

        unknown:
            "Non lo so",

        plugin_update:
            "Aggiornamento plugin",

        wordpress_update:
            "Aggiornamento WordPress",

        theme_update:
            "Aggiornamento tema",

        installation:
            "Installazione",

        nothing:
            "Nessuna modifica",

        update:
            "Aggiornamento",

        change:
            "Modifica",

        page_change:
            "Modifica della pagina",

        one_page:
            "Una sola pagina",

        multiple_pages:
            "Più pagine",

        whole_site:
            "Tutto il sito",

        not_visible:
            "Non viene visualizzata",

        broken:
            "Immagine rotta / errore",

        missing:
            "Elemento sparito",

        display:
            "Visualizzazione errata",

        checkout:
            "Checkout / pagamento",

        cart:
            "Carrello",

        orders:
            "Ordini",

        products:
            "Prezzi / prodotti",

        emails:
            "Email WooCommerce",

        woocommerce:
            "WooCommerce",

        wordpress:
            "Email WordPress",

        contact_form:
            "Form di contatto",

        sending:
            "Invio",

        receiving:
            "Ricezione",

        both:
            "Invio e ricezione",

        error:
            "Errore",

        500:
            "500 / Internal Server Error",

        database:
            "Database connection error",

        403:
            "403 / Access denied",

        404:
            "404 / Page not found"

    };


    return map[value] || value;
}


/* =====================================================
   UTILITY
===================================================== */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


function scrollToBottom() {

    setTimeout(() => {

        window.scrollTo({

            top:
                document.body.scrollHeight,

            behavior:
                "smooth"

        });

    }, 50);

}


/* =====================================================
   AVVIO
===================================================== */

setTimeout(() => {

    showQuestion("start");

}, 400);
