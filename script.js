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
   ALBERO DIAGNOSTICO
===================================================== */

const questions = {

    /* =================================================
       START
    ================================================= */

    start: {
        text: "Cosa sta succedendo al tuo sito?",
        saveAs: "mainProblem",
        options: [
            {
                label: "🔴 Il sito non si apre",
                value: "site_down",
                next: "site_down"
            },
            {
                label: "🔐 Non riesco ad accedere a WordPress",
                value: "wordpress_access",
                next: "wordpress_access"
            },
            {
                label: "🛒 WooCommerce non funziona",
                value: "woocommerce",
                next: "woocommerce"
            },
            {
                label: "🐌 Il sito è molto lento",
                value: "slow",
                next: "slow"
            },
            {
                label: "📧 Le email non funzionano",
                value: "email",
                next: "email"
            },
            {
                label: "🧩 Qualcosa non funziona",
                value: "something_wrong",
                next: "something_wrong"
            },
            {
                label: "🤷 Non so cosa non va",
                value: "unknown_problem",
                next: "unknown_problem"
            }
        ]
    },


    /* =================================================
       1. IL SITO NON SI APRE
    ================================================= */

    site_down: {
        text: "Cosa succede quando apri il tuo sito?",
        saveAs: "siteBehaviour",
        options: [
            {
                label: "🔴 Non si apre / dà errore",
                value: "error",
                next: "site_error"
            },
            {
                label: "⚪ Schermata completamente bianca",
                value: "white_screen",
                next: "site_change"
            },
            {
                label: "🟠 Compare una pagina di errore",
                value: "error_page",
                next: "site_error"
            },
            {
                label: "🟢 Si apre, ma qualcosa non funziona",
                value: "partially_working",
                next: "site_partial"
            }
        ]
    },

    site_error: {
        text: "Che errore vedi?",
        saveAs: "errorType",
        options: [
            {
                label: "500 / Internal Server Error",
                value: "500",
                next: "site_change"
            },
            {
                label: "Error establishing a database connection",
                value: "database",
                next: "site_change"
            },
            {
                label: "403 / Access denied",
                value: "403",
                next: "site_change"
            },
            {
                label: "404 / Page not found",
                value: "404",
                next: "site_change"
            },
            {
                label: "Un altro errore",
                value: "other_error",
                next: "site_change"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "site_change"
            }
        ]
    },

    site_change: {
        text: "Hai fatto qualcosa poco prima che comparisse il problema?",
        saveAs: "recentChange",
        options: [
            {
                label: "Ho aggiornato un plugin",
                value: "plugin_update",
                next: "site_access"
            },
            {
                label: "Ho aggiornato WordPress",
                value: "wordpress_update",
                next: "site_access"
            },
            {
                label: "Ho aggiornato il tema",
                value: "theme_update",
                next: "site_access"
            },
            {
                label: "Ho installato qualcosa",
                value: "installation",
                next: "site_access"
            },
            {
                label: "Non ho modificato nulla",
                value: "nothing",
                next: "site_access"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "site_access"
            }
        ]
    },

    site_access: {
        text: "Riesci ad accedere all'amministrazione di WordPress?",
        saveAs: "adminAccess",
        options: [
            {
                label: "Sì",
                value: "yes",
                next: "site_hosting"
            },
            {
                label: "No",
                value: "no",
                next: "site_hosting"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "site_hosting"
            }
        ]
    },

    site_hosting: {
        text: "Hai accesso al pannello del tuo hosting?",
        saveAs: "hostingAccess",
        options: [
            {
                label: "Sì",
                value: "yes",
                next: "site_result"
            },
            {
                label: "No",
                value: "no",
                next: "site_result"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "site_result"
            }
        ]
    },

    site_result: {
        result: "FIX"
    },


    /* =================================================
       SITO PARZIALMENTE FUNZIONANTE
    ================================================= */

    site_partial: {
        text: "Cosa non funziona?",
        saveAs: "sitePartialProblem",
        options: [
            {
                label: "Una pagina",
                value: "page",
                next: "partial_scope"
            },
            {
                label: "Una funzionalità",
                value: "function",
                next: "partial_scope"
            },
            {
                label: "Un modulo",
                value: "form",
                next: "partial_scope"
            },
            {
                label: "WooCommerce",
                value: "woocommerce",
                next: "partial_scope"
            },
            {
                label: "Altro",
                value: "other",
                next: "partial_scope"
            }
        ]
    },

    partial_scope: {
        text: "Il problema riguarda una sola pagina o più parti del sito?",
        saveAs: "partialScope",
        options: [
            {
                label: "Una sola pagina",
                value: "one_page",
                next: "partial_change"
            },
            {
                label: "Più pagine",
                value: "multiple_pages",
                next: "partial_change"
            },
            {
                label: "Tutto il sito",
                value: "whole_site",
                next: "partial_change"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "partial_change"
            }
        ]
    },

    partial_change: {
        text: "Il problema è comparso dopo una modifica?",
        saveAs: "partialChange",
        options: [
            {
                label: "Sì, dopo un aggiornamento",
                value: "update",
                next: "partial_access"
            },
            {
                label: "Sì, dopo una modifica al sito",
                value: "site_change",
                next: "partial_access"
            },
            {
                label: "No",
                value: "no",
                next: "partial_access"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "partial_access"
            }
        ]
    },

    partial_access: {
        text: "Riesci ad accedere normalmente a WordPress?",
        saveAs: "adminAccess",
        options: [
            {
                label: "Sì",
                value: "yes",
                next: "partial_result"
            },
            {
                label: "No",
                value: "no",
                next: "partial_result_complex"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "partial_result"
            }
        ]
    },

    partial_result: {
        result: "FIX"
    },

    partial_result_complex: {
        result: "COMPLEX"
    },


    /* =================================================
       2. ACCESSO WORDPRESS
    ================================================= */

    wordpress_access: {
        text: "Cosa succede quando provi ad accedere?",
        saveAs: "adminProblem",
        options: [
            {
                label: "La password non viene accettata",
                value: "password",
                next: "admin_public"
            },
            {
                label: "La pagina di login non si apre",
                value: "login_page",
                next: "admin_public"
            },
            {
                label: "Dopo il login torno alla schermata di login",
                value: "login_loop",
                next: "admin_public"
            },
            {
                label: "Vedo un errore",
                value: "error",
                next: "admin_public"
            },
            {
                label: "Altro",
                value: "other",
                next: "admin_public"
            }
        ]
    },

    admin_public: {
        text: "Il sito pubblico è ancora visibile?",
        saveAs: "publicSite",
        options: [
            {
                label: "Sì",
                value: "yes",
                next: "admin_change"
            },
            {
                label: "No",
                value: "no",
                next: "admin_change"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "admin_change"
            }
        ]
    },

    admin_change: {
        text: "Il problema è comparso dopo una modifica o un aggiornamento?",
        saveAs: "adminChange",
        options: [
            {
                label: "Sì, dopo un aggiornamento",
                value: "update",
                next: "admin_result"
            },
            {
                label: "Sì, dopo una modifica",
                value: "change",
                next: "admin_result"
            },
            {
                label: "No",
                value: "no",
                next: "admin_result"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "admin_result"
            }
        ]
    },

    admin_result: {
        result: "FIX"
    },


    /* =================================================
       3. WOOCOMMERCE
    ================================================= */

    woocommerce: {
        text: "Cosa non funziona?",
        saveAs: "wooProblem",
        options: [
            {
                label: "🛒 Carrello",
                value: "cart",
                next: "woo_update"
            },
            {
                label: "💳 Checkout / pagamento",
                value: "checkout",
                next: "woo_update"
            },
            {
                label: "📦 Ordini",
                value: "orders",
                next: "woo_update"
            },
            {
                label: "💰 Prezzi / prodotti",
                value: "products",
                next: "woo_update"
            },
            {
                label: "📧 Email degli ordini",
                value: "emails",
                next: "woo_update"
            },
            {
                label: "Altro",
                value: "other",
                next: "woo_update"
            }
        ]
    },

    woo_update: {
        text: "Il problema è comparso dopo un aggiornamento?",
        saveAs: "wooUpdate",
        options: [
            {
                label: "Sì",
                value: "yes",
                next: "woo_access"
            },
            {
                label: "No",
                value: "no",
                next: "woo_access"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "woo_access"
            }
        ]
    },

    woo_access: {
        text: "Riesci ad accedere normalmente a WordPress?",
        saveAs: "wooAdminAccess",
        options: [
            {
                label: "Sì",
                value: "yes",
                next: "woo_result"
            },
            {
                label: "No",
                value: "no",
                next: "woo_result_complex"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "woo_result"
            }
        ]
    },

    woo_result: {
        result: "FIX"
    },

    woo_result_complex: {
        result: "COMPLEX"
    },


    /* =================================================
       4. SITO LENTO
    ================================================= */

    slow: {
        text: "Dove noti principalmente la lentezza?",
        saveAs: "slowArea",
        options: [
            {
                label: "Tutto il sito è lento",
                value: "whole_site",
                next: "slow_history"
            },
            {
                label: "Solo alcune pagine",
                value: "pages",
                next: "slow_history"
            },
            {
                label: "WordPress / area admin",
                value: "admin",
                next: "slow_history"
            },
            {
                label: "WooCommerce",
                value: "woocommerce",
                next: "slow_history"
            },
            {
                label: "Non saprei",
                value: "unknown",
                next: "slow_history"
            }
        ]
    },

    slow_history: {
        text: "È sempre stato lento o è iniziato recentemente?",
        saveAs: "slowHistory",
        options: [
            {
                label: "È sempre stato lento",
                value: "always",
                next: "slow_change"
            },
            {
                label: "È peggiorato recentemente",
                value: "recent",
                next: "slow_change"
            },
            {
                label: "È diventato lento improvvisamente",
                value: "suddenly",
                next: "slow_change"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "slow_change"
            }
        ]
    },

    slow_change: {
        text: "Hai fatto qualche modifica o aggiornamento prima di notare il problema?",
        saveAs: "slowChange",
        options: [
            {
                label: "Sì, ho aggiornato qualcosa",
                value: "update",
                next: "slow_result"
            },
            {
                label: "Sì, ho modificato il sito",
                value: "change",
                next: "slow_result"
            },
            {
                label: "No",
                value: "no",
                next: "slow_result"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "slow_result"
            }
        ]
    },

    slow_result: {
        result: "QUOTE"
    },


    /* =================================================
       5. EMAIL
    ================================================= */

    email: {
        text: "Quali email non vengono inviate?",
        saveAs: "emailType",
        options: [
            {
                label: "Form di contatto",
                value: "contact_form",
                next: "email_direction"
            },
            {
                label: "Email WooCommerce",
                value: "woocommerce",
                next: "email_direction"
            },
            {
                label: "Email di WordPress",
                value: "wordpress",
                next: "email_direction"
            },
            {
                label: "Tutte",
                value: "all",
                next: "email_direction"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "email_direction"
            }
        ]
    },

    email_direction: {
        text: "Il problema riguarda l'invio, la ricezione o entrambi?",
        saveAs: "emailDirection",
        options: [
            {
                label: "Non riesco a inviare",
                value: "sending",
                next: "email_change"
            },
            {
                label: "Non ricevo",
                value: "receiving",
                next: "email_change"
            },
            {
                label: "Entrambi",
                value: "both",
                next: "email_change"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "email_change"
            }
        ]
    },

    email_change: {
        text: "Il problema è comparso dopo una modifica o un aggiornamento?",
        saveAs: "emailChange",
        options: [
            {
                label: "Sì",
                value: "yes",
                next: "email_result"
            },
            {
                label: "No",
                value: "no",
                next: "email_result"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "email_result"
            }
        ]
    },

    email_result: {
        result: "FIX"
    },


    /* =================================================
       6. QUALCOSA NON FUNZIONA
    ================================================= */

    something_wrong: {
        text: "Cosa non funziona?",
        saveAs: "functionProblem",
        options: [
            {
                label: "Una pagina",
                value: "page",
                next: "function_scope"
            },
            {
                label: "Un'immagine / elemento grafico",
                value: "image",
                next: "image_scope"
            },
            {
                label: "Un modulo",
                value: "form",
                next: "function_scope"
            },
            {
                label: "Un pulsante / link",
                value: "button",
                next: "function_scope"
            },
            {
                label: "Una funzionalità",
                value: "function",
                next: "function_scope"
            },
            {
                label: "WooCommerce",
                value: "woocommerce",
                next: "function_scope"
            },
            {
                label: "Altro",
                value: "other",
                next: "function_scope"
            }
        ]
    },


    /* -------------------------------------------------
       IMMAGINI / ELEMENTI GRAFICI
    ------------------------------------------------- */

    image_scope: {
        text: "Dove si verifica il problema?",
        saveAs: "functionScope",
        options: [
            {
                label: "Una sola pagina",
                value: "one_page",
                next: "image_behavior"
            },
            {
                label: "Più pagine",
                value: "multiple_pages",
                next: "image_behavior"
            },
            {
                label: "In tutto il sito",
                value: "whole_site",
                next: "image_behavior"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "image_behavior"
            }
        ]
    },

    image_behavior: {
        text: "Cosa succede esattamente?",
        saveAs: "imageBehavior",
        options: [
            {
                label: "L'immagine non viene visualizzata",
                value: "not_visible",
                next: "function_change"
            },
            {
                label: "L'immagine è rotta / mostra un errore",
                value: "broken",
                next: "function_change"
            },
            {
                label: "L'elemento è sparito",
                value: "missing",
                next: "function_change"
            },
            {
                label: "L'elemento appare ma è visualizzato male",
                value: "display",
                next: "function_change"
            },
            {
                label: "Altro",
                value: "other",
                next: "function_change"
            }
        ]
    },

    function_scope: {
        text: "Il problema riguarda tutto il sito o una parte?",
        saveAs: "functionScope",
        options: [
            {
                label: "Una sola pagina",
                value: "one_page",
                next: "function_change"
            },
            {
                label: "Più pagine",
                value: "multiple_pages",
                next: "function_change"
            },
            {
                label: "Tutto il sito",
                value: "whole_site",
                next: "function_change"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "function_change"
            }
        ]
    },

    function_change: {
        text: "Il problema è comparso dopo qualcosa che hai fatto?",
        saveAs: "functionChange",
        options: [
            {
                label: "Ho aggiornato WordPress",
                value: "wordpress_update",
                next: "function_access"
            },
            {
                label: "Ho aggiornato un plugin",
                value: "plugin_update",
                next: "function_access"
            },
            {
                label: "Ho aggiornato il tema",
                value: "theme_update",
                next: "function_access"
            },
            {
                label: "Ho modificato la pagina",
                value: "page_change",
                next: "function_access"
            },
            {
                label: "Ho installato qualcosa",
                value: "installation",
                next: "function_access"
            },
            {
                label: "Non ho modificato nulla",
                value: "nothing",
                next: "function_access"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "function_access"
            }
        ]
    },

    function_access: {
        text: "Hai accesso all'amministrazione di WordPress?",
        saveAs: "functionAdminAccess",
        options: [
            {
                label: "Sì",
                value: "yes",
                next: "function_result"
            },
            {
                label: "No",
                value: "no",
                next: "function_result_complex"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "function_result"
            }
        ]
    },

    function_result: {
        result: "FIX"
    },

    function_result_complex: {
        result: "COMPLEX"
    },


    /* =================================================
       7. NON SO COSA NON VA
    ================================================= */

    unknown_problem: {
        text: "Nessun problema. Ti faccio qualche domanda per capire cosa sta succedendo.",
        next: "unknown_site"
    },

    unknown_site: {
        text: "Quando apri il sito, cosa vedi?",
        saveAs: "unknownBehaviour",
        options: [
            {
                label: "Funziona normalmente",
                value: "normal",
                next: "unknown_strange"
            },
            {
                label: "Si apre ma c'è qualcosa di strano",
                value: "strange",
                next: "unknown_strange"
            },
            {
                label: "Vedo un errore",
                value: "error",
                next: "unknown_strange"
            },
            {
                label: "Non si apre",
                value: "down",
                next: "unknown_strange"
            },
            {
                label: "Non riesco a capirlo",
                value: "unknown",
                next: "unknown_strange"
            }
        ]
    },

    unknown_strange: {
        text: "Il problema riguarda una parte specifica del sito?",
        saveAs: "unknownScope",
        options: [
            {
                label: "Sì, una pagina",
                value: "page",
                next: "unknown_change"
            },
            {
                label: "Sì, una funzionalità",
                value: "function",
                next: "unknown_change"
            },
            {
                label: "No, riguarda tutto il sito",
                value: "whole_site",
                next: "unknown_change"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "unknown_change"
            }
        ]
    },

    unknown_change: {
        text: "Hai notato il problema dopo qualcosa che hai fatto?",
        saveAs: "unknownChange",
        options: [
            {
                label: "Sì, dopo un aggiornamento",
                value: "update",
                next: "unknown_access"
            },
            {
                label: "Sì, dopo una modifica",
                value: "change",
                next: "unknown_access"
            },
            {
                label: "No",
                value: "no",
                next: "unknown_access"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "unknown_access"
            }
        ]
    },

    unknown_access: {
        text: "Riesci ad accedere a WordPress?",
        saveAs: "unknownAdminAccess",
        options: [
            {
                label: "Sì",
                value: "yes",
                next: "unknown_result"
            },
            {
                label: "No",
                value: "no",
                next: "unknown_result_complex"
            },
            {
                label: "Non lo so",
                value: "unknown",
                next: "unknown_result"
            }
        ]
    },

    unknown_result: {
        result: "QUOTE"
    },

    unknown_result_complex: {
        result: "COMPLEX"
    }

};


/* =====================================================
   RISULTATI
===================================================== */

const results = {

    FIX: {
        icon: "🔧",
        label: "FIX STANDARD",
        title: "Possiamo occuparcene",
        description:
            "Sembra un problema che rientra nei nostri interventi standard. Analizziamo il problema, interveniamo e verifichiamo che il sito torni a funzionare correttamente.",
        price: "€99",
        meta: "Diagnosi + intervento + test",
        button: "Voglio risolverlo"
    },

    COMPLEX: {
        icon: "🟠",
        label: "POSSIBILE FIX COMPLESSO",
        title: "Sembra un problema che possiamo risolvere",
        description:
            "Il problema potrebbe però richiedere un intervento più approfondito. Prima di iniziare verificheremo esattamente cosa è necessario fare.",
        price: "€149–€249",
        meta: "Stima preliminare",
        button: "Richiedi la valutazione"
    },

    QUOTE: {
        icon: "📋",
        label: "PREVENTIVO",
        title: "Questo richiede un intervento personalizzato",
        description:
            "Abbiamo bisogno di valutare meglio il problema prima di stabilire il lavoro necessario e il relativo prezzo.",
        price: "Su richiesta",
        meta: "Valutazione personalizzata",
        button: "Ricevi il preventivo"
    },

    OUT: {
        icon: "🚫",
        label: "FUORI SCOPE",
        title: "Questo intervento non rientra nei nostri fix standard",
        description:
            "Possiamo comunque valutare il caso e dirti se possiamo aiutarti.",
        price: "Da valutare",
        meta: "Valutazione manuale",
        button: "Invia il problema"
    }

};


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
            "Visualizzazione errata"

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
