const questions = {

    start: {

        text:
            "Cosa succede quando provi ad aprire il tuo sito?",

        options: [

            {
                label: "🔴 Non si apre proprio",
                next: "site_down"
            },

            {
                label: "⚠️ Compare un errore",
                next: "error"
            },

            {
                label: "🔐 Non riesco ad accedere a WordPress",
                next: "admin"
            },

            {
                label: "🟡 Si apre, ma qualcosa non funziona",
                next: "something_wrong"
            },

            {
                label: "🤷 Non saprei descriverlo",
                next: "unknown"
            }

        ]
    },


    /* --------------------------------
       SITO DOWN
    -------------------------------- */

    site_down: {

        text:
            "Ok. Vediamo se riusciamo a capire quando è iniziato il problema.",

        options: [

            {
                label: "È successo proprio adesso",
                next: "site_down_update"
            },

            {
                label: "È iniziato oggi",
                next: "site_down_update"
            },

            {
                label: "È da qualche giorno",
                next: "site_down_update"
            },

            {
                label: "Non lo so",
                next: "site_down_update"
            }

        ]
    },


    site_down_update: {

        text:
            "Hai fatto modifiche o aggiornamenti poco prima che comparisse il problema?",

        options: [

            {
                label: "🔌 Ho aggiornato un plugin",
                result: "plugin_update"
            },

            {
                label: "WordPress",
                result: "wordpress_update"
            },

            {
                label: "🎨 Il tema",
                result: "theme_update"
            },

            {
                label: "Ho installato qualcosa",
                result: "new_plugin"
            },

            {
                label: "Non ho modificato nulla",
                result: "site_down_no_change"
            },

            {
                label: "Non lo so",
                result: "site_down_unknown"
            }

        ]
    },


    /* --------------------------------
       ERRORI
    -------------------------------- */

    error: {

        text:
            "Che tipo di errore visualizzi?",

        options: [

            {
                label: "500 / Internal Server Error",
                result: "error_500"
            },

            {
                label: "Schermata completamente bianca",
                result: "white_screen"
            },

            {
                label: "Error establishing database connection",
                result: "database_error"
            },

            {
                label: "403 / Access denied",
                result: "error_403"
            },

            {
                label: "404 / Page not found",
                result: "error_404"
            },

            {
                label: "Un altro errore",
                result: "other_error"
            }

        ]
    },


    /* --------------------------------
       ADMIN
    -------------------------------- */

    admin: {

        text:
            "Cosa succede quando provi ad accedere a WordPress?",

        options: [

            {
                label: "La password non viene accettata",
                result: "wrong_password"
            },

            {
                label: "La pagina di login non si apre",
                result: "login_page_down"
            },

            {
                label: "Dopo il login torno alla schermata di login",
                result: "login_loop"
            },

            {
                label: "Vedo un errore",
                result: "admin_error"
            },

            {
                label: "Non so cosa succede",
                result: "admin_unknown"
            }

        ]
    },


    /* --------------------------------
       SOMETHING WRONG
    -------------------------------- */

    something_wrong: {

        text:
            "Quale parte del sito non funziona correttamente?",

        options: [

            {
                label: "🛒 WooCommerce",
                next: "woocommerce"
            },

            {
                label: "📧 Le email",
                next: "email"
            },

            {
                label: "🐌 Il sito è molto lento",
                next: "slow"
            },

            {
                label: "📄 Una pagina o sezione",
                result: "page_problem"
            },

            {
                label: "🔗 Un pulsante o un link",
                result: "link_problem"
            },

            {
                label: "Altro",
                result: "unknown_problem"
            }

        ]
    },


    /* --------------------------------
       WOOCOMMERCE
    -------------------------------- */

    woocommerce: {

        text:
            "Cosa non funziona in WooCommerce?",

        options: [

            {
                label: "🛒 Il carrello",
                result: "woo_cart"
            },

            {
                label: "💳 Il checkout o pagamento",
                result: "woo_checkout"
            },

            {
                label: "📦 Gli ordini",
                result: "woo_orders"
            },

            {
                label: "💰 Prodotti o prezzi",
                result: "woo_products"
            },

            {
                label: "📧 Le email degli ordini",
                result: "woo_emails"
            },

            {
                label: "Altro",
                result: "woo_other"
            }

        ]
    },


    /* --------------------------------
       EMAIL
    -------------------------------- */

    email: {

        text:
            "Quali email non stanno funzionando?",

        options: [

            {
                label: "Email dei form di contatto",
                result: "contact_email"
            },

            {
                label: "Email di WooCommerce",
                result: "woo_emails"
            },

            {
                label: "Email di WordPress",
                result: "wordpress_email"
            },

            {
                label: "Nessuna email viene inviata",
                result: "all_email"
            },

            {
                label: "Non lo so",
                result: "email_unknown"
            }

        ]
    },


    /* --------------------------------
       SLOW
    -------------------------------- */

    slow: {

        text:
            "Dove noti maggiormente la lentezza?",

        options: [

            {
                label: "🐌 Tutto il sito",
                result: "slow_everywhere"
            },

            {
                label: "Solo alcune pagine",
                result: "slow_pages"
            },

            {
                label: "WordPress / area admin",
                result: "slow_admin"
            },

            {
                label: "WooCommerce",
                result: "slow_woo"
            },

            {
                label: "Non saprei",
                result: "slow_unknown"
            }

        ]
    },


    /* --------------------------------
       UNKNOWN
    -------------------------------- */

    unknown: {

        text:
            "Nessun problema. Ti faccio una domanda molto semplice: quando apri il sito, cosa vedi?",

        options: [

            {
                label: "Il sito funziona normalmente",
                result: "something_wrong"
            },

            {
                label: "Si apre, ma qualcosa è strano",
                result: "unknown_problem"
            },

            {
                label: "Vedo un errore",
                next: "error"
            },

            {
                label: "Non si apre",
                next: "site_down"
            },

            {
                label: "Non riesco a capirlo",
                result: "manual_review"
            }

        ]
    }

};
