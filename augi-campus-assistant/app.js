// AUGI - Ahmedabad University AI Assistant Engine (Stitch Design System + Enhanced Speech-to-Text)

document.addEventListener("DOMContentLoaded", () => {
  const data = window.AUGI_DATA;

  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // Security Helper: Strict HTML Escaping to prevent XSS
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Normalized data helper references
  const locations = data.campusLocations || [];
  const gates = data.campusGates || [];
  const calendars = data.academicCalendar || {};
  const cafeterias = data.cafeterias || [];
  const gradingScale = data.gradingScale || [];
  const attendanceRules = data.attendanceRules || { creditLimits: [] };
  const faqs = data.faqs || [];

  // Flattened advisors list
  const advisors = [];
  (data.programmeAdvisors || []).forEach(sch => {
    (sch.programmes || []).forEach(prog => {
      advisors.push({
        school: sch.school,
        degree: prog.degree,
        advisor: prog.advisor || "Programme Faculty",
        advisorEmail: prog.advisorEmail || "",
        chair: prog.chair || "Programme Chair",
        chairEmail: prog.chair && prog.chair.includes("(") ? prog.chair.match(/\((.*?)\)/)[1] : "academic@ahduni.edu.in",
        manager: prog.manager || "Programme Manager",
        managerEmail: prog.manager && prog.manager.includes("(") ? prog.manager.match(/\((.*?)\)/)[1] : "programme@ahduni.edu.in"
      });
    });
  });

  const INITIAL_MESSAGE = {
    sender: "augi",
    text: "Hello! I am **AUGI**, your Ahmedabad University campus companion. I can help you navigate campus buildings, find cafeterias & food spots, calculate attendance limits, estimate GPA on the 4.0 scale, look up faculty advisors, or answer academic policies from the **2026–2027 Student Handbook**.\n\nWhat can I assist you with today?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    chips: [
      "☕ Where are the cafeterias?",
      "🗺️ Where is University Centre?",
      "📉 Attendance grade drop rules",
      "👥 Who is the CSE Advisor?",
      "📅 2026-27 Academic Calendar",
      "🚨 Emergency Contacts"
    ]
  };

  let currentTab = "chat";
  let chatMessages = [ { ...INITIAL_MESSAGE } ];

  // DOM Elements
  const tabButtons = document.querySelectorAll(".nav-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const chatContainer = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const voiceBtn = document.getElementById("voice-btn");
  const sosModal = document.getElementById("sos-modal");
  const openSosBtns = document.querySelectorAll(".open-sos-btn");
  const closeSosBtn = document.getElementById("close-sos-btn");

  // Privacy & Security Elements
  const privacyModal = document.getElementById("privacy-modal");
  const openPrivacyBtn = document.getElementById("open-privacy-btn");
  const closePrivacyBtn = document.getElementById("close-privacy-btn");
  const purgeDataBtn = document.getElementById("purge-data-btn");
  const quickExitBtn = document.getElementById("quick-exit-btn");
  const toastNotification = document.getElementById("toast-notification");
  const toastMessage = document.getElementById("toast-message");

  function showToast(msg) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = msg;
    toastNotification.classList.add("show");
    setTimeout(() => {
      toastNotification.classList.remove("show");
    }, 3000);
  }

  // Quick Exit Security Handler
  function executeQuickExit() {
    window.location.replace("https://www.ahduni.edu.in");
  }

  if (quickExitBtn) quickExitBtn.addEventListener("click", executeQuickExit);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (privacyModal && !privacyModal.classList.contains("hidden")) {
        privacyModal.classList.add("hidden");
      } else if (sosModal && !sosModal.classList.contains("hidden")) {
        sosModal.classList.add("hidden");
      } else {
        executeQuickExit();
      }
    }
  });

  // Privacy Modal Controls
  if (openPrivacyBtn) {
    openPrivacyBtn.addEventListener("click", () => {
      if (privacyModal) privacyModal.classList.remove("hidden");
    });
  }
  if (closePrivacyBtn) {
    closePrivacyBtn.addEventListener("click", () => {
      if (privacyModal) privacyModal.classList.add("hidden");
    });
  }
  if (privacyModal) {
    privacyModal.addEventListener("click", (e) => {
      if (e.target === privacyModal) privacyModal.classList.add("hidden");
    });
  }

  // Purge All User Data Function
  function purgeAllUserData() {
    chatMessages = [ { ...INITIAL_MESSAGE } ];
    gpaCourses = [
      { name: "Course 1", credits: 3, grade: "A" },
      { name: "Course 2", credits: 3, grade: "A-" }
    ];
    if (missedClassesInput) missedClassesInput.value = "0";
    if (chatInput) chatInput.value = "";
    
    renderChat();
    calculateAttendance();
    renderGpaCourses();
    
    if (privacyModal) privacyModal.classList.add("hidden");
    showToast("🛡️ Local session data & history purged securely.");
  }

  if (purgeDataBtn) purgeDataBtn.addEventListener("click", purgeAllUserData);

  // -------------------------------------------------------------
  // HIGH-PRECISION REAL-TIME SPEECH-TO-TEXT ENGINE
  // -------------------------------------------------------------
  let isListening = false;
  let recognition = null;
  let voiceSubmitTimeout = null;
  const defaultPlaceholder = "Ask AUGI about attendance, cafeterias, buildings, advisors...";

  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      if (voiceBtn) {
        voiceBtn.classList.add("recording-active");
        voiceBtn.innerHTML = `<span class="material-symbols-outlined text-base">stop</span>`;
      }
      if (chatInput) {
        chatInput.placeholder = "🎙️ Listening... speak now (tap button when done)";
      }
      showToast("🎙️ Microphone active. Speak your question...");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (chatInput) {
        chatInput.value = finalTranscript || interimTranscript;
      }

      // If user finished a coherent sentence, schedule smooth auto-submit after silence
      if (finalTranscript.trim()) {
        clearTimeout(voiceSubmitTimeout);
        voiceSubmitTimeout = setTimeout(() => {
          if (isListening) {
            stopVoice();
            handleSendMessage();
          }
        }, 800);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        showToast("⚠️ Microphone access denied. Please allow mic permissions in your browser.");
      } else if (event.error !== 'no-speech') {
        showToast(`Voice notice: ${event.error}`);
      }
      stopVoice();
    };

    recognition.onend = () => {
      stopVoice();
    };
  }

  function toggleVoice() {
    if (!recognition) {
      showToast("Speech recognition is not supported in this browser. Please use Chrome/Edge.");
      return;
    }
    if (isListening) {
      stopVoice();
      if (chatInput && chatInput.value.trim()) {
        handleSendMessage();
      }
    } else {
      try {
        if (chatInput) chatInput.value = "";
        recognition.start();
      } catch (e) {
        stopVoice();
      }
    }
  }

  function stopVoice() {
    isListening = false;
    clearTimeout(voiceSubmitTimeout);
    try {
      if (recognition) recognition.stop();
    } catch (e) {}

    if (voiceBtn) {
      voiceBtn.classList.remove("recording-active");
      voiceBtn.innerHTML = `<span class="material-symbols-outlined">mic</span>`;
    }
    if (chatInput) {
      chatInput.placeholder = defaultPlaceholder;
    }
  }

  if (voiceBtn) voiceBtn.addEventListener("click", toggleVoice);

  // -------------------------------------------------------------
  // TAB NAVIGATION (Directional Horizontal Slide Transitions)
  // -------------------------------------------------------------
  const TAB_ORDER = ["chat", "map", "directory", "tools"];

  function switchTab(tabId) {
    if (currentTab === tabId && document.getElementById(`tab-${tabId}`)?.classList.contains("active")) return;

    const targetIdx = TAB_ORDER.indexOf(tabId);
    currentTab = tabId;

    TAB_ORDER.forEach((id, idx) => {
      const el = document.getElementById(`tab-${id}`);
      if (!el) return;
      const isTools = id === "tools";
      const baseClass = isTools ? "tab-content overflow-y-auto pane-scroll space-y-4 pr-1 pb-8" : "tab-content space-y-3";

      if (idx === targetIdx) {
        el.className = `${baseClass} active`;
      } else if (idx < targetIdx) {
        el.className = `${baseClass} slide-left`;
      } else {
        el.className = `${baseClass} slide-right`;
      }
    });

    tabButtons.forEach(btn => {
      const icon = btn.querySelector(".material-symbols-outlined");
      if (btn.dataset.tab === tabId) {
        btn.classList.add("active-tab", "text-primary", "font-bold");
        btn.classList.remove("text-on-surface-variant");
        if (btn.closest("nav.md\\:hidden")) {
          btn.classList.add("bg-primary-container/20");
        }
        if (icon) icon.classList.add("filled");
      } else {
        btn.classList.remove("active-tab", "text-primary", "font-bold", "bg-primary-container/20");
        btn.classList.add("text-on-surface-variant");
        if (icon) icon.classList.remove("filled");
      }
    });

    if (tabId === "map") {
      selectBuilding("uc");
    } else if (tabId === "directory") {
      renderDirectory();
    } else if (tabId === "tools") {
      calculateAttendance();
      renderGpaCourses();
      renderCalendar();
      renderHandbookFaqs();
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Emergency SOS Modal
  openSosBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (sosModal) sosModal.classList.remove("hidden");
    });
  });

  if (closeSosBtn) {
    closeSosBtn.addEventListener("click", () => {
      if (sosModal) sosModal.classList.add("hidden");
    });
  }

  if (sosModal) {
    sosModal.addEventListener("click", (e) => {
      if (e.target === sosModal) sosModal.classList.add("hidden");
    });
  }

  // -------------------------------------------------------------
  // CHAT ASSISTANT (Listen Feature Removed, Clean & Crisp)
  // -------------------------------------------------------------
  function renderChat() {
    if (!chatContainer) return;
    chatContainer.innerHTML = chatMessages.map((msg, index) => {
      const isUser = msg.sender === "user";
      const formattedText = isUser ? escapeHtml(msg.text) : formatMarkdown(msg.text);

      let cardHtml = "";
      if (msg.locationCard) {
        cardHtml = `
          <div class="mt-3 p-3.5 bg-surface-container-high border border-white/10 rounded-2xl text-xs space-y-2 shadow-md">
            <div class="flex items-center justify-between font-bold text-white">
              <span class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                ${escapeHtml(msg.locationCard.name)}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 bg-surface-container text-primary border border-primary/20 rounded-full">${escapeHtml(msg.locationCard.campus)}</span>
            </div>
            <p class="text-on-surface-variant leading-relaxed">${escapeHtml(msg.locationCard.description)}</p>
            <div class="text-[11px] text-on-surface"><strong>Nearest Gate:</strong> ${escapeHtml(msg.locationCard.nearestGate)}</div>
            <button onclick="window.viewLocationOnMap('${escapeHtml(msg.locationCard.id)}')" class="w-full py-2 bg-primary-container hover:brightness-110 text-on-primary-container font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98">
              <span class="material-symbols-outlined text-sm">explore</span>
              View on Campus Map
            </button>
          </div>
        `;
      }

      let chipsHtml = "";
      if (msg.chips && msg.chips.length > 0 && index === chatMessages.length - 1) {
        chipsHtml = `
          <div class="flex flex-wrap gap-2 mt-3 pt-2 border-t border-white/10">
            ${msg.chips.map(chip => `
              <button onclick="window.quickSend('${escapeHtml(chip).replace(/'/g, "\\'")}')" class="chip-btn text-xs px-3.5 py-1.5 rounded-full font-medium shadow-xs">
                ${escapeHtml(chip)}
              </button>
            `).join("")}
          </div>
        `;
      }

      return `
        <div class="flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-3 msg-anim">
          <div class="flex items-start gap-2.5 max-w-[92%] md:max-w-[82%]">
            ${!isUser ? `
              <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                AU
              </div>
            ` : ''}
            <div class="${isUser ? 'chat-bubble-user px-4 py-2.5' : 'chat-bubble-augi px-4 py-3.5'}">
              <div class="text-xs sm:text-sm leading-relaxed ${isUser ? 'text-white' : 'text-on-surface'}">
                ${formattedText}
              </div>
              ${cardHtml}
              ${chipsHtml}
              <div class="text-[10px] mt-1.5 font-label-mono ${isUser ? 'text-red-100 text-right' : 'text-on-surface-variant'}">
                ${msg.time}
              </div>
            </div>
            ${isUser ? `
              <div class="w-8 h-8 rounded-full bg-surface-container text-primary flex items-center justify-center text-xs font-bold shrink-0 shadow-md border border-white/10">
                You
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join("");

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-primary-container/20 text-primary border border-primary/20 rounded text-xs font-label-mono">$1</code>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  }

  // NLP Knowledge Engine
  function queryAugiKnowledge(query) {
    const q = query.toLowerCase().trim();

    // 1. CAFETERIAS
    if (q.includes("cafeteria") || q.includes("canteen") || q.includes("food") || q.includes("dining") || q.includes("restaurant") || q.includes("eat") || q.includes("hungry") || q.includes("snack") || q.includes("bistro") || q.includes("cafe") || q.includes("café") || q.includes("noboru") || q.includes("delice") || q.includes("greens and grains") || q.includes("truly indian")) {
      const cafeList = cafeterias.map(c => `• **${c.name}** (${c.location})\n  *Type:* ${c.type} | *Hours:* ${c.timings}`).join("\n\n");
      return {
        text: `**🍽️ Cafeterias & Dining Options on Campus:**\n\nAhmedabad University offers several casual and fine dining options across the campus and its immediate vicinity:\n\n${cafeList}\n\n*(Source: AU Student Handbook, Page 49)*`,
        chips: ["Where is University Centre?", "Where is VentureStudio?", "Central Library hours"]
      };
    }

    // 2. ATTENDANCE & GRADE DROP RULES
    if (q.includes("attendance") || q.includes("grade drop") || q.includes("absent") || q.includes("miss") || q.includes("leave") || q.includes("np grade") || q.includes("safe limit")) {
      return {
        text: `**📉 AU Attendance Policy & Grade Penalties:**\n\n• **Minimum Attendance Required:** **75%** in each registered course.\n• **60% to 74.9% Attendance:** **1 Grade Drop Penalty** is automatically applied to your final earned letter grade (e.g., \`A\` ➔ \`A-\`, \`B\` ➔ \`B-\`, \`B-\` ➔ \`C+\`).\n• **Below 60% Attendance:** You are awarded an **'NP' (Not Passed)** grade with zero grade points, and you must repeat the course.\n\n**Safe Absence Limits by Course Credits:**\n• **4.0 Credit Course (45 sessions):** Max **9 safe absences** (at 10 = 1 grade drop; at 16 = NP).\n• **3.0 Credit Course (30 sessions):** Max **6 safe absences** (at 7 = 1 grade drop; at 11 = NP).\n• **2.0 Credit Course (20 sessions):** Max **4 safe absences** (at 5 = 1 grade drop; at 7 = NP).\n• **1.5 Credit Course (15 sessions):** Max **3 safe absences** (at 4 = 1 grade drop; at 6 = NP).\n• **1.0 Credit Course (10 sessions):** Max **2 safe absences** (at 3 = 1 grade drop; at 4 = NP).\n\n*(Source: AU Student Handbook, Page 29-30)*`,
        chips: ["Open Attendance Calculator", "Estimate GPA on 4.0 scale"]
      };
    }

    // 3. GPA & GRADING SYSTEM
    if (q.includes("gpa") || q.includes("cgpa") || q.includes("grading") || q.includes("4.0") || q.includes("scale") || q.includes("grade point") || q.includes("deans list") || q.includes("honours")) {
      return {
        text: `**🎓 Ahmedabad University 4.00 Grading System:**\n\n• **A:** \`4.0\` (Excellent)\n• **A-:** \`3.7\` (Very Good)\n• **B+:** \`3.3\` (High Competence)\n• **B:** \`3.0\` (Good / Solid Understanding)\n• **B-:** \`2.7\` (Satisfactory)\n• **C+:** \`2.3\` (Fair / Adequate)\n• **C:** \`2.0\` (Minimum passing CGPA for graduation)\n• **D:** \`1.7\` (Minimum passing single course grade)\n• **NP:** \`0.0\` (Not Passed - repeat required)\n\n*(Source: AU Student Handbook, Page 31-33)*`,
        chips: ["Calculate GPA", "Attendance grade drop rules"]
      };
    }

    // 4. ADVISORS & FACULTY
    if (q.includes("advisor") || q.includes("chair") || q.includes("faculty") || q.includes("cse") || q.includes("chemical") || q.includes("mechanical") || q.includes("management") || q.includes("economics") || q.includes("physics")) {
      const match = advisors.find(a => q.includes(a.degree.toLowerCase()) || q.includes(a.advisor.toLowerCase()));
      if (match) {
        return {
          text: `**👥 Major Advisor Details:**\n\n• **Programme:** ${match.degree}\n• **School:** ${match.school}\n• **Major Advisor:** **${match.advisor}**\n• **Programme Chair:** ${match.chair}\n• **Programme Manager:** ${match.manager}`,
          chips: ["Open Full Directory", "Where is University Centre?"]
        };
      }
      return {
        text: `**👥 Major Advisors & Programme Chairs:**\n\nYou can search for all major advisors across Engineering (SEAS), Arts & Sciences (SAS), and Management (AMSOM) in the **Directory** tab.`,
        chips: ["Open Full Directory", "Who is the CSE Advisor?"]
      };
    }

    // 5. BUILDINGS & LOCATIONS
    for (const b of locations) {
      if (q.includes(b.id) || q.includes(b.name.toLowerCase())) {
        const facilityList = (b.floors || []).flatMap(f => f.facilities).slice(0, 5);
        return {
          text: `**📍 ${b.name} (${b.campus}):**\n\n${b.description}\n\n• **Nearest Gate:** ${b.nearestGate}\n• **Key Facilities:**\n${facilityList.map(f => `  - ${f}`).join("\n")}`,
          locationCard: b,
          chips: ["View on Campus Map", "Where are the cafeterias?"]
        };
      }
    }

    // 6. EMERGENCY CONTACTS & CONFIDENTIALITY
    if (q.includes("emergency") || q.includes("sos") || q.includes("security") || q.includes("doctor") || q.includes("ambulance") || q.includes("ragging") || q.includes("posh") || q.includes("harassment") || q.includes("help")) {
      return {
        text: `**🚨 Emergency & Confidential Support (24/7):**\n\n• **Campus Security Supervisor:** \`+91.9998800237\` (24h)\n• **University Doctor (Dr. Gayatri Raval):** \`+91.07961911026\` (Health Centre, 1st Fl UC)\n• **Anti-Ragging Helpline (Toll-Free):** \`1800.180.5522\`\n• **POSH Committee (Sexual Harassment Complaints):** \`posh@ahduni.edu.in\` *(Strict Confidentiality)*\n• **Emergency Ambulance:** \`108\`\n\n*Tap the red SOS button or Shield icon at any time for confidential support.*`,
        chips: ["Where is University Centre?", "Central Library hours"]
      };
    }

    // DEFAULT
    return {
      text: `I searched the **Ahmedabad University 2026–2027 Student Handbook** for "${escapeHtml(query)}". Here are key topics you can explore:`,
      chips: [
        "☕ Where are the cafeterias?",
        "🗺️ Where is University Centre?",
        "📉 Attendance grade drop rules",
        "🎓 GPA Calculator (4.0 scale)",
        "👥 Who is the CSE Advisor?",
        "🚨 Emergency SOS"
      ]
    };
  }

  function handleSendMessage(text) {
    const rawQuery = text || (chatInput ? chatInput.value.trim() : "");
    if (!rawQuery) return;

    if (chatInput) chatInput.value = "";

    chatMessages.push({
      sender: "user",
      text: rawQuery,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    renderChat();

    setTimeout(() => {
      const response = queryAugiKnowledge(rawQuery);
      chatMessages.push({
        sender: "augi",
        text: response.text,
        locationCard: response.locationCard,
        chips: response.chips,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      renderChat();
    }, 200);
  }

  if (sendBtn) sendBtn.addEventListener("click", () => handleSendMessage());
  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSendMessage();
    });
  }

  window.quickSend = function(text) {
    if (text.includes("Open Attendance Calculator") || text.includes("Calculate GPA")) {
      switchTab("tools");
    } else if (text.includes("Open Full Directory")) {
      switchTab("directory");
    } else if (text.includes("Open Calendar Tool")) {
      switchTab("tools");
    } else {
      switchTab("chat");
      handleSendMessage(text);
    }
  };

  // -------------------------------------------------------------
  // CAMPUS MAP & WAYFINDING ROUTE ENGINE
  // -------------------------------------------------------------
  const mapSvg = document.getElementById("campus-map-svg");
  const mapSearchInput = document.getElementById("map-search");
  const buildingDetailsContainer = document.getElementById("building-details");
  const svgRouteLayer = document.getElementById("svg-route-layer");
  const routeStartSelect = document.getElementById("route-start");
  const routeDestSelect = document.getElementById("route-dest");
  const findRouteBtn = document.getElementById("find-route-btn");

  const MAP_COORDINATES = {
    g10: { x: 865, y: 400, name: "Gate 10 (Main Gate)" },
    g12: { x: 600, y: 200, name: "Gate 12 (University Centre)" },
    g6: { x: 360, y: 670, name: "Gate 6 (Central Campus)" },
    g7: { x: 880, y: 670, name: "Gate 7 (S V Desai Road)" },
    g8: { x: 920, y: 400, name: "Gate 8 (East Campus)" },
    g3: { x: 650, y: 30, name: "Gate 3 (VentureStudio)" },
    g5: { x: 170, y: 520, name: "Gate 5 (Bio Lab)" },
    g15: { x: 35, y: 240, name: "Gate 15 (Sports Complex)" },
    uc: { x: 620, y: 560, name: "University Centre (UC)" },
    gict: { x: 435, y: 500, name: "GICT Building (SEAS)" },
    sas: { x: 780, y: 390, name: "SAS Arts & Sciences" },
    amsom: { x: 800, y: 570, name: "AMSOM Management" },
    undergrad_hl: { x: 1030, y: 530, name: "Undergrad / HL Building" },
    venturestudio: { x: 520, y: 120, name: "VentureStudio" },
    univ_office: { x: 1020, y: 110, name: "University Administration" },
    bio_lab: { x: 175, y: 640, name: "Biosciences Research Lab" },
    sports_complex: { x: 160, y: 345, name: "Sports Complex & Track" }
  };

  function selectBuilding(buildingId) {
    const b = locations.find(l => l.id === buildingId) || locations[0];
    if (!b) return;

    if (svgRouteLayer) svgRouteLayer.innerHTML = "";

    document.querySelectorAll(".map-building").forEach(el => {
      if (el.dataset.id === buildingId) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    });

    const allFacilities = (b.floors || []).flatMap(f => f.facilities);

    if (buildingDetailsContainer) {
      buildingDetailsContainer.innerHTML = `
        <div class="glass-panel p-4 md:p-5 rounded-2xl border border-white/10 shadow-xl space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-primary-container animate-pulse"></span>
              <h3 class="font-bold text-sm md:text-base text-white">${escapeHtml(b.name)}</h3>
            </div>
            <button onclick="window.quickSend('Tell me all about ${escapeHtml(b.name)}')" class="px-2.5 py-1 bg-primary-container/20 text-primary hover:bg-primary-container hover:text-on-primary-container font-bold text-xs rounded-xl flex items-center gap-1 transition-all border border-primary/20">
              <span class="material-symbols-outlined text-xs">chat_bubble</span>
              Ask
            </button>
          </div>

          <div class="text-[11px] text-on-surface-variant">
            ${escapeHtml(b.campus)} • <strong>Nearest:</strong> ${escapeHtml(b.nearestGate)}
          </div>

          <p class="text-xs text-on-surface leading-relaxed">${escapeHtml(b.description)}</p>

          <div class="space-y-1.5 pt-2 border-t border-white/10">
            <h4 class="text-[10px] font-label-mono text-on-surface-variant uppercase tracking-wider">Floor Directory & Facilities</h4>
            <div class="space-y-1 max-h-48 overflow-y-auto pane-scroll pr-1">
              ${allFacilities.map(f => `
                <div class="text-xs p-2 bg-surface-container rounded-lg border border-white/5 flex items-center gap-2 text-on-surface">
                  <span class="text-primary">•</span>
                  <span>${escapeHtml(f)}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    }
  }

  function drawWayfindingRoute(startKey, destKey) {
    const start = MAP_COORDINATES[startKey];
    const dest = MAP_COORDINATES[destKey];
    if (!start || !dest || !svgRouteLayer) return;

    const midX = (start.x + dest.x) / 2;
    const midY = (start.y + dest.y) / 2;
    const pathD = `M ${start.x} ${start.y} Q ${midX} ${midY} ${dest.x} ${dest.y}`;

    svgRouteLayer.innerHTML = `
      <path d="${pathD}" fill="none" stroke="#d71920" stroke-width="9" stroke-opacity="0.3" stroke-linecap="round"/>
      <path d="${pathD}" fill="none" class="animated-route-line"/>
      <circle cx="${start.x}" cy="${start.y}" r="8" fill="#2ECC71" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="${dest.x}" cy="${dest.y}" r="8" fill="#FF4D4D" stroke="#FFFFFF" stroke-width="2"/>
    `;

    const dx = dest.x - start.x;
    const dy = dest.y - start.y;
    const distanceMeters = Math.round(Math.sqrt(dx * dx + dy * dy) * 0.45);
    const walkMinutes = Math.max(1, Math.round(distanceMeters / 80));

    if (buildingDetailsContainer) {
      buildingDetailsContainer.innerHTML = `
        <div class="glass-panel p-4 md:p-5 rounded-2xl border border-primary/30 shadow-xl space-y-3">
          <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div class="flex items-center gap-2 text-primary">
              <span class="material-symbols-outlined filled">directions_walk</span>
              <h3 class="font-bold text-sm md:text-base text-white">Walking Route Guidance</h3>
            </div>
            <span class="text-[10px] font-label-mono px-2 py-0.5 bg-primary-container text-on-primary-container rounded-full font-bold">LIVE</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-center text-xs">
            <div class="p-2.5 bg-surface-container rounded-xl border border-white/5">
              <span class="text-on-surface-variant block text-[9px] uppercase font-label-mono">Walk Time</span>
              <strong class="text-primary text-base font-label-mono">~${walkMinutes} min</strong>
            </div>
            <div class="p-2.5 bg-surface-container rounded-xl border border-white/5">
              <span class="text-on-surface-variant block text-[9px] uppercase font-label-mono">Distance</span>
              <strong class="text-white text-base font-label-mono">${distanceMeters} m</strong>
            </div>
          </div>

          <div class="space-y-2 text-xs text-on-surface pt-1">
            <div class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-success-green/20 text-success-green flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">A</span>
              <div><strong>Start:</strong> ${escapeHtml(start.name)}</div>
            </div>
            <div class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">➔</span>
              <div>Follow the paved central promenade walkway past the central lawns & stepwell.</div>
            </div>
            <div class="flex items-start gap-2">
              <span class="w-4 h-4 rounded-full bg-sos-red/20 text-sos-red flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">B</span>
              <div><strong>Destination:</strong> ${escapeHtml(dest.name)}</div>
            </div>
          </div>

          <button onclick="window.clearWayfindingRoute()" class="w-full py-2 bg-surface-container hover:bg-surface-bright text-xs text-on-surface-variant font-bold rounded-xl border border-white/10 transition-all">
            Clear Route
          </button>
        </div>
      `;
    }
  }

  window.clearWayfindingRoute = function() {
    if (svgRouteLayer) svgRouteLayer.innerHTML = "";
    selectBuilding("uc");
  };

  if (findRouteBtn) {
    findRouteBtn.addEventListener("click", () => {
      const s = routeStartSelect ? routeStartSelect.value : "g10";
      const d = routeDestSelect ? routeDestSelect.value : "uc";
      drawWayfindingRoute(s, d);
    });
  }

  window.viewLocationOnMap = function(buildingId) {
    switchTab("map");
    selectBuilding(buildingId);
  };

  if (mapSvg) {
    mapSvg.addEventListener("click", (e) => {
      const bldg = e.target.closest(".map-building");
      if (bldg && bldg.dataset.id) {
        selectBuilding(bldg.dataset.id);
        return;
      }
      const gate = e.target.closest(".gate-marker");
      if (gate && gate.dataset.gate) {
        const gateNum = parseInt(gate.dataset.gate);
        const gObj = gates.find(g => g.num === gateNum);
        if (gObj && buildingDetailsContainer) {
          buildingDetailsContainer.innerHTML = `
            <div class="glass-panel p-4 md:p-5 rounded-2xl border border-white/10 shadow-xl space-y-3">
              <div class="flex items-center gap-2 text-primary">
                <span class="material-symbols-outlined">meeting_room</span>
                <h3 class="font-bold text-sm md:text-base text-white">${escapeHtml(gObj.name)}</h3>
              </div>
              <p class="text-xs text-on-surface">${escapeHtml(gObj.desc)}</p>
              <div class="text-[11px] text-on-surface-variant"><strong>Campus Zone:</strong> ${escapeHtml(gObj.campus)}</div>
              <button onclick="window.drawRouteFromGate('g${gObj.num}')" class="w-full py-2 bg-primary-container text-on-primary-container font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-md hover:brightness-110">
                <span class="material-symbols-outlined text-xs">directions_walk</span>
                Navigate to University Centre
              </button>
            </div>
          `;
        }
      }
    });
  }

  window.drawRouteFromGate = function(gateKey) {
    drawWayfindingRoute(gateKey, "uc");
  };

  if (mapSearchInput) {
    mapSearchInput.addEventListener("input", (e) => {
      const val = e.target.value.toLowerCase().trim();
      if (!val) return;
      const match = locations.find(l => l.name.toLowerCase().includes(val) || (l.floors && l.floors.some(fl => fl.facilities.some(fac => fac.toLowerCase().includes(val)))));
      if (match) selectBuilding(match.id);
    });
  }

  // -------------------------------------------------------------
  // ADVISORS DIRECTORY ENGINE
  // -------------------------------------------------------------
  const directorySearch = document.getElementById("directory-search");
  const schoolFilter = document.getElementById("school-filter");
  const directoryList = document.getElementById("directory-list");

  function renderDirectory() {
    if (!directoryList) return;
    const query = directorySearch ? directorySearch.value.toLowerCase().trim() : "";
    const filter = schoolFilter ? schoolFilter.value : "all";

    const filtered = advisors.filter(item => {
      const matchesSchool = filter === "all" || item.school.toLowerCase().includes(filter.toLowerCase());
      const matchesQuery = !query || 
        item.degree.toLowerCase().includes(query) || 
        item.advisor.toLowerCase().includes(query) || 
        item.chair.toLowerCase().includes(query) ||
        item.school.toLowerCase().includes(query);
      return matchesSchool && matchesQuery;
    });

    if (filtered.length === 0) {
      directoryList.innerHTML = `
        <div class="p-8 text-center text-xs text-on-surface-variant glass-panel rounded-xl">
          No advisors found matching "${escapeHtml(query)}". Try searching "CSE", "Chemical", "Management", or "Economics".
        </div>
      `;
      return;
    }

    directoryList.innerHTML = filtered.map(item => `
      <div class="glass-panel p-4 rounded-xl border border-white/10 shadow-lg space-y-2.5">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-xs md:text-sm text-white">${escapeHtml(item.degree)}</h4>
          <span class="text-[10px] font-label-mono px-2 py-0.5 bg-surface-container text-primary border border-primary/20 rounded-full">${escapeHtml(item.school.split('(')[1] ? item.school.split('(')[1].replace(')', '') : item.school)}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
          <div class="p-2.5 bg-surface-container rounded-lg border border-white/5">
            <span class="text-[10px] text-on-surface-variant block uppercase font-label-mono">Major Advisor</span>
            <strong class="text-white text-xs">${escapeHtml(item.advisor)}</strong>
          </div>
          <div class="p-2.5 bg-surface-container rounded-lg border border-white/5">
            <span class="text-[10px] text-on-surface-variant block uppercase font-label-mono">Programme Chair</span>
            <strong class="text-white text-xs">${escapeHtml(item.chair)}</strong>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <span class="text-[11px] text-on-surface-variant"><strong>Manager:</strong> ${escapeHtml(item.manager)}</span>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(item.chairEmail)}&su=Academic%20Advising%20Query%20-%20${encodeURIComponent(item.degree)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-primary-container text-on-primary-container rounded-lg font-bold text-[11px] flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow-sm">
            <span class="material-symbols-outlined text-xs">mail</span>
            Email Chair
          </a>
        </div>
      </div>
    `).join("");
  }

  if (directorySearch) directorySearch.addEventListener("input", renderDirectory);
  if (schoolFilter) schoolFilter.addEventListener("change", renderDirectory);

  // -------------------------------------------------------------
  // ATTENDANCE SIMULATOR ENGINE
  // -------------------------------------------------------------
  const creditSelect = document.getElementById("att-credits");
  const totalClassesInput = document.getElementById("att-total");
  const missedClassesInput = document.getElementById("att-missed");
  const attResultCard = document.getElementById("att-result");

  function calculateAttendance() {
    if (!creditSelect || !totalClassesInput || !missedClassesInput || !attResultCard) return;

    const credits = parseFloat(creditSelect.value);
    let total = parseInt(totalClassesInput.value);
    const missed = parseInt(missedClassesInput.value) || 0;

    const preset = attendanceRules.creditLimits.find(c => c.credits === credits) || { totalSessions: 30, maxAbsencesSafe: 6, npThreshold: 11 };

    if (isNaN(total) || total <= 0) {
      total = preset.totalSessions;
      totalClassesInput.value = total;
    }

    const attended = Math.max(0, total - missed);
    const percentage = ((attended / total) * 100).toFixed(1);
    const maxSafe = preset.maxAbsencesSafe;
    const remainingSafe = maxSafe - missed;

    let statusHtml = "";
    if (percentage >= 75) {
      statusHtml = `
        <div class="p-3.5 bg-emerald-950/40 border border-success-green/40 rounded-xl text-emerald-200">
          <div class="flex items-center justify-between font-bold text-xs sm:text-sm">
            <span class="text-success-green flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              Safe (No Penalty)
            </span>
            <span class="text-lg font-black text-success-green font-label-mono">${percentage}%</span>
          </div>
          <p class="text-[11px] mt-1 text-emerald-300/80">
            ${remainingSafe > 0 
              ? `You can still miss <strong>${remainingSafe}</strong> more class${remainingSafe > 1 ? 'es' : ''} without grade penalty.` 
              : `You have reached the maximum safe absences (${maxSafe}). Any more absence will trigger a grade drop!`}
          </p>
        </div>
      `;
    } else if (percentage >= 60) {
      statusHtml = `
        <div class="p-3.5 bg-amber-950/40 border border-warning-amber/40 rounded-xl text-amber-200">
          <div class="flex items-center justify-between font-bold text-xs sm:text-sm">
            <span class="text-warning-amber flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">warning</span>
              1 Grade Drop Applied
            </span>
            <span class="text-lg font-black text-warning-amber font-label-mono">${percentage}%</span>
          </div>
          <p class="text-[11px] mt-1 text-amber-300/80">
            Attendance is between 60% and 74%. Your final letter grade will be reduced by 1 notch (e.g. A ➔ A-, B ➔ B-, B- ➔ C+).
          </p>
        </div>
      `;
    } else {
      statusHtml = `
        <div class="p-3.5 bg-red-950/40 border border-sos-red/40 rounded-xl text-red-200">
          <div class="flex items-center justify-between font-bold text-xs sm:text-sm">
            <span class="text-sos-red flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">error</span>
              'NP' (Not Passed) Grade
            </span>
            <span class="text-lg font-black text-sos-red font-label-mono">${percentage}%</span>
          </div>
          <p class="text-[11px] mt-1 text-red-300/80">
            Attendance has fallen below 60%. As per AU regulations, you will receive an 'NP' grade and must repeat the course.
          </p>
        </div>
      `;
    }

    attResultCard.innerHTML = `
      <div class="space-y-2.5">
        ${statusHtml}
        <div class="grid grid-cols-3 gap-2 text-center text-xs">
          <div class="p-2.5 bg-surface-container rounded-xl border border-white/10">
            <span class="text-on-surface-variant block text-[9px] uppercase font-label-mono">Total</span>
            <strong class="text-white text-sm font-label-mono">${total}</strong>
          </div>
          <div class="p-2.5 bg-surface-container rounded-xl border border-white/10">
            <span class="text-on-surface-variant block text-[9px] uppercase font-label-mono">Attended</span>
            <strong class="text-success-green text-sm font-label-mono">${attended}</strong>
          </div>
          <div class="p-2.5 bg-surface-container rounded-xl border border-white/10">
            <span class="text-on-surface-variant block text-[9px] uppercase font-label-mono">Safe Limit</span>
            <strong class="text-white text-sm font-label-mono">≤ ${maxSafe}</strong>
          </div>
        </div>
      </div>
    `;
  }

  if (creditSelect) {
    creditSelect.addEventListener("change", () => {
      const credits = parseFloat(creditSelect.value);
      const preset = attendanceRules.creditLimits.find(c => c.credits === credits);
      if (preset && totalClassesInput) totalClassesInput.value = preset.totalSessions;
      calculateAttendance();
    });
  }
  if (totalClassesInput) totalClassesInput.addEventListener("input", calculateAttendance);
  if (missedClassesInput) missedClassesInput.addEventListener("input", calculateAttendance);

  // -------------------------------------------------------------
  // GPA CALCULATOR ENGINE (4.00 Scale)
  // -------------------------------------------------------------
  let gpaCourses = [
    { name: "Course 1", credits: 3, grade: "A" },
    { name: "Course 2", credits: 3, grade: "A-" },
    { name: "Course 3", credits: 4, grade: "B+" },
    { name: "Course 4", credits: 3, grade: "B" }
  ];

  const gpaCourseList = document.getElementById("gpa-course-list");
  const addCourseBtn = document.getElementById("add-course-btn");
  const gpaResultDisplay = document.getElementById("gpa-result");

  function renderGpaCourses() {
    if (!gpaCourseList) return;
    gpaCourseList.innerHTML = gpaCourses.map((c, i) => `
      <div class="flex items-center gap-2 p-1.5 bg-surface-container rounded-xl border border-white/5">
        <input type="text" value="${escapeHtml(c.name)}" onchange="window.updateGpaCourse(${i}, 'name', this.value)" class="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-surface-dim text-white outline-none">
        <select onchange="window.updateGpaCourse(${i}, 'credits', parseFloat(this.value))" class="text-xs px-2 py-1.5 rounded-lg border border-white/10 bg-surface-dim text-white outline-none">
          <option value="1" ${c.credits === 1 ? 'selected' : ''}>1 Cr</option>
          <option value="1.5" ${c.credits === 1.5 ? 'selected' : ''}>1.5 Cr</option>
          <option value="2" ${c.credits === 2 ? 'selected' : ''}>2 Cr</option>
          <option value="3" ${c.credits === 3 ? 'selected' : ''}>3 Cr</option>
          <option value="4" ${c.credits === 4 ? 'selected' : ''}>4 Cr</option>
        </select>
        <select onchange="window.updateGpaCourse(${i}, 'grade', this.value)" class="text-xs px-2 py-1.5 rounded-lg border border-white/10 bg-surface-dim text-white outline-none">
          ${gradingScale.filter(g => g.points !== null).map(g => `
            <option value="${escapeHtml(g.grade)}" ${c.grade === g.grade ? 'selected' : ''}>${escapeHtml(g.grade)} (${g.points.toFixed(1)})</option>
          `).join("")}
        </select>
        <button onclick="window.removeGpaCourse(${i})" class="p-1.5 text-on-surface-variant hover:text-sos-red rounded-lg hover:bg-white/10 transition-colors">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    `).join("");

    calculateGpa();
  }

  window.updateGpaCourse = function(index, field, value) {
    gpaCourses[index][field] = value;
    calculateGpa();
  };

  window.removeGpaCourse = function(index) {
    gpaCourses.splice(index, 1);
    renderGpaCourses();
  };

  if (addCourseBtn) {
    addCourseBtn.addEventListener("click", () => {
      gpaCourses.push({ name: `Course ${gpaCourses.length + 1}`, credits: 3, grade: "A" });
      renderGpaCourses();
    });
  }

  function calculateGpa() {
    if (!gpaResultDisplay) return;
    let totalQualityPoints = 0;
    let totalCredits = 0;

    gpaCourses.forEach(c => {
      const gObj = gradingScale.find(g => g.grade === c.grade);
      if (gObj && gObj.points !== null) {
        totalQualityPoints += (gObj.points * c.credits);
        totalCredits += c.credits;
      }
    });

    const gpa = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : "0.00";

    gpaResultDisplay.innerHTML = `
      <div class="p-3.5 bg-surface-container rounded-xl border border-white/10 flex items-center justify-between">
        <div>
          <span class="text-[10px] text-on-surface-variant uppercase font-label-mono block">Estimated Semester GPA</span>
          <span class="text-xs text-on-surface">${totalCredits} Total Credits</span>
        </div>
        <div class="text-2xl font-black text-success-green font-label-mono">
          ${gpa} <span class="text-xs font-normal text-on-surface-variant">/ 4.00</span>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // ACADEMIC CALENDAR ENGINE
  // -------------------------------------------------------------
  const semFilter = document.getElementById("sem-filter");
  const calendarEventsList = document.getElementById("calendar-events-list");

  function renderCalendar() {
    if (!calendarEventsList) return;
    const selectedSem = semFilter ? semFilter.value : "monsoon2026";
    const semData = calendars[selectedSem] || { events: [] };
    const events = semData.events || [];

    if (events.length === 0) {
      calendarEventsList.innerHTML = `<div class="text-xs text-on-surface-variant p-4">No events found for this semester.</div>`;
      return;
    }

    calendarEventsList.innerHTML = `
      <div class="space-y-2 max-h-56 overflow-y-auto pane-scroll pr-1">
        ${events.map(ev => `
          <div class="p-2.5 bg-surface-container rounded-xl border border-white/5 flex items-center justify-between text-xs">
            <div>
              <strong class="text-white block">${escapeHtml(ev.title)}</strong>
              <span class="text-[11px] text-primary font-label-mono">${escapeHtml(ev.date)}</span>
            </div>
            <span class="text-[10px] font-label-mono px-2 py-0.5 bg-surface-dim text-on-surface-variant rounded-full border border-white/5 uppercase">${escapeHtml(ev.type)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  if (semFilter) semFilter.addEventListener("change", renderCalendar);

  // -------------------------------------------------------------
  // HANDBOOK FAQS VIEWER
  // -------------------------------------------------------------
  const handbookFaqList = document.getElementById("handbook-faq-list");

  function renderHandbookFaqs() {
    if (!handbookFaqList) return;
    handbookFaqList.innerHTML = faqs.map((faq, i) => `
      <details class="group bg-surface-container rounded-xl border border-white/5 overflow-hidden transition-all">
        <summary class="p-3.5 cursor-pointer flex items-center justify-between text-xs font-bold text-white hover:text-primary transition-colors select-none">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-label-mono px-2 py-0.5 bg-surface-dim text-primary rounded-md border border-primary/20">${escapeHtml(faq.category)}</span>
            <span>${escapeHtml(faq.q)}</span>
          </div>
          <span class="material-symbols-outlined text-sm group-open:rotate-180 transition-transform">expand_more</span>
        </summary>
        <div class="p-3.5 pt-0 text-xs text-on-surface-variant border-t border-white/5 leading-relaxed space-y-2">
          <p class="whitespace-pre-line">${escapeHtml(faq.a)}</p>
          <div class="text-[10px] font-label-mono text-primary flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">menu_book</span>
            <span>Student Handbook Page ${faq.page}</span>
          </div>
        </div>
      </details>
    `).join("");
  }

  // Initial Boot
  renderChat();
  selectBuilding("uc");
  renderDirectory();
  calculateAttendance();
  renderGpaCourses();
  renderCalendar();
  renderHandbookFaqs();
});
