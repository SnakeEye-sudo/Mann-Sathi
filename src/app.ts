(() => {
  type Lang = "hi" | "en";
  type ThemeMode = "night" | "dawn";
  type Mode = "dashboard" | "journal" | "messages";
  type Voice = "male" | "female";
  type Entry = { id: string; title: string; body: string; createdAt: string; mood: number };

  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  }

  const STORAGE = {
    lang: "mann-lang",
    theme: "mann-theme",
    familyTheme: "sathi-family-theme",
    familyThemeMode: "sathi-family-theme-mode",
    voice: "mann-voice",
    entries: "mann-entries",
    morningTime: "mann-morning-time",
    nightTime: "mann-night-time",
    morningIndex: "mann-morning-index",
    nightIndex: "mann-night-index",
    lastMorning: "mann-last-morning",
    lastNight: "mann-last-night",
    installMarker: "sathi-installed-mann-sathi",
    cloudSyncedAt: "mann-cloud-synced-at"
  } as const;

  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyC6Cpg83N8fBuvY7YOSwTWsfM9DUsaVc3E",
    authDomain: "pariksha-sathi.firebaseapp.com",
    projectId: "pariksha-sathi",
    storageBucket: "pariksha-sathi.firebasestorage.app",
    messagingSenderId: "921721697043",
    appId: "1:921721697043:web:dada90a420c40e11ae60e6",
    measurementId: "G-NC7955J7KV"
  } as const;

  const POSITIVE = ["happy", "calm", "good", "grateful", "proud", "excited", "acha", "khush", "sukoon", "badhiya", "shukr", "mast"];
  const NEGATIVE = ["sad", "tired", "angry", "upset", "stress", "lonely", "dukhi", "thak", "gussa", "pareshan", "akela", "bura"];

  const UI_COPY = {
    hi: {
      menuLabel: "Quick Controls",
      menuTitle: "Mann menu",
      languageLabel: "Language",
      languageTitle: "Hindi aur English",
      themeLabel: "Theme",
      themeTitle: "Mood studio mode",
      themeAction: "Theme badlo",
      installLabel: "Install",
      installTitle: "App ko phone par rakho",
      installAction: "Install app",
      authLabel: "Family login",
      authTitle: "Ek login, poori family",
      authLoading: "Login status load ho raha hai...",
      authSignIn: "Login with Google",
      authSignOut: "Logout",
      authSignedAs: "Signed in as",
      authLoggedOut: "Abhi family login active nahi hai.",
      messageSettingsLabel: "Messages",
      messageSettingsTitle: "Morning & night timing",
      morningTimeLabel: "Morning time",
      nightTimeLabel: "Night time",
      saveSchedule: "Save schedule",
      pagesLabel: "Pages",
      pagesTitle: "Family links aur info",
      pageAbout: "About",
      pageResources: "Resources",
      pageContact: "Contact",
      pagePrivacy: "Privacy Policy",
      pageTerms: "Terms & Conditions",
      pageFamily: "Aapka-Sathi Family",
      brandTag: "Journal comfort desk",
      familyChip: "Aapka-Sathi family ka hissa",
      heroHeadline: "Roz ka dil halka karo, mood samjho, aur pyare non-repeating messages ke saath din shuru aur khatam karo.",
      heroText: "Journal entry, local mood analysis, aur supportive best-friend style messages bina kisi external API ke yahin generate hote hain.",
      entryLabel: "Journal entries",
      moodLabel: "Mood pulse",
      todayMessageLabel: "Today's message",
      todayMessageTitle: "Warm start, gentle close",
      trendLabel: "Mood trend",
      trendTitle: "Recent 7 entries",
      journalLabel: "Journal",
      journalTitle: "Aaj ka page likho",
      voiceLabel: "You are",
      entryTitleLabel: "Entry title",
      entryBodyLabel: "Entry body",
      saveEntry: "Save entry",
      messageBankLabel: "Message engine",
      messageBankTitle: "Non-repeating supportive stock",
      previewLabel: "Preview",
      previewTitle: "Next morning line",
      entriesListLabel: "Entries",
      entriesListTitle: "Recent pages",
      profileLabel: "Profile",
      profileTitle: "Mood setup",
      footerNote: "Roz ke ehsaas ko safe jagah dene ke liye.",
      scheduleSaved: "Message schedule save ho gaya.",
      entrySaved: "Entry save ho gayi.",
      installUnavailable: "Install prompt abhi available nahi hai. Browser menu se install try karo.",
      noEntries: "Abhi tak koi journal entry nahi hai.",
      male: "Male",
      female: "Female",
      dashboard: "Dashboard",
      journal: "Journal",
      messages: "Messages",
      moodSummary: (value: string) => `Average mood ${value}`,
      profileVoice: "Voice style",
      profileMorning: "Morning time",
      profileNight: "Night time",
      messageRemaining: "Messages left",
      cloudReady: "Family sync ready",
      cloudUser: "Family account linked",
      cloudSavedAt: (value: string) => `Last cloud save: ${value}`
    },
    en: {
      menuLabel: "Quick Controls",
      menuTitle: "Mann menu",
      languageLabel: "Language",
      languageTitle: "Hindi and English",
      themeLabel: "Theme",
      themeTitle: "Mood studio mode",
      themeAction: "Change theme",
      installLabel: "Install",
      installTitle: "Keep the app on your phone",
      installAction: "Install app",
      authLabel: "Family login",
      authTitle: "One login, whole family",
      authLoading: "Loading login status...",
      authSignIn: "Login with Google",
      authSignOut: "Logout",
      authSignedAs: "Signed in as",
      authLoggedOut: "No family login is active right now.",
      messageSettingsLabel: "Messages",
      messageSettingsTitle: "Morning & night timing",
      morningTimeLabel: "Morning time",
      nightTimeLabel: "Night time",
      saveSchedule: "Save schedule",
      pagesLabel: "Pages",
      pagesTitle: "Family links and info",
      pageAbout: "About",
      pageResources: "Resources",
      pageContact: "Contact",
      pagePrivacy: "Privacy Policy",
      pageTerms: "Terms & Conditions",
      pageFamily: "Aapka-Sathi Family",
      brandTag: "Journal comfort desk",
      familyChip: "Part of Aapka-Sathi family",
      heroHeadline: "Lighten the day, understand your mood, and start and end gently with non-repeating caring messages.",
      heroText: "Journal entries, local mood analysis, and supportive best-friend style messages are generated right here without any external API.",
      entryLabel: "Journal entries",
      moodLabel: "Mood pulse",
      todayMessageLabel: "Today's message",
      todayMessageTitle: "Warm start, gentle close",
      trendLabel: "Mood trend",
      trendTitle: "Recent 7 entries",
      journalLabel: "Journal",
      journalTitle: "Write today's page",
      voiceLabel: "You are",
      entryTitleLabel: "Entry title",
      entryBodyLabel: "Entry body",
      saveEntry: "Save entry",
      messageBankLabel: "Message engine",
      messageBankTitle: "Non-repeating supportive stock",
      previewLabel: "Preview",
      previewTitle: "Next morning line",
      entriesListLabel: "Entries",
      entriesListTitle: "Recent pages",
      profileLabel: "Profile",
      profileTitle: "Mood setup",
      footerNote: "Built to give daily feelings a safe place.",
      scheduleSaved: "Message schedule saved.",
      entrySaved: "Entry saved.",
      installUnavailable: "The install prompt is not available yet. Try the browser install option.",
      noEntries: "No journal entries yet.",
      male: "Male",
      female: "Female",
      dashboard: "Dashboard",
      journal: "Journal",
      messages: "Messages",
      moodSummary: (value: string) => `Average mood ${value}`,
      profileVoice: "Voice style",
      profileMorning: "Morning time",
      profileNight: "Night time",
      messageRemaining: "Messages left",
      cloudReady: "Family sync ready",
      cloudUser: "Family account linked",
      cloudSavedAt: (value: string) => `Last cloud save: ${value}`
    }
  } as const;

  const state = {
    lang: (localStorage.getItem(STORAGE.lang) as Lang) || "hi",
    theme: resolveTheme(getThemePreference()),
    mode: "dashboard" as Mode,
    voice: (localStorage.getItem(STORAGE.voice) as Voice) || "male",
    entries: loadEntries(),
    morningTime: localStorage.getItem(STORAGE.morningTime) || "07:00",
    nightTime: localStorage.getItem(STORAGE.nightTime) || "22:00",
    authUser: null as { uid: string; displayName: string | null; email: string | null } | null,
    deferredPrompt: null as BeforeInstallPromptEvent | null
  };

  const firebaseContext: { db: unknown | null; sdk: Record<string, unknown> | null; saveTimer: number | null } = {
    db: null,
    sdk: null,
    saveTimer: null
  };

  let pollTimer: number | null = null;

  function loadEntries(): Entry[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.entries) || "[]") as Entry[];
    } catch {
      return [];
    }
  }

  function getThemePreference(): string {
    return localStorage.getItem(STORAGE.familyThemeMode)
      || localStorage.getItem(STORAGE.familyTheme)
      || localStorage.getItem(STORAGE.theme)
      || "system";
  }

  function resolveTheme(themePreference: string): ThemeMode {
    if (themePreference === "night" || themePreference === "dawn") return themePreference;
    const base = themePreference === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : themePreference;
    return base === "light" ? "dawn" : "night";
  }

  function $(id: string): HTMLElement {
    return document.getElementById(id) as HTMLElement;
  }

  function inputEl(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
  }

  function textEl(id: string): HTMLTextAreaElement {
    return document.getElementById(id) as HTMLTextAreaElement;
  }

  function t<K extends keyof typeof UI_COPY.hi>(key: K): (typeof UI_COPY.hi)[K] {
    return UI_COPY[state.lang][key] as (typeof UI_COPY.hi)[K];
  }

  function todayKey(): string {
    return new Date().toISOString().slice(0, 10);
  }

  function analyzeMood(text: string): number {
    const lower = text.toLowerCase();
    let score = 0;
    POSITIVE.forEach((word) => { if (lower.includes(word)) score += 1; });
    NEGATIVE.forEach((word) => { if (lower.includes(word)) score -= 1; });
    return Math.max(-3, Math.min(3, score));
  }

  function shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function messagePool(type: "morning" | "night"): string[] {
    const sender = state.voice === "male"
      ? (type === "morning" ? ["tumhari dost", "ek pyari dost", "soft bestie"] : ["tumhari dost", "soft bestie", "warm dost"])
      : (type === "morning" ? ["tumhara dost", "ek caring dost", "steady bestie"] : ["tumhara dost", "steady bestie", "warm dost"]);
    const openings = type === "morning"
      ? ["Good morning", "Nayi subah mubarak", "Aaj ka din ready hai", "Subah ka pyaara hello", "Utho champ", "Soft morning note"]
      : ["Good night", "Raat ka halka sa hug", "Aaj ka din ab rest le", "Night note", "Aaram se so jao", "Din ko pyaar se wrap karo"];
    const middles = type === "morning"
      ? ["tum aaj bhi sambhal loge", "aaj ka pace tumhare control me hai", "khud par thoda sa pyaar rakho", "small steps bhi kaafi hote hain", "aaj ka din tumhare saath hai", "dil ko halka rakhna"]
      : ["aaj jo bhi hua uska weight ab dheere se rakh do", "tumne jitna kiya woh kaafi tha", "kal fir se fresh start milega", "khud ko aaj ke liye maaf kar do", "rest bhi progress ka part hai", "ab dimag ko chain do"];
    const closings = type === "morning"
      ? ["main yahin hoon, tumhari ${friend}.", "aaj apne aap se softly milna.", "bas present rehna, perfect nahi.", "aaj ek achhi line zarur likhna.", "thoda sa muskura ke start karo.", "tumhara din accha jaa sakta hai."]
      : ["ab chain se so jana, tumhari ${friend}.", "kal ke liye hope sambhal ke rakhna.", "aaj ka chapter pyaar se close karo.", "raat tumhe reset de rahi hai.", "ab bas saans halka kar lo.", "sleep ko apna soft reset banne do."];
    const templates: string[] = [];
    openings.forEach((opening) => {
      middles.forEach((middle) => {
        closings.forEach((closing) => {
          templates.push(`${opening}. ${middle}. ${closing.replace("${friend}", sender[Math.floor(Math.random() * sender.length)])}`);
        });
      });
    });
    return shuffle(templates);
  }

  function ensurePool(type: "morning" | "night"): string[] {
    const key = type === "morning" ? STORAGE.morningIndex : STORAGE.nightIndex;
    const storageKey = `${key}-pool`;
    const cached = localStorage.getItem(storageKey);
    const parsed = cached ? (JSON.parse(cached) as string[]) : [];
    if (parsed.length >= 20) return parsed;
    const refreshed = parsed.concat(messagePool(type)).slice(0, 280);
    localStorage.setItem(storageKey, JSON.stringify(refreshed));
    return refreshed;
  }

  function nextMessage(type: "morning" | "night"): string {
    const key = type === "morning" ? STORAGE.morningIndex : STORAGE.nightIndex;
    const poolKey = `${key}-pool`;
    const index = Number(localStorage.getItem(key) || "0");
    const pool = ensurePool(type);
    const message = pool[index % pool.length];
    localStorage.setItem(key, String(index + 1));
    return message;
  }

  function averageMood(): number {
    if (!state.entries.length) return 0;
    return state.entries.reduce((sum, entry) => sum + entry.mood, 0) / state.entries.length;
  }

  function syncAuthUi(): void {
    const authStateText = $("authStateText");
    const authBtn = $("authBtn") as HTMLButtonElement;
    if (state.authUser) {
      authStateText.textContent = `${t("authSignedAs")} ${state.authUser.displayName || state.authUser.email || "User"}`;
      authBtn.textContent = t("authSignOut") as string;
    } else {
      authStateText.textContent = t("authLoggedOut") as string;
      authBtn.textContent = t("authSignIn") as string;
    }
  }

  function applyText(): void {
    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n as keyof typeof UI_COPY.hi | undefined;
      if (!key) return;
      const value = UI_COPY[state.lang][key];
      if (typeof value === "string") node.textContent = value;
    });
    $("langHiBtn").classList.toggle("active", state.lang === "hi");
    $("langEnBtn").classList.toggle("active", state.lang === "en");
    syncAuthUi();
  }

  function setTheme(themePreference: string, persist = true): void {
    const resolved = resolveTheme(themePreference);
    state.theme = resolved;
    document.body.dataset.theme = resolved;
    if (persist) {
      localStorage.setItem(STORAGE.theme, resolved);
      localStorage.setItem(STORAGE.familyTheme, resolved === "dawn" ? "light" : "dark");
      localStorage.setItem(STORAGE.familyThemeMode, resolved === "dawn" ? "light" : "dark");
    }
  }

  function setLanguage(lang: Lang): void {
    state.lang = lang;
    localStorage.setItem(STORAGE.lang, lang);
    document.documentElement.lang = lang;
    renderEverything();
  }

  function renderModeTabs(): void {
    const tabs = [
      { id: "dashboard", label: t("dashboard") },
      { id: "journal", label: t("journal") },
      { id: "messages", label: t("messages") }
    ];
    $("modeTabs").innerHTML = tabs.map((tab) => `<button class="tab-btn ${state.mode === tab.id ? "active" : ""}" type="button" data-mode="${tab.id}">${tab.label}</button>`).join("");
    document.querySelectorAll<HTMLElement>(".tool-view").forEach((view) => {
      view.classList.toggle("active", view.id === `view-${state.mode}`);
    });
  }

  function renderHero(): void {
    $("heroBadges").innerHTML = ["Local mood analysis", "Message stock", "Cloud-ready", "Journal timeline"].map((item) => `<span class="hero-badge">${item}</span>`).join("");
    $("entryHeadline").textContent = `${state.entries.length}`;
    $("entryValue").textContent = `${state.entries.length}`;
    $("entryMeta").textContent = state.entries.length ? state.entries[0].createdAt.slice(0, 10) : "--";
    $("moodHeadline").textContent = averageMood().toFixed(1);
    $("moodMeta").textContent = (t("moodSummary") as (value: string) => string)(averageMood().toFixed(1));
  }

  function renderMessageCard(): void {
    const morning = ensurePool("morning")[Number(localStorage.getItem(STORAGE.morningIndex) || "0") % ensurePool("morning").length];
    const night = ensurePool("night")[Number(localStorage.getItem(STORAGE.nightIndex) || "0") % ensurePool("night").length];
    $("messageCard").innerHTML = `<strong>Morning</strong><p>${morning}</p><hr><strong>Night</strong><p>${night}</p>`;
    $("previewCard").innerHTML = `<p>${morning}</p>`;
  }

  function renderTrend(): void {
    const recent = state.entries.slice(0, 7);
    $("trendList").innerHTML = recent.map((entry) => `
      <div class="detail-card">
        <strong>${entry.title || "Untitled"}</strong>
        <div class="trend-bar"><span style="width:${Math.max(10, 50 + entry.mood * 15)}%"></span></div>
      </div>
    `).join("");
  }

  function renderEntries(): void {
    if (!state.entries.length) {
      $("entriesList").innerHTML = `<div class="history-empty">${t("noEntries")}</div>`;
      return;
    }
    $("entriesList").innerHTML = state.entries.map((entry) => `
      <div class="history-item">
        <strong>${entry.title || "Untitled"}</strong>
        <small>${entry.createdAt.slice(0, 10)} · mood ${entry.mood}</small>
      </div>
    `).join("");
  }

  function renderMessageStats(): void {
    const morningRemaining = ensurePool("morning").length - Number(localStorage.getItem(STORAGE.morningIndex) || "0");
    const nightRemaining = ensurePool("night").length - Number(localStorage.getItem(STORAGE.nightIndex) || "0");
    $("messageStats").innerHTML = `
      <div class="detail-card"><strong>${Math.max(morningRemaining, 0)}</strong><div>Morning ${t("messageRemaining")}</div></div>
      <div class="detail-card"><strong>${Math.max(nightRemaining, 0)}</strong><div>Night ${t("messageRemaining")}</div></div>
      <div class="detail-card"><strong>${state.voice === "male" ? t("male") : t("female")}</strong><div>${t("profileVoice")}</div></div>
      <div class="detail-card"><strong>${state.entries.length}</strong><div>${t("entryLabel")}</div></div>
    `;
  }

  function renderProfileSummary(): void {
    const synced = localStorage.getItem(STORAGE.cloudSyncedAt);
    $("profileSummary").innerHTML = `
      <div class="stack-row"><span>${t("profileVoice")}</span><strong>${state.voice === "male" ? t("male") : t("female")}</strong></div>
      <div class="stack-row"><span>${t("profileMorning")}</span><strong>${state.morningTime}</strong></div>
      <div class="stack-row"><span>${t("profileNight")}</span><strong>${state.nightTime}</strong></div>
      <div class="stack-row"><span>Cloud</span><strong>${state.authUser ? (t("cloudUser") as string) : (t("cloudReady") as string)}</strong></div>
      ${synced ? `<div class="stack-row"><span>Sync</span><strong>${synced}</strong></div>` : ""}
    `;
  }

  function renderEverything(): void {
    applyText();
    renderModeTabs();
    renderHero();
    renderMessageCard();
    renderTrend();
    renderEntries();
    renderMessageStats();
    renderProfileSummary();
    inputEl("morningTimeInput").value = state.morningTime;
    inputEl("nightTimeInput").value = state.nightTime;
    (document.getElementById("voiceSelect") as HTMLSelectElement).value = state.voice;
  }

  function queueCloudSave(): void {
    if (!state.authUser || !firebaseContext.db || !firebaseContext.sdk) return;
    if (firebaseContext.saveTimer) window.clearTimeout(firebaseContext.saveTimer);
    firebaseContext.saveTimer = window.setTimeout(() => { void saveCloudState(); }, 700);
  }

  async function saveCloudState(): Promise<void> {
    if (!state.authUser || !firebaseContext.db || !firebaseContext.sdk) return;
    try {
      const { doc, setDoc } = firebaseContext.sdk as {
        doc: (...args: unknown[]) => unknown;
        setDoc: (ref: unknown, value: Record<string, unknown>, options: { merge: boolean }) => Promise<void>;
      };
      const ref = doc(firebaseContext.db, "users", state.authUser.uid, "apps", "mann-sathi", "state", "default");
      await setDoc(ref, {
        entries: state.entries,
        voice: state.voice,
        morningTime: state.morningTime,
        nightTime: state.nightTime,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      localStorage.setItem(STORAGE.cloudSyncedAt, new Date().toLocaleString());
      renderProfileSummary();
    } catch (error) {
      console.error("Cloud save failed", error);
    }
  }

  async function loadCloudState(): Promise<void> {
    if (!state.authUser || !firebaseContext.db || !firebaseContext.sdk) return;
    try {
      const { doc, getDoc } = firebaseContext.sdk as {
        doc: (...args: unknown[]) => unknown;
        getDoc: (ref: unknown) => Promise<{ exists: () => boolean; data: () => Record<string, unknown> }>;
      };
      const ref = doc(firebaseContext.db, "users", state.authUser.uid, "apps", "mann-sathi", "state", "default");
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      if (Array.isArray(data.entries)) state.entries = data.entries as Entry[];
      if (typeof data.voice === "string" && (data.voice === "male" || data.voice === "female")) state.voice = data.voice;
      if (typeof data.morningTime === "string") state.morningTime = data.morningTime;
      if (typeof data.nightTime === "string") state.nightTime = data.nightTime;
      renderEverything();
    } catch (error) {
      console.error("Cloud load failed", error);
    }
  }

  async function initFamilyAuth(): Promise<void> {
    try {
      const firebaseApp = await import("https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js");
      const firebaseAuth = await import("https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js");
      const firebaseStore = await import("https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js");
      const app = firebaseApp.initializeApp(FIREBASE_CONFIG, "mann-sathi-family-app");
      const auth = firebaseAuth.getAuth(app);
      const provider = new firebaseAuth.GoogleAuthProvider();
      const db = firebaseStore.getFirestore(app);
      firebaseContext.db = db;
      firebaseContext.sdk = { ...firebaseAuth, ...firebaseStore };

      ($("authBtn") as HTMLButtonElement).addEventListener("click", async () => {
        if (state.authUser) {
          await firebaseAuth.signOut(auth);
        } else {
          await firebaseAuth.signInWithPopup(auth, provider);
        }
      });

      firebaseAuth.onAuthStateChanged(auth, async (user) => {
        state.authUser = user ? { uid: user.uid, displayName: user.displayName, email: user.email } : null;
        syncAuthUi();
        if (state.authUser) {
          await loadCloudState();
          queueCloudSave();
        }
      });
    } catch (error) {
      console.error("Family auth unavailable", error);
    }
  }

  function saveEntry(): void {
    const title = inputEl("entryTitleInput").value.trim();
    const body = textEl("entryBodyInput").value.trim();
    if (!body) return;
    const entry: Entry = {
      id: String(Date.now()),
      title,
      body,
      createdAt: new Date().toISOString(),
      mood: analyzeMood(`${title} ${body}`)
    };
    state.entries = [entry, ...state.entries].slice(0, 120);
    localStorage.setItem(STORAGE.entries, JSON.stringify(state.entries));
    $("entryStatus").textContent = t("entrySaved") as string;
    inputEl("entryTitleInput").value = "";
    textEl("entryBodyInput").value = "";
    renderEverything();
    queueCloudSave();
  }

  async function saveSchedule(): Promise<void> {
    state.morningTime = inputEl("morningTimeInput").value || "07:00";
    state.nightTime = inputEl("nightTimeInput").value || "22:00";
    localStorage.setItem(STORAGE.morningTime, state.morningTime);
    localStorage.setItem(STORAGE.nightTime, state.nightTime);
    if ("Notification" in window && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.error("Notification permission failed", error);
      }
    }
    $("scheduleStatus").textContent = t("scheduleSaved") as string;
    renderEverything();
    queueCloudSave();
  }

  async function maybeNotify(type: "morning" | "night"): Promise<void> {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const lastKey = type === "morning" ? STORAGE.lastMorning : STORAGE.lastNight;
    if (localStorage.getItem(lastKey) === todayKey()) return;
    const target = type === "morning" ? state.morningTime : state.nightTime;
    const [hours, minutes] = target.split(":").map((part) => Number(part));
    const now = new Date();
    if (now.getHours() < hours || (now.getHours() === hours && now.getMinutes() < minutes)) return;
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return;
    const message = nextMessage(type);
    await registration.showNotification("Mann Sathi", { body: message });
    localStorage.setItem(lastKey, todayKey());
    renderMessageCard();
    renderMessageStats();
  }

  function startMessageLoop(): void {
    if (pollTimer) window.clearInterval(pollTimer);
    pollTimer = window.setInterval(() => {
      void maybeNotify("morning");
      void maybeNotify("night");
    }, 60000);
  }

  function initInstallFlow(): void {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      state.deferredPrompt = event as BeforeInstallPromptEvent;
    });
    window.addEventListener("appinstalled", () => {
      localStorage.setItem(STORAGE.installMarker, "true");
      state.deferredPrompt = null;
    });
    $("installBtn").addEventListener("click", async () => {
      if (!state.deferredPrompt) {
        alert(t("installUnavailable") as string);
        return;
      }
      await state.deferredPrompt.prompt();
      await state.deferredPrompt.userChoice;
      state.deferredPrompt = null;
    });
  }

  async function registerServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("./sw.js");
      } catch (error) {
        console.error("Service worker registration failed", error);
      }
    }
  }

  function bindEvents(): void {
    const openDrawer = () => {
      $("drawer").classList.add("open");
      $("drawer").setAttribute("aria-hidden", "false");
    };
    const closeDrawer = () => {
      $("drawer").classList.remove("open");
      $("drawer").setAttribute("aria-hidden", "true");
    };
    $("openDrawerBtn").addEventListener("click", openDrawer);
    $("closeDrawerBtn").addEventListener("click", closeDrawer);
    $("drawer").addEventListener("click", (event) => {
      if (event.target === $("drawer")) closeDrawer();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDrawer();
    });
    document.querySelectorAll<HTMLAnchorElement>("#drawer a").forEach((link) => {
      link.addEventListener("click", closeDrawer);
    });
    $("themeBtn").addEventListener("click", () => setTheme(state.theme === "night" ? "dawn" : "night"));
    $("langHiBtn").addEventListener("click", () => setLanguage("hi"));
    $("langEnBtn").addEventListener("click", () => setLanguage("en"));
    $("saveScheduleBtn").addEventListener("click", () => { void saveSchedule(); });
    $("saveEntryBtn").addEventListener("click", saveEntry);
    $("modeTabs").addEventListener("click", (event) => {
      const mode = (event.target as HTMLElement).dataset.mode as Mode | undefined;
      if (!mode) return;
      state.mode = mode;
      renderModeTabs();
    });
    (document.getElementById("voiceSelect") as HTMLSelectElement).addEventListener("change", () => {
      state.voice = (document.getElementById("voiceSelect") as HTMLSelectElement).value as Voice;
      localStorage.setItem(STORAGE.voice, state.voice);
      renderEverything();
      queueCloudSave();
    });
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE.familyTheme || event.key === STORAGE.familyThemeMode) {
        setTheme(getThemePreference(), false);
      }
    });
  }

  void (async function init(): Promise<void> {
    document.body.dataset.theme = state.theme;
    await registerServiceWorker();
    initInstallFlow();
    bindEvents();
    await initFamilyAuth();
    renderEverything();
    startMessageLoop();
  })();
})();
