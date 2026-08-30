// AUGI - Ahmedabad University AI Assistant Engine (Stitch Design System)

document.addEventListener("DOMContentLoaded", () => {
  const data = window.AUGI_DATA;
  let currentTab = "chat";
  let chatMessages = [
    {
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
    }
  ];

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

  // Voice State
  let isListening = false;
  let recognition = null;

  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      handleSendMessage();
    };

    recognition.onerror = () => stopVoice();
    recognition.onend = () => stopVoice();
  }

  function toggleVoice() {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }
    if (isListening) {
      recognition.stop();
      stopVoice();
    } else {
      try {
        recognition.start();
        isListening = true;
        voiceBtn.classList.add("text-primary", "animate-pulse");
      } catch (e) {
        stopVoice();
      }
    }
  }

  function stopVoice() {
    isListening = false;
    if (voiceBtn) {
      voiceBtn.classList.remove("text-primary", "animate-pulse");
    }
  }

  if (voiceBtn) voiceBtn.addEventListener("click", toggleVoice);

  // Tab Navigation with Stitch Active Highlighting
  function switchTab(tabId) {
    currentTab = tabId;
    tabContents.forEach(el => {
      if (el.id === `tab-${tabId}`) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });

    tabButtons.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add("active-tab", "text-primary", "font-bold");
        btn.classList.remove("text-on-surface-variant");
        const icon = btn.querySelector(".material-symbols-outlined");
        if (icon) icon.classList.add("filled");
      } else {
        btn.classList.remove("active-tab", "text-primary", "font-bold");
        btn.classList.add("text-on-surface-variant");
        const icon = btn.querySelector(".material-symbols-outlined");
        if (icon) icon.classList.remove("filled");
      }
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Emergency SOS Modal
  openSosBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      sosModal.classList.remove("hidden");
    });
  });

  if (closeSosBtn) {
    closeSosBtn.addEventListener("click", () => sosModal.classList.add("hidden"));
  }

  if (sosModal) {
    sosModal.addEventListener("click", (e) => {
      if (e.target === sosModal) sosModal.classList.add("hidden");
    });
  }

  // Render Chat Messages
  function renderChat() {
    if (!chatContainer) return;
    chatContainer.innerHTML = chatMessages.map((msg, index) => {
      const isUser = msg.sender === "user";
      const formattedText = formatMarkdown(msg.text);

      let cardHtml = "";
      if (msg.locationCard) {
        cardHtml = `
          <div class="mt-3 p-3.5 bg-surface-container-high border border-white/10 rounded-2xl text-xs space-y-2 shadow-md">
            <div class="flex items-center justify-between font-bold text-white">
              <span class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                ${msg.locationCard.name}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 bg-surface-container text-primary border border-primary/20 rounded-full">${msg.locationCard.campus}</span>
            </div>
            <p class="text-on-surface-variant">${msg.locationCard.description}</p>
            <div class="text-[11px] text-on-surface"><strong>Nearest Gate:</strong> ${msg.locationCard.nearestGate}</div>
            <button onclick="window.viewLocationOnMap('${msg.locationCard.id}')" class="w-full py-2 bg-primary-container hover:brightness-110 text-on-primary-container font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98">
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
              <button onclick="window.quickSend('${chip.replace(/'/g, "\\'")}')" class="chip-btn text-xs px-3.5 py-1.5 rounded-full font-medium shadow-xs">
                ${chip}
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
              <div class="text-[10px] mt-1.5 ${isUser ? 'text-red-100 text-right' : 'text-on-surface-variant'} font-label-mono">
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

  // High-Precision NLP Routing
  function queryAugiKnowledge(query) {
    const q = query.toLowerCase().trim();

    // 1. CAFETERIAS, FOOD, DINING, CANTEEN
    if (q.includes("cafeteria") || q.includes("canteen") || q.includes("food") || q.includes("dining") || q.includes("restaurant") || q.includes("eat") || q.includes("hungry") || q.includes("snack") || q.includes("bistro") || q.includes("cafe") || q.includes("café") || q.includes("lunch") || q.includes("dinner") || q.includes("breakfast") || q.includes("noboru") || q.includes("delice") || q.includes("greens and grains") || q.includes("truly indian")) {
      const cafeList = data.cafeterias.map(c => `• **${c.name}** (${c.location})\n  *Type:* ${c.type} | *Hours:* ${c.timings}`).join("\n\n");
      return {
        text: `**🍽️ Cafeterias & Dining Options on Campus:**\n\nAhmedabad University offers several casual and fine dining options across the campus and its immediate vicinity:\n\n${cafeList}\n\n*(Source: AU Student Handbook, Page 49)*`,
        chips: ["Where is University Centre?", "Where is VentureStudio?", "Central Library hours"]
      };
    }

    // 2. HOSTELS & STUDENT RESIDENCES
    if (q.includes("hostel") || q.includes("residence") || q.includes("accommodation") || q.includes("stay") || q.includes("student village") || q.includes("dorm")) {
      const hostelList = data.hostels.map(h => `• **${h.name}** (${h.gender})\n  *Location:* ${h.location}\n  *Distance:* ${h.distanceFromCampus}\n  *Amenities:* ${h.amenities.join(", ")}`).join("\n\n");
      return {
        text: `**🏢 Student Residences & Hostels:**\n\n${hostelList}\n\n*All residences provide 24/7 security, WiFi, air-conditioned rooms, dining, housekeeping, and scheduled campus shuttle services.*`,
        chips: ["Emergency Contacts", "Where is University Centre?"]
      };
    }

    // 3. ATTENDANCE & GRADE DROP RULES
    if (q.includes("attendance") || q.includes("grade drop") || q.includes("absent") || q.includes("miss") || q.includes("leave") || q.includes("np grade") || q.includes("safe limit")) {
      return {
        text: `**📉 AU Attendance Policy & Grade Penalties:**\n\n• **Minimum Attendance Required:** **75%** in each registered course.\n• **60% to 74.9% Attendance:** **1 Grade Drop Penalty** is automatically applied to your final earned letter grade (e.g., \`A\` ➔ \`A-\`, \`B\` ➔ \`B-\`, \`B-\` ➔ \`C+\`).\n• **Below 60% Attendance:** You are awarded an **'NP' (Not Passed)** grade with zero grade points, and you must repeat the course.\n\n**Safe Absence Thresholds:**\n• **4.0 Credit Course (45 sessions):** Max **11 safe absences** (at 12 = 1 grade drop; at 19 = NP).\n• **3.0 Credit Course (30 sessions):** Max **7 safe absences** (at 8 = 1 grade drop; at 13 = NP).\n• **2.0 Credit Course (20 sessions):** Max **5 safe absences** (at 6 = 1 grade drop; at 9 = NP).\n• **1.5 Credit Course (15 sessions):** Max **3 safe absences** (at 4 = 1 grade drop; at 7 = NP).\n• **1.0 Credit Course (10 sessions):** Max **2 safe absences** (at 3 = 1 grade drop; at 5 = NP).\n\n*(Source: AU Student Handbook, Page 29-30)*`,
        chips: ["Open Attendance Calculator", "Estimate GPA on 4.0 scale"]
      };
    }

    // 4. GRADING SCALE & GPA SYSTEM
    if (q.includes("gpa") || q.includes("cgpa") || q.includes("grading") || q.includes("4.0") || q.includes("grade point") || q.includes("scale") || q.includes("honours") || q.includes("dean's list") || q.includes("deans list")) {
      return {
        text: `**🎓 Ahmedabad University 4.00 Grading System:**\n\n• **A+ / A:** \`4.0\` (Outstanding / Excellent)\n• **A-:** \`3.7\` (Very Good)\n• **B+:** \`3.3\` (Good)\n• **B:** \`3.0\` (Above Average)\n• **B-:** \`2.7\` (Average)\n• **C+:** \`2.3\` (Below Average)\n• **C:** \`2.0\` (Marginal Passing)\n• **C-:** \`1.7\` | **D+:** \`1.3\` | **D:** \`1.0\` | **F / NP:** \`0.0\`\n\n**Dean's List / Honours Criteria:**\n• Minimum SGPA/CGPA of **3.50+** with no disciplinary record.\n\n*(Source: AU Student Handbook, Page 31-33)*`,
        chips: ["Calculate GPA", "Attendance grade drop rules"]
      };
    }

    // 5. ACADEMIC CALENDAR & DATES
    if (q.includes("calendar") || q.includes("holiday") || q.includes("exam") || q.includes("midsem") || q.includes("endsem") || q.includes("diwali") || q.includes("break") || q.includes("monsoon") || q.includes("winter") || q.includes("semester") || q.includes("2026") || q.includes("2027")) {
      return {
        text: `**📅 Academic Calendar Highlights (2026–2027):**\n\n**Monsoon Semester 2026:**\n• **Classes Begin:** July 27, 2026\n• **Mid-Semester Exams:** September 21–26, 2026\n• **Navratri / Dussehra Break:** October 19–24, 2026\n• **Diwali Vacation:** November 9–14, 2026\n• **End-Semester Exams:** November 30 – December 12, 2026\n\n**Winter Semester 2027:**\n• **Classes Begin:** January 4, 2027\n• **Mid-Semester Exams:** February 22–27, 2027\n• **End-Semester Exams:** April 26 – May 8, 2027\n\n*(Source: AU Student Handbook, Page 7-9)*`,
        chips: ["Open Calendar Tool", "Attendance rules"]
      };
    }

    // 6. ADVISORS & DIRECTORY
    if (q.includes("advisor") || q.includes("chair") || q.includes("faculty") || q.includes("cse") || q.includes("mechanical") || q.includes("chemical") || q.includes("economics") || q.includes("management") || q.includes("bba") || q.includes("btech") || q.includes("physics") || q.includes("dean")) {
      const match = data.majorAdvisors.find(a => q.includes(a.programme.toLowerCase()) || q.includes(a.school.toLowerCase()) || q.includes("advisor"));
      if (match) {
        return {
          text: `**👥 Major Advisor Information:**\n\n• **Programme:** ${match.programme}\n• **School:** ${match.school}\n• **Major Advisor:** **${match.advisor}**\n• **Programme Chair:** ${match.chair} (\`${match.chairEmail}\`)\n• **Programme Manager:** ${match.manager} (\`${match.managerEmail}\`)`,
          chips: ["Open Full Directory", "Where is SEAS GICT?", "Where is AMSOM?"]
        };
      }
      return {
        text: `**👥 Faculty & Major Advisors:**\n\nEvery undergraduate programme has dedicated Major Faculty Advisors, Programme Chairs, and Managers. You can find all advisor details and email them directly from the **Directory** tab!`,
        chips: ["Open Full Directory", "Who is the CSE Advisor?"]
      };
    }

    // 7. SPECIFIC BUILDINGS
    for (const b of data.locations) {
      if (q.includes(b.id) || q.includes(b.name.toLowerCase())) {
        return {
          text: `**📍 ${b.name} (${b.campus}):**\n\n${b.description}\n\n• **Nearest Gate:** ${b.nearestGate}\n• **Key Facilities:**\n${b.facilities.map(f => `  - ${f}`).join("\n")}`,
          locationCard: b,
          chips: ["View on Campus Map", "Where are the cafeterias?"]
        };
      }
    }

    // 8. EMERGENCY & SOS
    if (q.includes("emergency") || q.includes("sos") || q.includes("security") || q.includes("doctor") || q.includes("health") || q.includes("ambulance") || q.includes("ragging") || q.includes("posh") || q.includes("harassment") || q.includes("help")) {
      return {
        text: `**🚨 Emergency & Safety Contacts (24/7):**\n\n• **Campus Security Supervisor:** \`+91.9998800237\` (24h)\n• **University Doctor (Dr. Gayatri Raval):** \`+91.07961911026\` (Health Centre, 1st Fl UC)\n• **Anti-Ragging Helpline (Toll-Free):** \`1800.180.5522\`\n• **POSH Committee (Sexual Harassment Complaints):** \`posh@ahduni.edu.in\`\n• **Emergency Ambulance:** \`108\`\n\n*Tap the red SOS button at the top right to dial immediately.*`,
        chips: ["Where is University Centre?", "Central Library hours"]
      };
    }

    // DEFAULT FALLBACK
    return {
      text: `I searched the **Ahmedabad University 2026–2027 Student Handbook** for "${query}". Here are quick topics you can explore:`,
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
    const query = text || (chatInput ? chatInput.value.trim() : "");
    if (!query) return;

    if (chatInput) chatInput.value = "";

    // Add User Message
    chatMessages.push({
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    renderChat();

    // Generate AUGI Response
    setTimeout(() => {
      const response = queryAugiKnowledge(query);
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
  // CAMPUS MAP ENGINE
  // -------------------------------------------------------------
  const mapSvg = document.getElementById("campus-map-svg");
  const mapSearchInput = document.getElementById("map-search");
  const buildingDetailsContainer = document.getElementById("building-details");

  function selectBuilding(buildingId) {
    const b = data.locations.find(l => l.id === buildingId) || data.locations[2]; // Default UC
    
    // Highlight SVG building
    document.querySelectorAll(".map-building").forEach(el => {
      if (el.dataset.id === buildingId) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    });

    if (buildingDetailsContainer) {
      buildingDetailsContainer.innerHTML = `
        <div class="glass-panel p-4 md:p-5 rounded-2xl border border-white/10 shadow-xl space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-primary-container animate-pulse"></span>
              <h3 class="font-bold text-sm md:text-base text-white">${b.name}</h3>
            </div>
            <button onclick="window.quickSend('Tell me all about ${b.name}')" class="px-2.5 py-1 bg-primary-container/20 text-primary hover:bg-primary-container hover:text-on-primary-container font-bold text-xs rounded-xl flex items-center gap-1 transition-all border border-primary/20">
              <span class="material-symbols-outlined text-xs">chat_bubble</span>
              Ask
            </button>
          </div>

          <div class="text-[11px] text-on-surface-variant">
            ${b.campus} • <strong>Nearest:</strong> ${b.nearestGate}
          </div>

          <p class="text-xs text-on-surface leading-relaxed">${b.description}</p>

          <div class="space-y-1.5 pt-2 border-t border-white/10">
            <h4 class="text-[10px] font-label-mono text-on-surface-variant uppercase tracking-wider">Floor Directory & Facilities</h4>
            <div class="space-y-1">
              ${b.facilities.map(f => `
                <div class="text-xs p-2 bg-surface-container rounded-lg border border-white/5 flex items-center gap-2 text-on-surface">
                  <span class="text-primary">•</span>
                  <span>${f}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    }
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
      }
    });
  }

  if (mapSearchInput) {
    mapSearchInput.addEventListener("input", (e) => {
      const val = e.target.value.toLowerCase().trim();
      if (!val) return;
      const match = data.locations.find(l => l.name.toLowerCase().includes(val) || l.facilities.some(f => f.toLowerCase().includes(val)));
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

    const filtered = data.majorAdvisors.filter(item => {
      const matchesSchool = filter === "all" || item.school.includes(filter);
      const matchesQuery = !query || item.programme.toLowerCase().includes(query) || item.advisor.toLowerCase().includes(query) || item.chair.toLowerCase().includes(query);
      return matchesSchool && matchesQuery;
    });

    if (filtered.length === 0) {
      directoryList.innerHTML = `<div class="p-6 text-center text-xs text-on-surface-variant">No advisors found matching your query.</div>`;
      return;
    }

    directoryList.innerHTML = filtered.map(item => `
      <div class="glass-panel p-4 rounded-xl border border-white/10 shadow-lg space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="font-bold text-xs md:text-sm text-white">${item.programme}</h4>
          <span class="text-[10px] font-label-mono px-2 py-0.5 bg-surface-container text-primary border border-primary/20 rounded-full">${item.school}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
          <div class="p-2 bg-surface-container rounded-lg border border-white/5">
            <span class="text-[10px] text-on-surface-variant block uppercase font-label-mono">Major Advisor</span>
            <strong class="text-white">${item.advisor}</strong>
          </div>
          <div class="p-2 bg-surface-container rounded-lg border border-white/5">
            <span class="text-[10px] text-on-surface-variant block uppercase font-label-mono">Programme Chair</span>
            <strong class="text-white">${item.chair}</strong>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <span class="text-[11px] text-on-surface-variant"><strong>Manager:</strong> ${item.manager}</span>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${item.chairEmail}&su=Academic%20Advising%20Query%20-%20${encodeURIComponent(item.programme)}" target="_blank" class="px-3 py-1 bg-primary-container text-on-primary-container rounded-lg font-bold text-[11px] flex items-center gap-1 hover:brightness-110 transition-all">
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

    if (isNaN(total) || total <= 0) {
      const preset = data.attendanceRules.creditLimits.find(c => c.credits === credits);
      if (preset) total = preset.totalSessions;
      totalClassesInput.value = total;
    }

    const attended = Math.max(0, total - missed);
    const percentage = ((attended / total) * 100).toFixed(1);

    const preset = data.attendanceRules.creditLimits.find(c => c.credits === credits) || { maxAbsencesSafe: Math.floor(total * 0.25), npThreshold: Math.ceil(total * 0.40) };
    const maxSafe = preset.maxAbsencesSafe;
    const remainingSafe = maxSafe - missed;

    let statusHtml = "";
    if (percentage >= 75) {
      statusHtml = `
        <div class="p-3.5 bg-emerald-950/40 border border-success-green/40 rounded-xl text-emerald-200">
          <div class="flex items-center justify-between font-bold text-xs sm:text-sm">
            <span class="text-success-green">✅ Status: Safe (No Penalty)</span>
            <span class="text-lg font-black text-success-green">${percentage}%</span>
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
            <span class="text-warning-amber">⚠️ Status: 1 Grade Drop Applied</span>
            <span class="text-lg font-black text-warning-amber">${percentage}%</span>
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
            <span class="text-sos-red">⛔ Status: 'NP' (Not Passed) Grade</span>
            <span class="text-lg font-black text-sos-red">${percentage}%</span>
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
          <div class="p-2 bg-surface-container rounded-xl border border-white/10">
            <span class="text-on-surface-variant block text-[9px] uppercase font-label-mono">Total</span>
            <strong class="text-white text-sm font-label-mono">${total}</strong>
          </div>
          <div class="p-2 bg-surface-container rounded-xl border border-white/10">
            <span class="text-on-surface-variant block text-[9px] uppercase font-label-mono">Attended</span>
            <strong class="text-success-green text-sm font-label-mono">${attended}</strong>
          </div>
          <div class="p-2 bg-surface-container rounded-xl border border-white/10">
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
      const preset = data.attendanceRules.creditLimits.find(c => c.credits === credits);
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
        <input type="text" value="${c.name}" onchange="window.updateGpaCourse(${i}, 'name', this.value)" class="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-surface-dim text-white outline-none">
        <select onchange="window.updateGpaCourse(${i}, 'credits', parseFloat(this.value))" class="text-xs px-2 py-1.5 rounded-lg border border-white/10 bg-surface-dim text-white outline-none">
          <option value="1" ${c.credits === 1 ? 'selected' : ''}>1 Cr</option>
          <option value="1.5" ${c.credits === 1.5 ? 'selected' : ''}>1.5 Cr</option>
          <option value="2" ${c.credits === 2 ? 'selected' : ''}>2 Cr</option>
          <option value="3" ${c.credits === 3 ? 'selected' : ''}>3 Cr</option>
          <option value="4" ${c.credits === 4 ? 'selected' : ''}>4 Cr</option>
        </select>
        <select onchange="window.updateGpaCourse(${i}, 'grade', this.value)" class="text-xs px-2 py-1.5 rounded-lg border border-white/10 bg-surface-dim text-white outline-none">
          ${data.gradingScale.filter(g => g.points !== null).map(g => `
            <option value="${g.grade}" ${c.grade === g.grade ? 'selected' : ''}>${g.grade} (${g.points.toFixed(1)})</option>
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
      const gObj = data.gradingScale.find(g => g.grade === c.grade);
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
    const events = data.academicCalendar[selectedSem] || [];

    calendarEventsList.innerHTML = `
      <div class="space-y-2 max-h-56 overflow-y-auto pane-scroll pr-1">
        ${events.map(ev => `
          <div class="p-2.5 bg-surface-container rounded-xl border border-white/5 flex items-center justify-between text-xs">
            <div>
              <strong class="text-white block">${ev.event}</strong>
              <span class="text-[11px] text-primary font-label-mono">${ev.dates}</span>
            </div>
            <span class="text-[10px] font-label-mono px-2 py-0.5 bg-surface-dim text-on-surface-variant rounded-full border border-white/5">${ev.type}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  if (semFilter) semFilter.addEventListener("change", renderCalendar);

  // Initial Initialization
  renderChat();
  selectBuilding("uc");
  renderDirectory();
  calculateAttendance();
  renderGpaCourses();
  renderCalendar();
});
