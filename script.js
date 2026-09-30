const chat = document.getElementById("chat");
const options = document.getElementById("options");
const typing = document.getElementById("typing");

const resultBox = document.getElementById("result");
const contactForm = document.getElementById("contact-form");

const submitContact =
    document.getElementById("submit-contact");

const progress =
    document.getElementById("progress");


/* --------------------------------
   STATO
-------------------------------- */

const answers = {};

let questionCount = 0;
let totalQuestions = 5;


/* --------------------------------
   CHAT
-------------------------------- */

function addBotMessage(text) {

    const message =
        document.createElement("div");

    message.className = "message bot";

    message.innerHTML = text;

    chat.appendChild(message);

    scrollToBottom();
}


function addUserMessage(text) {

    const message =
        document.createElement("div");

    message.className = "message user";

    message.textContent = text;

    chat.appendChild(message);

    scrollToBottom();
}


function scrollToBottom() {

    setTimeout(() => {

        window.scrollTo({

            top: document.body.scrollHeight,

            behavior: "smooth"

        });

    }, 50);

}


/* --------------------------------
   TYPING
-------------------------------- */

function showTyping() {

    typing.classList.remove("hidden");

    scrollToBottom();
}


function hideTyping() {

    typing.classList.add("hidden");
}


function botMessage(text, delay = 650) {

    showTyping();

    setTimeout(() => {

        hideTyping();

        addBotMessage(text);

    }, delay);

}


/* --------------------------------
   PROGRESS
-------------------------------- */

function updateProgress() {

    questionCount++;

    const percentage =
        Math.min(
            (questionCount / totalQuestions) * 100,
            90
        );

    progress.style.width =
        `${percentage}%`;
}


/* --------------------------------
   OPTIONS
-------------------------------- */

function showQuestion(id) {

    const question = questions[id];

    if (!question) {

        console.error(
            "Domanda non trovata:",
            id
        );

        return;
    }


    updateProgress();


    botMessage(
        question.text,
        550
    );


    setTimeout(() => {

        options.innerHTML = "";


        question.options.forEach(
            (option, index) => {

                const button =
                    document.createElement("button");

                button.className = "option";

                button.textContent =
                    option.label;


                button.style.animationDelay =
                    `${index * 0.04}s`;


                button.addEventListener(
                    "click",
                    () => {

                        handleAnswer(
                            option
                        );

                    }
                );


                options.appendChild(button);

            }
        );


        scrollToBottom();

    }, 700);

}


/* --------------------------------
   RISPOSTA
-------------------------------- */

function handleAnswer(option) {

    addUserMessage(
        option.label
    );

    options.innerHTML = "";


    answers.lastAnswer =
        option.label;


    if (option.result) {

        answers.result =
            option.result;

        setTimeout(() => {

            showResult(
                option.result
            );

        }, 600);

        return;
    }


    if (option.next) {

        setTimeout(() => {

            showQuestion(
                option.next
            );

        }, 500);

    }

}


/* --------------------------------
   RISULTATI
-------------------------------- */

const results = {

    plugin_update: {

        type: "FIX STANDARD",

        title:
            "Probabile conflitto dopo un aggiornamento",

        description:
            "Le informazioni che ci hai fornito sono compatibili con un problema causato da un plugin aggiornato.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    wordpress_update: {

        type: "FIX STANDARD",

        title:
            "Possibile problema dopo un aggiornamento WordPress",

        description:
            "Potrebbe esserci un problema di compatibilità tra WordPress, il tema o uno dei plugin installati.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    theme_update: {

        type: "FIX STANDARD",

        title:
            "Possibile problema del tema",

        description:
            "Il problema potrebbe essere collegato a un aggiornamento o a una modifica del tema.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    new_plugin: {

        type: "FIX STANDARD",

        title:
            "Possibile conflitto dopo l'installazione di un plugin",

        description:
            "Il problema potrebbe essere comparso dopo l'introduzione di un nuovo plugin.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    error_500: {

        type: "FIX STANDARD",

        title:
            "Probabile errore server o PHP",

        description:
            "Un errore 500 può essere causato da PHP, plugin, tema o configurazione del server.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    white_screen: {

        type: "FIX STANDARD",

        title:
            "Probabile errore PHP",

        description:
            "Una schermata bianca è spesso collegata a un errore PHP o a un conflitto tra plugin e tema.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    database_error: {

        type: "FIX COMPLESSO",

        title:
            "Problema di connessione al database",

        description:
            "WordPress non riesce a collegarsi correttamente al database. Potrebbe essere necessaria una verifica più approfondita.",

        price:
            "€149–249",

        meta:
            "Valutazione iniziale + intervento"

    },


    error_403: {

        type: "FIX STANDARD",

        title:
            "Problema di accesso",

        description:
            "Un errore 403 indica che il server sta impedendo l'accesso alla risorsa richiesta.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    error_404: {

        type: "FIX STANDARD",

        title:
            "Problema di pagina o permalink",

        description:
            "Potrebbe esserci un problema con permalink, pagine o configurazione WordPress.",

        price:
            "€79",

        meta:
            "Diagnosi + intervento + test"

    },


    wrong_password: {

        type: "PREVENTIVO",

        title:
            "Problema di accesso a WordPress",

        description:
            "Per motivi di sicurezza è necessaria una verifica prima di determinare l'intervento.",

        price:
            "Da valutare",

        meta:
            "Valutazione del caso"

    },


    login_page_down: {

        type: "FIX STANDARD",

        title:
            "Pagina di login non disponibile",

        description:
            "Il problema potrebbe essere causato da un plugin, dal tema o dalla configurazione di WordPress.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    login_loop: {

        type: "FIX STANDARD",

        title:
            "Problema durante il login",

        description:
            "Il ciclo continuo di login può dipendere da cookie, plugin, configurazione o URL del sito.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    admin_error: {

        type: "FIX STANDARD",

        title:
            "Errore nell'area amministrativa",

        description:
            "Potrebbe esserci un conflitto o un errore specifico nell'area amministrativa di WordPress.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    woo_cart: {

        type: "FIX STANDARD",

        title:
            "Problema con il carrello WooCommerce",

        description:
            "Possibile problema con WooCommerce, un plugin collegato o la configurazione del carrello.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    woo_checkout: {

        type: "FIX COMPLESSO",

        title:
            "Problema con checkout o pagamento",

        description:
            "Il checkout richiede una verifica più attenta perché può coinvolgere WooCommerce, gateway di pagamento e plugin.",

        price:
            "€149–249",

        meta:
            "Valutazione + intervento"

    },


    woo_orders: {

        type: "FIX STANDARD",

        title:
            "Problema con gli ordini WooCommerce",

        description:
            "Potrebbe essere necessario verificare WooCommerce e i plugin collegati alla gestione degli ordini.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    woo_products: {

        type: "FIX STANDARD",

        title:
            "Problema con prodotti o prezzi",

        description:
            "Il problema potrebbe essere collegato a WooCommerce o a una configurazione dei prodotti.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    woo_emails: {

        type: "FIX STANDARD",

        title:
            "Problema con le email WooCommerce",

        description:
            "Potrebbe esserci un problema nella configurazione email di WooCommerce o nell'invio SMTP.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    contact_email: {

        type: "FIX STANDARD",

        title:
            "Problema con le email del modulo",

        description:
            "Il problema potrebbe riguardare WordPress, il plugin del form o la configurazione SMTP.",

        price:
            "€79",

        meta:
            "Diagnosi + intervento + test"

    },


    wordpress_email: {

        type: "FIX STANDARD",

        title:
            "Problema con l'invio delle email",

        description:
            "Potrebbe essere necessaria una verifica della configurazione email di WordPress.",

        price:
            "€79",

        meta:
            "Diagnosi + intervento + test"

    },


    all_email: {

        type: "FIX STANDARD",

        title:
            "Problema generale con le email",

        description:
            "Il problema potrebbe essere collegato alla configurazione SMTP o all'invio email di WordPress.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    slow_everywhere: {

        type: "PREVENTIVO",

        title:
            "Problema di performance",

        description:
            "La lentezza generale può avere molte cause. Prima di promettere un fix è necessaria un'analisi del sito.",

        price:
            "Da valutare",

        meta:
            "Analisi delle performance"

    },


    slow_pages: {

        type: "PREVENTIVO",

        title:
            "Lentezza localizzata",

        description:
            "Sarà necessario verificare la pagina interessata e capire cosa sta causando il rallentamento.",

        price:
            "Da valutare",

        meta:
            "Analisi del problema"

    },


    slow_admin: {

        type: "PREVENTIVO",

        title:
            "Area WordPress lenta",

        description:
            "La lentezza dell'area amministrativa può avere diverse cause e richiede una verifica.",

        price:
            "Da valutare",

        meta:
            "Analisi del problema"

    },


    slow_woo: {

        type: "PREVENTIVO",

        title:
            "WooCommerce lento",

        description:
            "Le prestazioni di WooCommerce possono dipendere da database, plugin, hosting o configurazione.",

        price:
            "Da valutare",

        meta:
            "Analisi del problema"

    },


    page_problem: {

        type: "FIX STANDARD",

        title:
            "Problema con una pagina",

        description:
            "Potrebbe trattarsi di un problema di contenuto, plugin, tema o configurazione della pagina.",

        price:
            "€99",

        meta:
            "Diagnosi + intervento + test"

    },


    link_problem: {

        type: "FIX STANDARD",

        title:
            "Problema con un link o pulsante",

        description:
            "Possiamo verificare il collegamento e individuare perché non sta funzionando correttamente.",

        price:
            "€79",

        meta:
            "Diagnosi + intervento + test"

    },


    unknown_problem: {

        type: "PREVENTIVO",

        title:
            "Serve una verifica",

        description:
            "Le informazioni disponibili non sono sufficienti per identificare con sicurezza un fix standard.",

        price:
            "Da valutare",

        meta:
            "Valutazione del caso"

    },


    site_down_no_change: {

        type: "FIX COMPLESSO",

        title:
            "Sito non raggiungibile",

        description:
            "Non risultano modifiche recenti. Potrebbe essere necessario verificare hosting, server, DNS o database.",

        price:
            "€149–249",

        meta:
            "Valutazione + intervento"

    },


    site_down_unknown: {

        type: "FIX COMPLESSO",

        title:
            "Sito non raggiungibile",

        description:
            "Non abbiamo ancora abbastanza informazioni per determinare la causa. Possiamo effettuare una verifica.",

        price:
            "€149–249",

        meta:
            "Valutazione + intervento"

    },


    other_error: {

        type: "PREVENTIVO",

        title:
            "Errore da analizzare",

        description:
            "Questo errore richiede qualche informazione aggiuntiva prima di poter determinare il tipo di intervento.",

        price:
            "Da valutare",

        meta:
            "Valutazione del caso"

    },


    admin_unknown: {

        type: "PREVENTIVO",

        title:
            "Problema di accesso da verificare",

        description:
            "Servono ulteriori informazioni per capire se si tratta di un problema standard.",

        price:
            "Da valutare",

        meta:
            "Valutazione del caso"

    },


    woo_other: {

        type: "PREVENTIVO",

        title:
            "Problema WooCommerce da analizzare",

        description:
            "WooCommerce può coinvolgere diversi componenti. È necessaria una verifica prima di definire il lavoro.",

        price:
            "Da valutare",

        meta:
            "Valutazione del caso"

    },


    email_unknown: {

        type: "PREVENTIVO",

        title:
            "Problema email da analizzare",

        description:
            "Servono ulteriori informazioni per capire dove si interrompe il processo di invio.",

        price:
            "Da valutare",

        meta:
            "Valutazione del caso"

    },


    slow_unknown: {

        type: "PREVENTIVO",

        title:
            "Problema di performance da analizzare",

        description:
            "Prima di proporre un intervento è necessario capire cosa sta causando la lentezza.",

        price:
            "Da valutare",

        meta:
            "Analisi delle performance"

    },


    manual_review: {

        type: "PREVENTIVO",

        title:
            "Meglio farlo verificare",

        description:
            "Non è necessario che tu sappia diagnosticare il problema. Possiamo analizzare il caso per te.",

        price:
            "Da valutare",

        meta:
            "Valutazione del caso"

    }

};


/* --------------------------------
   MOSTRA RISULTATO
-------------------------------- */

function showResult(resultId) {

    const result =
        results[resultId] ||
        results.unknown_problem;


    botMessage(
        "Ho analizzato le informazioni che mi hai fornito.",
        700
    );


    setTimeout(() => {

        resultBox.classList.remove(
            "hidden"
        );


        resultBox.innerHTML = `

            <div class="result-label">
                ${result.type}
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

        `;


        progress.style.width = "100%";


        setTimeout(() => {

            addBotMessage(
                "Vuoi ricevere il riepilogo della diagnosi via email?"
            );


            contactForm.classList.remove(
                "hidden"
            );


            scrollToBottom();

        }, 700);

    }, 1000);

}


/* --------------------------------
   FORM
-------------------------------- */

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


        if (!website) {

            alert(
                "Inserisci l'indirizzo del tuo sito."
            );

            return;
        }


        answers.name = name;
        answers.email = email;
        answers.website = website;


        contactForm.classList.add(
            "hidden"
        );


        botMessage(
            `Perfetto ${name} 👋<br><br>` +
            "Abbiamo registrato la tua richiesta.",
            600
        );


        setTimeout(() => {

            addBotMessage(
                "Nella prossima versione collegheremo " +
                "questa richiesta all'invio automatico " +
                "della diagnosi via email."
            );

        }, 1000);

    }
);


/* --------------------------------
   START
-------------------------------- */

setTimeout(() => {

    addBotMessage(
        "Ciao 👋<br><br>" +
        "Ti aiuto a capire cosa potrebbe essere " +
        "successo al tuo sito WordPress.",
        400
    );


    setTimeout(() => {

        showQuestion("start");

    }, 900);

}, 300);
