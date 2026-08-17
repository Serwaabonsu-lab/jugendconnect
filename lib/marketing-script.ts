// @ts-nocheck
// Automatisch aus der ursprünglichen JugendConnect-Seite extrahierte Logik
// (i18n, Demo-Schritte, mobiles Menü, Auth-Modal). Der Auth-Teil wurde auf
// echte Supabase-Aufrufe umgestellt (siehe renderAuthModal / submit-Handler).
// Wird von components/MarketingClient.tsx per useEffect einmalig aufgerufen.
export const initMarketingScript =
(function (supabase: any) {
  document.getElementById('year').textContent = new Date().getFullYear();

  var T = {
    de: {
      nav: { about: "Über uns", features: "Funktionen", demo: "Demo", contact: "Kontakt", start: "Jetzt starten" },
      hero: {
        badge: "Die Software für Jugendarbeit", title: "JugendConnect", subtitle: "Mehr Zeit für das, was zählt.",
        desc: "Dein digitaler Assistent für Programmplanung und Aufgabenverteilung. JugendConnect übernimmt die Technik – damit du dich voll auf deine Jugendlichen konzentrieren kannst.",
        ctaPrimary: "Kostenlos loslegen", ctaSecondary: "Demo ansehen",
        tag1: "Automatische Planung", tag2: "Aufgaben-Erinnerungen", tag3: "Für dein ganzes Team",
        cardSub: "Nächstes Treffen", cardTitle: "Allnight – Freitag 23:00", cardBadge: "Geplant",
        cardNotif: "Erinnerung gesendet: PIWCDus Secretary kümmert sich um die Ankündigungen dieser Woche."
      },
      features: {
        badge: "Was der Assistent kann", title: "Ein Assistent, der dir den Rücken freihält",
        subtitle: "Alles, was du für organisierte und entspannte Jugendarbeit brauchst – an einem Ort.",
        items: [
          { icon: "cal", title: "Automatische Programmplanung", desc: "Erstelle Treffen, Freizeiten und Events in Minuten. JugendConnect schlägt Termine vor und hält alle auf dem Laufenden." },
          { icon: "list", title: "Faire Aufgabenverteilung", desc: "Snacks, Technik, Andacht – Aufgaben werden automatisch und ausgewogen im Team verteilt. Niemand wird vergessen." },
          { icon: "bell", title: "Automatische Erinnerungen", desc: "Dein Team bekommt rechtzeitig Benachrichtigungen zu den eigenen Aufgaben. Kein Nachhaken, kein Stress mehr." },
          { icon: "users", title: "Dein Team an einem Ort", desc: "Alle Mitarbeitenden, Rollen und Verfügbarkeiten übersichtlich gebündelt – Schluss mit verstreuten Chats und Listen." },
          { icon: "refresh", title: "Plan-Änderungen in Echtzeit", desc: "Termin verschoben? Eine Änderung genügt und alle sehen sofort den aktuellen Stand." },
          { icon: "shield", title: "Du behältst die Kontrolle", desc: "Du entscheidest, was passiert. Die Technik unterstützt dich – überschreibt aber nie deine Entscheidungen." }
        ]
      },
      about: {
        badge: "Über uns", title: "Mehr Zeit für das, was zählt",
        p1: "JugendConnect wurde entwickelt, um die Organisation von Jugendevents einfacher und transparenter zu machen. Oft verlieren sich Absprachen in Chat-Gruppen oder E-Mails – mit JugendConnect haben Organisatoren und Teilnehmende eine zentrale Anlaufstelle.",
        p2: "Organisatoren erstellen Events, weisen Aufgaben zu und sehen Rückmeldungen in Echtzeit. Teilnehmende hinterlegen ihre Kontaktdaten und verwalten ihre zugewiesenen Aufgaben.",
        v1t: "Klarheit statt Chaos", v1d: "Alle Events, Aufgaben und Rückmeldungen an einem Ort.",
        v2t: "Mitarbeitendenah", v2d: "Teilnehmende geben Rückmeldung zu Aufgaben – mit Begründung.",
        v3t: "Schnell & einfach", v3d: "In wenigen Minuten startklar – kostenlos für alle.",
        s1t: "Account erstellen", s1d: "Melde dich kostenlos an und hinterlege deine Kontaktdaten inkl. Geburtsdatum.",
        s2t: "Eingeteilt werden", s2d: "Organisatoren weisen dir Aufgaben zu – du erhältst automatisch SMS & WhatsApp.",
        s3t: "Rückmeldung geben", s3d: "Nimm Aufgaben an oder lehne sie ab – mit Begründung. Organisatoren sehen es sofort."
      },
      community: {
        badge: "Unsere Gemeinde", title: "The Church of Pentecost",
        p1: "JugendConnect ist ein Werkzeug der Jugendarbeit unserer Gemeinde. Wir glauben, dass gute Organisation mehr Raum schafft für das Wesentliche: Gemeinschaft, Glaube und das Wachstum unserer Jugendlichen.",
        p2: "Mit JugendConnect gestalten wir die Planung von Events und die Verteilung von Aufgaben so einfach wie möglich – damit weniger Zeit in der Organisation verloren geht und mehr Zeit für die Menschen bleibt.",
        colorsLabel: "Die Farben unserer Gemeinde"
      },
      demo: {
        badge: "Schritt für Schritt", title: "So einfach funktioniert JugendConnect", subtitle: "Wähle einen Schritt, um die jeweilige Funktion zu erkunden.",
        steps: ["Event erstellen", "Aufgabe zuteilen", "Benachrichtigung", "Rückmeldung"],
        s1sub: "Schritt 1", s1title: "Event erstellen", s1label1: "Event-Titel", s1val1: "Weihnachtszusammenkunft 2026",
        s1rangeLabel: "Zeitraum", s1range: "Mi, 24. – Sa, 27. Dezember 2026",
        s1daysLabel: "Programm nach Tagen", s1hint: "Jeder Tag mit eigener Uhrzeit, Ort und Aufgabeneinteilung – mit Google Maps / Karten verlinkt",
        s1cta: "Event erstellen (Demo)",
        s1days: [
          { label: "Tag 1", date: "Mi, 24. Dez", time: "18:00 Uhr", loc: "Gemeindehaus, Hauptstraße 5", task: "Chorprobe" },
          { label: "Tag 2", date: "Do, 25. Dez", time: "10:00 Uhr", loc: "Stadthalle, Bahnhofstraße 12", task: "Einstehergebete" },
          { label: "Tag 3", date: "Fr, 26. Dez", time: "19:00 Uhr", loc: "Gemeindehaus, Hauptstraße 5", task: "Eröffnungsgebet leiten" },
          { label: "Tag 4", date: "Sa, 27. Dez", time: "09:00 Uhr", loc: "Freizeithaus, Waldweg 3", task: "Gebete leiten" }
        ],
        s2sub: "Schritt 2", s2title: "Aufgaben zuteilen", s2desc: "Organisatoren weisen dem Team Aufgaben zu – auch an sich selbst. Weitere Aufgaben können jederzeit ergänzt werden.",
        s2addBtn: "Aufgabe hinzufügen", s2addLabelPh: "Aufgabenbezeichnung", s2addPersonPh: "Person zuweisen (optional)",
        s2addConfirm: "Hinzufügen", s2addCancel: "Abbrechen", s2unassigned: "Noch offen",
        s3sub: "Schritt 3", s3title: "Automatische Benachrichtigung", s3desc: "Nach der Zuteilung erhält die Person automatisch eine SMS und WhatsApp-Nachricht:",
        s3smsLabel: "SMS von +49 1521 1424402", s3smsBody: "Hallo Sarah, du wurdest für 'Chorprobe' beim Jugendkreis am Freitag 18:00 eingeteilt. Bitte antworte mit 'Ja' oder 'Nein' (mit Begründung). – JugendConnect",
        s3waLabel: "WhatsApp von +49 1521 1424402", s3waBody: "Hallo Sarah! Du wurdest für 'Chorprobe' beim Jugendkreis eingeteilt (Fr, 18. Juli, 18:00 Uhr). Bitte gib eine Rückmeldung: annehmen oder begründet ablehnen. – JugendConnect",
        s3notif: "Benachrichtigungen werden automatisch nach Zuteilung versendet.",
        s4sub: "Schritt 4", s4title: "Rückmeldung geben", s4desc: "Die eingeteilte Person kann die Aufgabe annehmen oder begründet ablehnen:",
        s4accept: "Annehmen", s4acceptSub: "Aufgabe übernehmen", s4decline: "Ablehnen", s4declineSub: "Mit Begründung",
        s4pending: "Ausstehend", s4accepted: "Angenommen"
      },
      contact: { title: "Bereit, dein nächstes Event zu organisieren?", subtitle: "Melde dich kostenlos an und starte in wenigen Minuten mit der Organisation deines nächsten Jugendevents.", cta: "Kostenlos anmelden" },
      footer: {
        tagline: "Die Plattform für Jugendevents. Organisiere Events, teile Aufgaben zu und verwalte Rückmeldungen einfach und zentral.",
        community: "Ein Projekt der Jugendarbeit – The Church of Pentecost",
        platform: "Plattform", signIn: "Anmelden", features: "Funktionen", free: "Kostenlos", demo: "Demo", dashboard: "Für Organisatoren",
        aboutUs: "Über uns", about: "Über JugendConnect", contact: "Kontakt", copyright: "Alle Rechte vorbehalten."
      }
    },
    en: {
      nav: { about: "About", features: "Features", demo: "Demo", contact: "Contact", start: "Get started" },
      hero: {
        badge: "Youth Ministry Software", title: "JugendConnect", subtitle: "More time for what matters.",
        desc: "Your digital assistant for programme planning and task assignment. JugendConnect handles the organisation – so you can focus fully on your youth.",
        ctaPrimary: "Get started free", ctaSecondary: "See demo",
        tag1: "Automatic planning", tag2: "Task reminders", tag3: "For your whole team",
        cardSub: "Next Meeting", cardTitle: "Allnight – Friday 23:00", cardBadge: "Scheduled",
        cardNotif: "Reminder sent: Our church secretary is taking care of the announcements for the coming week."
      },
      features: {
        badge: "What the assistant can do", title: "An assistant that has your back",
        subtitle: "Everything you need for organised, stress-free youth ministry – in one place.",
        items: [
          { icon: "cal", title: "Automatic Programme Planning", desc: "Create meetings, camps and events in minutes. JugendConnect suggests dates and keeps everyone in the loop." },
          { icon: "list", title: "Fair Task Distribution", desc: "Snacks, tech, devotion – tasks are distributed automatically and evenly across the team. Nobody is forgotten." },
          { icon: "bell", title: "Automatic Reminders", desc: "Your team receives timely notifications about their tasks. No more chasing, no more stress." },
          { icon: "users", title: "Your Team in One Place", desc: "All members, roles and availability bundled clearly – no more scattered chats and lists." },
          { icon: "refresh", title: "Real-time Plan Changes", desc: "Date moved? One update and everyone sees the current schedule immediately." },
          { icon: "shield", title: "You Stay in Control", desc: "You decide what happens. The technology supports you – but never overrides your decisions." }
        ]
      },
      about: {
        badge: "About us", title: "More time for what matters",
        p1: "JugendConnect was built to make organising youth events simpler and more transparent. Agreements often get lost in group chats or emails – with JugendConnect, organisers and participants have one central platform.",
        p2: "Organisers create events, assign tasks and see responses in real time. Participants store their contact details and manage their assigned tasks.",
        v1t: "Clarity over chaos", v1d: "All events, tasks and feedback in one place.",
        v2t: "People-first", v2d: "Participants can respond to tasks – with a reason.",
        v3t: "Quick & easy", v3d: "Ready in minutes – free for everyone.",
        s1t: "Create an account", s1d: "Sign up for free and add your contact details including date of birth.",
        s2t: "Get assigned", s2d: "Organisers assign tasks to you – you receive automatic SMS & WhatsApp messages.",
        s3t: "Give feedback", s3d: "Accept or decline tasks with a reason. Organisers see it immediately."
      },
      community: {
        badge: "Our Church", title: "The Church of Pentecost",
        p1: "JugendConnect is a youth ministry tool of our church. We believe that good organisation creates more space for what matters: community, faith and the growth of our youth.",
        p2: "With JugendConnect we make event planning and task distribution as simple as possible – so less time is lost in logistics and more time is spent with people.",
        colorsLabel: "The colours of our church"
      },
      demo: {
        badge: "Step by step", title: "How JugendConnect works", subtitle: "Select a step to explore the feature.",
        steps: ["Create Event", "Assign Task", "Notification", "Feedback"],
        s1sub: "Step 1", s1title: "Create Event", s1label1: "Event title", s1val1: "ChristmasConvention 2026",
        s1rangeLabel: "Date range", s1range: "Wed 24 – Sat 27 December 2026",
        s1daysLabel: "Schedule by day", s1hint: "Each day has its own time, location and task assignments – linked with Google Maps",
        s1cta: "Create Event (Demo)",
        s1days: [
          { label: "Day 1", date: "Wed, 24 Dec", time: "6:00 PM", loc: "Community Hall, Main Street 5", task: "Choir rehearsal" },
          { label: "Day 2", date: "Thu, 25 Dec", time: "10:00 AM", loc: "Town Hall, Station Street 12", task: "Intercessory prayers" },
          { label: "Day 3", date: "Fri, 26 Dec", time: "7:00 PM", loc: "Community Hall, Main Street 5", task: "Lead opening prayer" },
          { label: "Day 4", date: "Sat, 27 Dec", time: "9:00 AM", loc: "Leisure Center, Forest Path 3", task: "Lead prayers" }
        ],
        s2sub: "Step 2", s2title: "Assign Tasks", s2desc: "Organisers assign tasks to the team – including themselves. More tasks can be added at any time.",
        s2addBtn: "Add task", s2addLabelPh: "Task name", s2addPersonPh: "Assign person (optional)",
        s2addConfirm: "Add", s2addCancel: "Cancel", s2unassigned: "Unassigned",
        s3sub: "Step 3", s3title: "Automatic Notification", s3desc: "After assignment the person automatically receives an SMS and WhatsApp message:",
        s3smsLabel: "SMS from +49 1521 1424402", s3smsBody: "Hi Sarah, you have been assigned 'Tech & Music' at Youth Circle on Friday 18:00. Please reply 'Yes' or 'No' (with reason). – JugendConnect",
        s3waLabel: "WhatsApp from +49 1521 1424402", s3waBody: "Hi Sarah! You've been assigned 'Tech & Music' at Youth Circle (Fri, 18 July, 18:00). Please give your response: accept or decline with a reason. Thanks! – JugendConnect",
        s3notif: "Notifications are sent automatically after assignment.",
        s4sub: "Step 4", s4title: "Give Feedback", s4desc: "The assigned person can accept or decline the task with a reason:",
        s4accept: "Accept", s4acceptSub: "Take on the task", s4decline: "Decline", s4declineSub: "With reason",
        s4pending: "Pending", s4accepted: "Accepted"
      },
      contact: { title: "Ready to organise your next event?", subtitle: "Sign up for free and start organising your next youth event in minutes.", cta: "Sign up free" },
      footer: {
        tagline: "The platform for youth events. Organise events, assign tasks and manage feedback simply and centrally.",
        community: "A youth ministry project – The Church of Pentecost",
        platform: "Platform", signIn: "Sign in", features: "Features", free: "Free", demo: "Demo", dashboard: "For organisers",
        aboutUs: "About us", about: "About JugendConnect", contact: "Contact", copyright: "All rights reserved."
      }
    }
  };

  var ICONS = {
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
  };
  var ICON_STYLE = [
    { bg: "var(--navy-50)", darkBg: "color-mix(in srgb, var(--navy-600) 30%, transparent)", fg: "var(--navy-600)" },
    { bg: "color-mix(in srgb, var(--yellow-400) 16%, var(--bg))", darkBg: "color-mix(in srgb, var(--yellow-400) 16%, var(--bg))", fg: "var(--yellow-600, #a88500)" },
    { bg: "var(--red-50)", darkBg: "color-mix(in srgb, var(--red-500) 16%, var(--bg))", fg: "var(--red-500)" }
  ];

  var checkSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';

  var currentLang = "de";
  var currentStep = 0;
  var demoTasks = [
    { done: false, label: "Chorprobe", person: "Dcns Esther, Mandy, Jemimah" },
    { done: false, label: "Einstehergebete", person: "Keziah, Adele, Serwaa" },
    { done: true, label: "Eröffnungsgebet leiten", person: "Brigitte Adu" },
    { done: true, label: "Gebete leiten", person: "Ältester Isaac" }
  ];
  var addingTask = false;

  function renderFeatures(t) {
    var grid = document.getElementById('featureGrid');
    grid.innerHTML = t.features.items.map(function (f, i) {
      var style = ICON_STYLE[i % 3];
      return '<div class="feature-card">' +
        '<div class="feature-icon" style="background:' + style.bg + ';color:' + style.fg + ';">' + ICONS[f.icon] + '</div>' +
        '<h3>' + f.title + '</h3><p>' + f.desc + '</p></div>';
    }).join('');
  }

  
  function demoPanelHTML(t, step) {
    var d = t.demo;
    if (step === 0) {
      var timeSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
      var pinSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
      var taskSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
      var dayRows = d.s1days.map(function (day) {
        return '<div class="day-row"><div class="day-top"><span class="day-label">' + day.label + '</span><span class="day-date">' + day.date + '</span></div>' +
          '<div class="day-meta"><span>' + timeSVG + day.time + '</span><span>' + pinSVG + day.loc + '</span><span>' + taskSVG + day.task + '</span></div></div>';
      }).join('');
      return '<div class="dp-head"><p>' + d.s1sub + '</p><p>' + d.s1title + '</p></div><div class="dp-body">' +
        '<label class="field-label">' + d.s1label1 + '</label><div class="field-value">' + d.s1val1 + '</div>' +
        '<label class="field-label" style="margin-top:14px;display:block;">' + d.s1rangeLabel + '</label><div class="field-value"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>' + d.s1range + '</div>' +
        '<label class="field-label" style="margin-top:14px;display:block;">' + d.s1daysLabel + '</label>' +
        '<div class="day-list">' + dayRows + '</div>' +
        '<p class="field-hint">' + d.s1hint + '</p>' +
        '<button class="btn btn-primary demo-cta" type="button" disabled>' + d.s1cta + '</button>' +
      '</div>';
    }
    if (step === 1) {
      var rows = demoTasks.map(function (task) {
        return '<div class="task-row"><div class="task-check' + (task.done ? ' done' : '') + '">' + (task.done ? checkSVG : '') + '</div>' +
          '<span class="task-label">' + task.label + '</span>' +
          '<span class="task-person">' + task.person + '</span></div>';
      }).join('');
      var addBlock = addingTask
        ? '<div class="task-add-form"><input type="text" id="newTaskLabel" placeholder="' + d.s2addLabelPh + '" /><input type="text" id="newTaskPerson" placeholder="' + d.s2addPersonPh + '" /><div class="task-add-actions"><button type="button" class="btn btn-primary" id="newTaskConfirm">' + d.s2addConfirm + '</button><button type="button" class="btn btn-outline" id="newTaskCancel">' + d.s2addCancel + '</button></div></div>'
        : '<button type="button" class="task-add-btn" id="taskAddBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>' + d.s2addBtn + '</button>';
      return '<div class="dp-head"><p>' + d.s2sub + '</p><p>' + d.s2title + '</p></div><div class="dp-body">' +
        '<p class="lead">' + d.s2desc + '</p><div class="dp-tasklist">' + rows + '</div>' + addBlock + '</div>';
    }
    if (step === 2) {
      return '<div class="dp-head"><p>' + d.s3sub + '</p><p>' + d.s3title + '</p></div><div class="dp-body">' +
        '<p class="lead">' + d.s3desc + '</p>' +
        '<div class="msg-box"><div class="msg-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' + d.s3smsLabel + '</div><p class="body-text">' + d.s3smsBody + '</p></div>' +
        '<div class="msg-box wa"><div class="msg-label" style="color:#15803d;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' + d.s3waLabel + '</div><p class="body-text">' + d.s3waBody + '</p></div>' +
        '<div class="notif-note"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--yellow-500)" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>' + d.s3notif + '</div>' +
      '</div>';
    }
    var clockSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
    var checkCircleSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>';
    var xCircleSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>';
    return '<div class="dp-head"><p>' + d.s4sub + '</p><p>' + d.s4title + '</p></div><div class="dp-body">' +
      '<p class="lead">' + d.s4desc + '</p>' +
      '<div class="response-grid">' +
        '<div class="response-opt accept" style="color:#15803d;">' + checkCircleSVG + '<span class="lbl" style="color:var(--text);">' + d.s4accept + '</span><p class="sub">' + d.s4acceptSub + '</p></div>' +
        '<div class="response-opt decline" style="color:var(--red-500);">' + xCircleSVG + '<span class="lbl" style="color:var(--text);">' + d.s4decline + '</span><p class="sub">' + d.s4declineSub + '</p></div>' +
      '</div>' +
      '<div class="status-row"><span class="name">Eröffnungsgebet leiten</span><span class="status-pill accepted">' + checkCircleSVG.replace('<svg ', '<svg width="12" height="12" ') + d.s4accepted + '</span></div>' +
      '<div class="status-row"><span class="name">Chorprobe</span><span class="status-pill pending">' + clockSVG.replace('<svg ', '<svg width="12" height="12" ') + d.s4pending + '</span></div>' +
    '</div>';
  }

  function renderDemo(t) {
    var tabs = document.getElementById('stepTabs');
    tabs.innerHTML = t.demo.steps.map(function (label, i) {
      return '<button type="button" class="step-tab' + (i === currentStep ? ' active' : '') + '" data-step="' + i + '">' +
        '<span class="num">' + (i + 1) + '</span>' + label + '</button>';
    }).join('');
    Array.prototype.forEach.call(tabs.querySelectorAll('.step-tab'), function (btn) {
      btn.addEventListener('click', function () {
        currentStep = parseInt(btn.getAttribute('data-step'), 10);
        render();
      });
    });
    document.getElementById('demoPanel').innerHTML = demoPanelHTML(t, currentStep);
    if (currentStep === 1) {
      var addBtn = document.getElementById('taskAddBtn');
      if (addBtn) addBtn.addEventListener('click', function () { addingTask = true; renderDemo(t); });
      var confirmBtn = document.getElementById('newTaskConfirm');
      if (confirmBtn) confirmBtn.addEventListener('click', function () {
        var label = document.getElementById('newTaskLabel').value.trim();
        var person = document.getElementById('newTaskPerson').value.trim();
        if (label) {
          demoTasks.push({ done: false, label: label, person: person || t.demo.s2unassigned });
          addingTask = false;
          renderDemo(t);
        }
      });
      var cancelBtn = document.getElementById('newTaskCancel');
      if (cancelBtn) cancelBtn.addEventListener('click', function () { addingTask = false; renderDemo(t); });
    }
  }

  function render() {
    var t = T[currentLang];
    document.documentElement.lang = currentLang;
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      var path = el.getAttribute('data-i18n').split('.');
      var val = t;
      for (var i = 0; i < path.length; i++) { val = val && val[path[i]]; }
      if (typeof val === 'string') {
        var icon = el.querySelector('svg');
        if (icon) { el.firstChild.textContent = val + ' '; }
        else { el.textContent = val; }
      }
    });
    renderFeatures(t);
    renderDemo(t);
    renderAuthModal();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.lang-switch'), function (group) {
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-lang]');
      if (!btn) return;
      currentLang = btn.getAttribute('data-lang');
      Array.prototype.forEach.call(document.querySelectorAll('.lang-switch button'), function (b) {
        b.classList.toggle('active', b.getAttribute('data-lang') === currentLang);
      });
      render();
    });
  });

  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');
  menuToggle.addEventListener('click', function () {
    mobileNav.classList.toggle('open');
  });
  Array.prototype.forEach.call(mobileNav.querySelectorAll('a'), function (a) {
    a.addEventListener('click', function () { mobileNav.classList.remove('open'); });
  });

  var authT = {
    de: {
      signupTab: "Registrieren", signinTab: "Anmelden",
      signupTitle: "Kostenlos registrieren", signupSub: "Erstelle deinen Zugang – ein Organisator kann dir danach Aufgaben zuteilen.",
      signinTitle: "Anmelden", signinSub: "Für Organisatoren: Gib deine E-Mail-Adresse an, wir senden dir einen Anmelde-Link.",
      fullName: "Vollständiger Name", email: "E-Mail-Adresse", phone: "Telefonnummer (für SMS & WhatsApp)", birth: "Geburtsdatum",
      signupNote: "Deine Angaben werden sicher gespeichert. Organisatoren können dich danach für Aufgaben einteilen.",
      signinNote: "Nur für Organisatoren. Du erhältst eine E-Mail mit einem Anmelde-Link – kein Passwort nötig.",
      signupCta: "Registrierung senden", signinCta: "Anmelde-Link senden",
      submitting: "Wird gesendet...",
      signupSuccess: "Danke! Deine Registrierung ist eingegangen.",
      signinSuccess: "E-Mail gesendet! Prüfe dein Postfach und klicke auf den Anmelde-Link.",
      genericError: "Etwas ist schiefgelaufen. Bitte versuche es erneut."
    },
    en: {
      signupTab: "Sign up", signinTab: "Sign in",
      signupTitle: "Create free account", signupSub: "Create your access – an organiser can then assign you tasks.",
      signinTitle: "Sign in", signinSub: "For organisers: enter your email address, we'll send you a sign-in link.",
      fullName: "Full name", email: "Email address", phone: "Phone number (for SMS & WhatsApp)", birth: "Date of birth",
      signupNote: "Your details are stored securely. Organisers can then assign tasks to you.",
      signinNote: "Organisers only. You'll get an email with a sign-in link – no password needed.",
      signupCta: "Send registration", signinCta: "Send sign-in link",
      submitting: "Sending...",
      signupSuccess: "Thanks! Your registration has been received.",
      signinSuccess: "Email sent! Check your inbox and click the sign-in link.",
      genericError: "Something went wrong. Please try again."
    }
  };
  var authTab = 'signup';

  function setAuthStatus(text, kind) {
    var el = document.getElementById('authStatus');
    if (!text) { el.style.display = 'none'; el.textContent = ''; return; }
    el.style.display = 'block';
    el.textContent = text;
    el.style.color = kind === 'error' ? 'var(--red-500)' : (kind === 'success' ? '#15803d' : '');
  }

  function renderAuthModal() {
    var a = authT[currentLang];
    document.getElementById('tabSignup').textContent = a.signupTab;
    document.getElementById('tabSignin').textContent = a.signinTab;
    document.getElementById('authTitle').textContent = authTab === 'signup' ? a.signupTitle : a.signinTitle;
    document.getElementById('authSub').textContent = authTab === 'signup' ? a.signupSub : a.signinSub;
    document.getElementById('lblFullName').textContent = a.fullName;
    document.getElementById('lblEmail').textContent = a.email;
    document.getElementById('lblPhone').textContent = a.phone;
    document.getElementById('lblBirth').textContent = a.birth;
    document.getElementById('authNote').textContent = authTab === 'signup' ? a.signupNote : a.signinNote;
    document.getElementById('authSubmit').textContent = authTab === 'signup' ? a.signupCta : a.signinCta;
    document.getElementById('authSubmit').disabled = false;
    document.getElementById('tabSignup').classList.toggle('active', authTab === 'signup');
    document.getElementById('tabSignin').classList.toggle('active', authTab === 'signin');
    document.querySelector('.form-field[data-field="phone"]').classList.toggle('hidden', authTab === 'signin');
    document.querySelector('.form-field[data-field="birth"]').classList.toggle('hidden', authTab === 'signin');
    document.querySelector('.form-field[data-field="fullName"]').classList.toggle('hidden', authTab === 'signin');
    setAuthStatus('');
  }

  function openAuthModal(tab) {
    authTab = tab || 'signup';
    renderAuthModal();
    document.getElementById('authForm').reset();
    document.getElementById('authOverlay').classList.add('open');
    document.getElementById('authOverlay').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeAuthModal() {
    document.getElementById('authOverlay').classList.remove('open');
    document.getElementById('authOverlay').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-auth-open]');
    if (opener) { e.preventDefault(); openAuthModal(opener.getAttribute('data-auth-open')); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAuthModal();
  });
  document.getElementById('authClose').addEventListener('click', closeAuthModal);
  document.getElementById('authOverlay').addEventListener('click', function (e) { if (e.target.id === 'authOverlay') closeAuthModal(); });
  document.getElementById('tabSignup').addEventListener('click', function () { authTab = 'signup'; renderAuthModal(); });
  document.getElementById('tabSignin').addEventListener('click', function () { authTab = 'signin'; renderAuthModal(); });

  document.getElementById('authForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var a = authT[currentLang];
    var name = document.getElementById('inpFullName').value.trim();
    var email = document.getElementById('inpEmail').value.trim();
    var phone = document.getElementById('inpPhone').value.trim();
    var birth = document.getElementById('inpBirth').value.trim();
    var submitBtn = document.getElementById('authSubmit');
    submitBtn.disabled = true;
    submitBtn.textContent = a.submitting;
    setAuthStatus('');

    if (authTab === 'signup') {
      fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email: email, phone: phone, birthDate: birth })
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          submitBtn.disabled = false;
          submitBtn.textContent = a.signupCta;
          if (result.ok) {
            setAuthStatus(a.signupSuccess, 'success');
            document.getElementById('authForm').reset();
          } else {
            setAuthStatus((result.data && result.data.error) || a.genericError, 'error');
          }
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = a.signupCta;
          setAuthStatus(a.genericError, 'error');
        });
    } else {
      supabase.auth.signInWithOtp({
        email: email,
        options: { emailRedirectTo: window.location.origin + '/auth/callback' }
      }).then(function (result) {
        submitBtn.disabled = false;
        submitBtn.textContent = a.signinCta;
        if (result.error) {
          setAuthStatus(result.error.message || a.genericError, 'error');
        } else {
          setAuthStatus(a.signinSuccess, 'success');
          document.getElementById('authForm').reset();
        }
      }).catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = a.signinCta;
        setAuthStatus(a.genericError, 'error');
      });
    }
  });
  render();
});
