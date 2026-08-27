// AUGI - Ahmedabad University AI Assistant Main Engine (Instant No-Scroll View & Red/White Theme)

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
        voiceBtn.classList.add("text-[#8C1D24]", "animate-pulse");
      } catch (e) {
        stopVoice();
      }
    }
  }

  function stopVoice() {
    isListening = false;
    if (voiceBtn) {
      voiceBtn.classList.remove("text-[#8C1D24]", "animate-pulse");
    }
  }

  if (voiceBtn) voiceBtn.addEventListener("click", toggleVoice);

  // Tab Navigation with Instant Viewport Reset (No Scroll Lag)
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
        btn.classList.add("active-tab", "text-[#8C1D24]", "font-bold");
        btn.classList.remove("text-slate-400", "text-slate-500", "text-slate-600");
      } else {
        btn.classList.remove("active-tab", "text-[#8C1D24]", "font-bold");
        btn.classList.add("text-slate-500");
      }
    });

    // Instant reset scroll to absolute top
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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
          <div class="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 shadow-xs">
            <div class="flex items-center justify-between font-bold text-slate-900">
              <span class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#8C1D24]"></span>
                ${msg.locationCard.name}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">${msg.locationCard.campus}</span>
            </div>
            <p class="text-slate-600">${msg.locationCard.description}</p>
            <div class="text-[11px] text-slate-500"><strong>Nearest Gate:</strong> ${msg.locationCard.nearestGate}</div>
            <button onclick="window.viewLocationOnMap('${msg.locationCard.id}')" class="w-full py-2 bg-gradient-to-r from-[#8C1D24] to-[#A82A33] hover:from-[#6E1218] hover:to-[#8C1D24] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
              View on Campus Map
            </button>
          </div>
        `;
      }

      let chipsHtml = "";
      if (msg.chips && msg.chips.length > 0 && index === chatMessages.length - 1) {
        chipsHtml = `
          <div class="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-100">
            ${msg.chips.map(chip => `
              <button onclick="window.quickSend('${chip.replace(/'/g, "\\'")}')" class="chip-btn text-xs px-3 py-1.5 rounded-full font-medium shadow-xs">
                ${chip}
              </button>
            `).join("")}
          </div>
        `;
      }

      return `
        <div class="flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-2.5 msg-anim">
          <div class="flex items-start gap-2.5 max-w-[92%] md:max-w-[82%]">
            ${!isUser ? `
              <div class="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#8C1D24] to-[#A82A33] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs border border-red-200">
                AU
              </div>
            ` : ''}
            <div class="${isUser ? 'chat-bubble-user px-4 py-2.5' : 'chat-bubble-augi px-4 py-3'}">
              <div class="text-xs sm:text-sm leading-relaxed ${isUser ? 'text-white' : 'text-slate-800'}">
                ${formattedText}
              </div>
              ${cardHtml}
              ${chipsHtml}
              <div class="text-[10px] mt-1.5 ${isUser ? 'text-red-100 text-right' : 'text-slate-400'}">
                ${msg.time}
              </div>
            </div>
            ${isUser ? `
              <div class="w-8 h-8 rounded-2xl bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
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
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-red-50 text-[#8C1D24] border border-red-200 rounded text-xs font-mono">$1</code>')
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
      const hostelsText = data.hostels.map(h => `• **${h.name}**\n  📍 *Location:* ${h.location}\n  ✨ *Amenities:* ${h.amenities.join(", ")}\n  📋 *Rules:* ${h.rules.join(", ")}\n  ✉️ *Contact:* ${h.email}`).join("\n\n");
      return {
        text: `**🏠 Ahmedabad University Residences:**\n\n${hostelsText}\n\n*(Source: AU Student Handbook, Page 42)*`,
        chips: ["How to reach campus?", "Emergency Contacts", "Cafeterias on Campus"]
      };
    }

    // 3. ATTENDANCE & LEAVES
    if (q.includes("attendance") || q.includes("miss") || q.includes("absent") || q.includes("absence") || q.includes("grade drop") || q.includes("authorised absence") || q.includes("authorized absence") || q.includes("leave")) {
      if (q.includes("apply") || q.includes("form") || q.includes("authorised") || q.includes("authorized") || q.includes("process") || q.includes("procedure")) {
        return {
          text: "**How to apply for Authorised Absence (AA):**\n\n1. Log in to **AURIS** (`auris.ahduni.edu.in`) under *Quick Links ➔ Authorised Absence*.\n2. Attach supporting proof (e.g. conference acceptance, sports event invite) and a letter from your professor/Sports Director.\n3. The Programme Office reviews and forwards to the Programme Chair & School Dean.\n4. Once approved, the missed session is marked **AA** (treated as present, no grade penalty) and an automated email notifies your instructors.\n\n*(Source: AU Student Handbook, Page 36)*",
          chips: ["Attendance calculation for 3-credit", "Attendance calculation for 4-credit", "What if I get NP?"]
        };
      }
      return {
        text: "**Ahmedabad University Attendance Policy:**\n\n- **Minimum Required:** **75%** of all conducted sessions.\n- **75% or above:** No penalty.\n- **60% to 74% (1st drop zone):** **1 Grade Drop** is applied (e.g. an **A** becomes **A-**, a **B** becomes **B-**, a **B-** becomes **C+**).\n- **Below 60%:** Automatic **'NP' (Not Passed)** grade — you must repeat the entire course.\n\n*Note for Foundation Programme:* 100% attendance expected in Studios and Seminars. Below 75% in any weekly unit/module results in an NP grade.\n\n*(Source: AU Student Handbook, Pages 34–35)*",
        chips: ["Open Attendance Calculator", "How to apply for AA?", "Grading scale"]
      };
    }

    // 4. GPA & GRADING SYSTEM
    if (q.includes("gpa") || q.includes("cgpa") || q.includes("sgpa") || q.includes("grading") || q.includes("grade") || q.includes("marks") || q.includes("scale") || q.includes("incomplete") || q.includes("fail") || q.includes("np grade")) {
      return {
        text: "**Ahmedabad University 4.00 Grading System:**\n\n- **A (4.0)**: Excellent\n- **A- (3.7)** / **B+ (3.3)**: Very Good\n- **B (3.0)** / **B- (2.7)**: Good\n- **C+ (2.3)** / **C (2.0)**: Fair\n- **D (1.7)**: Sufficient (Minimum passing grade for a single course)\n- **NP (0.0)**: Not Passed (Course must be repeated)\n- **P**: Passed (No-grade courses)\n- **I**: Incomplete (Coursework pending; turns to NP if not resolved in time)\n- **W**: Withdrawn from Course\n- **S / U**: Satisfactory / Unsatisfactory (Audited course)\n\n**Academic Standard:** Minimum CGPA of **2.00 / 4.00** required to graduate in Undergraduate/Masters programmes (2.70 for PhD).\n\n*(Source: AU Student Handbook, Pages 31–33)*",
        chips: ["Open GPA Calculator", "What does NP mean?", "Add Week & Drop Month"]
      };
    }

    // 5. LIBRARY & LEARNING RESOURCES
    if (q.includes("library") || q.includes("books") || q.includes("reading room") || q.includes("koha") || q.includes("turnitin") || q.includes("moodle") || q.includes("borrow")) {
      return {
        text: "**University Library System:**\n\n- **Central Library (GICT Building):**\n  • **Open 24 Hours**, Monday to Saturday.\n  • **Sunday:** 9:00 AM to 6:00 PM.\n  • **Examination Period:** **Open 24/7 continuous.**\n- **Book Borrowing & Returns:** Mon–Sat 9:00 AM – 9:00 PM, Sun 9:00 AM – 5:00 PM.\n- **Borrowing Limits:**\n  • UG/PG Students: **2 books for 14 days**.\n  • Doctoral Students: **10 books for 1 month**.\n- **Reading Rooms:** Two reading rooms (SAS & East Campus) open 9:00 AM – 6:00 PM on weekdays for reference.\n- **Digital Subscriptions:** KOHA catalogue (`uls.ahduni.edu.in`), 3 lakh+ books/e-books, 10,000+ journals, Turnitin plagiarism check, MATLAB, AutoCAD, SolidWorks.\n\n*(Source: AU Student Handbook, Pages 46–47)*",
        chips: ["Where is GICT Building?", "Bookstore Hours", "Cafeterias on Campus"]
      };
    }

    // 6. SPORTS & GYMNASIUM
    if (q.includes("sports") || q.includes("gym") || q.includes("badminton") || q.includes("cricket") || q.includes("football") || q.includes("tennis") || q.includes("squash") || q.includes("pickleball") || q.includes("track") || q.includes("fitness")) {
      return {
        text: "**🏸 Sports & Fitness Facilities:**\n\n- **University Centre (Indoor):** 200m track, Badminton courts, Basketball, Chess, Carrom, Futsal, Squash, 10m Shooting Range, Table Tennis, Modern fully equipped Gymnasium with fitness instructors.\n- **University Sports Complex (Outdoor):** 400m track, Basketball, Cricket pitch, Football ground, Frisbee, Kabaddi, Kho-Kho, Tennis courts, Volleyball, Pickleball.\n\n*(Source: AU Student Handbook, Page 45)*",
        chips: ["Where is Sports Complex?", "Where is University Centre?", "Health Centre Hours"]
      };
    }

    // 7. SPECIFIC CAMPUS BUILDINGS
    for (let loc of data.campusLocations) {
      if (q.includes(loc.id) || q.includes(loc.name.toLowerCase()) || 
         (loc.id === "uc" && (q.includes("university centre") || q.includes("cdc") || q.includes("ods") || q.includes("health centre") || q.includes("bookstore") || q.includes("reprographics"))) || 
         (loc.id === "gict" && (q.includes("gict") || q.includes("seas") || q.includes("engineering building"))) || 
         (loc.id === "sas" && (q.includes("arts and science") || q.includes("sas building"))) || 
         (loc.id === "amsom" && (q.includes("management building") || q.includes("amsom"))) ||
         (loc.id === "arboretum" && (q.includes("arboretum") || q.includes("garden") || q.includes("trees") || q.includes("stepwell")))) {
        const floorList = loc.floors.map(f => `• **${f.floor}:** ${f.facilities.join(", ")}`).join("\n");
        return {
          text: `**${loc.name}**\n\n📍 **Campus Zone:** ${loc.campus}\n🚪 **Nearest Entry:** ${loc.nearestGate}\nℹ️ ${loc.description}\n\n**Directory & Facilities:**\n${floorList}\n\n*(Source: AU Student Handbook, Pages 44–49, 68)*`,
          locationCard: loc,
          chips: ["Show all 15 Gates", "Show Cafeterias", "Where is Central Library?"]
        };
      }
    }

    // 8. GATES & TRANSIT
    if (q.includes("gate") || q.includes("entrance") || q.includes("entry") || q.includes("metro") || q.includes("reach") || q.includes("direction") || q.includes("map")) {
      if (q.includes("metro") || q.includes("bus") || q.includes("airport") || q.includes("railway") || q.includes("transit") || q.includes("train")) {
        return {
          text: "**Transit & Directions to Ahmedabad University:**\n\n🚇 **Metro:** Nearest station is **Commerce Six Roads Metro Station** (Blue Line - East-West Corridor), just **300 metres** away.\n🚌 **Local Bus (AMTS/BRTS):** Two 'University' bus stops are within walking distance; BRTS dedicated bus corridor runs right across from the administration building.\n✈️ **Airport:** 11 km from campus.\n🚆 **Kalupur Railway Station:** 7 km from campus.\n🚌 **Gita Mandir Bus Station:** 7 km from campus.\n\n*(Source: AU Student Handbook, Page 64)*",
          chips: ["Show Gates on Map", "Where is Gate 10?", "Student Village Hostel"]
        };
      }
      return {
        text: "**Ahmedabad University Campus Gates Guide (Gates 1 to 15):**\n\n- **Gate 10:** University Main Gate (Central Campus, Security Office)\n- **Gate 12:** Direct entrance to University Centre (Health, CDC, ODS)\n- **Gate 6:** Central Campus West (GICT & Fab Shop)\n- **Gate 7:** S V Desai Road connecting Central & East Campuses\n- **Gate 8 & 9:** East Campus (AMSOM, BK Majumdar, HL Building)\n- **Gate 3 & 4:** North Campus (VentureStudio & Cafe)\n- **Gate 5:** South Campus (Biosciences Lab)\n- **Gate 15:** Sports Complex & Outdoor Track\n- **Gate 1 & 2:** University Administration & VC Office\n\n*(Source: AU Student Handbook, Page 68)*",
        chips: ["Open Campus Map", "Where is University Centre?", "Where is VentureStudio?"]
      };
    }

    // 9. ACADEMIC CALENDAR 2026-27
    if (q.includes("calendar") || q.includes("diwali") || q.includes("exam") || q.includes("break") || q.includes("holiday") || q.includes("semester") || q.includes("isp") || q.includes("midsem") || q.includes("endsem")) {
      return {
        text: "**Academic Calendar 2026–2027 Key Dates:**\n\n🍂 **Monsoon Semester (Aug–Dec 2026):**\n- **Classes Start:** August 3, 2026\n- **Mid-Sem Exams:** Sept 19–27 (Returning/Grad) | Oct 3–4 (Incoming UG)\n- **Diwali Break:** November 7 – 11, 2026\n- **Quiet Reading:** November 23 – 27, 2026\n- **End-Sem Exams:** November 28 – December 9, 2026\n- **Independent Study Period (ISP) & Break:** December 10, 2026 – January 3, 2027\n\n❄️ **Winter Semester (Jan–May 2027):**\n- **Classes Start:** January 4, 2027\n- **Mid-Sem Exams:** February 20 – 28, 2027\n- **End-Sem Exams:** April 24 – May 5, 2027\n- **Summer Break & Internships:** May 6 – July 25, 2027\n\n*(Source: AU Student Handbook, Page 12)*",
        chips: ["What is ISP?", "Add Week & Drop Month", "Open Calendar Tool"]
      };
    }

    // 10. ADVISORS & FACULTY DIRECTORY
    if (q.includes("advisor") || q.includes("chair") || q.includes("manager") || q.includes("cse advisor") || q.includes("faculty") || q.includes("dean") || q.includes("contact")) {
      return {
        text: "**Program Chairs & Major Advisors (2026–2027):**\n\n- **BTech Computer Science & Engg (CSE):**\n  • Chair: Prof. Sridhar Dalai (`ug.coordinator.seas@ahduni.edu.in`)\n  • Major Advisor: Dhaval Patel (Sem 1-4) / Souvik Roy (Sem 5-8) (`majoradvisor-cse@ahduni.edu.in`)\n  • Manager: Sanjay Gupta (`seas.ugprogramme@ahduni.edu.in`)\n- **BS (Hons) Computer Science:** Shashi Kant Shankar (`majoradvisor-computerscience@ahduni.edu.in`)\n- **BTech Mechanical:** Nand Kishore Singh (`majoradvisor-me@ahduni.edu.in`)\n- **BTech Chemical:** Anamika Maurya (`majoradvisor-cee@ahduni.edu.in`)\n- **BTech EEE:** Harmeet Kaur (`majoradvisor.eee@ahduni.edu.in`)\n- **BSM Management (Finance/Acct):** Hetal Jhaveri (`majoradvisor-finance@ahduni.edu.in`)\n- **BA (Hons) Economics:** Aranya Chakraborty (`majoradvisor-economics@ahduni.edu.in`)\n- **Dean of Students (ODS):** Prof. Amresh Kumar (`dean.students@ahduni.edu.in`)\n\n*(Source: AU Student Handbook, Pages 23–26)*",
        chips: ["Open Directory Tab", "Dean of Students Contact", "Emergency Contacts"]
      };
    }

    // 11. EMERGENCY & MEDICAL
    if (q.includes("emergency") || q.includes("doctor") || q.includes("medical") || q.includes("health") || q.includes("ragging") || q.includes("posh") || q.includes("harassment") || q.includes("security") || q.includes("police") || q.includes("ambulance")) {
      return {
        text: "**🚨 Ahmedabad University Emergency & Support Contacts:**\n\n- **Campus Security Supervisor (24/7):** `+91.9998800237`\n- **University Doctor (Dr. Gayatri Raval):** `+91.079.61911026` (`university.doctor@ahduni.edu.in`) | Health Centre 1st Flr UC (10am–3pm)\n- **Infirmary (8am - 8pm):** `+91.079.61911099` (4-bed observation facility)\n- **Anti-Ragging Helpline (Toll-Free):** `1800.180.5522` (`antiragging@ahduni.edu.in`)\n- **POSH Internal Committee:** `posh@ahduni.edu.in`\n- **Mental Wellness & Counselling:** `wellness@ahduni.edu.in` (2nd Floor UC / YourDOST)\n- **Ambulance:** `108`\n- **Memnagar Fire Station:** `+91.079.27911331`\n\n*(Source: AU Student Handbook, Pages 60, 65)*",
        chips: ["Open Emergency SOS Drawer", "Where is Health Centre?", "Security Gate 10"]
      };
    }

    // 12. CLUBS, FESTS & STUDENT COMMUNITIES
    if (q.includes("club") || q.includes("fest") || q.includes("chiasma") || q.includes("ingenium") || q.includes("concourse") || q.includes("radio") || q.includes("queer") || q.includes("society") || q.includes("auseac")) {
      return {
        text: "**Student Life, Clubs & Major Fests:**\n\n🎉 **Signature Annual Fests:**\n- **Chiasma:** Science Fest by School of Arts and Sciences\n- **Ingenium:** Annual Technology Festival by School of Engineering & Applied Science\n- **Concourse:** Annual Management Festival by AMSOM\n- **Anandmela:** Republic Day Children Festival with NGOs\n- **Panorama:** Annual Youth Festival of Creativity & Cultural Exchange\n- **Rooh-E-Bharat:** National Dance Traditions festival\n\n🎪 **Clubs & Communities (23+):** Programming Club, Robotics Club, Astronomy, Entrepreneurs', Wealth, Dance, Music, Theatre, Fine Arts, Stepwell Radio (`radio@ahduni.edu.in`), Queer Collective (`thequeer.collective@ahduni.edu.in`).\n\n*(Source: AU Student Handbook, Pages 52–56)*",
        chips: ["Sports Facilities", "What is ISP?", "Cafeterias on Campus"]
      };
    }

    // 13. ISP (Independent Study Period)
    if (q.includes("isp") || q.includes("independent study period")) {
      return {
        text: "**Independent Study Period (ISP):**\n\nISP is a unique mini-term running from **December 10, 2026 to January 3, 2027**.\n- Students take specially curated experiential studio courses in an **8-hour/day, 15-consecutive-day format**.\n- Explore passions beyond regular academic specialisations (fine arts, field biology, research, design thinking).\n- ISP culminates in an **Expo** where students display projects to the university community and public.\n\n*(Source: AU Student Handbook, Page 38)*",
        chips: ["Academic Calendar", "Foundation Programme", "Clubs & Fests"]
      };
    }

    // 14. Course Registration, Add/Drop & AURIS
    if (q.includes("auris") || q.includes("registration") || q.includes("add week") || q.includes("drop month") || q.includes("prerequisite") || q.includes("corequisite") || q.includes("apaar") || q.includes("abc id")) {
      return {
        text: "**Course Registration & AURIS Guide:**\n\n1. **AURIS Portal:** Access course registration, schedules, and attendance at `auris.ahduni.edu.in`.\n2. **Add Week & Drop Month:** During the first month of classes, students may attend sessions and switch courses without penalty. Afterward, drops require Dean's approval.\n3. **APAAR / ABC ID:** Mandatory Academic Account Registry ID created via DigiLocker under Academic Bank of Credits using your AU Enrollment Number.\n4. **Prerequisites & Corequisites:** Corequisites (e.g. MAT102 for CSC203) must be registered simultaneously or prior in AURIS.\n\n*(Source: AU Student Handbook, Pages 27–29)*",
        chips: ["How to apply for AA?", "Grading scale", "Academic Calendar"]
      };
    }

    // 15. Fallback Semantic Search in FAQs
    const matchedFaq = data.faqs.find(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    if (matchedFaq) {
      return {
        text: `**${matchedFaq.q}**\n\n${matchedFaq.a}\n\n*(Source: AU Student Handbook, Page ${matchedFaq.page})*`,
        chips: ["Attendance rules", "Grading system", "Campus Map", "Cafeterias on Campus"]
      };
    }

    return {
      text: "I can help with information directly from the **Ahmedabad University Student Handbook (2026–2027)**:\n\n• **Campus Navigation:** Buildings, room directories, gates, parking, transit.\n• **Food & Dining:** Cafeterias, menus, hours.\n• **Academics:** Attendance limits, grade drops, 4.0 GPA scale, Add/Drop month.\n• **Contacts:** Major advisors, program chairs, 24h security, health clinic.",
      chips: [
        "☕ Where are the cafeterias?",
        "🗺️ Where is University Centre?",
        "📉 Attendance grade drop rules",
        "👥 Find my Major Advisor",
        "📅 2026-27 Academic Calendar",
        "🚨 Emergency Contacts"
      ]
    };
  }

  function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatMessages.push({
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    chatInput.value = "";
    renderChat();

    setTimeout(() => {
      const response = queryAugiKnowledge(text);
      chatMessages.push({
        sender: "augi",
        text: response.text,
        locationCard: response.locationCard,
        chips: response.chips,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      renderChat();
    }, 280);
  }

  if (sendBtn) sendBtn.addEventListener("click", handleSendMessage);
  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSendMessage();
      }
    });
  }

  window.quickSend = function(text) {
    if (chatInput) {
      chatInput.value = text;
      handleSendMessage();
      if (currentTab !== "chat") {
        switchTab("chat");
      }
    }
  };

  window.viewLocationOnMap = function(locId) {
    switchTab("map");
    setTimeout(() => {
      const bldg = data.campusLocations.find(l => l.id === locId);
      if (bldg) selectBuilding(bldg);
    }, 50);
  };

  // -------------------------------------------------------------
  // MAP TAB LOGIC
  // -------------------------------------------------------------
  const mapSvg = document.getElementById("campus-map-svg");
  const buildingDetailsCard = document.getElementById("building-details");
  const mapSearchInput = document.getElementById("map-search");

  function renderMapMarkers() {
    if (!mapSvg) return;
    const buildingElements = document.querySelectorAll(".map-building");
    buildingElements.forEach(el => {
      el.addEventListener("click", () => {
        const id = el.dataset.id;
        const bldg = data.campusLocations.find(l => l.id === id);
        if (bldg) selectBuilding(bldg);
      });
    });

    const gateElements = document.querySelectorAll(".gate-marker");
    gateElements.forEach(el => {
      el.addEventListener("click", () => {
        const num = parseInt(el.dataset.gate);
        const gate = data.campusGates.find(g => g.num === num);
        if (gate) selectGate(gate);
      });
    });
  }

  function selectBuilding(bldg) {
    document.querySelectorAll(".map-building").forEach(el => {
      if (el.dataset.id === bldg.id) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    });

    if (buildingDetailsCard) {
      buildingDetailsCard.innerHTML = `
        <div class="glass-card p-4 rounded-2xl border border-slate-200 shadow-xs modal-anim bg-white">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#8C1D24]"></span>
                <h3 class="font-bold text-sm text-slate-900">${bldg.name}</h3>
              </div>
              <p class="text-[11px] text-[#8C1D24] font-semibold mt-0.5">${bldg.campus} • Nearest: ${bldg.nearestGate}</p>
            </div>
            <button onclick="window.askAugiAboutLocation('${bldg.name}')" class="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-[#8C1D24] text-[11px] font-bold rounded-lg border border-red-200 flex items-center gap-1 transition-all">
              💬 Ask
            </button>
          </div>
          <p class="text-[11px] text-slate-600 mt-2 leading-relaxed">${bldg.description}</p>
          <div class="mt-3 pt-2.5 border-t border-slate-100">
            <h4 class="text-[10px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Floor Directory:</h4>
            <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              ${bldg.floors.map(f => `
                <div class="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span class="font-bold text-slate-900">${f.floor}:</span>
                  <span class="text-slate-600"> ${f.facilities.join(", ")}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    }
  }

  function selectGate(gate) {
    if (buildingDetailsCard) {
      buildingDetailsCard.innerHTML = `
        <div class="glass-card p-4 rounded-2xl border border-slate-200 shadow-xs modal-anim bg-white">
          <div class="flex items-center gap-2.5">
            <span class="w-7 h-7 rounded-xl bg-[#D97706] text-white font-black text-xs flex items-center justify-center shadow-xs">${gate.num}</span>
            <h3 class="font-bold text-xs sm:text-sm text-slate-900">${gate.name}</h3>
          </div>
          <p class="text-[11px] text-slate-600 mt-2 leading-relaxed">${gate.desc}</p>
          <p class="text-[11px] text-[#8C1D24] mt-1 font-bold">Zone: ${gate.campus}</p>
          <button onclick="window.askAugiAboutLocation('How do I enter from Gate ${gate.num}?')" class="w-full mt-3 py-1.5 bg-gradient-to-r from-[#8C1D24] to-[#A82A33] text-white text-xs font-bold rounded-lg shadow-xs transition-all active:scale-98">
            Get Directions from Gate ${gate.num}
          </button>
        </div>
      `;
    }
  }

  window.askAugiAboutLocation = function(name) {
    switchTab("chat");
    chatInput.value = `Tell me about ${name}`;
    handleSendMessage();
  };

  if (mapSearchInput) {
    mapSearchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      if (!term) return;
      const match = data.campusLocations.find(l => l.name.toLowerCase().includes(term) || l.description.toLowerCase().includes(term) || l.floors.some(f => f.facilities.some(fac => fac.toLowerCase().includes(term))));
      if (match) selectBuilding(match);
    });
  }

  // -------------------------------------------------------------
  // DIRECTORY TAB LOGIC
  // -------------------------------------------------------------
  const directoryContainer = document.getElementById("directory-list");
  const directorySearchInput = document.getElementById("directory-search");
  const schoolFilterSelect = document.getElementById("school-filter");

  function renderDirectory(schoolFilter = "all", searchTerm = "") {
    if (!directoryContainer) return;
    let html = "";

    data.programmeAdvisors.forEach(group => {
      if (schoolFilter !== "all" && !group.school.toLowerCase().includes(schoolFilter.toLowerCase())) {
        return;
      }

      const filteredProgs = group.programmes.filter(p => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        return p.degree.toLowerCase().includes(s) || p.advisor.toLowerCase().includes(s) || p.chair.toLowerCase().includes(s);
      });

      if (filteredProgs.length === 0) return;

      html += `
        <div class="mb-4">
          <h3 class="text-[11px] font-black text-[#8C1D24] uppercase tracking-widest mb-2 px-1 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-[#8C1D24]"></span>
            ${group.school}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            ${filteredProgs.map(p => `
              <div class="glass-card p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-xs">
                <div>
                  <h4 class="font-bold text-xs text-slate-900">${p.degree}</h4>
                  <div class="mt-2 text-[11px] text-slate-600 space-y-0.5">
                    <div><span class="text-slate-400">Major Advisor:</span> <strong class="text-slate-900">${p.advisor}</strong></div>
                    <div><span class="text-slate-400">Chair:</span> ${p.chair}</div>
                    <div><span class="text-slate-400">Manager:</span> ${p.manager}</div>
                  </div>
                </div>
                <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${p.advisorEmail}&su=${encodeURIComponent('Academic Query - ' + p.degree)}" target="_blank" rel="noopener noreferrer" class="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-[#8C1D24] font-bold text-center rounded-lg text-xs border border-red-200 flex items-center justify-center gap-1.5 transition-all">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    Email on Gmail
                  </a>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    });

    directoryContainer.innerHTML = html || `<div class="text-center py-8 text-slate-400 text-xs">No advisors found matching your query.</div>`;
  }

  if (directorySearchInput) {
    directorySearchInput.addEventListener("input", (e) => {
      renderDirectory(schoolFilterSelect ? schoolFilterSelect.value : "all", e.target.value);
    });
  }

  if (schoolFilterSelect) {
    schoolFilterSelect.addEventListener("change", (e) => {
      renderDirectory(e.target.value, directorySearchInput ? directorySearchInput.value : "");
    });
  }

  // -------------------------------------------------------------
  // STUDENT TOOLS: ATTENDANCE CALCULATOR & GPA
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
        <div class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
          <div class="flex items-center justify-between font-bold text-xs sm:text-sm">
            <span class="text-emerald-800">✅ Status: Safe (No Penalty)</span>
            <span class="text-lg font-black text-emerald-700">${percentage}%</span>
          </div>
          <p class="text-[11px] mt-1 text-emerald-700">
            ${remainingSafe > 0 
              ? `You can still miss <strong>${remainingSafe}</strong> more class${remainingSafe > 1 ? 'es' : ''} without grade penalty.` 
              : `You have reached the maximum safe absences (${maxSafe}). Any more absence will trigger a grade drop!`}
          </p>
        </div>
      `;
    } else if (percentage >= 60) {
      statusHtml = `
        <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950">
          <div class="flex items-center justify-between font-bold text-xs sm:text-sm">
            <span class="text-amber-800">⚠️ Status: 1 Grade Drop Applied</span>
            <span class="text-lg font-black text-amber-700">${percentage}%</span>
          </div>
          <p class="text-[11px] mt-1 text-amber-700">
            Attendance is between 60% and 74%. Your final letter grade will be reduced by 1 notch (e.g. A ➔ A-, B ➔ B-, B- ➔ C+).
          </p>
        </div>
      `;
    } else {
      statusHtml = `
        <div class="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-950">
          <div class="flex items-center justify-between font-bold text-xs sm:text-sm">
            <span class="text-red-800">⛔ Status: 'NP' (Not Passed) Grade</span>
            <span class="text-lg font-black text-red-700">${percentage}%</span>
          </div>
          <p class="text-[11px] mt-1 text-red-700">
            Attendance has fallen below 60%. As per AU regulations, you will receive an 'NP' grade and must repeat the course.
          </p>
        </div>
      `;
    }

    attResultCard.innerHTML = `
      <div class="space-y-2.5">
        ${statusHtml}
        <div class="grid grid-cols-3 gap-2 text-center text-xs">
          <div class="p-2 bg-slate-50 rounded-xl border border-slate-200">
            <span class="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Total</span>
            <strong class="text-slate-900 text-sm">${total}</strong>
          </div>
          <div class="p-2 bg-slate-50 rounded-xl border border-slate-200">
            <span class="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Attended</span>
            <strong class="text-emerald-600 text-sm">${attended}</strong>
          </div>
          <div class="p-2 bg-slate-50 rounded-xl border border-slate-200">
            <span class="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Safe Limit</span>
            <strong class="text-slate-900 text-sm">≤ ${maxSafe}</strong>
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
  // GPA CALCULATOR ENGINE
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
      <div class="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
        <input type="text" value="${c.name}" onchange="window.updateGpaCourse(${i}, 'name', this.value)" class="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 outline-none">
        <select onchange="window.updateGpaCourse(${i}, 'credits', parseFloat(this.value))" class="text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 outline-none">
          <option value="1" ${c.credits === 1 ? 'selected' : ''}>1 Cr</option>
          <option value="1.5" ${c.credits === 1.5 ? 'selected' : ''}>1.5 Cr</option>
          <option value="2" ${c.credits === 2 ? 'selected' : ''}>2 Cr</option>
          <option value="3" ${c.credits === 3 ? 'selected' : ''}>3 Cr</option>
          <option value="4" ${c.credits === 4 ? 'selected' : ''}>4 Cr</option>
        </select>
        <select onchange="window.updateGpaCourse(${i}, 'grade', this.value)" class="text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 outline-none">
          ${data.gradingScale.filter(g => g.points !== null).map(g => `
            <option value="${g.grade}" ${c.grade === g.grade ? 'selected' : ''}>${g.grade} (${g.points.toFixed(1)})</option>
          `).join("")}
        </select>
        <button onclick="window.removeGpaCourse(${i})" class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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
    let totalCredits = 0;
    let totalPoints = 0;

    gpaCourses.forEach(c => {
      const gObj = data.gradingScale.find(g => g.grade === c.grade);
      if (gObj && gObj.points !== null) {
        totalCredits += c.credits;
        totalPoints += (c.credits * gObj.points);
      }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    gpaResultDisplay.innerHTML = `
      <div class="text-center p-3.5 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl shadow-xs text-white">
        <span class="text-[10px] text-slate-300 uppercase font-black tracking-widest block">Estimated SGPA</span>
        <span class="text-3xl font-black text-amber-400 mt-0.5 block tracking-tight">${gpa} <span class="text-xs text-slate-400 font-medium">/ 4.00</span></span>
        <div class="flex justify-center gap-5 mt-2 text-[11px] text-slate-300">
          <span>Total Credits: <strong class="text-white">${totalCredits}</strong></span>
          <span>Quality Points: <strong class="text-white">${totalPoints.toFixed(1)}</strong></span>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // ACADEMIC CALENDAR RENDERER
  // -------------------------------------------------------------
  const calendarContainer = document.getElementById("calendar-events-list");
  const semFilterSelect = document.getElementById("sem-filter");

  function renderCalendar(semKey = "monsoon2026") {
    if (!calendarContainer) return;
    const sem = data.academicCalendar[semKey];
    if (!sem) return;

    calendarContainer.innerHTML = `
      <h3 class="text-[11px] font-black text-[#8C1D24] uppercase tracking-widest mb-2 px-1">${sem.name}</h3>
      <div class="space-y-2">
        ${sem.events.map(ev => {
          let badgeColor = "bg-blue-50 text-blue-800 border border-blue-200";
          if (ev.type === "exam") badgeColor = "bg-amber-50 text-amber-800 border border-amber-200";
          if (ev.type === "holiday") badgeColor = "bg-emerald-50 text-emerald-800 border border-emerald-200";

          return `
            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between gap-2.5">
              <div>
                <h4 class="font-bold text-xs text-slate-900">${ev.title}</h4>
                <p class="text-[10px] text-slate-500 mt-0.5">${ev.date}</p>
              </div>
              <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeColor} shrink-0 uppercase tracking-wider">${ev.type}</span>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  if (semFilterSelect) {
    semFilterSelect.addEventListener("change", (e) => renderCalendar(e.target.value));
  }

  // Initialize all components & pre-select University Centre on map
  renderChat();
  renderMapMarkers();
  renderDirectory();
  calculateAttendance();
  renderGpaCourses();
  renderCalendar();
  if (data.campusLocations && data.campusLocations[0]) {
    selectBuilding(data.campusLocations[0]);
  }
});
