/* =====================================================
   ELEMENTI DOM
===================================================== */

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
   AVVIO
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {

        showQuestion("start");

    }, 400);

});


/* =====================================================
   MESSAGGI
===================================================== */

function addMessage(text, type = "bot") {

    const message =
        document.createElement("div");

    message.className =
        `message ${type}`;

    message.textContent = text;

    chat.appendChild(message);

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


/* =====================================================
   UTILITY WAIT
===================================================== */

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
        `${questionCount} ${
            questionCount === 1
                ? "informazione"
                : "informazioni"
        } raccolte`;


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

    const question =
        questions[id];


    if (!question) {

        console.error(
            "Nodo domanda non trovato:",
            id
        );

        interactionLocked = false;

        return;

    }


    currentQuestion = id;

    interactionLocked = true;


    /* ---------------------------------------------
       RISULTATO DIRETTO
    --------------------------------------------- */

    if (question.result) {

        await showResult(question.result);

        return;

    }


    /* ---------------------------------------------
       PROGRESS
    --------------------------------------------- */

    updateProgress();


    /* ---------------------------------------------
       TYPING
    --------------------------------------------- */

    showTyping();

    await wait(550);

    hideTyping();


    /* ---------------------------------------------
       MESSAGGIO
    --------------------------------------------- */

    addMessage(question.text);


    /* ---------------------------------------------
       NODO INTRODUTTIVO
    --------------------------------------------- */

    if (
        question.next &&
        !question.options
    ) {

        await wait(350);

        showQuestion(question.next);

        return;

    }


    /* ---------------------------------------------
       OPZIONI
    --------------------------------------------- */

    await wait(300);

    renderOptions(question.options);

    interactionLocked = false;

}


/* =====================================================
   RENDER OPZIONI
===================================================== */

function renderOptions(questionOptions) {

    options.innerHTML = "";


    if (
        !questionOptions ||
        !questionOptions.length
    ) {

        return;

    }


    questionOptions.forEach(
        (option, index) => {

            const button =
                document.createElement("button");


            button.type = "button";

            button.className = "option";

            button.textContent =
                option.label;


            button.style.animationDelay =
                `${index * 60}ms`;


            button.addEventListener(
                "click",
                () => {

                    handleAnswer(option);

                }
            );


            options.appendChild(button);

        }
    );


    scrollToBottom();

}


/* =====================================================
   GESTIONE RISPOSTA
===================================================== */

async function handleAnswer(option) {

    if (interactionLocked) {

        return;

    }


    interactionLocked = true;


    options.innerHTML = "";


    addUserMessage(
        option.label
    );


    const question =
        questions[currentQuestion];


    /* ---------------------------------------------
       SALVATAGGIO RISPOSTA
    --------------------------------------------- */

    if (
        question &&
        question.saveAs
    ) {

        caseData[question.saveAs] =
            option.value;

    }


    await wait(400);


    /* ---------------------------------------------
       RISULTATO
    --------------------------------------------- */

    if (option.result) {

        await showResult(option.result);

        return;

    }


    /* ---------------------------------------------
       PROSSIMA DOMANDA
    --------------------------------------------- */

    if (option.next) {

        await wait(250);

        showQuestion(option.next);

        return;

    }


    interactionLocked = false;

}


/* =====================================================
   RISULTATO
===================================================== */

async function showResult(resultId) {

    interactionLocked = true;


    showTyping();

    await wait(850);

    hideTyping();


    const result =
        results[resultId];


    if (!result) {

        console.error(
            "Risultato non trovato:",
            resultId
        );

        interactionLocked = false;

        return;

    }


    /* ---------------------------------------------
       PROGRESS COMPLETO
    --------------------------------------------- */

    progressBar.style.width =
        "100%";


    progressCount.textContent =
        "Analisi completata";


    /* ---------------------------------------------
       MESSAGGIO
    --------------------------------------------- */

    addMessage(
        "Ho analizzato le informazioni che mi hai fornito."
    );


    await wait(500);


    /* ---------------------------------------------
       RISULTATO
    --------------------------------------------- */

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
            type="button"
        >
            ${result.button}
        </button>

    `;


    resultBox.classList.remove(
        "hidden"
    );


    await wait(500);


    /* ---------------------------------------------
       INVITO AL FORM
    --------------------------------------------- */

    addMessage(
        "Se vuoi procedere, lasciaci i tuoi dati e prepariamo la richiesta."
    );


    await wait(350);


    contactForm.classList.remove(
        "hidden"
    );


    /* ---------------------------------------------
       BUTTON RISULTATO
    --------------------------------------------- */

    const resultButton =
        document.getElementById(
            "result-button"
        );


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
    handleContactSubmit
);


function handleContactSubmit() {

    const nameInput =
        document.getElementById("name");


    const emailInput =
        document.getElementById("email");


    const websiteInput =
        document.getElementById("website");


    const name =
        nameInput.value.trim();


    const email =
        emailInput.value.trim();


    const website =
        websiteInput.value.trim();


    /* ---------------------------------------------
       VALIDAZIONE NOME
    --------------------------------------------- */

    if (!name) {

        alert(
            "Inserisci il tuo nome."
        );

        nameInput.focus();

        return;

    }


    /* ---------------------------------------------
       VALIDAZIONE EMAIL
    --------------------------------------------- */

    if (!email) {

        alert(
            "Inserisci la tua email."
        );

        emailInput.focus();

        return;

    }


    if (!isValidEmail(email)) {

        alert(
            "Inserisci un indirizzo email valido."
        );

        emailInput.focus();

        return;

    }


    /* ---------------------------------------------
       VALIDAZIONE SITO
    --------------------------------------------- */

    if (!website) {

        alert(
            "Inserisci l'indirizzo del tuo sito."
        );

        websiteInput.focus();

        return;

    }


    /* ---------------------------------------------
       SALVATAGGIO
    --------------------------------------------- */

    caseData.name =
        name;

    caseData.email =
        email;

    caseData.website =
        website;


    /* ---------------------------------------------
       NASCONDI FORM
    --------------------------------------------- */

    contactForm.classList.add(
        "hidden"
    );


    /* ---------------------------------------------
       CONFERMA
    --------------------------------------------- */

    addMessage(
        `Perfetto ${name} 👋`
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

        <div class="summary-divider"></div>

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

        error:
            "Errore",

        white_screen:
            "Schermata bianca",

        error_page:
            "Pagina di errore",

        partially_working:
            "Parzialmente funzionante",

        500:
            "Errore 500",

        database:
            "Errore database",

        403:
            "Errore 403",

        404:
            "Errore 404",

        password:
            "Password non accettata",

        login_page:
            "Pagina login non disponibile",

        login_loop:
            "Loop di login",

        cart:
            "Carrello",

        checkout:
            "Checkout / pagamento",

        orders:
            "Ordini",

        products:
            "Prezzi / prodotti",

        emails:
            "Email ordini",

        contact_form:
            "Form di contatto",

        sending:
            "Invio",

        receiving:
            "Ricezione",

        both:
            "Invio e ricezione",

        always:
            "Sempre stato lento",

        recent:
            "Peggiorato recentemente",

        suddenly:
            "Diventato lento improvvisamente",

        pages:
            "Alcune pagine",

        admin:
            "Area amministrazione",

        normal:
            "Funziona normalmente",

        strange:
            "Comportamento anomalo",

        down:
            "Non si apre"

    };


    return map[value] || value;

}


/* =====================================================
   VALIDAZIONE EMAIL
===================================================== */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


/* =====================================================
   SCROLL
===================================================== */

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
