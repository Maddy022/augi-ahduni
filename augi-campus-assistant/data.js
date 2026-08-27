// AUGI - Ahmedabad University Knowledge Base & Directory Data (Handbook 2026-2027)

window.AUGI_DATA = {
  university: {
    name: "Ahmedabad University",
    academicYear: "2026-2027",
    foundedBy: "Ahmedabad Education Society (AES)",
    establishedYear: 2009,
    motto: "Enquiry for Acquiring Deep Understanding",
    portalUrls: {
      auris: "https://auris.ahduni.edu.in",
      lms: "https://lms.ahduni.edu.in",
      library: "https://uls.ahduni.edu.in",
      itHelp: "https://sites.google.com/ahduni.edu.in/ithelpandsupport",
      website: "https://www.ahduni.edu.in",
      abcPortal: "https://www.abc.gov.in"
    }
  },

  academicCalendar: {
    monsoon2026: {
      name: "Monsoon Semester (August – December 2026)",
      events: [
        { date: "August 3, 2026", title: "First Day of Classes", type: "academic" },
        { date: "September 19 – 27, 2026", title: "Mid Semester Examination Period (Returning & Graduate)", type: "exam" },
        { date: "October 3 – 4, 2026", title: "Mid Semester Examination Period (Incoming UG & Integrated Masters)", type: "exam" },
        { date: "October 5, 2026", title: "First Day of Bi-Semester Courses", type: "academic" },
        { date: "November 7 – 11, 2026", title: "Diwali Break", type: "holiday" },
        { date: "November 23 – 27, 2026", title: "Quiet Reading Period (Returning)", type: "academic" },
        { date: "November 28 – December 9, 2026", title: "Mid Bi-Semester / End Semester Examination Period", type: "exam" },
        { date: "December 10, 2026 – January 3, 2027", title: "Semester Break & Independent Study Period (ISP)", type: "holiday" }
      ]
    },
    winter2027: {
      name: "Winter Semester (January – May 2027)",
      events: [
        { date: "January 4, 2027", title: "First Day of Classes", type: "academic" },
        { date: "February 17 – 19, 2027", title: "Quiet Reading Period for Bi-Semester Courses", type: "academic" },
        { date: "February 20 – 28, 2027", title: "Mid Semester / End Bi-Semester Examination Period", type: "exam" },
        { date: "April 19 – 23, 2027", title: "Quiet Reading Period (Returning)", type: "academic" },
        { date: "April 24 – May 5, 2027", title: "End Semester Examination Period (Returning)", type: "exam" },
        { date: "April 27 – 30, 2027", title: "Quiet Reading Period (Incoming UG)", type: "academic" },
        { date: "May 1 – 5, 2027", title: "End Semester Examination Period (Incoming UG)", type: "exam" },
        { date: "May 6 – July 25, 2027", title: "Summer Break and Internship Period", type: "holiday" }
      ]
    },
    summer2027: {
      name: "Summer Term (May – July 2027)",
      events: [
        { date: "May 10, 2027", title: "First Day of Classes", type: "academic" },
        { date: "Week 4 (class hours)", title: "Mid Term Examination Period", type: "exam" },
        { date: "July 5 – 9, 2027", title: "End Term Examination Period", type: "exam" }
      ]
    }
  },

  gradingScale: [
    { grade: "A", points: 4.0, meaning: "Excellent", minMarkDesc: "Outstanding mastery of material" },
    { grade: "A-", points: 3.7, meaning: "Very Good", minMarkDesc: "Excellent comprehension" },
    { grade: "B+", points: 3.3, meaning: "Very Good", minMarkDesc: "High level of competence" },
    { grade: "B", points: 3.0, meaning: "Good", minMarkDesc: "Solid understanding" },
    { grade: "B-", points: 2.7, meaning: "Good", minMarkDesc: "Satisfactory with minor gaps" },
    { grade: "C+", points: 2.3, meaning: "Fair", minMarkDesc: "Adequate performance" },
    { grade: "C", points: 2.0, meaning: "Fair", minMarkDesc: "Minimum overall passing CGPA requirement" },
    { grade: "D", points: 1.7, meaning: "Sufficient", minMarkDesc: "Minimum passing grade in a single course" },
    { grade: "NP", points: 0.0, meaning: "Not Passed", minMarkDesc: "Failed / requires repeating course" },
    { grade: "P", points: 0.0, meaning: "Passed", minMarkDesc: "Pass/No-grade courses" },
    { grade: "I", points: null, meaning: "Incomplete", minMarkDesc: "Coursework pending, turns to NP if not resolved" },
    { grade: "W", points: null, meaning: "Withdrawn", minMarkDesc: "Withdrawn from Course" },
    { grade: "S", points: 0.0, meaning: "Satisfactory", minMarkDesc: "Audited course" },
    { grade: "U", points: 0.0, meaning: "Unsatisfactory", minMarkDesc: "Audited course incomplete" }
  ],

  attendanceRules: {
    minimumRequired: 75,
    severeThreshold: 60,
    creditLimits: [
      { credits: 4, totalSessions: 45, maxAbsencesSafe: 9, gradeDropRange: "10-15", npThreshold: 16 },
      { credits: 3, totalSessions: 30, maxAbsencesSafe: 6, gradeDropRange: "7-10", npThreshold: 11 },
      { credits: 2, totalSessions: 20, maxAbsencesSafe: 4, gradeDropRange: "5-6", npThreshold: 7 },
      { credits: 1.5, totalSessions: 15, maxAbsencesSafe: 3, gradeDropRange: "4-5", npThreshold: 6 },
      { credits: 1, totalSessions: 10, maxAbsencesSafe: 2, gradeDropRange: "3", npThreshold: 4 }
    ],
    foundationProgrammePolicy: "100% attendance expected in Studios and First-Year Seminars. If attendance drops below 75% in any module/weekly unit, student receives an NP grade."
  },

  campusLocations: [
    {
      id: "uc",
      num: 9,
      name: "University Centre (UC)",
      campus: "Central Campus",
      nearestGate: "Gate 12 / Gate 10",
      description: "Main student life & administration hub. Houses student services, dining, health clinic, and recreation.",
      floors: [
        { floor: "1st Floor", facilities: ["University Health Centre (8am - 8pm)", "Dr. Gayatri Raval Clinic", "Infirmary"] },
        { floor: "2nd Floor", facilities: ["Office of the Dean of Students (ODS - Room 200)", "Special Education Centre", "Wellness Centre"] },
        { floor: "3rd Floor", facilities: ["Silent Study Area", "Student Lounges", "Discussion Rooms"] },
        { floor: "4th Floor", facilities: ["Career Development Centre (CDC - Room 401)", "Office of International Affairs (Room 206)"] },
        { floor: "Ground / Mezzanine", facilities: ["Ahmedabad University Bookstore", "Reprographics Centre (Room 102)", "Food Court", "The Gulmohar", "Gymnasium"] }
      ],
      coords: { x: 50, y: 55 }
    },
    {
      id: "gict",
      num: 10,
      name: "GICT Building (Engineering & Tech)",
      campus: "Central Campus",
      nearestGate: "Gate 6 / Gate 10",
      description: "School of Engineering & Applied Science, Research Centres & Central Library.",
      floors: [
        { floor: "Ground - 2nd", facilities: ["Central Library (24h Mon-Sat, 24/7 in Exams)", "SEAS Engineering Labs", "Computer Labs"] },
        { floor: "3rd - 5th", facilities: ["SEAS Faculty Offices", "Global Centre for Environment & Energy (GCEE)", "Centre for Learning Futures (CLEF)", "ICSC"] }
      ],
      coords: { x: 40, y: 48 }
    },
    {
      id: "sas",
      num: 8,
      name: "School of Arts and Sciences (SAS)",
      campus: "Central Campus",
      nearestGate: "Gate 10 / Gate 7",
      description: "Houses Biological & Life Sciences, Humanities, Math, Performing & Social Sciences.",
      floors: [
        { floor: "All Floors", facilities: ["SAS Reading Room", "Lecture Studios", "Physics & Chemistry Labs", "Dean SAS Office", "Faculty Cabins"] }
      ],
      coords: { x: 62, y: 46 }
    },
    {
      id: "amsom",
      num: 6,
      name: "Amrut Mody School of Management (AMSOM)",
      campus: "Central Campus / East Campus",
      nearestGate: "Gate 10 / Gate 7",
      description: "Management programmes, MBA studios, case study halls, and seminar auditoriums.",
      floors: [
        { floor: "Ground - 4th", facilities: ["AMSOM Programme Office", "Dean AMSOM Office", "Case Study Rooms", "Management Labs", "Venture Cafe Area"] }
      ],
      coords: { x: 65, y: 56 }
    },
    {
      id: "undergrad_hl",
      num: 11,
      name: "Undergraduate Programmes (BK Majumdar & HL Buildings)",
      campus: "East Campus",
      nearestGate: "Gate 8 / Gate 9 / Gate 7",
      description: "Classrooms, Reading Room, ATM, Cricket Ground, and Controller of Examinations.",
      floors: [
        { floor: "Ground - 2nd", facilities: ["Ahmedabad Design Lab", "Controller of Examinations", "East Campus Reading Room", "HL Cafeteria", "ATM"] }
      ],
      coords: { x: 86, y: 52 }
    },
    {
      id: "venturestudio",
      num: 2,
      name: "VentureStudio & Innovation Lab",
      campus: "North Campus",
      nearestGate: "Gate 3 / Gate 4",
      description: "Startup incubation center founded with Stanford CDR. DST Prayas Shala & Bio-NEST prototyping labs.",
      floors: [
        { floor: "All", facilities: ["DST Prayas Shala Fabrication Shop", "Bio-NEST Bio-incubation Lab", "Café VentureStudio", "Co-working spaces"] }
      ],
      coords: { x: 55, y: 22 }
    },
    {
      id: "univ_office",
      num: 1,
      name: "University Offices (Administration)",
      campus: "North / Main Entry",
      nearestGate: "Gate 1 / Gate 2",
      description: "Vice Chancellor's Office, Registrar, Admissions, Financial Aid & Conference Rooms.",
      floors: [
        { floor: "Building 1", facilities: ["Office of the Vice Chancellor", "Office of the Registrar", "Admissions & Financial Aid (Office No. 5)", "Chief Financial Officer"] }
      ],
      coords: { x: 82, y: 24 }
    },
    {
      id: "bio_lab",
      num: 3,
      name: "Biosciences Research Laboratory",
      campus: "South Campus",
      nearestGate: "Gate 5",
      description: "State-of-the-art biological research, cell biology and genomics research equipment.",
      floors: [
        { floor: "All", facilities: ["Biosciences Research Facility", "Cell Culture Rooms", "Analytical Lab"] }
      ],
      coords: { x: 18, y: 78 }
    },
    {
      id: "arboretum",
      num: 0,
      name: "The Arboretum & Central Lawns",
      campus: "Central Campus",
      nearestGate: "Gate 10 / Gate 12",
      description: "3 lakh sq ft campus green lung with 800+ trees, recharge stepwell amphitheatre, and outdoor discussion spaces.",
      floors: [
        { floor: "Outdoors", facilities: ["Stepwell Amphitheatre", "Outdoor Classroom Spaces", "Walking trails"] }
      ],
      coords: { x: 58, y: 40 }
    },
    {
      id: "sports_complex",
      num: 15,
      name: "Sports Complex & Indoor Gymnasium",
      campus: "West / Central",
      nearestGate: "Gate 15 / Gate 12",
      description: "Comprehensive sports: 400m track, tennis, football, basketball, badminton, squash, shooting range, table tennis, pickleball.",
      floors: [
        { floor: "Outdoor", facilities: ["400m Track", "Football Field", "Cricket Pitch", "Tennis Courts", "Basketball", "Pickleball"] },
        { floor: "UC Indoor", facilities: ["200m Track", "Badminton Courts", "Squash Courts", "10m Shooting Range", "Gymnasium"] }
      ],
      coords: { x: 10, y: 32 }
    }
  ],

  campusGates: [
    { num: 1, name: "Gate 1: University Office Entry", desc: "Access to Administrative Office 1 & Conference Rooms", campus: "North-East" },
    { num: 2, name: "Gate 2: University Office Entry", desc: "Admissions & Financial Aid access", campus: "North-East" },
    { num: 3, name: "Gate 3: VentureStudio", desc: "Direct access to VentureStudio & Cafe VentureStudio", campus: "North Campus" },
    { num: 4, name: "Gate 4: North Campus Entry", desc: "Entry to North Campus drive and parking", campus: "North Campus" },
    { num: 5, name: "Gate 5: Biosciences Research Lab", desc: "Access to Biosciences Lab & South Campus", campus: "South Campus" },
    { num: 6, name: "Gate 6: Central Campus Entry", desc: "West entry towards GICT Building and Fabrication Shop", campus: "Central Campus" },
    { num: 7, name: "Gate 7: Campus Entry (S V Desai Road)", desc: "Major connecting road between Central and East Campus", campus: "Central/East" },
    { num: 8, name: "Gate 8: East Campus Entry", desc: "Direct access to AMSOM, BK Majumdar & HL Buildings", campus: "East Campus" },
    { num: 9, name: "Gate 9: East Campus Entry", desc: "Access to Cricket Ground and East Campus library room", campus: "East Campus" },
    { num: 10, name: "Gate 10: University Main Gate", desc: "Main ceremonial entry on Central Campus (Security Office)", campus: "Central Campus" },
    { num: 11, name: "Gate 11: Central Campus", desc: "Access to SAS and Central Lawns", campus: "Central Campus" },
    { num: 12, name: "Gate 12: University Centre", desc: "Direct entry to University Centre (Health, ODS, CDC)", campus: "Central Campus" },
    { num: 13, name: "Gate 13: Central Campus", desc: "North entry to Central Campus from University Road", campus: "Central Campus" },
    { num: 14, name: "Gate 14: Guest House", desc: "Guest House & faculty housing lane", campus: "South-West" },
    { num: 15, name: "Gate 15: Sports Complex", desc: "Direct access to 400m outdoor track & sports grounds", campus: "West" }
  ],

  hostels: [
    {
      name: "Ahmedabad University Student Village",
      location: "Opposite Gujarat University Metro Station, Helmet Circle, Navrangpura, Ahmedabad",
      amenities: ["Twin-sharing AC rooms", "Buffet veg/non-veg meals", "Wi-Fi", "Daily cleaning & laundry (up to 4 items/day)", "Scheduled transport to campus", "24-hour security & CCTV", "Medical support & hospital tie-up"],
      rules: ["Housing confirmed for full academic year", "Strict No Tobacco, No Alcohol, No Drugs policy", "AC billed on actuals via sub-meter"],
      email: "director.studentresidences@ahduni.edu.in",
      phone: "+91.8511220747"
    },
    {
      name: "Student Village Annexe",
      location: "Besides Samudra Complex, Mithakhali, Navrangpura, Ahmedabad",
      amenities: ["Twin-sharing AC rooms", "Meal plans", "Wi-Fi", "Daily cleaning", "Shuttle transport"],
      rules: ["Annual commitment", "Zero tolerance for substances"],
      email: "director.studentresidences@ahduni.edu.in"
    }
  ],

  cafeterias: [
    { name: "University Cafeteria & Food Court", location: "University Centre (Ground Floor)", type: "Full food court & snacks", timings: "8:00 AM - 9:00 PM" },
    { name: "Café VentureStudio", location: "VentureStudio (North Campus)", type: "Coffee, quick bites, sandwiches", timings: "9:00 AM - 7:00 PM" },
    { name: "Café Delice", location: "Near Central Campus", type: "Pastries, beverages, continental", timings: "9:00 AM - 8:00 PM" },
    { name: "Global Bistro", location: "Campus Vicinity", type: "Multi-cuisine bowls & salads", timings: "11:00 AM - 10:00 PM" },
    { name: "Greens and Grains", location: "Campus Hub", type: "Healthy salads, organic bowls & fresh juices", timings: "9:00 AM - 8:00 PM" },
    { name: "Noboru", location: "Campus Vicinity", type: "Pan-Asian & specialty dining", timings: "12:00 PM - 10:30 PM" },
    { name: "Truly Indian", location: "East Campus vicinity", type: "Traditional Indian meals, thalis & snacks", timings: "10:00 AM - 9:30 PM" }
  ],

  emergencyContacts: [
    { title: "Campus Security Supervisor (24 Hours)", phone: "+91.9998800237", desc: "Immediate 24/7 on-campus emergency response", isHot: true },
    { title: "University Doctor (Dr. Gayatri Raval)", phone: "+91.079.61911026", email: "university.doctor@ahduni.edu.in", desc: "Health Centre, 1st Floor UC (10am-3pm)", isHot: true },
    { title: "Health Centre Infirmary", phone: "+91.079.61911099", desc: "Open 8:00 am to 8:00 pm, 4-bed facility", isHot: true },
    { title: "Central Helpdesk", phone: "+91.8511223310", altPhone: "+91.079.61911001", desc: "General campus enquiry & dispatch" },
    { title: "Anti-Ragging Toll-Free Helpline", phone: "1800.180.5522", email: "antiragging@ahduni.edu.in", desc: "National 24/7 anti-ragging support", isHot: true },
    { title: "Prevention of Sexual Harassment (POSH)", email: "posh@ahduni.edu.in", desc: "Confidential Internal Complaints Committee", isHot: true },
    { title: "Mental Wellness & Counselling", email: "wellness@ahduni.edu.in", desc: "Office of Dean of Students, 2nd Floor UC / YourDOST" },
    { title: "Suicide Prevention Helpline", phone: "1860.266.2345", desc: "24/7 mental health crisis hotline" },
    { title: "Women's Helpline", phone: "1091", desc: "National emergency helpline for women" },
    { title: "Ambulance (Govt)", phone: "108", desc: "Emergency medical transport" },
    { title: "Security Gate 10 (Main Gate)", phone: "+91.079.61911005", desc: "Security Manager Paresh Jain" }
  ],

  programmeAdvisors: [
    {
      school: "School of Engineering and Applied Science (SEAS)",
      programmes: [
        {
          degree: "BTech - Computer Science and Engineering",
          chair: "Sridhar Dalai (ug.coordinator.seas@ahduni.edu.in)",
          manager: "Sanjay Gupta (seas.ugprogramme@ahduni.edu.in)",
          advisor: "Dhaval Patel (Sem 1-4) / Souvik Roy (Sem 5-8)",
          advisorEmail: "majoradvisor-cse@ahduni.edu.in"
        },
        {
          degree: "BTech - Chemical and Environmental Engineering",
          chair: "Sridhar Dalai (ug.coordinator.seas@ahduni.edu.in)",
          manager: "Sanjay Gupta (seas.ugprogramme@ahduni.edu.in)",
          advisor: "Anamika Maurya",
          advisorEmail: "majoradvisor-cee@ahduni.edu.in"
        },
        {
          degree: "BTech - Mechanical Engineering",
          chair: "Sridhar Dalai (ug.coordinator.seas@ahduni.edu.in)",
          manager: "Sanjay Gupta (seas.ugprogramme@ahduni.edu.in)",
          advisor: "Nand Kishore Singh",
          advisorEmail: "majoradvisor-me@ahduni.edu.in"
        },
        {
          degree: "BTech - Electrical and Electronics Engineering",
          chair: "Sridhar Dalai (ug.coordinator.seas@ahduni.edu.in)",
          manager: "Sanjay Gupta (seas.ugprogramme@ahduni.edu.in)",
          advisor: "Harmeet Kaur",
          advisorEmail: "majoradvisor.eee@ahduni.edu.in"
        },
        {
          degree: "MTech - Computer Science and Engineering",
          chair: "Srikrishnan Divakaran (srikrishnan.divakaran@ahduni.edu.in)",
          manager: "Megha Mistry (seas.pgprogramme@ahduni.edu.in)",
          advisor: "Srikrishnan Divakaran",
          advisorEmail: "seas.pgprogramme@ahduni.edu.in"
        },
        {
          degree: "MTech - VLSI, Microelectronics & Semiconductors",
          chair: "Mazad Zaveri (mazad.zaveri@ahduni.edu.in)",
          manager: "Megha Mistry (seas.pgprogramme@ahduni.edu.in)",
          advisor: "Mazad Zaveri",
          advisorEmail: "mazad.zaveri@ahduni.edu.in"
        },
        {
          degree: "MTech - Composites",
          chair: "Hemant Chouhan (hemant.chouhan@ahduni.edu.in)",
          manager: "Megha Mistry (seas.pgprogramme@ahduni.edu.in)",
          advisor: "Hemant Chouhan",
          advisorEmail: "hemant.chouhan@ahduni.edu.in"
        }
      ]
    },
    {
      school: "School of Arts and Sciences (SAS)",
      programmes: [
        {
          degree: "BS (Hons) - Computer Science",
          chair: "Noopur Thakur (programmechair-bs-ims@ahduni.edu.in)",
          manager: "Jitendra Salunke (jitendra.salunke@ahduni.edu.in)",
          advisor: "Shashi Kant Shankar",
          advisorEmail: "majoradvisor-computerscience@ahduni.edu.in"
        },
        {
          degree: "BS (Hons) - Physics / Engineering Physics",
          chair: "Noopur Thakur (programmechair-bs-ims@ahduni.edu.in)",
          manager: "Jitendra Salunke (jitendra.salunke@ahduni.edu.in)",
          advisor: "Sutapa Mukherji (Physics) / Pinaki Majumdar (Engg Physics)",
          advisorEmail: "majoradvisor-physics@ahduni.edu.in"
        },
        {
          degree: "BS (Hons) - Mathematical & Computational Sciences",
          chair: "Noopur Thakur (programmechair-bs-ims@ahduni.edu.in)",
          manager: "Jitendra Salunke (jitendra.salunke@ahduni.edu.in)",
          advisor: "Pramath Anamby",
          advisorEmail: "majoradvisor-mcs@ahduni.edu.in"
        },
        {
          degree: "BA (Hons) - Economics",
          chair: "Sabyasachi Das (chair.bseco@ahduni.edu.in)",
          manager: "Amruta Kapoor (amruta.kapoor@ahduni.edu.in)",
          advisor: "Aranya Chakraborty",
          advisorEmail: "majoradvisor-economics@ahduni.edu.in"
        },
        {
          degree: "BA (Hons) - Psychology",
          chair: "Shishir Saxena (programmechair-ba@ahduni.edu.in)",
          manager: "Jitendra Salunke (jitendra.salunke@ahduni.edu.in)",
          advisor: "Rachna Mishra (Sem 1-4) / Nithin George (Sem 5-8)",
          advisorEmail: "majoradvisor-psychology@ahduni.edu.in"
        },
        {
          degree: "BA (Hons) - History",
          chair: "Shishir Saxena (programmechair-ba@ahduni.edu.in)",
          manager: "Jitendra Salunke (jitendra.salunke@ahduni.edu.in)",
          advisor: "Ayesha Sheth",
          advisorEmail: "majoradvisor-history@ahduni.edu.in"
        },
        {
          degree: "BA (Hons) - Social & Political Sciences",
          chair: "Shishir Saxena (programmechair-ba@ahduni.edu.in)",
          manager: "Jitendra Salunke (jitendra.salunke@ahduni.edu.in)",
          advisor: "Neelanjan Sircar",
          advisorEmail: "majoradvisor-sps@ahduni.edu.in"
        },
        {
          degree: "Integrated MS - Life Sciences",
          chair: "Noopur Thakur (programmechair-bs-ims@ahduni.edu.in)",
          manager: "Jitendra Salunke (jitendra.salunke@ahduni.edu.in)",
          advisor: "Manish Grover (Sem 1-6) / Subhash Rajpurohit (Sem 7-10)",
          advisorEmail: "majoradvisor-lifesciences@ahduni.edu.in"
        }
      ]
    },
    {
      school: "Amrut Mody School of Management (AMSOM)",
      programmes: [
        {
          degree: "BS in Management (Honours) - Finance / Accounting",
          chair: "Kunal Mankodi (chair.bsm@ahduni.edu.in)",
          manager: "Amruta Kapoor (amruta.kapoor@ahduni.edu.in)",
          advisor: "Hetal Jhaveri",
          advisorEmail: "majoradvisor-finance@ahduni.edu.in"
        },
        {
          degree: "BSM (Hons) - Business Analytics / ORS",
          chair: "Kunal Mankodi (chair.bsm@ahduni.edu.in)",
          manager: "Amruta Kapoor (amruta.kapoor@ahduni.edu.in)",
          advisor: "Amit Singh",
          advisorEmail: "majoradvisor-businessanalytics@ahduni.edu.in"
        },
        {
          degree: "BSM (Hons) - Marketing",
          chair: "Kunal Mankodi (chair.bsm@ahduni.edu.in)",
          manager: "Amruta Kapoor (amruta.kapoor@ahduni.edu.in)",
          advisor: "Bijal Mehta",
          advisorEmail: "majoradvisor-marketing@ahduni.edu.in"
        },
        {
          degree: "BSM (Hons) - Operations Management / SCM",
          chair: "Kunal Mankodi (chair.bsm@ahduni.edu.in)",
          manager: "Amruta Kapoor (amruta.kapoor@ahduni.edu.in)",
          advisor: "Md Shahrukh Anjum",
          advisorEmail: "majoradvisor-om@ahduni.edu.in"
        },
        {
          degree: "BCom (Honours & Professional)",
          chair: "Hetal Jhaveri (chair.bcom@ahduni.edu.in)",
          manager: "Amruta Kapoor (amruta.kapoor@ahduni.edu.in)",
          advisor: "Hetal Jhaveri",
          advisorEmail: "majoradvisor-accounting@ahduni.edu.in"
        },
        {
          degree: "Family Business and Entrepreneurship (FBE)",
          chair: "Amrita Bihani (chair.fbe@ahduni.edu.in)",
          manager: "Sonia Kumar (sonia.kumar@ahduni.edu.in)",
          advisor: "Amrita Bihani",
          advisorEmail: "majoradvisor-efb@ahduni.edu.in"
        },
        {
          degree: "Master of Business Administration (MBA)",
          chair: "Sudhir Pandey (chair.mba@ahduni.edu.in)",
          manager: "Sonia Kumar (sonia.kumar@ahduni.edu.in)",
          advisor: "Sudhir Pandey",
          advisorEmail: "chair.mba@ahduni.edu.in"
        }
      ]
    }
  ],

  studentClubs: [
    { name: "Programming Club", category: "Technical", desc: "Hackathons, competitive coding, open-source projects, and dev workshops." },
    { name: "Robotics Club", category: "Technical", desc: "Hardware tinkering, ROS, IoT, drone building, and robot combat." },
    { name: "Astronomy Club", category: "Science", desc: "Stargazing nights, telescope workshops, and space science seminars." },
    { name: "Entrepreneurs' Club", category: "Business", desc: "Startup ideation, venture pitch decks, and founder fireside chats." },
    { name: "Wealth Club", category: "Finance", desc: "Equity research, portfolio management, algorithmic trading simulations." },
    { name: "Debate Society", category: "Literary", desc: "Parliamentary debates, MUNs, public speaking and rhetoric." },
    { name: "Film Appreciation Club", category: "Arts", desc: "Screenings of world cinema, film analysis, and filmmaking workshops." },
    { name: "Dance Club", category: "Cultural", desc: "Classical, contemporary, hip-hop, and organizers of Rooh-E-Bharat." },
    { name: "Music Club", category: "Cultural", desc: "Vocal and instrumental jams, band performances, and campus concerts." },
    { name: "Theatre Club", category: "Cultural", desc: "Street plays, stage dramas, scriptwriting, and acting workshops." },
    { name: "Fine Arts Club", category: "Arts", desc: "Painting, sketching, pottery, and Rang De Pathshala community murals." },
    { name: "Photography Club", category: "Media", desc: "Campus photojournalism, portraiture, photowalks across Old Ahmedabad." },
    { name: "Quiz Club", category: "Literary", desc: "General, pop culture, sci-tech, and business trivia tournaments." },
    { name: "Food and Nutrition Club", category: "Lifestyle", desc: "Culinary workshops, healthy eating drives, and Onam Sadhya host." },
    { name: "Fitness Club", category: "Sports", desc: "Crossfit, marathon training, yoga, and calisthenics." },
    { name: "Sports Club", category: "Sports", desc: "Inter-college championships in football, basketball, cricket, badminton." },
    { name: "Heritage Club", category: "Culture", desc: "Preserving Ahmedabad World Heritage city sites and historical tours." },
    { name: "Environment Club", category: "Eco", desc: "Campus sustainability, tree planting in Arboretum, zero-waste campaigns." },
    { name: "Social Service Forum", category: "Community", desc: "VOL100 coordination, teaching underprivileged children, blood donation." },
    { name: "Stepwell Radio", category: "Broadcasting", desc: "Student podcasting, faculty interviews, and indie playlists (radio@ahduni.edu.in)." },
    { name: "Queer Collective", category: "Community", desc: "Safe, inclusive space for LGBTQ+ students & allies (thequeer.collective@ahduni.edu.in)." },
    { name: "IEEE Student Branch", category: "Professional", desc: "Electrical, electronics, and CS professional development." },
    { name: "ASME Student Section", category: "Professional", desc: "Mechanical engineering student body and design challenges." },
    { name: "AIChE Student Chapter", category: "Professional", desc: "Chemical engineering industry linkage and conferences." }
  ],

  faqs: [
    {
      q: "How do I apply for an Authorised Absence (AA)?",
      category: "Attendance & Leaves",
      page: 36,
      a: "To apply for an Authorised Absence (AA):\n1. Log in to AURIS (auris.ahduni.edu.in) and go to Quick Links -> Authorised Absence.\n2. Upload proof (conference acceptance, sporting invite) and supporting letter from faculty/Sports Director.\n3. Your Programme Office forwards the request to the Programme Chair and Dean.\n4. If approved, you will be marked 'AA' (counted as present, no grade penalty) and an intimation email is sent to your course instructors."
    },
    {
      q: "What is the Attendance Policy and grade drop rule?",
      category: "Attendance & Leaves",
      page: 34,
      a: "Ahmedabad University requires a minimum of 75% attendance.\n- If attendance is 75% or higher: No penalty.\n- If attendance drops between 60% and 74%: 1 Grade Drop is applied (e.g., A becomes A-, B becomes B-, B- becomes C+).\n- If attendance falls below 60%: You receive an 'NP' (Not Passed) grade and must repeat the course.\n- Note: Foundation Programme Studios require 100% attendance; failing 75% in any weekly module results in an NP grade."
    },
    {
      q: "How does the 4.0 GPA and Grading System work?",
      category: "Academics",
      page: 32,
      a: "AU follows a 4.00 GPA system:\n- A = 4.0 (Excellent), A- = 3.7 (Very Good), B+ = 3.3, B = 3.0 (Good), B- = 2.7, C+ = 2.3, C = 2.0 (Fair), D = 1.7 (Sufficient / Minimum Single-course pass), NP = 0.0 (Not Passed).\n- Overall Graduation Requirement: Minimum CGPA of 2.00 out of 4.00 (or 2.70 for PhD).\n- NP Grade: Must repeat the required course. Only the best grade counts toward CGPA, but all attempts appear on transcripts."
    },
    {
      q: "What are the Central Library hours and borrowing limits?",
      category: "Facilities",
      page: 46,
      a: "Library details:\n- Central Library: Open 24 hours Monday to Saturday, 9:00 AM – 6:00 PM on Sundays. During Exam Periods, it is open 24/7.\n- Book Issue/Return: Mon–Sat 9:00 AM – 9:00 PM, Sun 9:00 AM – 5:00 PM.\n- Borrowing Limit: UG/PG students can borrow 2 books for 14 days; Doctoral students can borrow 10 books for 1 month.\n- Reading Rooms: SAS and East Campus reading rooms open 9:00 AM – 6:00 PM on weekdays."
    },
    {
      q: "How does Add Week and Drop Month work for courses?",
      category: "Academics",
      page: 28,
      a: "During the first month of classes (Add Week and Drop Month), students can attend classes to explore courses and switch/drop registered courses without penalty. After the Drop Month ends, courses cannot be dropped except under special approval from the Dean."
    },
    {
      q: "What is the Independent Study Period (ISP)?",
      category: "Student Life",
      page: 38,
      a: "ISP is a unique mini-term running from December 10, 2026 to January 3, 2027. It offers experiential, studio-mode courses in an 8-hour/day, 15-consecutive-day format where students explore passions beyond their major (e.g. arts, research projects, specialized skills) culminating in an Expo."
    },
    {
      q: "How do I create my APAAR / ABC (Academic Bank of Credits) ID?",
      category: "Academics",
      page: 27,
      a: "Steps to create APAAR/ABC ID:\n1. Log in to DigiLocker (digilocker.gov.in).\n2. Search 'Academic Bank of Credits' under Education & Learning.\n3. Select APAAR ID / ABC ID.\n4. Enter Identity Type: Enrolment Number.\n5. Enter Identity Value: Your AU Enrollment Number (e.g., AU2410999) & Year of Admission.\n6. Select Institute: 'Ahmedabad University' and click Get Document."
    },
    {
      q: "Where is the University Health Centre and Doctor located?",
      category: "Health & Emergency",
      page: 60,
      a: "The University Health Centre is on the 1st Floor of the University Centre (UC). Open 8:00 AM – 8:00 PM.\n- Dr. Gayatri Raval is available 10:00 AM – 3:00 PM (university.doctor@ahduni.edu.in | +91.079.61911026).\n- Includes a 4-bed infirmary for observation. In emergency, call 24h Security (+91.9998800237) or 108 Ambulance."
    },
    {
      q: "What is the Volunteerism (VOL100) requirement?",
      category: "Academics",
      page: 20,
      a: "All undergraduate students must complete 45 hours of community engagement under VOL100 Engagement with Society (3 credits) as a mandatory graduation requirement, recommended during their first two years."
    }
  ]
};
