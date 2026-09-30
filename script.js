const chat = document.getElementById("chat");
const options = document.getElementById("options");

const contactForm = document.getElementById("contact-form");
const submitContact = document.getElementById("submit-contact");


// --------------------------------------------------
// STATO DELLA DIAGNOSI
// --------------------------------------------------

const answers = {};


// --------------------------------------------------
// FUNZIONI CHAT
// --------------------------------------------------

function addBotMessage(text) {

    const message = document.createElement("div");

    message.className = "message bot";

    message.innerHTML = text;

    chat.appendChild(message);

}


function addUserMessage(text) {

    const message = document.createElement("div");

    message.className = "message user";

    message.textContent = text;

    chat.appendChild(message);

}


function showOptions(items) {

    options.innerHTML = "";

    items.forEach(item => {

        const button = document.createElement("button");

        button.className = "option";

        button.textContent = item.label;

        button.addEventListener("click", () => {

            addUserMessage(item.label);

            options.innerHTML = "";

            item.action();

        });

        options.appendChild(button);

    });

}


// --------------------------------------------------
// INIZIO
// --------------------------------------------------

function startDiagnosis() {

    addBotMessage(
        "Ciao 👋<br><br>" +
        "Ti aiuto a capire cosa potrebbe essere successo " +
        "al tuo sito WordPress."
    );

    setTimeout(() => {

        addBotMessage(
            "Prima di tutto: <strong>cosa non funziona?</strong>"
        );

        showOptions([

            {
                label: "Il sito è completamente offline",
                action: () => chooseProblem("site_down")
            },

            {
                label: "Vedo un errore",
                action: () => chooseProblem("error")
            },

            {
                label: "Non riesco ad accedere a WordPress",
                action: () => chooseProblem("admin")
            },

            {
                label: "Qualcosa non funziona correttamente",
                action: () => chooseProblem("something_wrong")
            },

            {
                label: "Non sono sicuro",
                action: () => chooseProblem("unknown")
            }

        ]);

    }, 500);

}


// --------------------------------------------------
// PROBLEMA PRINCIPALE
// --------------------------------------------------

function chooseProblem(problem) {

    answers.problem = problem;


    if (problem === "site_down") {

        addBotMessage(
            "Ok. Vediamo se riusciamo a capire cosa ha causato " +
            "il problema."
        );

        setTimeout(() => {

            addBotMessage(
                "Hai fatto qualche aggiornamento recentemente?"
            );

            showOptions([

                {
                    label: "Sì",
                    action: () => recentUpdate(true)
                },

                {
                    label: "No",
                    action: () => recentUpdate(false)
                },

                {
                    label: "Non lo so",
                    action: () => recentUpdate(null)
                }

            ]);

        }, 400);

        return;
    }


    if (problem === "error") {

        addBotMessage(
            "Che tipo di errore visualizzi?"
        );

        showOptions([

            {
                label: "Schermata bianca",
                action: () => finishDiagnosis("white_screen")
            },

            {
                label: "Errore 500",
                action: () => finishDiagnosis("error_500")
            },

            {
                label: "Errore 404",
                action: () => finishDiagnosis("error_404")
            },

            {
                label: "Un altro errore",
                action: () => finishDiagnosis("other_error")
            }

        ]);

        return;
    }


    if (problem === "admin") {

        addBotMessage(
            "Il sito pubblico è visibile normalmente?"
        );

        showOptions([

            {
                label: "Sì, il sito funziona",
                action: () => finishDiagnosis("admin_down")
            },

            {
                label: "No, anche il sito è offline",
                action: () => finishDiagnosis("site_and_admin_down")
            }

        ]);

        return;
    }


    if (
        problem === "something_wrong" ||
        problem === "unknown"
    ) {

        addBotMessage(
            "Nessun problema. Facciamo qualche domanda " +
            "per capire meglio."
        );

        showOptions([

            {
                label: "Il problema riguarda WooCommerce",
                action: () => finishDiagnosis("woocommerce")
            },

            {
                label: "Il sito è molto lento",
                action: () => finishDiagnosis("slow")
            },

            {
                label: "Le email non funzionano",
                action: () => finishDiagnosis("email")
            },

            {
                label: "Altro",
                action: () => finishDiagnosis("unknown")
            }

        ]);

    }

}


// --------------------------------------------------
// AGGIORNAMENTO
// --------------------------------------------------

function recentUpdate(value) {

    answers.recentUpdate = value;


    if (value === true) {

        addBotMessage(
            "Quale tipo di aggiornamento hai fatto?"
        );

        showOptions([

            {
                label: "Plugin",
                action: () => finishDiagnosis("plugin_update")
            },

            {
                label: "Tema",
                action: () => finishDiagnosis("theme_update")
            },

            {
                label: "WordPress",
                action: () => finishDiagnosis("wordpress_update")
            },

            {
                label: "Non lo so",
                action: () => finishDiagnosis("unknown_update")
            }

        ]);

    } else {

        finishDiagnosis("site_down_no_update");

    }

}


// --------------------------------------------------
// DIAGNOSI
// --------------------------------------------------

function finishDiagnosis(type) {

    answers.diagnosisType = type;


    let title = "";
    let description = "";
    let price = "";
    let status = "";


    switch (type) {

        case "plugin_update":

            title = "Probabile conflitto dopo un aggiornamento";

            description =
                "Le informazioni che ci hai fornito sono compatibili " +
                "con un problema causato da un plugin aggiornato.";

            price = "€99";

            status = "standard";

            break;


        case "theme_update":

            title = "Possibile problema del tema";

            description =
                "Il problema potrebbe essere collegato a un " +
                "aggiornamento del tema.";

            price = "€99";

            status = "standard";

            break;


        case "wordpress_update":

            title = "Possibile problema dopo un aggiornamento WordPress";

            description =
                "Potrebbe essere necessario verificare la compatibilità " +
                "tra WordPress, tema e plugin.";

            price = "€99";

            status = "standard";

            break;


        case "white_screen":

            title = "Probabile errore PHP";

            description =
                "Una schermata bianca può essere causata da un errore " +
                "PHP o da un conflitto tra plugin o tema.";

            price = "€99";

            status = "standard";

            break;


        case "error_500":

            title = "Probabile errore server / PHP";

            description =
                "L'errore 500 indica generalmente un problema lato server " +
                "o nell'esecuzione di PHP.";

            price = "€99";

            status = "standard";

            break;


        case "error_404":

            title = "Problema di pagina o configurazione";

            description =
                "Potrebbe trattarsi di un problema con permalink, " +
                "pagine o configurazione WordPress.";

            price = "79€";

            status = "standard";

            break;


        case "admin_down":

            title = "Accesso WordPress non disponibile";

            description =
                "Il sito pubblico funziona ma l'accesso amministrativo " +
                "sembra essere bloccato.";

            price = "€99";

            status = "standard";

            break;


        case "woocommerce":

            title = "Problema WooCommerce";

            description =
                "Potrebbe essere necessario verificare checkout, plugin " +
                "o configurazione WooCommerce.";

            price = "€99+";

            status = "review";

            break;


        case "slow":

            title = "Problema di prestazioni";

            description =
                "La lentezza può avere diverse cause e potrebbe richiedere " +
                "un'analisi più approfondita.";

            price = "Da valutare";

            status = "review";

            break;


        case "email":

            title = "Problema email";

            description =
                "La mancata ricezione delle email può dipendere da " +
                "WordPress, SMTP o dalla configurazione del dominio.";

            price = "€99";

            status = "standard";

            break;


        default:

            title = "Serve una verifica";

            description =
                "Da queste informazioni non possiamo determinare con " +
                "sufficiente certezza il problema.";

            price = "Da valutare";

            status = "review";

    }


    showResult(title, description, price, status);

}


// --------------------------------------------------
// RISULTATO
// --------------------------------------------------

function showResult(title, description, price, status) {

    addBotMessage(
        "Ho analizzato le informazioni che mi hai fornito."
    );


    setTimeout(() => {

        const result = document.createElement("div");

        result.className = "result";

        result.innerHTML = `
            <strong>🔍 ${title}</strong>

            <p style="margin-top:10px;">
                ${description}
            </p>

            <div class="result-price">
                ${price}
            </div>
        `;

        chat.appendChild(result);


        setTimeout(() => {

            addBotMessage(
                "Vuoi ricevere il riepilogo della diagnosi via email?"
            );

            contactForm.classList.remove("hidden");

        }, 500);

    }, 500);

}


// --------------------------------------------------
// FORM CONTATTO
// --------------------------------------------------

submitContact.addEventListener("click", () => {

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();


    if (!name || !email) {

        alert("Inserisci nome ed email.");

        return;

    }


    addBotMessage(
        `Perfetto ${name}! Abbiamo salvato la tua richiesta.`
    );


    contactForm.classList.add("hidden");

});


// --------------------------------------------------
// AVVIO
// --------------------------------------------------

startDiagnosis();
