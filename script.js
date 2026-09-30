const chat = document.getElementById("chat");
const options = document.getElementById("options");

const typing = document.getElementById("typing");

const resultBox = document.getElementById("result");
const contactForm = document.getElementById("contact-form");

const progressBar =
    document.getElementById("progress-bar");

const progressCount =
    document.getElementById("progress-count");

const submitContact =
    document.getElementById("submit-contact");


/* =========================================
   STATO
========================================= */

const caseData = {};

let currentQuestion = "start";

let questionCount = 0;

let interactionLocked = false;


/*
 * Non mostriamo "3/7" perché i percorsi
 * sono dinamici.
 *
 * Mostriamo invece quante informazioni
 * sono state raccolte.
 */


/* =========================================
   CHAT
========================================= */

function addMessage(text, type = "bot") {

    const message =
        document.createElement("div");

    message.className =
        `message ${type}`;

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


/* =========================================
   TYPING
========================================= */

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


/* =========================================
   PROGRESS
========================================= */

function updateProgress() {

    questionCount++;

    progressCount.textContent =
        `${questionCount} ${questionCount === 1 ? "informazione" : "informazioni"} raccolte`;

    const width =
        Math.min(
            15 + questionCount * 10,
            90
        );

    progressBar.style.width =
        `${width}%`;

}


/* =========================================
   DOMANDA
========================================= */

async function showQuestion(id) {

    const question =
        questions[id];

    if (!question) {

        console.error(
            "Domanda non trovata:",
            id
        );

        return;

    }


    currentQuestion = id;

    interactionLocked = true;


    updateProgress();


    /*
     * Domanda introduttiva senza opzioni.
     */

    if (question.next && !question.options) {

        showTyping();

        await wait(650);

        hideTyping();

        addMessage(question.text);

        await wait(450);

        showQuestion(question.next);

        return;

    }


    showTyping();

    await wait(650);

    hideTyping();

    addMessage(question.text);


    await wait(350);


    renderOptions(
        question.options
    );


    interactionLocked = false;

}


/* =========================================
   OPZIONI
========================================= */

function renderOptions(questionOptions) {

    options.innerHTML = "";


    questionOptions.forEach(
        (option, index) => {

            const button =
                document.createElement("button");

            button.className =
                "option";


            button.textContent =
                option.label;


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

        }
    );


    requestAnimationFrame(() => {

        options.classList.add("show");

    });


    scrollToBottom();

}


/* =========================================
   RISPOSTA
========================================= */

async function handleAnswer(option) {

    if (interactionLocked) {
        return;
    }


    interactionLocked = true;


    options.classList.remove("show");


    await wait(120);


    options.innerHTML = "";


    addUserMessage(
        option.label
    );


    /*
     * Salviamo la risposta.
     */

    if (questions[currentQuestion].saveAs) {

        const field =
            questions[currentQuestion].saveAs;

        caseData[field] =
            option.value;

    }


    /*
     * Piccola pausa naturale.
     */

    await wait(400);


    /*
     * Risultato finale.
     */

    if (option.result) {

        showResult(
            option.result
        );

        return;

    }


    /*
     * Prossima domanda.
     */

    if (option.next) {

        interactionLocked = false;

        await wait(250);

        showQuestion(
            option.next
        );

    }

}


/* =========================================
   RISULTATO
========================================= */

async function showResult(resultId) {

    showTyping();

    await wait(850);

    hideTyping();


    const result =
        results[resultId];


    progressBar.style.width =
        "100%";


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

        <div class="result-meta">
            ${result.meta}
        </div>

        <button
            id="result-button"
            class="result-button"
        >
            ${result.button}
        </button>

    `;


    resultBox.classList.remove(
        "hidden"
    );


    await wait(500);


    addMessage(
        "Se vuoi procedere, lasciaci i tuoi dati e prepariamo la richiesta."
    );


    await wait(350);


    contactForm.classList.remove(
        "hidden"
    );


    const resultButton =
        document.getElementById(
            "result-button"
        );


    resultButton.addEventListener(
        "click",
        () => {

            contactForm.scrollIntoView({
                behavior: "smooth"
            });

        }
    );


    interactionLocked = false;

    scrollToBottom();

}


/* =========================================
   FORM
========================================= */

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


        caseData.name =
            name;

        caseData.email =
            email;

        caseData.website =
            website;


        contactForm.classList.add(
            "hidden"
        );


        addMessage(
            `Perfetto ${escapeHtml(name)} 👋`,
            "bot"
        );


        setTimeout(() => {

            addMessage(
                "La tua richiesta è pronta per essere inviata."
            );

        }, 600);


        /*
         * PER ORA:
         * mostriamo semplicemente il riepilogo.
         *
         * Nel prossimo step collegheremo
         * questo punto all'email.
         */

        setTimeout(() => {

            showCaseSummary();

        }, 1200);

    }
);


/* =========================================
   RIEPILOGO
========================================= */

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
            <span>Nome</span>
            <strong>
                ${escapeHtml(caseData.name)}
            </strong>
        </div>

        <div class="summary-row">
            <span>Email</span>
            <strong>
                ${escapeHtml(caseData.email)}
            </strong>
        </div>

        <div class="summary-row">
            <span>Sito</span>
            <strong>
                ${escapeHtml(caseData.website)}
            </strong>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-data">
            ${formatCaseData()}
        </div>

    `;


    chat.appendChild(
        summary
    );


    scrollToBottom();

}


/* =========================================
   FORMAT DATI
========================================= */

function formatCaseData() {

    const labels = {

        mainProblem: "Problema principale",

        siteBehaviour: "Comportamento del sito",

        errorType: "Errore",

        recentChange: "Modifica recente",

        adminAccess: "Accesso WordPress",

        adminProblem: "Problema WordPress",

        publicSite: "Sito pubblico",

        wooProblem: "Problema WooCommerce",

        wooUpdate: "Aggiornamento WooCommerce",

        slowArea: "Area lenta",

        slowHistory: "Storia lentezza",

        slowDevice: "Dispositivo",

        emailType: "Tipo email",

        emailDirection: "Direzione email",

        emailHistory: "Storia problema email",

        emailChange: "Modifica email",

        functionProblem: "Funzionalità",

        functionScope: "Ambito",

        functionChange: "Modifica recente",

        problemStillPresent: "Problema presente"

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


function formatValue(value) {

    const map = {

        yes: "Sì",

        no: "No",

        unknown: "Non lo so",

        intermittent: "Intermittente",

        plugin_update:
            "Aggiornamento plugin",

        wordpress_update:
            "Aggiornamento WordPress",

        theme_update:
            "Aggiornamento tema",

        installation:
            "Installazione",

        nothing:
            "Nessuna modifica"

    };


    return map[value] || value;

}


/* =========================================
   UTILITY
========================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

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


/* =========================================
   START
========================================= */

setTimeout(() => {

    showQuestion(
        "start"
    );

}, 400);
