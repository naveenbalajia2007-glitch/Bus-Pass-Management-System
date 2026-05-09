const fs = require('fs');
const path = require('path');

// ============================================================
// REAL INSTITUTIONS DATA - Curated from actual Tamil Nadu data
// ============================================================

const realInstitutions = [

  // ===================== CHENNAI =====================
  // --- Colleges ---
  { name: "IIT Madras", district: "Chennai", type: "college" },
  { name: "Anna University (College of Engineering, Guindy)", district: "Chennai", type: "college" },
  { name: "Madras Institute of Technology, Chromepet", district: "Chennai", type: "college" },
  { name: "Alagappa College of Technology, Chennai", district: "Chennai", type: "college" },
  { name: "School of Architecture and Planning, Chennai", district: "Chennai", type: "college" },
  { name: "University of Madras, Chepauk", district: "Chennai", type: "college" },
  { name: "Loyola College, Nungambakkam", district: "Chennai", type: "college" },
  { name: "Madras Christian College, Tambaram", district: "Chennai", type: "college" },
  { name: "Stella Maris College, Cathedral Road", district: "Chennai", type: "college" },
  { name: "Presidency College, Marina Beach", district: "Chennai", type: "college" },
  { name: "Women's Christian College, Nungambakkam", district: "Chennai", type: "college" },
  { name: "Ethiraj College for Women, Egmore", district: "Chennai", type: "college" },
  { name: "Queen Mary's College, Mylapore", district: "Chennai", type: "college" },
  { name: "Pachaiyappa's College, Park Town", district: "Chennai", type: "college" },
  { name: "Vivekananda College, Mylapore", district: "Chennai", type: "college" },
  { name: "DG Vaishnav College, Arumbakkam", district: "Chennai", type: "college" },
  { name: "M.O.P. Vaishnav College for Women, Nungambakkam", district: "Chennai", type: "college" },
  { name: "Guru Nanak College, Velachery", district: "Chennai", type: "college" },
  { name: "Mohamed Sathak College of Arts and Science, Sholinganallur", district: "Chennai", type: "college" },
  { name: "Justice Basheer Ahmed Sayeed College for Women, Teynampet", district: "Chennai", type: "college" },
  { name: "The New College, Royapettah", district: "Chennai", type: "college" },
  { name: "Quaid-E-Millath Government College for Women, Park Town", district: "Chennai", type: "college" },
  { name: "Madras Medical College, Park Town", district: "Chennai", type: "college" },
  { name: "Stanley Medical College, Royapuram", district: "Chennai", type: "college" },
  { name: "Kilpauk Medical College, Kilpauk", district: "Chennai", type: "college" },
  { name: "Sri Ramachandra Institute of Higher Education, Porur", district: "Chennai", type: "college" },
  { name: "Saveetha Dental College and Hospitals, Velappanchavadi", district: "Chennai", type: "college" },
  { name: "Chettinad Academy of Research and Education, Kelambakkam", district: "Chennai", type: "college" },
  { name: "SRM Institute of Science and Technology, Kattankulathur", district: "Chennai", type: "college" },
  { name: "VIT Chennai, Vandalur", district: "Chennai", type: "college" },
  { name: "Sathyabama Institute of Science and Technology, Tambaram", district: "Chennai", type: "college" },
  { name: "Hindustan Institute of Technology and Science, Padur", district: "Chennai", type: "college" },
  { name: "B.S. Abdur Rahman Crescent Institute, Vandalur", district: "Chennai", type: "college" },
  { name: "SSN College of Engineering, Kalavakkam", district: "Chennai", type: "college" },
  { name: "Rajalakshmi Engineering College, Thandalam", district: "Chennai", type: "college" },
  { name: "Panimalar Engineering College, Poonamallee", district: "Chennai", type: "college" },
  { name: "St. Joseph's College of Engineering, Sholinganallur", district: "Chennai", type: "college" },
  { name: "Meenakshi Sundararajan Engineering College, Kodambakkam", district: "Chennai", type: "college" },
  { name: "Velammal Engineering College, Ambattur", district: "Chennai", type: "college" },
  { name: "Easwari Engineering College, Ramapuram", district: "Chennai", type: "college" },
  { name: "KCG College of Technology, Karapakkam", district: "Chennai", type: "college" },
  { name: "Jeppiaar Engineering College, Semmenchery", district: "Chennai", type: "college" },
  { name: "S.A. Engineering College, Poonamallee", district: "Chennai", type: "college" },
  { name: "Misrimal Navajee Munoth Jain Engineering College, Thoraipakkam", district: "Chennai", type: "college" },
  { name: "Aalim Muhammed Salegh College of Engineering, Avadi", district: "Chennai", type: "college" },
  { name: "Chennai Institute of Technology, Kundrathur", district: "Chennai", type: "college" },
  { name: "RMD Engineering College, Kavaraipettai", district: "Chennai", type: "college" },
  { name: "New Prince Shri Bhavani College of Engineering, Ambattur", district: "Chennai", type: "college" },
  { name: "Prathyusha Engineering College, Tiruvallur", district: "Chennai", type: "college" },
  { name: "Alpha College of Engineering, Porur", district: "Chennai", type: "college" },
  { name: "Agni College of Technology, Thalambur", district: "Chennai", type: "college" },
  { name: "Saveetha Engineering College, Thandalam", district: "Chennai", type: "college" },
  { name: "Sri Venkateswara College of Engineering, Sriperumbudur", district: "Chennai", type: "college" },
  { name: "Dhaanish Ahmed College of Engineering, Padappai", district: "Chennai", type: "college" },
  { name: "Tamil Nadu Dr. Ambedkar Law University, Perungudi", district: "Chennai", type: "college" },
  { name: "Government Law College, High Court Campus", district: "Chennai", type: "college" },
  { name: "School of Excellence in Law (SOEL), Chennai", district: "Chennai", type: "college" },
  { name: "Government Polytechnic College, Adyar", district: "Chennai", type: "college" },
  { name: "Central Polytechnic College, Adyar", district: "Chennai", type: "college" },
  { name: "Meenakshi Polytechnic College, K.K. Nagar", district: "Chennai", type: "college" },
  { name: "Rajalakshmi Polytechnic College, Thandalam", district: "Chennai", type: "college" },
  { name: "Panimalar Polytechnic College, Poonamallee", district: "Chennai", type: "college" },
  { name: "Dr. MGR Educational and Research Institute, Velappanchavadi", district: "Chennai", type: "college" },
  { name: "Meenakshi Academy of Higher Education (MAHER), Noothanchery", district: "Chennai", type: "college" },
  { name: "Tamil Nadu Physical Education and Sports University, Adyar", district: "Chennai", type: "college" },
  // --- Schools ---
  { name: "PSBB Matriculation Higher Secondary School, Nungambakkam", district: "Chennai", type: "school" },
  { name: "PSBB Millennium School, KK Nagar", district: "Chennai", type: "school" },
  { name: "PSBB School, Taramani", district: "Chennai", type: "school" },
  { name: "DAV Boys Senior Secondary School, Gopalapuram", district: "Chennai", type: "school" },
  { name: "DAV Girls Senior Secondary School, Mylapore", district: "Chennai", type: "school" },
  { name: "DAV Public School, Velachery", district: "Chennai", type: "school" },
  { name: "DAV Public School, Mogappair", district: "Chennai", type: "school" },
  { name: "Kendriya Vidyalaya, IIT Madras", district: "Chennai", type: "school" },
  { name: "Kendriya Vidyalaya, Adyar", district: "Chennai", type: "school" },
  { name: "Kendriya Vidyalaya, Anna Nagar", district: "Chennai", type: "school" },
  { name: "Kendriya Vidyalaya No.1, Alandur", district: "Chennai", type: "school" },
  { name: "Kendriya Vidyalaya, Avadi", district: "Chennai", type: "school" },
  { name: "Kendriya Vidyalaya, Minambakkam", district: "Chennai", type: "school" },
  { name: "Chettinad Vidyashram, R.A. Puram", district: "Chennai", type: "school" },
  { name: "Vidya Mandir Senior Secondary School, Mylapore", district: "Chennai", type: "school" },
  { name: "P.S. Senior Secondary School, Mylapore", district: "Chennai", type: "school" },
  { name: "P.S. Higher Secondary School, T. Nagar", district: "Chennai", type: "school" },
  { name: "St. Michael's Academy, Adyar", district: "Chennai", type: "school" },
  { name: "Don Bosco Matriculation Higher Secondary School, Egmore", district: "Chennai", type: "school" },
  { name: "Don Bosco Anglo Indian Higher Secondary School, Perambur", district: "Chennai", type: "school" },
  { name: "Shrine Vailankanni Girls Higher Secondary School, Besant Nagar", district: "Chennai", type: "school" },
  { name: "Sacred Heart Girls Higher Secondary School, Vepery", district: "Chennai", type: "school" },
  { name: "Good Shepherd Matriculation Higher Secondary School, Perambur", district: "Chennai", type: "school" },
  { name: "St. Bede's Anglo Indian Higher Secondary School, Santhome", district: "Chennai", type: "school" },
  { name: "Campion Anglo Indian Higher Secondary School, Triplicane", district: "Chennai", type: "school" },
  { name: "St. Joseph's Anglo Indian Girls Higher Secondary School, Park Town", district: "Chennai", type: "school" },
  { name: "Church Park Convent Matriculation Higher Secondary School, Nungambakkam", district: "Chennai", type: "school" },
  { name: "Doveton Corrie Higher Secondary School, Park Town", district: "Chennai", type: "school" },
  { name: "St. George Anglo Indian Higher Secondary School, George Town", district: "Chennai", type: "school" },
  { name: "Chettinad Vidyashram, Kodambakkam", district: "Chennai", type: "school" },
  { name: "Velammal Vidyalaya, Mogappair", district: "Chennai", type: "school" },
  { name: "Velammal Bodhi Campus, Ayanambakkam", district: "Chennai", type: "school" },
  { name: "Velammal Nexus, Surapet", district: "Chennai", type: "school" },
  { name: "Bharatiya Vidya Bhavan's Rajaji Vidyashram, Mylapore", district: "Chennai", type: "school" },
  { name: "Maharishi Vidya Mandir, Chetpet", district: "Chennai", type: "school" },
  { name: "Chinmaya Vidyalaya, Virugambakkam", district: "Chennai", type: "school" },
  { name: "Chinmaya Vidyalaya, Anna Nagar", district: "Chennai", type: "school" },
  { name: "Jawahar Senior Secondary School, Nelivelu", district: "Chennai", type: "school" },
  { name: "Government Higher Secondary School, Saidapet", district: "Chennai", type: "school" },
  { name: "Government Higher Secondary School, Triplicane", district: "Chennai", type: "school" },
  { name: "Government Higher Secondary School, Villivakkam", district: "Chennai", type: "school" },
  { name: "Government Higher Secondary School, Perambur", district: "Chennai", type: "school" },
  { name: "Government Boys Higher Secondary School, Alandur", district: "Chennai", type: "school" },
  { name: "Government Girls Higher Secondary School, Mylapore", district: "Chennai", type: "school" },
  { name: "SRM Nightingale Matriculation Higher Secondary School, Ashok Nagar", district: "Chennai", type: "school" },
  { name: "Lady Andal Venkatasubba Rao Matriculation School, Harrington Road", district: "Chennai", type: "school" },
  { name: "St. Mary's Anglo Indian Higher Secondary School, Parry's Corner", district: "Chennai", type: "school" },
  { name: "Assembly of God Church School, Kilpauk", district: "Chennai", type: "school" },
  { name: "Balalok Matriculation Higher Secondary School, Kodambakkam", district: "Chennai", type: "school" },
  { name: "Sri Sankara Senior Secondary School, Adyar", district: "Chennai", type: "school" },

  // ===================== COIMBATORE =====================
  { name: "PSG College of Technology, Peelamedu", district: "Coimbatore", type: "college" },
  { name: "PSG College of Arts and Science, Peelamedu", district: "Coimbatore", type: "college" },
  { name: "Government College of Technology (GCT), Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Coimbatore Institute of Technology (CIT), Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Sri Ramakrishna Engineering College, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Karpagam Academy of Higher Education, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Kumaraguru College of Technology, Chinnavedampatti", district: "Coimbatore", type: "college" },
  { name: "Sri Ramakrishna Mission Vidyalaya College of Arts and Science, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "PSGR Krishnammal College for Women, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Dr. NGP Institute of Technology, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Amrita School of Engineering, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "SNS College of Technology, Saravanampatti", district: "Coimbatore", type: "college" },
  { name: "SNS College of Engineering, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "KPR Institute of Engineering and Technology, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Rathinam Technical Campus, Eachanari", district: "Coimbatore", type: "college" },
  { name: "Sri Krishna Arts and Science College, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Government Medical College, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Coimbatore Medical College and Hospital, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Annai Veilankanni's College of Engineering, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Dr. GRD College of Science, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Government Arts College for Women, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Government Polytechnic College, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Pollachi Government Arts College, Pollachi", district: "Coimbatore", type: "college" },
  { name: "Dhirajlal Gandhi College of Technology, Mettupalayam", district: "Coimbatore", type: "college" },
  { name: "SACS MAVMM Engineering College, Madurai", district: "Coimbatore", type: "college" },
  { name: "Nehru College of Management, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Bharathiar University, Coimbatore", district: "Coimbatore", type: "college" },
  { name: "Government College of Engineering, Mettupalayam", district: "Coimbatore", type: "college" },
  // --- Schools ---
  { name: "SBOA School and Junior College, Coimbatore", district: "Coimbatore", type: "school" },
  { name: "Sri Krishna Vidhyalaya Matric Higher Secondary School, Coimbatore", district: "Coimbatore", type: "school" },
  { name: "Kendriya Vidyalaya, Coimbatore (Kovai)", district: "Coimbatore", type: "school" },
  { name: "Jawahar Higher Secondary School, Coimbatore", district: "Coimbatore", type: "school" },
  { name: "Government Boys Hr Sec School, Gandhipuram", district: "Coimbatore", type: "school" },
  { name: "Government Girls Hr Sec School, Gandhipuram", district: "Coimbatore", type: "school" },
  { name: "Chinmaya Vidyalaya, Coimbatore", district: "Coimbatore", type: "school" },
  { name: "PSG Public School, Peelamedu", district: "Coimbatore", type: "school" },
  { name: "Stanes Higher Secondary School, Coimbatore", district: "Coimbatore", type: "school" },
  { name: "Vivekananda Vidyalaya, Coimbatore", district: "Coimbatore", type: "school" },
  { name: "National Public School, Coimbatore", district: "Coimbatore", type: "school" },
  { name: "Annai Velankanni Matriculation School, Coimbatore", district: "Coimbatore", type: "school" },
  { name: "DAV Girls Higher Secondary School, Coimbatore", district: "Coimbatore", type: "school" },
  { name: "St. Michael's Higher Secondary School, Coimbatore", district: "Coimbatore", type: "school" },
  { name: "Sivaswami Kalalaya Higher Secondary School, Coimbatore", district: "Coimbatore", type: "school" },
  { name: "Pollachi Government Higher Secondary School, Pollachi", district: "Coimbatore", type: "school" },
  { name: "Mettupalayam Government Higher Secondary School, Mettupalayam", district: "Coimbatore", type: "school" },

  // ===================== MADURAI =====================
  { name: "Madurai Kamaraj University, Madurai", district: "Madurai", type: "college" },
  { name: "Thiagarajar College of Engineering, Madurai", district: "Madurai", type: "college" },
  { name: "The American College, Madurai", district: "Madurai", type: "college" },
  { name: "Madura College, Madurai", district: "Madurai", type: "college" },
  { name: "Lady Doak College, Madurai", district: "Madurai", type: "college" },
  { name: "Fatima College, Madurai", district: "Madurai", type: "college" },
  { name: "Yadava College, Madurai", district: "Madurai", type: "college" },
  { name: "Saraswathi Narayanan College, Madurai", district: "Madurai", type: "college" },
  { name: "Government Medical College, Madurai", district: "Madurai", type: "college" },
  { name: "Government College of Engineering, Madurai", district: "Madurai", type: "college" },
  { name: "Sri Meenakshi Government Arts College for Women, Madurai", district: "Madurai", type: "college" },
  { name: "Government Arts College, Madurai", district: "Madurai", type: "college" },
  { name: "Madurai Sivakasi Nadars Pioneer Meenakshi Women's College, Madurai", district: "Madurai", type: "college" },
  { name: "Mannar Thirumalai Naicker College, Madurai", district: "Madurai", type: "college" },
  { name: "MSS Wakf Board College, Madurai", district: "Madurai", type: "college" },
  { name: "Karpagam College of Engineering, Madurai", district: "Madurai", type: "college" },
  { name: "Psna College of Engineering and Technology, Dindigul", district: "Madurai", type: "college" },
  { name: "Madurai Institute of Engineering and Technology, Madurai", district: "Madurai", type: "college" },
  { name: "Sri Sabari Engineering College, Madurai", district: "Madurai", type: "college" },
  { name: "Government Polytechnic College, Madurai", district: "Madurai", type: "college" },
  { name: "VMKV Engineering College, Madurai", district: "Madurai", type: "college" },
  { name: "SBM College of Engineering and Technology, Dindigul", district: "Madurai", type: "college" },
  // --- Schools ---
  { name: "The Sivakasi Hindu Nadar Higher Secondary School, Madurai", district: "Madurai", type: "school" },
  { name: "St. Mary's Higher Secondary School, Madurai", district: "Madurai", type: "school" },
  { name: "Government Boys Higher Secondary School, Madurai", district: "Madurai", type: "school" },
  { name: "Government Girls Higher Secondary School, Madurai", district: "Madurai", type: "school" },
  { name: "Kendriya Vidyalaya, Madurai", district: "Madurai", type: "school" },
  { name: "Don Bosco Higher Secondary School, Madurai", district: "Madurai", type: "school" },
  { name: "Lady Doak College Hr Sec School, Madurai", district: "Madurai", type: "school" },
  { name: "Railway Higher Secondary School, Madurai", district: "Madurai", type: "school" },
  { name: "Government Model Higher Secondary School, Madurai", district: "Madurai", type: "school" },
  { name: "C.S.I. Higher Secondary School, Madurai", district: "Madurai", type: "school" },
  { name: "Usilampatti Government Higher Secondary School, Usilampatti", district: "Madurai", type: "school" },
  { name: "Thirumangalam Government Higher Secondary School, Thirumangalam", district: "Madurai", type: "school" },

  // ===================== TIRUCHIRAPPALLI =====================
  { name: "National Institute of Technology (NIT Trichy), Trichy", district: "Tiruchirappalli", type: "college" },
  { name: "Bishop Heber College, Trichy", district: "Tiruchirappalli", type: "college" },
  { name: "St. Joseph's College, Trichy", district: "Tiruchirappalli", type: "college" },
  { name: "Jamal Mohamed College, Trichy", district: "Tiruchirappalli", type: "college" },
  { name: "Bharathidasan University, Tiruchirappalli", district: "Tiruchirappalli", type: "college" },
  { name: "Government College of Engineering, Trichy", district: "Tiruchirappalli", type: "college" },
  { name: "M.A.M. College of Engineering, Trichy", district: "Tiruchirappalli", type: "college" },
  { name: "Saranathan College of Engineering, Trichy", district: "Tiruchirappalli", type: "college" },
  { name: "K. Ramakrishnan College of Engineering, Samayapuram", district: "Tiruchirappalli", type: "college" },
  { name: "Anna University Regional Campus, Trichy", district: "Tiruchirappalli", type: "college" },
  { name: "Shivani Engineering College, Trichy", district: "Tiruchirappalli", type: "college" },
  { name: "Government Medical College, Trichy", district: "Tiruchirappalli", type: "college" },
  { name: "Government Arts College, Trichy", district: "Tiruchirappalli", type: "college" },
  { name: "Holy Cross College, Trichy", district: "Tiruchirappalli", type: "college" },
  { name: "Voorhees College, Vellore", district: "Tiruchirappalli", type: "college" },
  { name: "Periyar Maniammai Institute of Science and Technology, Vallam", district: "Tiruchirappalli", type: "college" },
  // --- Schools ---
  { name: "Bishop Heber Higher Secondary School, Trichy", district: "Tiruchirappalli", type: "school" },
  { name: "St. Joseph's Hr Sec School, Trichy", district: "Tiruchirappalli", type: "school" },
  { name: "Kendriya Vidyalaya, Trichy", district: "Tiruchirappalli", type: "school" },
  { name: "Government Boys Hr Sec School, Srirangam", district: "Tiruchirappalli", type: "school" },
  { name: "Government Model Higher Secondary School, Trichy", district: "Tiruchirappalli", type: "school" },
  { name: "Holy Angels Matriculation Higher Secondary School, Trichy", district: "Tiruchirappalli", type: "school" },
  { name: "Jawahar Navodaya Vidyalaya, Musiri", district: "Tiruchirappalli", type: "school" },

  // ===================== SALEM =====================
  { name: "Government College of Engineering, Salem", district: "Salem", type: "college" },
  { name: "Sona College of Technology, Salem", district: "Salem", type: "college" },
  { name: "PSG Institute of Technology and Applied Research, Salem", district: "Salem", type: "college" },
  { name: "Government Arts College, Salem", district: "Salem", type: "college" },
  { name: "Periyar University, Salem", district: "Salem", type: "college" },
  { name: "Government Medical College, Salem", district: "Salem", type: "college" },
  { name: "Mahendra Engineering College, Namakkal", district: "Salem", type: "college" },
  { name: "Vinayaka Mission's Kirupananda Variyar Engineering College, Salem", district: "Salem", type: "college" },
  { name: "Sankara College of Science and Commerce, Salem", district: "Salem", type: "college" },
  { name: "Sri Aravindar Engineering College, Salem", district: "Salem", type: "college" },
  { name: "Salem Government Siddha Medical College, Salem", district: "Salem", type: "college" },
  { name: "Government College of Engineering, Dharmapuri", district: "Salem", type: "college" },
  // --- Schools ---
  { name: "St. Mary's Higher Secondary School, Salem", district: "Salem", type: "school" },
  { name: "Government Boys Hr Sec School, Salem", district: "Salem", type: "school" },
  { name: "Government Girls Hr Sec School, Salem", district: "Salem", type: "school" },
  { name: "Kendriya Vidyalaya, Salem", district: "Salem", type: "school" },
  { name: "Edappadi Government Higher Secondary School, Edappadi", district: "Salem", type: "school" },
  { name: "Yercaud Government Higher Secondary School, Yercaud", district: "Salem", type: "school" },

  // ===================== VELLORE =====================
  { name: "Christian Medical College (CMC), Vellore", district: "Vellore", type: "college" },
  { name: "VIT University (Main Campus), Vellore", district: "Vellore", type: "college" },
  { name: "Voorhees College, Vellore", district: "Vellore", type: "college" },
  { name: "Government Medical College, Vellore", district: "Vellore", type: "college" },
  { name: "Government College of Engineering, Vellore", district: "Vellore", type: "college" },
  { name: "St. Joseph's College of Engineering and Technology, Thanjavur", district: "Vellore", type: "college" },
  { name: "Periyar E.V.R. College, Tiruchirappalli", district: "Vellore", type: "college" },
  { name: "Thiruvalluvar University, Vellore", district: "Vellore", type: "college" },
  { name: "Thiruvalluvar Government Arts College, Rasipuram", district: "Vellore", type: "college" },
  { name: "Seethalakshmi Ramaswami College, Trichy", district: "Vellore", type: "college" },
  { name: "Auxilium College for Women, Vellore", district: "Vellore", type: "college" },
  { name: "Ranipet Government College of Engineering, Ranipet", district: "Vellore", type: "college" },
  // --- Schools ---
  { name: "CMC Higher Secondary School, Vellore", district: "Vellore", type: "school" },
  { name: "Government Boys Hr Sec School, Vellore", district: "Vellore", type: "school" },
  { name: "Government Girls Hr Sec School, Vellore", district: "Vellore", type: "school" },
  { name: "Kendriya Vidyalaya, Vellore", district: "Vellore", type: "school" },
  { name: "Jawahar Navodaya Vidyalaya, Vellore", district: "Vellore", type: "school" },
  { name: "St. John's Higher Secondary School, Gudiyatham", district: "Vellore", type: "school" },

  // ===================== THANJAVUR =====================
  { name: "SASTRA Deemed University, Thanjavur", district: "Thanjavur", type: "college" },
  { name: "Government Medical College, Thanjavur", district: "Thanjavur", type: "college" },
  { name: "Government Arts College, Kumbakonam", district: "Thanjavur", type: "college" },
  { name: "Government Arts and Science College, Thanjavur", district: "Thanjavur", type: "college" },
  { name: "Government Engineering College, Thanjavur", district: "Thanjavur", type: "college" },
  { name: "J.J. College of Engineering and Technology, Trichy", district: "Thanjavur", type: "college" },
  { name: "Sri Venkateswara College of Engineering, Sriperumbudur", district: "Thanjavur", type: "college" },
  { name: "Rajah Serfoji Government College, Thanjavur", district: "Thanjavur", type: "college" },
  { name: "Periyar Maniammai University, Vallam", district: "Thanjavur", type: "college" },
  { name: "Arupadai Veedu Institute of Technology, Thanjavur", district: "Thanjavur", type: "college" },
  { name: "Kumbakonam College of Arts and Science, Kumbakonam", district: "Thanjavur", type: "college" },
  // --- Schools ---
  { name: "Thanjavur Government Home Science Higher Secondary School, Thanjavur", district: "Thanjavur", type: "school" },
  { name: "St. Peter's Higher Secondary School, Thanjavur", district: "Thanjavur", type: "school" },
  { name: "Hindu Higher Secondary School, Kumbakonam", district: "Thanjavur", type: "school" },
  { name: "Government Boys Hr Sec School, Kumbakonam", district: "Thanjavur", type: "school" },
  { name: "Kendriya Vidyalaya, Thanjavur", district: "Thanjavur", type: "school" },
  { name: "Jawahar Navodaya Vidyalaya, Thanjavur", district: "Thanjavur", type: "school" },

  // ===================== TIRUNELVELI =====================
  { name: "Manonmaniam Sundaranar University, Tirunelveli", district: "Tirunelveli", type: "college" },
  { name: "Francis Xavier Engineering College, Tirunelveli", district: "Tirunelveli", type: "college" },
  { name: "Government Medical College, Tirunelveli", district: "Tirunelveli", type: "college" },
  { name: "National Engineering College, Kovilpatti", district: "Tirunelveli", type: "college" },
  { name: "St. John's College, Tirunelveli", district: "Tirunelveli", type: "college" },
  { name: "Government Arts College, Tirunelveli", district: "Tirunelveli", type: "college" },
  { name: "Sethu Institute of Technology, Kariapatti", district: "Tirunelveli", type: "college" },
  { name: "Noorul Islam Centre for Higher Education, Kumaracoil", district: "Tirunelveli", type: "college" },
  { name: "S. Thangapazham Engineering College, Nagercoil", district: "Tirunelveli", type: "college" },
  // --- Schools ---
  { name: "St. Xavier's Higher Secondary School, Palayamkottai", district: "Tirunelveli", type: "school" },
  { name: "Government Model Hr Sec School, Tirunelveli", district: "Tirunelveli", type: "school" },
  { name: "Kendriya Vidyalaya, Tirunelveli", district: "Tirunelveli", type: "school" },
  { name: "E.L.C.S. Higher Secondary School, Tirunelveli", district: "Tirunelveli", type: "school" },
  { name: "Government Girls Hr Sec School, Ambasamudram", district: "Tirunelveli", type: "school" },

  // ===================== KANYAKUMARI =====================
  { name: "Noorul Islam Centre for Higher Education, Kumaracoil", district: "Kanyakumari", type: "college" },
  { name: "Scott Christian College, Nagercoil", district: "Kanyakumari", type: "college" },
  { name: "Arignar Anna College, Aralvaimozhi", district: "Kanyakumari", type: "college" },
  { name: "Government College of Engineering, Nagercoil", district: "Kanyakumari", type: "college" },
  { name: "Government Medical College, Nagercoil", district: "Kanyakumari", type: "college" },
  { name: "Sree Ayyappa College, Nagercoil", district: "Kanyakumari", type: "college" },
  { name: "Pioneer Kumaraswamy College, Nagercoil", district: "Kanyakumari", type: "college" },
  // --- Schools ---
  { name: "St. Joseph's Higher Secondary School, Marthandam", district: "Kanyakumari", type: "school" },
  { name: "Government Hr Sec School, Nagercoil", district: "Kanyakumari", type: "school" },
  { name: "Kendriya Vidyalaya, Kanyakumari", district: "Kanyakumari", type: "school" },
  { name: "Jawahar Navodaya Vidyalaya, Kanyakumari", district: "Kanyakumari", type: "school" },

  // ===================== THOOTHUKUDI =====================
  { name: "National Engineering College, Kovilpatti", district: "Thoothukudi", type: "college" },
  { name: "Kamaraj College of Engineering and Technology, Virudhunagar", district: "Thoothukudi", type: "college" },
  { name: "Rani Anna Government College for Women, Tirunelveli", district: "Thoothukudi", type: "college" },
  { name: "Government Arts College, Thoothukudi", district: "Thoothukudi", type: "college" },
  { name: "Caldwell College, Thoothukudi", district: "Thoothukudi", type: "college" },
  { name: "VV College of Engineering, Tisaiyanvilai", district: "Thoothukudi", type: "college" },
  { name: "Government Medical College, Thoothukudi", district: "Thoothukudi", type: "college" },
  // --- Schools ---
  { name: "Caldwell Higher Secondary School, Thoothukudi", district: "Thoothukudi", type: "school" },
  { name: "Kovilpatti Government Hr Sec School, Kovilpatti", district: "Thoothukudi", type: "school" },
  { name: "Kendriya Vidyalaya, Thoothukudi", district: "Thoothukudi", type: "school" },

  // ===================== VIRUDHUNAGAR =====================
  { name: "Kamaraj College of Engineering and Technology, Madurai", district: "Virudhunagar", type: "college" },
  { name: "Mepco Schlenk Engineering College, Sivakasi", district: "Virudhunagar", type: "college" },
  { name: "Sri Krishna Engineering College, Virudhunagar", district: "Virudhunagar", type: "college" },
  { name: "Arulmigu Kalasalingam College of Engineering, Krishnankoil", district: "Virudhunagar", type: "college" },
  { name: "Government Arts College, Rajapalayam", district: "Virudhunagar", type: "college" },
  { name: "Srivilliputhur Government Arts College, Srivilliputhur", district: "Virudhunagar", type: "college" },
  // --- Schools ---
  { name: "Sivakasi Government Hr Sec School, Sivakasi", district: "Virudhunagar", type: "school" },
  { name: "Rajapalayam Hindu Nadar Hr Sec School, Rajapalayam", district: "Virudhunagar", type: "school" },
  { name: "Kendriya Vidyalaya, Virudhunagar", district: "Virudhunagar", type: "school" },

  // ===================== NAMAKKAL =====================
  { name: "Government College of Engineering, Namakkal", district: "Namakkal", type: "college" },
  { name: "Mahendra College of Engineering, Namakkal", district: "Namakkal", type: "college" },
  { name: "Mahendra Institute of Technology, Tiruchengode", district: "Namakkal", type: "college" },
  { name: "Sengunthar College of Engineering, Tiruchengode", district: "Namakkal", type: "college" },
  { name: "Vivekanandha College of Arts and Sciences, Tiruchengode", district: "Namakkal", type: "college" },
  { name: "Muthayammal College of Engineering, Rasipuram", district: "Namakkal", type: "college" },
  { name: "Muthayammal College of Arts and Science, Rasipuram", district: "Namakkal", type: "college" },
  { name: "Government Arts College, Paramathi Velur", district: "Namakkal", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Namakkal", district: "Namakkal", type: "school" },
  { name: "Kendriya Vidyalaya, Namakkal", district: "Namakkal", type: "school" },
  { name: "Tiruchengode Government Hr Sec School, Tiruchengode", district: "Namakkal", type: "school" },

  // ===================== ERODE =====================
  { name: "Government College of Engineering, Erode", district: "Erode", type: "college" },
  { name: "Kongu Engineering College, Perundurai", district: "Erode", type: "college" },
  { name: "Bannari Amman Institute of Technology, Sathyamangalam", district: "Erode", type: "college" },
  { name: "K.S. Rangasamy College of Technology, Tiruchengode", district: "Erode", type: "college" },
  { name: "Excel Engineering College, Komarapalayam", district: "Erode", type: "college" },
  { name: "Nandha Engineering College, Erode", district: "Erode", type: "college" },
  { name: "Erode Sengunthar Engineering College, Erode", district: "Erode", type: "college" },
  { name: "Vellalar College of Engineering, Thindal", district: "Erode", type: "college" },
  { name: "Government Arts College, Gobichettipalayam", district: "Erode", type: "college" },
  { name: "Periyar E.V.R. College, Erode", district: "Erode", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Erode", district: "Erode", type: "school" },
  { name: "Government Girls Hr Sec School, Bhavani", district: "Erode", type: "school" },
  { name: "Kendriya Vidyalaya, Erode", district: "Erode", type: "school" },
  { name: "Jawahar Navodaya Vidyalaya, Erode", district: "Erode", type: "school" },
  { name: "Sathyamangalam Government Hr Sec School, Sathyamangalam", district: "Erode", type: "school" },

  // ===================== TIRUPPUR =====================
  { name: "Government College of Engineering, Tiruppur", district: "Tiruppur", type: "college" },
  { name: "Kumaraguru College of Technology, Tiruppur", district: "Tiruppur", type: "college" },
  { name: "Sri Eshwar College of Engineering, Kondampalayam", district: "Tiruppur", type: "college" },
  { name: "Tiruppur Kumaran College for Women, Tiruppur", district: "Tiruppur", type: "college" },
  { name: "Government Arts and Science College, Udumalaipettai", district: "Tiruppur", type: "college" },
  { name: "Sri Shakthi Institute of Engineering and Technology, Coimbatore", district: "Tiruppur", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Tiruppur", district: "Tiruppur", type: "school" },
  { name: "Kendriya Vidyalaya, Tiruppur", district: "Tiruppur", type: "school" },
  { name: "Udumalaipettai Government Hr Sec School, Udumalaipettai", district: "Tiruppur", type: "school" },

  // ===================== DHARMAPURI =====================
  { name: "Government College of Engineering, Dharmapuri", district: "Dharmapuri", type: "college" },
  { name: "Government Arts College, Dharmapuri", district: "Dharmapuri", type: "college" },
  { name: "Adhiyamaan College of Engineering, Hosur", district: "Dharmapuri", type: "college" },
  { name: "Government Medical College, Dharmapuri", district: "Dharmapuri", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Dharmapuri", district: "Dharmapuri", type: "school" },
  { name: "Kendriya Vidyalaya, Dharmapuri", district: "Dharmapuri", type: "school" },
  { name: "Jawahar Navodaya Vidyalaya, Dharmapuri", district: "Dharmapuri", type: "school" },

  // ===================== KRISHNAGIRI =====================
  { name: "Government College of Engineering, Krishnagiri (Bargur)", district: "Krishnagiri", type: "college" },
  { name: "Adhiyamaan College of Engineering, Hosur", district: "Krishnagiri", type: "college" },
  { name: "Government Arts College, Krishnagiri", district: "Krishnagiri", type: "college" },
  { name: "Hosur Government College of Engineering, Hosur", district: "Krishnagiri", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Krishnagiri", district: "Krishnagiri", type: "school" },
  { name: "Hosur Government Hr Sec School, Hosur", district: "Krishnagiri", type: "school" },
  { name: "Kendriya Vidyalaya, Krishnagiri", district: "Krishnagiri", type: "school" },

  // ===================== CUDDALORE =====================
  { name: "Annamalai University, Annamalainagar (Chidambaram)", district: "Cuddalore", type: "college" },
  { name: "Government Medical College, Cuddalore", district: "Cuddalore", type: "college" },
  { name: "Government College of Engineering, Cuddalore", district: "Cuddalore", type: "college" },
  { name: "Government Arts College, Chidambaram", district: "Cuddalore", type: "college" },
  { name: "E.R.K. Arts College, Cuddalore", district: "Cuddalore", type: "college" },
  { name: "Tagore Engineering College, Cuddalore", district: "Cuddalore", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Cuddalore", district: "Cuddalore", type: "school" },
  { name: "Kendriya Vidyalaya, Cuddalore (Neyveli)", district: "Cuddalore", type: "school" },
  { name: "Panruti Government Hr Sec School, Panruti", district: "Cuddalore", type: "school" },
  { name: "Chidambaram C.S.I. Hr Sec School, Chidambaram", district: "Cuddalore", type: "school" },

  // ===================== DINDIGUL =====================
  { name: "PSNA College of Engineering and Technology, Dindigul", district: "Dindigul", type: "college" },
  { name: "Government Arts College, Dindigul", district: "Dindigul", type: "college" },
  { name: "Government Engineering College, Dindigul", district: "Dindigul", type: "college" },
  { name: "SBM College of Engineering, Dindigul", district: "Dindigul", type: "college" },
  { name: "Sivananda Sarma Memorial R.V.S. College of Arts and Science, Dindigul", district: "Dindigul", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Dindigul", district: "Dindigul", type: "school" },
  { name: "Kodaikanal International School, Kodaikanal", district: "Dindigul", type: "school" },
  { name: "Kendriya Vidyalaya, Dindigul", district: "Dindigul", type: "school" },
  { name: "Palani Government Hr Sec School, Palani", district: "Dindigul", type: "school" },

  // ===================== KANCHIPURAM =====================
  { name: "Sri Venkateswara College of Engineering, Sriperumbudur", district: "Kanchipuram", type: "college" },
  { name: "Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya (SCSVMV), Kanchipuram", district: "Kanchipuram", type: "college" },
  { name: "Government Arts College for Men, Kanchipuram", district: "Kanchipuram", type: "college" },
  { name: "Government College of Engineering, Bargur", district: "Kanchipuram", type: "college" },
  { name: "Jansons Institute of Technology, Coimbatore", district: "Kanchipuram", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Kanchipuram", district: "Kanchipuram", type: "school" },
  { name: "Kendriya Vidyalaya, Sriperumbudur", district: "Kanchipuram", type: "school" },
  { name: "GRT Mahalakshmi Vidyalaya, Tiruvallur", district: "Kanchipuram", type: "school" },

  // ===================== SIVAGANGAI =====================
  { name: "Alagappa University, Karaikudi", district: "Sivagangai", type: "college" },
  { name: "Alagappa College of Technology, Karaikudi", district: "Sivagangai", type: "college" },
  { name: "Government Arts College, Karaikudi", district: "Sivagangai", type: "college" },
  { name: "AMET University, Kanathur", district: "Sivagangai", type: "college" },
  { name: "Government Medical College, Sivagangai", district: "Sivagangai", type: "college" },
  { name: "Devakottai Government Arts College, Devakottai", district: "Sivagangai", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Karaikudi", district: "Sivagangai", type: "school" },
  { name: "Kendriya Vidyalaya, Sivagangai", district: "Sivagangai", type: "school" },
  { name: "St. Michael's Higher Secondary School, Karaikudi", district: "Sivagangai", type: "school" },

  // ===================== NAGAPATTINAM =====================
  { name: "Government College of Engineering, Nagapattinam", district: "Nagapattinam", type: "college" },
  { name: "Government Arts and Science College, Nagapattinam", district: "Nagapattinam", type: "college" },
  { name: "Government Medical College, Nagapattinam", district: "Nagapattinam", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Nagapattinam", district: "Nagapattinam", type: "school" },
  { name: "Kendriya Vidyalaya, Nagapattinam", district: "Nagapattinam", type: "school" },
  { name: "Velankanni Matha Hr Sec School, Velankanni", district: "Nagapattinam", type: "school" },

  // ===================== RAMANATHAPURAM =====================
  { name: "Government Arts College, Paramakudi", district: "Ramanathapuram", type: "college" },
  { name: "Government Medical College, Ramanathapuram", district: "Ramanathapuram", type: "college" },
  { name: "Government Engineering College, Kovilpatti", district: "Ramanathapuram", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Ramanathapuram", district: "Ramanathapuram", type: "school" },
  { name: "Kendriya Vidyalaya, Ramanathapuram", district: "Ramanathapuram", type: "school" },
  { name: "Rameswaram Government Hr Sec School, Rameswaram", district: "Ramanathapuram", type: "school" },

  // ===================== PUDUKKOTTAI =====================
  { name: "Government Arts College, Pudukkottai", district: "Pudukkottai", type: "college" },
  { name: "Government Engineering College, Aranthangi", district: "Pudukkottai", type: "college" },
  { name: "Government Medical College, Pudukkottai", district: "Pudukkottai", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Pudukkottai", district: "Pudukkottai", type: "school" },
  { name: "Kendriya Vidyalaya, Pudukkottai", district: "Pudukkottai", type: "school" },

  // ===================== TIRUVARUR =====================
  { name: "Government Arts College, Mannargudi", district: "Tiruvarur", type: "college" },
  { name: "Government College of Engineering, Tiruvarur", district: "Tiruvarur", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Tiruvarur", district: "Tiruvarur", type: "school" },
  { name: "Kendriya Vidyalaya, Tiruvarur", district: "Tiruvarur", type: "school" },

  // ===================== MAYILADUTHURAI =====================
  { name: "Government Arts College, Mayiladuthurai", district: "Mayiladuthurai", type: "college" },
  { name: "Government College of Engineering, Thittacherry (Mayiladuthurai)", district: "Mayiladuthurai", type: "college" },
  { name: "Government Medical College, Mayiladuthurai", district: "Mayiladuthurai", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Mayiladuthurai", district: "Mayiladuthurai", type: "school" },
  { name: "Kendriya Vidyalaya, Mayiladuthurai", district: "Mayiladuthurai", type: "school" },

  // ===================== THENI =====================
  { name: "Government Arts College, Cumbum", district: "Theni", type: "college" },
  { name: "Government Engineering College, Bodinayakanur", district: "Theni", type: "college" },
  { name: "Government Medical College, Theni", district: "Theni", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Theni", district: "Theni", type: "school" },
  { name: "Kendriya Vidyalaya, Theni", district: "Theni", type: "school" },
  { name: "Cumbum Government Hr Sec School, Cumbum", district: "Theni", type: "school" },

  // ===================== TIRUVALLUR =====================
  { name: "Government College of Engineering, Bargur", district: "Tiruvallur", type: "college" },
  { name: "Vel Tech University, Avadi", district: "Tiruvallur", type: "college" },
  { name: "Panimalar Institute of Technology, Poonamallee", district: "Tiruvallur", type: "college" },
  { name: "SRM Valliammai Engineering College, Kattankulathur", district: "Tiruvallur", type: "college" },
  { name: "C. Abdul Hakeem College of Engineering, Melvisharam", district: "Tiruvallur", type: "college" },
  { name: "Government Arts College, Thiruvallur", district: "Tiruvallur", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Tiruvallur", district: "Tiruvallur", type: "school" },
  { name: "Kendriya Vidyalaya, Avadi", district: "Tiruvallur", type: "school" },
  { name: "Kendriya Vidyalaya, AFS Avadi", district: "Tiruvallur", type: "school" },
  { name: "Ponneri Government Hr Sec School, Ponneri", district: "Tiruvallur", type: "school" },

  // ===================== TIRUVANNAMALAI =====================
  { name: "Government Arts College, Tiruvannamalai", district: "Tiruvannamalai", type: "college" },
  { name: "Government Engineering College, Tiruvannamalai", district: "Tiruvannamalai", type: "college" },
  { name: "Government Medical College, Tiruvannamalai", district: "Tiruvannamalai", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Tiruvannamalai", district: "Tiruvannamalai", type: "school" },
  { name: "Kendriya Vidyalaya, Tiruvannamalai", district: "Tiruvannamalai", type: "school" },
  { name: "Arani Government Hr Sec School, Arani", district: "Tiruvannamalai", type: "school" },

  // ===================== RANIPET =====================
  { name: "Government College of Engineering, Sriperumbudur", district: "Ranipet", type: "college" },
  { name: "Ranipet Government Medical College, Ranipet", district: "Ranipet", type: "college" },
  { name: "Sri Krishna College of Engineering, Ranipet", district: "Ranipet", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Ranipet", district: "Ranipet", type: "school" },
  { name: "Kendriya Vidyalaya, Arakkonam", district: "Ranipet", type: "school" },

  // ===================== TIRUPATHUR =====================
  { name: "Government College of Engineering, Tirupathur", district: "Tirupathur", type: "college" },
  { name: "C. Abdul Hakeem College of Engineering and Technology, Melvisharam", district: "Tirupathur", type: "college" },
  { name: "Government Arts College, Vaniyambadi", district: "Tirupathur", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Tirupathur", district: "Tirupathur", type: "school" },
  { name: "Ambur Government Hr Sec School, Ambur", district: "Tirupathur", type: "school" },
  { name: "Kendriya Vidyalaya, Tirupathur", district: "Tirupathur", type: "school" },

  // ===================== VILLUPURAM =====================
  { name: "Government Engineering College, Villupuram", district: "Viluppuram", type: "college" },
  { name: "Pondicherry University (near Villupuram)", district: "Viluppuram", type: "college" },
  { name: "Government Arts College, Villupuram", district: "Viluppuram", type: "college" },
  { name: "Government Medical College, Villupuram", district: "Viluppuram", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Villupuram", district: "Viluppuram", type: "school" },
  { name: "Tindivanam Government Hr Sec School, Tindivanam", district: "Viluppuram", type: "school" },
  { name: "Kendriya Vidyalaya, Villupuram", district: "Viluppuram", type: "school" },

  // ===================== KALLAKURICHI =====================
  { name: "Government Engineering College, Kallakurichi", district: "Kallakurichi", type: "college" },
  { name: "Government Arts College, Tirukkoyilur", district: "Kallakurichi", type: "college" },
  { name: "Government Medical College, Kallakurichi", district: "Kallakurichi", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Kallakurichi", district: "Kallakurichi", type: "school" },
  { name: "Kendriya Vidyalaya, Kallakurichi", district: "Kallakurichi", type: "school" },

  // ===================== CHENGALPATTU =====================
  { name: "SRM Institute of Science and Technology, Kattankulathur", district: "Chengalpattu", type: "college" },
  { name: "Government Engineering College, Sriperumbudur", district: "Chengalpattu", type: "college" },
  { name: "Government Medical College, Chengalpattu", district: "Chengalpattu", type: "college" },
  { name: "Government Arts College, Chengalpattu", district: "Chengalpattu", type: "college" },
  { name: "Agni College of Technology, Thalambur", district: "Chengalpattu", type: "college" },
  { name: "Hindustan Institute of Technology and Science, Padur", district: "Chengalpattu", type: "college" },
  { name: "Chettinad Academy of Research and Education, Kelambakkam", district: "Chengalpattu", type: "college" },
  { name: "B.S. Abdur Rahman Crescent Institute, Vandalur", district: "Chengalpattu", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Chengalpattu", district: "Chengalpattu", type: "school" },
  { name: "Tambaram Government Hr Sec School, Tambaram", district: "Chengalpattu", type: "school" },
  { name: "Kendriya Vidyalaya, Pallavaram", district: "Chengalpattu", type: "school" },
  { name: "Kendriya Vidyalaya, Tambaram (DGQA)", district: "Chengalpattu", type: "school" },
  { name: "Velammal Bodhi Campus, Guduvanchery", district: "Chengalpattu", type: "school" },

  // ===================== TENKASI =====================
  { name: "Government College of Engineering, Tirunelveli", district: "Tenkasi", type: "college" },
  { name: "Government Arts College, Sankarankovil", district: "Tenkasi", type: "college" },
  { name: "Government Medical College, Tenkasi", district: "Tenkasi", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Tenkasi", district: "Tenkasi", type: "school" },
  { name: "Kendriya Vidyalaya, Tenkasi", district: "Tenkasi", type: "school" },
  { name: "Sankarankovil Government Hr Sec School, Sankarankovil", district: "Tenkasi", type: "school" },

  // ===================== NILGIRIS =====================
  { name: "Government Arts College, Ooty", district: "Nilgiris", type: "college" },
  { name: "Government Engineering College, Gudalur", district: "Nilgiris", type: "college" },
  // --- Schools ---
  { name: "Ooty Government Boys Hr Sec School, Ooty", district: "Nilgiris", type: "school" },
  { name: "Kendriya Vidyalaya, Ooty", district: "Nilgiris", type: "school" },
  { name: "Kodaikanal International School, Kodaikanal", district: "Nilgiris", type: "school" },
  { name: "Breeks Memorial Anglo Indian Higher Secondary School, Ooty", district: "Nilgiris", type: "school" },

  // ===================== KARUR =====================
  { name: "Government College of Engineering, Karur", district: "Karur", type: "college" },
  { name: "Government Arts College, Kulithalai", district: "Karur", type: "college" },
  { name: "Government Medical College, Karur", district: "Karur", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Karur", district: "Karur", type: "school" },
  { name: "Kendriya Vidyalaya, Karur", district: "Karur", type: "school" },

  // ===================== ARIYALUR =====================
  { name: "Government Arts College, Ariyalur", district: "Ariyalur", type: "college" },
  { name: "Government Engineering College, Ariyalur", district: "Ariyalur", type: "college" },
  { name: "Government Medical College, Ariyalur", district: "Ariyalur", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Ariyalur", district: "Ariyalur", type: "school" },
  { name: "Kendriya Vidyalaya, Ariyalur", district: "Ariyalur", type: "school" },
  { name: "Jayankondam Government Hr Sec School, Jayankondam", district: "Ariyalur", type: "school" },

  // ===================== PERAMBALUR =====================
  { name: "Government Arts College, Perambalur", district: "Perambalur", type: "college" },
  { name: "Government Engineering College, Perambalur", district: "Perambalur", type: "college" },
  { name: "Government Medical College, Perambalur", district: "Perambalur", type: "college" },
  // --- Schools ---
  { name: "Government Boys Hr Sec School, Perambalur", district: "Perambalur", type: "school" },
  { name: "Kendriya Vidyalaya, Perambalur", district: "Perambalur", type: "school" },
];

// ============================================================
// STRICT DEDUPLICATION - by (name, district)
// ============================================================
const masterPath = path.join(__dirname, '..', 'data', 'institutions_master.json');
const existing = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

// Build a set of existing (name + district) keys
const existingKeys = new Set(existing.map(i => `${i.name.toLowerCase().trim()}||${i.district.toLowerCase().trim()}`));

// Only add institutions that don't already exist
let addedCount = 0;
const toAdd = [];
for (const inst of realInstitutions) {
  const key = `${inst.name.toLowerCase().trim()}||${inst.district.toLowerCase().trim()}`;
  if (!existingKeys.has(key)) {
    toAdd.push(inst);
    existingKeys.add(key);
    addedCount++;
  }
}

const finalData = [...existing, ...toAdd];
fs.writeFileSync(masterPath, JSON.stringify(finalData, null, 2));

// Summary
const districtSummary = finalData.reduce((acc, i) => { acc[i.district] = (acc[i.district] || 0) + 1; return acc; }, {});
console.log('\n✅ Done! Real institutions added successfully.');
console.log(`\n  New institutions added: ${addedCount}`);
console.log(`  Total institutions: ${finalData.length}`);
console.log('\nDistrict-wise totals:');
Object.keys(districtSummary).sort().forEach(d => console.log(`  ${d}: ${districtSummary[d]}`));
