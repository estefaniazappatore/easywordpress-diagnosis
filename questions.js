
/* EasyWordPress MVP — Albero diagnostico completo */

const questions = {

  start: {
    text: 'Cosa sta succedendo al tuo sito?',
    saveAs: 'mainProblem',
    options: [
      {label:'🔴 Il sito non si apre',value:'site_down',next:'site_down'},
      {label:'🔐 Non riesco ad accedere a WordPress',value:'wordpress_access',next:'wordpress_access'},
      {label:'🛒 WooCommerce non funziona',value:'woocommerce',next:'woocommerce'},
      {label:'🐌 Il sito è molto lento',value:'slow',next:'slow'},
      {label:'📧 Le email non funzionano',value:'email',next:'email'},
      {label:'🧩 Qualcosa non funziona',value:'something_wrong',next:'something_wrong'},
      {label:'🤷 Non so cosa non va',value:'unknown_problem',next:'unknown_site'},
      {label:'🧱 Voglio creare, modificare o migliorare il sito',value:'new_request',next:'request_type'}
    ]
  },

  /* RICHIESTE DI MODIFICA O SVILUPPO */

  request_type: {
    text: 'Di che tipo di richiesta si tratta?',
    saveAs: 'requestType',
    options: [
      {label:'Sviluppare nuove funzionalità',value:'new_feature',next:'end_out'},
      {label:'Creare nuove pagine',value:'new_pages',next:'end_out'},
      {label:'Redesign / rifacimento del sito',value:'redesign',next:'end_out'},
      {label:'Migrazione completa',value:'migration',next:'end_out'},
      {label:'Sviluppo custom importante',value:'custom',next:'end_out'},
      {label:'SEO / copywriting / marketing',value:'marketing',next:'end_out'},
      {label:'Manutenzione o gestione ricorrente',value:'maintenance',next:'end_out'},
      {label:'Piccola modifica a qualcosa di esistente',value:'small_change',next:'end_quote'},
      {label:'In realtà devo riparare un malfunzionamento',value:'repair',next:'something_wrong'}
    ]
  },

  /* SITO NON ACCESSIBILE */

  site_down: {
    text: 'Cosa succede quando apri il tuo sito?',
    saveAs: 'siteBehaviour',
    options: [
      {label:'🔴 Non si apre / dà errore',value:'error',next:'site_error'},
      {label:'⚪ Schermata completamente bianca',value:'white_screen',next:'site_change'},
      {label:'🟠 Compare una pagina di errore',value:'error_page',next:'site_error'},
      {label:'🟢 Si apre, ma qualcosa non funziona',value:'partially_working',next:'site_partial'}
    ]
  },

  site_error: {
    text: 'Che errore vedi?',
    saveAs: 'errorType',
    options: [
      {label:'500 / Internal Server Error',value:'500',next:'site_change'},
      {label:'Error establishing a database connection',value:'database',next:'site_change'},
      {label:'403 / Access denied',value:'403',next:'site_change'},
      {label:'404 / Page not found',value:'404',next:'site_change'},
      {label:'Errore hosting, DNS, SSL o server',value:'hosting',next:'site_change'},
      {label:'Un altro errore',value:'other_error',next:'site_change'},
      {label:'Non lo so',value:'unknown',next:'site_change'}
    ]
  },

  site_change: {
    text: 'Hai fatto qualcosa poco prima che comparisse il problema?',
    saveAs: 'recentChange',
    options: [
      {label:'Ho aggiornato un plugin',value:'plugin_update',next:'site_access'},
      {label:'Ho aggiornato WordPress',value:'wordpress_update',next:'site_access'},
      {label:'Ho aggiornato il tema',value:'theme_update',next:'site_access'},
      {label:'Ho installato qualcosa',value:'installation',next:'site_access'},
      {label:'Ho fatto delle modifiche al sito',value:'site_change',next:'site_access'},
      {label:'Non ho modificato nulla',value:'nothing',next:'site_access'},
      {label:'Non lo so',value:'unknown',next:'site_access'}
    ]
  },

  site_access: {
    text: "Riesci ad accedere all'amministrazione di WordPress?",
    saveAs: 'adminAccess',
    options: [
      {label:'Sì',value:'yes',next:'site_hosting'},
      {label:'No',value:'no',next:'site_hosting'},
      {label:'Non lo so',value:'unknown',next:'site_hosting'}
    ]
  },

  site_hosting: {
    text: 'Hai accesso al pannello del tuo hosting?',
    saveAs: 'hostingAccess',
    options: [
      {label:'Sì',value:'yes',next:'end_site'},
      {label:'No',value:'no',next:'end_site'},
      {label:'Non lo so',value:'unknown',next:'end_site'}
    ]
  },

  /* SITO PARZIALMENTE FUNZIONANTE */

  site_partial: {
    text: 'Cosa non funziona?',
    saveAs: 'sitePartialProblem',
    options: [
      {label:'Una pagina',value:'page',next:'partial_scope'},
      {label:'Una funzionalità',value:'function',next:'partial_scope'},
      {label:'Un modulo',value:'form',next:'partial_scope'},
      {label:'WooCommerce',value:'woocommerce',next:'woocommerce'},
      {label:'Altro',value:'other',next:'partial_scope'}
    ]
  },

  partial_scope: {
    text: 'Il problema riguarda una sola pagina o più parti del sito?',
    saveAs: 'partialScope',
    options: [
      {label:'Una sola pagina',value:'one_page',next:'partial_change'},
      {label:'Più pagine',value:'multiple_pages',next:'partial_change'},
      {label:'Tutto il sito',value:'whole_site',next:'partial_change'},
      {label:'Non lo so',value:'unknown',next:'partial_change'}
    ]
  },

  partial_change: {
    text: 'Il problema è comparso dopo una modifica?',
    saveAs: 'partialChange',
    options: [
      {label:'Sì, dopo un aggiornamento',value:'update',next:'partial_access'},
      {label:'Sì, dopo una modifica al sito',value:'site_change',next:'partial_access'},
      {label:'No',value:'no',next:'partial_access'},
      {label:'Non lo so',value:'unknown',next:'partial_access'}
    ]
  },

  partial_access: {
    text: 'Riesci ad accedere normalmente a WordPress?',
    saveAs: 'partialAdminAccess',
    options: [
      {label:'Sì',value:'yes',next:'end_partial'},
      {label:'No',value:'no',next:'end_partial'},
      {label:'Non lo so',value:'unknown',next:'end_partial'}
    ]
  },

  /* ACCESSO WORDPRESS */

  wordpress_access: {
    text: 'Cosa succede quando provi ad accedere?',
    saveAs: 'adminProblem',
    options: [
      {label:'La password non viene accettata',value:'password',next:'admin_public'},
      {label:'La pagina di login non si apre',value:'login_page',next:'admin_public'},
      {label:'Dopo il login torno alla schermata di login',value:'login_loop',next:'admin_public'},
      {label:'Vedo un errore',value:'error',next:'admin_public'},
      {label:'Altro',value:'other',next:'admin_public'}
    ]
  },

  admin_public: {
    text: 'Il sito pubblico è ancora visibile?',
    saveAs: 'publicSite',
    options: [
      {label:'Sì',value:'yes',next:'admin_change'},
      {label:'No',value:'no',next:'admin_change'},
      {label:'Non lo so',value:'unknown',next:'admin_change'}
    ]
  },

  admin_change: {
    text: 'Il problema è comparso dopo una modifica o un aggiornamento?',
    saveAs: 'adminChange',
    options: [
      {label:'Sì, dopo un aggiornamento',value:'update',next:'end_admin'},
      {label:'Sì, dopo una modifica',value:'change',next:'end_admin'},
      {label:'No',value:'no',next:'end_admin'},
      {label:'Non lo so',value:'unknown',next:'end_admin'}
    ]
  },

  /* WOOCOMMERCE */

  woocommerce: {
    text: 'Cosa non funziona?',
    saveAs: 'wooProblem',
    options: [
      {label:'🛒 Carrello',value:'cart',next:'woo_cart_detail'},
      {label:'💳 Checkout / pagamento',value:'checkout',next:'woo_checkout_detail'},
      {label:'📦 Ordini',value:'orders',next:'woo_orders_detail'},
      {label:'💰 Prezzi / prodotti',value:'products',next:'woo_products_detail'},
      {label:'📧 Email degli ordini',value:'emails',next:'woo_emails_detail'},
      {label:'Altro',value:'other',next:'woo_other_detail'}
    ]
  },

  woo_cart_detail: {
    text: 'Cosa succede esattamente al carrello?',
    saveAs: 'wooDetail',
    options: [
      {label:'I prodotti non vengono aggiunti',value:'cart_not_adding',next:'woo_update'},
      {label:'Il carrello si svuota da solo',value:'cart_empties',next:'woo_update'},
      {label:'Quantità o totali errati',value:'cart_totals',next:'woo_update'},
      {label:'Compare un errore',value:'cart_error',next:'woo_update'},
      {label:'Altro / non saprei',value:'cart_other',next:'woo_update'}
    ]
  },

  woo_checkout_detail: {
    text: 'Cosa succede esattamente al checkout o al pagamento?',
    saveAs: 'wooDetail',
    options: [
      {label:"Non riesco a completare l'acquisto",value:'checkout_blocked',next:'woo_update'},
      {label:'Il pagamento fallisce o viene rifiutato',value:'payment_failed',next:'woo_update'},
      {label:"Il pagamento riesce ma l'ordine non compare",value:'payment_missing_order',next:'woo_update'},
      {label:'La pagina di checkout non si apre',value:'checkout_page',next:'woo_update'},
      {label:'Totali, spedizione o tasse errati',value:'checkout_totals',next:'woo_update'},
      {label:'Altro / non saprei',value:'checkout_other',next:'woo_update'}
    ]
  },

  woo_orders_detail: {
    text: 'Cosa succede esattamente con gli ordini?',
    saveAs: 'wooDetail',
    options: [
      {label:'Gli ordini non vengono registrati',value:'orders_missing',next:'woo_update'},
      {label:'Gli ordini sono bloccati o hanno uno stato errato',value:'orders_status',next:'woo_update'},
      {label:'I pagamenti arrivano, ma gli ordini non compaiono',value:'orders_paid_missing',next:'woo_update'},
      {label:'Gli ordini vengono duplicati',value:'orders_duplicate',next:'woo_update'},
      {label:'Non riesco a visualizzare o gestire gli ordini',value:'orders_manage',next:'woo_update'},
      {label:'Altro / non saprei',value:'orders_other',next:'woo_update'}
    ]
  },

  woo_products_detail: {
    text: 'Cosa non funziona nei prodotti o nei prezzi?',
    saveAs: 'wooDetail',
    options: [
      {label:'Un prodotto non compare nello shop',value:'product_hidden',next:'woo_update'},
      {label:'Prezzi o sconti errati',value:'product_prices',next:'woo_update'},
      {label:'Varianti o disponibilità errate',value:'product_stock',next:'woo_update'},
      {label:'Le immagini prodotto non sono visibili',value:'product_images',next:'woo_update'},
      {label:'Non riesco ad aggiornare i prodotti',value:'product_update',next:'woo_update'},
      {label:'Altro / non saprei',value:'product_other',next:'woo_update'}
    ]
  },

  woo_emails_detail: {
    text: 'Quali email degli ordini hanno un problema?',
    saveAs: 'wooDetail',
    options: [
      {label:"Il cliente non riceve la conferma d'ordine",value:'woo_email_customer',next:'woo_update'},
      {label:'Il negoziante non riceve notifiche',value:'woo_email_owner',next:'woo_update'},
      {label:'Le email contengono informazioni sbagliate',value:'woo_email_wrong',next:'woo_update'},
      {label:'Le email vengono duplicate',value:'woo_email_duplicates',next:'woo_update'},
      {label:'Non arriva nessuna email WooCommerce',value:'woo_email_all',next:'woo_update'},
      {label:'Altro / non saprei',value:'woo_email_other',next:'woo_update'}
    ]
  },

  woo_other_detail: {
    text: 'Quale parte dello shop è coinvolta?',
    saveAs: 'wooDetail',
    options: [
      {label:'Coupon / promozioni',value:'woo_coupons',next:'woo_update'},
      {label:'Spedizioni / tasse',value:'woo_shipping',next:'woo_update'},
      {label:'Account cliente',value:'woo_accounts',next:'woo_update'},
      {label:'Plugin / integrazioni dello shop',value:'woo_integrations',next:'woo_update'},
      {label:'Non so identificarla',value:'woo_unknown',next:'woo_update'},
      {label:'Vorrei una nuova funzionalità, non riparare un guasto',value:'new_feature',next:'request_type'}
    ]
  },

  woo_update: {
    text: 'Il problema è comparso dopo un aggiornamento?',
    saveAs: 'wooUpdate',
    options: [
      {label:'Sì',value:'yes',next:'woo_access'},
      {label:'No',value:'no',next:'woo_access'},
      {label:'Non lo so',value:'unknown',next:'woo_access'}
    ]
  },

  woo_access: {
    text: 'Riesci ad accedere normalmente a WordPress?',
    saveAs: 'wooAdminAccess',
    options: [
      {label:'Sì',value:'yes',next:'end_woo'},
      {label:'No',value:'no',next:'end_woo'},
      {label:'Non lo so',value:'unknown',next:'end_woo'}
    ]
  },

  /* PERFORMANCE */

  slow: {
    text: 'Dove noti principalmente la lentezza?',
    saveAs: 'slowArea',
    options: [
      {label:'Tutto il sito è lento',value:'whole_site',next:'slow_history'},
      {label:'Solo alcune pagine',value:'pages',next:'slow_history'},
      {label:'WordPress / area admin',value:'admin',next:'slow_history'},
      {label:'WooCommerce',value:'woocommerce',next:'slow_history'},
      {label:'Non saprei',value:'unknown',next:'slow_history'}
    ]
  },

  slow_history: {
    text: 'È sempre stato lento o è iniziato recentemente?',
    saveAs: 'slowHistory',
    options: [
      {label:'È sempre stato lento',value:'always',next:'slow_change'},
      {label:'È peggiorato recentemente',value:'recent',next:'slow_change'},
      {label:'È diventato lento improvvisamente',value:'suddenly',next:'slow_change'},
      {label:'Non lo so',value:'unknown',next:'slow_change'}
    ]
  },

  slow_change: {
    text: 'Hai fatto modifiche o aggiornamenti prima di notare il problema?',
    saveAs: 'slowChange',
    options: [
      {label:'Sì, ho aggiornato qualcosa',value:'update',next:'end_slow'},
      {label:'Sì, ho modificato il sito',value:'change',next:'end_slow'},
      {label:'No',value:'no',next:'end_slow'},
      {label:'Non lo so',value:'unknown',next:'end_slow'}
    ]
  },

  /* EMAIL */

  email: {
    text: 'Quali email non funzionano?',
    saveAs: 'emailType',
    options: [
      {label:'Form di contatto',value:'contact_form',next:'email_direction'},
      {label:'Email WooCommerce',value:'woocommerce',next:'woo_emails_detail'},
      {label:'Email di WordPress',value:'wordpress',next:'email_direction'},
      {label:'Tutte le email',value:'all',next:'email_direction'},
      {label:'Non lo so',value:'unknown',next:'email_direction'}
    ]
  },

  email_direction: {
    text: "Il problema riguarda l'invio, la ricezione o entrambi?",
    saveAs: 'emailDirection',
    options: [
      {label:'Invio',value:'sending',next:'email_change'},
      {label:'Ricezione',value:'receiving',next:'email_change'},
      {label:'Entrambi',value:'both',next:'email_change'},
      {label:'Non lo so',value:'unknown',next:'email_change'}
    ]
  },

  email_change: {
    text: 'Il problema è comparso dopo una modifica o un aggiornamento?',
    saveAs: 'emailChange',
    options: [
      {label:'Sì',value:'yes',next:'end_email'},
      {label:'No',value:'no',next:'end_email'},
      {label:'Non lo so',value:'unknown',next:'end_email'}
    ]
  },

  /* MALFUNZIONAMENTO SPECIFICO */

  something_wrong: {
    text: 'Cosa non funziona?',
    saveAs: 'functionProblem',
    options: [
      {label:'Una pagina',value:'page',next:'function_scope'},
      {label:'Un’immagine / elemento grafico',value:'image',next:'image_scope'},
      {label:'Un modulo',value:'form',next:'function_scope'},
      {label:'Un pulsante / link',value:'button',next:'function_scope'},
      {label:'Una funzionalità',value:'function',next:'function_scope'},
      {label:'WooCommerce',value:'woocommerce',next:'woocommerce'},
      {label:'Altro',value:'other',next:'function_scope'},
      {label:'Voglio aggiungere qualcosa, non riparare',value:'new_request',next:'request_type'}
    ]
  },

  image_scope: {
    text: 'Dove si verifica il problema?',
    saveAs: 'functionScope',
    options: [
      {label:'Una sola pagina',value:'one_page',next:'image_behavior'},
      {label:'Più pagine',value:'multiple_pages',next:'image_behavior'},
      {label:'In tutto il sito',value:'whole_site',next:'image_behavior'},
      {label:'Non lo so',value:'unknown',next:'image_behavior'}
    ]
  },

  image_behavior: {
    text: 'Cosa succede esattamente?',
    saveAs: 'imageBehavior',
    options: [
      {label:"L'immagine non si vede",value:'not_visible',next:'function_change'},
      {label:'Compare una immagine rotta / errore',value:'broken',next:'function_change'},
      {label:"L'elemento è sparito",value:'missing',next:'function_change'},
      {label:'Il layout è sbagliato',value:'display',next:'function_change'},
      {label:'Altro',value:'other',next:'function_change'}
    ]
  },

  function_scope: {
    text: 'Il problema riguarda tutto il sito o una parte?',
    saveAs: 'functionScope',
    options: [
      {label:'Una sola pagina',value:'one_page',next:'function_change'},
      {label:'Più pagine',value:'multiple_pages',next:'function_change'},
      {label:'Tutto il sito',value:'whole_site',next:'function_change'},
      {label:'Non lo so',value:'unknown',next:'function_change'}
    ]
  },

  function_change: {
    text: 'Il problema è comparso dopo qualcosa che hai fatto?',
    saveAs: 'functionChange',
    options: [
      {label:'Ho aggiornato WordPress',value:'wordpress_update',next:'function_access'},
      {label:'Ho aggiornato un plugin',value:'plugin_update',next:'function_access'},
      {label:'Ho aggiornato il tema',value:'theme_update',next:'function_access'},
      {label:'Ho modificato la pagina',value:'page_change',next:'function_access'},
      {label:'Ho fatto delle modifiche al sito',value:'site_change',next:'function_access'},
      {label:'Ho installato qualcosa',value:'installation',next:'function_access'},
      {label:'Non ho modificato nulla',value:'nothing',next:'function_access'},
      {label:'Non lo so',value:'unknown',next:'function_access'}
    ]
  },

  function_access: {
    text: "Hai accesso all'amministrazione di WordPress?",
    saveAs: 'functionAdminAccess',
    options: [
      {label:'Sì',value:'yes',next:'end_function'},
      {label:'No',value:'no',next:'end_function'},
      {label:'Non lo so',value:'unknown',next:'end_function'}
    ]
  },

  /* PROBLEMA NON IDENTIFICATO */

  unknown_site: {
    text: 'Quando apri il sito, cosa vedi?',
    saveAs: 'unknownBehaviour',
    options: [
      {label:'Funziona normalmente',value:'normal',next:'unknown_strange'},
      {label:"Si apre ma c'è qualcosa di strano",value:'strange',next:'unknown_strange'},
      {label:'Vedo un errore',value:'error',next:'unknown_strange'},
      {label:'Non si apre',value:'down',next:'unknown_strange'},
      {label:'Non riesco a capirlo',value:'unknown',next:'unknown_strange'}
    ]
  },

  unknown_strange: {
    text: 'Il problema riguarda una parte specifica del sito?',
    saveAs: 'unknownScope',
    options: [
      {label:'Una pagina',value:'page',next:'unknown_change'},
      {label:'Una funzionalità',value:'function',next:'unknown_change'},
      {label:'Tutto il sito',value:'whole_site',next:'unknown_change'},
      {label:'Non lo so',value:'unknown',next:'unknown_change'}
    ]
  },

  unknown_change: {
    text: 'Hai notato il problema dopo qualcosa che hai fatto?',
    saveAs: 'unknownChange',
    options: [
      {label:'Dopo un aggiornamento',value:'update',next:'unknown_access'},
      {label:'Dopo una modifica',value:'change',next:'unknown_access'},
      {label:'No',value:'no',next:'unknown_access'},
      {label:'Non lo so',value:'unknown',next:'unknown_access'}
    ]
  },

  unknown_access: {
    text: 'Riesci ad accedere a WordPress?',
    saveAs: 'unknownAdminAccess',
    options: [
      {label:'Sì',value:'yes',next:'end_unknown'},
      {label:'No',value:'no',next:'end_unknown'},
      {label:'Non lo so',value:'unknown',next:'end_unknown'}
    ]
  },

  /* RISULTATI TERMINALI */

  end_site: {result:'SMART_SITE'},
  end_partial: {result:'SMART_PARTIAL'},
  end_admin: {result:'SMART_ADMIN'},
  end_woo: {result:'COMPLEX'},
  end_slow: {result:'QUOTE'},
  end_email: {result:'SMART_EMAIL'},
  end_function: {result:'SMART_FUNCTION'},
  end_unknown: {result:'QUOTE'},
  end_quote: {result:'QUOTE'},
  end_out: {result:'OUT'}

};
