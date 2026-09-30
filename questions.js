const questions = {

    /* =========================================
       START
    ========================================= */

    start: {

        text: "Cosa sta succedendo al tuo sito?",

        saveAs: "mainProblem",

        options: [

            {
                label: "🔴 Il sito non si apre",
                value: "site_down",
                next: "site_down_1"
            },

            {
                label: "🔐 Non riesco ad accedere a WordPress",
                value: "admin",
                next: "admin_1"
            },

            {
                label: "🛒 WooCommerce non funziona",
                value: "woocommerce",
                next: "woo_1"
            },

            {
                label: "🐌 Il sito è molto lento",
                value: "slow",
                next: "slow_1"
            },

            {
                label: "📧 Le email non funzionano",
                value: "email",
                next: "email_1"
            },

            {
                label: "🧩 Qualcosa non funziona",
                value: "something_wrong",
                next: "function_1"
            },

            {
                label: "🤷 Non so cosa non va",
                value: "unknown",
                next: "unknown_1"
            }

        ]

    },


    /* =========================================
       1. SITO NON SI APRE
    ========================================= */

    site_down_1: {

        text: "Cosa succede quando apri il tuo sito?",

        saveAs: "siteBehaviour",

        options: [

            {
                label: "🔴 Non si apre / dà errore",
                value: "error",
                next: "site_down_error"
            },

            {
                label: "⚪ Schermata completamente bianca",
                value: "white_screen",
                next: "site_down_change"
            },

            {
                label: "🟠 Compare una pagina di errore",
                value: "error_page",
                next: "site_down_error"
            },

            {
                label: "🟢 Si apre, ma qualcosa non funziona",
                value: "partially_working",
                next: "function_1"
            }

        ]

    },


    site_down_error: {

        text: "Che errore vedi?",

        saveAs: "errorType",

        options: [

            {
                label: "500 / Internal Server Error",
                value: "500",
                next: "site_down_change"
            },

            {
                label: "Error establishing a database connection",
                value: "database",
                next: "site_down_change"
            },

            {
                label: "403 / Access denied",
                value: "403",
                next: "site_down_change"
            },

            {
                label: "404 / Page not found",
                value: "404",
                next: "site_down_change"
            },

            {
                label: "Un altro errore",
                value: "other",
                next: "site_down_change"
            },

            {
                label: "Non lo so",
                value: "unknown",
                next: "site_down_change"
            }

        ]

    },


    site_down_change: {

        text: "Hai fatto qualcosa poco prima che comparisse il problema?",

        saveAs: "recentChange",

        options: [

            {
                label: "Ho aggiornato un plugin",
                value: "plugin_update",
                next: "site_down_admin"
            },

            {
                label: "Ho aggiornato WordPress",
                value: "wordpress_update",
                next: "site_down_admin"
            },

            {
                label: "Ho aggiornato il tema",
                value: "theme_update",
                next: "site_down_admin"
            },

            {
                label: "Ho installato qualcosa",
                value: "installation",
                next: "site_down_admin"
            },

            {
                label: "Non ho modificato nulla",
                value: "nothing",
                next: "site_down_admin"
            },

            {
                label: "Non lo so",
                value: "unknown",
                next: "site_down_admin"
            }

        ]

    },


    site_down_admin: {

        text: "Riesci ad accedere al pannello WordPress?",

        saveAs: "adminAccess",

        options: [

            {
                label: "Sì",
                value: "yes",
                next: "site_down_still"
            },

            {
                label: "No",
                value: "no",
                next: "site_down_still"
            },

            {
                label: "Non lo so",
                value: "unknown",
                next: "site_down_still"
            }

        ]

    },


    site_down_still: {

        text: "Il problema è ancora presente?",

        saveAs: "problemStillPresent",

        options: [

            {
                label: "Sì, è ancora presente",
                value: "yes",
                result: "site_down_result"
            },

            {
                label: "È intermittente",
                value: "intermittent",
                result: "site_down_result"
            },

            {
                label: "Non lo so",
                value: "unknown",
                result: "site_down_result"
            }

        ]

    },


    /* =========================================
       2. WORDPRESS ADMIN
    ========================================= */

    admin_1: {

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
                value: "login_down",
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
                next: "admin_error"
            },

            {
                label: "Altro",
                value: "other",
                next: "admin_public"
            }

        ]

    },


    admin_error: {

        text: "Che tipo di errore vedi?",

        saveAs: "adminError",

        options: [

            {
                label: "Errore 500",
                value: "500",
                next: "admin_public"
            },

            {
                label: "Schermata bianca",
                value: "white_screen",
                next: "admin_public"
            },

            {
                label: "Errore di accesso",
                value: "access",
                next: "admin_public"
            },

            {
                label: "Un altro errore",
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

        text: "Hai fatto modifiche o aggiornamenti prima del problema?",

        saveAs: "adminRecentChange",

        options: [

            {
                label: "Sì, ho aggiornato qualcosa",
                value: "update",
                next: "admin_still"
            },

            {
                label: "Sì, ho installato qualcosa",
                value: "installation",
                next: "admin_still"
            },

            {
                label: "No",
                value: "nothing",
                next: "admin_still"
            },

            {
                label: "Non lo so",
                value: "unknown",
                next: "admin_still"
            }

        ]

    },


    admin_still: {

        text: "Il problema è ancora presente?",

        saveAs: "problemStillPresent",

        options: [

            {
                label: "Sì",
                value: "yes",
                result: "admin_result"
            },

            {
                label: "È intermittente",
                value: "intermittent",
                result: "admin_result"
            },

            {
                label: "Non lo so",
                value: "unknown",
                result: "admin_result"
            }

        ]

    },


    /* =========================================
       3. WOOCOMMERCE
    ========================================= */

    woo_1: {

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
                next: "woo_still"
            },

            {
                label: "No",
                value: "no",
                next: "woo_still"
            },

            {
                label: "Non lo so",
                value: "unknown",
                next: "woo_still"
            }

        ]

    },


    woo_still: {

        text: "Il problema è ancora presente?",

        saveAs: "problemStillPresent",

        options: [

            {
                label: "Sì",
                value: "yes",
                result: "woo_result"
            },

            {
                label: "È intermittente",
                value: "intermittent",
                result: "woo_result"
            },

            {
                label: "Non lo so",
                value: "unknown",
                result: "woo_result"
            }

        ]

    },


    /* =========================================
       4. SITO LENTO
    ========================================= */

    slow_1: {

        text: "Dove lo noti principalmente?",

        saveAs: "slowArea",

        options: [

            {
                label: "Tutto il sito è lento",
                value: "whole_site",
                next: "slow_when"
            },

            {
                label: "Solo alcune pagine",
                value: "pages",
                next: "slow_when"
            },

            {
                label: "WordPress / area admin",
                value: "admin",
                next: "slow_when"
            },

            {
                label: "WooCommerce",
                value: "woocommerce",
                next: "slow_when"
            },

            {
                label: "Non saprei",
                value: "unknown",
                next: "slow_when"
            }

        ]

    },


    slow_when: {

        text: "È sempre stato lento o è iniziato recentemente?",

        saveAs: "slowHistory",

        options: [

            {
                label: "È sempre stato lento",
                value: "always",
                next: "slow_device"
            },

            {
                label: "È peggiorato recentemente",
                value: "recent",
                next: "slow_device"
            },

            {
                label: "È diventato lento improvvisamente",
                value: "sudden",
                next: "slow_device"
            },

            {
                label: "Non lo so",
                value: "unknown",
                next: "slow_device"
            }

        ]

    },


    slow_device: {

        text: "Succede sia da computer che da smartphone?",

        saveAs: "slowDevice",

        options: [

            {
                label: "Sì, su entrambi",
                value: "both",
                result: "slow_result"
            },

            {
                label: "Solo da computer",
                value: "desktop",
                result: "slow_result"
            },

            {
                label: "Solo da smartphone",
                value: "mobile",
                result: "slow_result"
            },

            {
                label: "Non lo so",
                value: "unknown",
                result: "slow_result"
            }

        ]

    },


    /* =========================================
       5. EMAIL
    ========================================= */

    email_1: {

        text: "Quali email non vengono inviate?",

        saveAs: "emailType",

        options: [

            {
                label: "Form di contatto",
                value: "contact",
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
                value: "send",
                next: "email_history"
            },

            {
                label: "Non ricevo",
                value: "receive",
                next: "email_history"
            },

            {
                label: "Entrambi",
                value: "both",
                next: "email_history"
            },

            {
                label: "Non lo so",
                value: "unknown",
                next: "email_history"
            }

        ]

    },


    email_history: {

        text: "Il problema è comparso recentemente?",

        saveAs: "emailHistory",

        options: [

            {
                label: "Sì",
                value: "recent",
                next: "email_change"
            },

            {
                label: "No, non ha mai funzionato",
                value: "always",
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

        text: "Hai modificato qualcosa prima del problema?",

        saveAs: "emailChange",

        options: [

            {
                label: "Hosting / email",
                value: "hosting_email",
                result: "email_result"
            },

            {
                label: "Plugin",
                value: "plugin",
                result: "email_result"
            },

            {
                label: "WordPress",
                value: "wordpress",
                result: "email_result"
            },

            {
                label: "Nulla",
                value: "nothing",
                result: "email_result"
            },

            {
                label: "Non lo so",
                value: "unknown",
                result: "email_result"
            }

        ]

    },


    /* =========================================
       6. QUALCOSA NON FUNZIONA
    ========================================= */

    function_1: {

        text: "Cosa non funziona?",

        saveAs: "functionProblem",

        options: [

            {
                label: "Una pagina",
                value: "page",
                next: "function_location"
            },

            {
                label: "Un'immagine / elemento grafico",
                value: "visual",
                next: "function_location"
            },

            {
                label: "Un modulo",
                value: "form",
                next: "function_location"
            },

            {
                label: "Un pulsante / link",
                value: "link",
                next: "function_location"
            },

            {
                label: "Una funzionalità",
                value: "feature",
                next: "function_location"
            },

            {
                label: "WooCommerce",
                value: "woocommerce",
                next: "woo_1"
            },

            {
                label: "Altro",
                value: "other",
                next: "function_location"
            }

        ]

    },


    function_location: {

        text: "Il problema riguarda tutto il sito o una parte?",

        saveAs: "functionScope",

        options: [

            {
                label: "Tutto il sito",
                value: "whole_site",
                next: "function_change"
            },

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
                label: "Non lo so",
                value: "unknown",
                next: "function_change"
            }

        ]

    },


    function_change: {

        text: "Il problema è comparso dopo una modifica?",

        saveAs: "functionChange",

        options: [

            {
                label: "Sì, dopo un aggiornamento",
                value: "update",
                next: "function_still"
            },

            {
                label: "Sì, dopo una modifica",
                value: "modification",
                next: "function_still"
            },

            {
                label: "No",
                value: "no",
                next: "function_still"
            },

            {
                label: "Non lo so",
                value: "unknown",
                next: "function_still"
            }

        ]

    },


    function_still: {

        text: "Il problema è ancora presente?",

        saveAs: "problemStillPresent",

        options: [

            {
                label: "Sì",
                value: "yes",
                result: "function_result"
            },

            {
                label: "È intermittente",
                value: "intermittent",
                result: "function_result"
            },

            {
                label: "Non lo so",
                value: "unknown",
                result: "function_result"
            }

        ]

    },


    /* =========================================
       7. NON SO COSA NON VA
    ========================================= */

    unknown_1: {

        text: "Nessun problema. Ti faccio qualche domanda per capire cosa sta succedendo.",

        next: "unknown_2"

    },


    unknown_2: {

        text: "Quando apri il sito, cosa vedi?",

        saveAs: "unknownBehaviour",

        options: [

            {
                label: "Funziona normalmente",
                value: "normal",
                next: "unknown_3"
            },

            {
                label: "Si apre ma c'è qualcosa di strano",
                value: "strange",
                next: "function_1"
            },

            {
                label: "Vedo un errore",
                value: "error",
                next: "site_down_error"
            },

            {
                label: "Non si apre",
                value: "down",
                next: "site_down_1"
            },

            {
                label: "Non riesco a capirlo",
                value: "unknown",
                next: "unknown_3"
            }

        ]

    },


    unknown_3: {

        text: "Qual è la cosa principale che ti preoccupa?",

        saveAs: "unknownConcern",

        options: [

            {
                label: "Una pagina non funziona",
                value: "page",
                next: "function_1"
            },

            {
                label: "Una funzione non funziona",
                value: "function",
                next: "function_1"
            },

            {
                label: "Il sito è lento",
                value: "slow",
                next: "slow_1"
            },

            {
                label: "Le email non funzionano",
                value: "email",
                next: "email_1"
            },

            {
                label: "Non riesco ancora a capirlo",
                value: "manual",
                result: "manual_result"
            }

        ]

    }

};
