window.onerror = function(msg, url, line, col, error){
  try{
    const b = document.getElementById('configBanner');
    if(b){ b.textContent = '⚠ App error: ' + msg + ' (line ' + line + ')'; b.className = 'config-banner'; b.style.display = 'block'; }
  }catch(e){}
  console.error('Global error:', msg, 'at line', line, error);
  return false;
};

window.addEventListener('unhandledrejection', function(event) {
  console.warn('Unhandled Promise Rejection caught:', event.reason);
  finishBoot();
});

/* =======================================================================
   FIREBASE SETUP
   ---------------------------------------------------------------------
   Replace the placeholder values below with your Firebase Project Config.
   ======================================================================= */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const SCHOOL_NAME = "Gyan Dayini Bal Mandir";
const LOGO_DATA_URI = "data:image/png;base64,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" alt="School Logo" style="width:100%;height:100%;object-fit:contain;">
    </div>
    <p class="brand-name">Gyan Dayini Bal Mandir</p>
    <p class="brand-loc">Semrauta, Tiloi, Amethi</p>
    <p class="brand-tag">School Management System</p>

    <div class="field">
      <label for="user">Username</label>
      <input id="user" type="text" placeholder="e.g. admin" autocomplete="off">
    </div>
    <div class="field">
      <label for="pass">Password</label>
      <input id="pass" type="password" placeholder="••••••••" autocomplete="off">
    </div>
    <button class="login-btn" onclick="attemptLogin()">Log In</button>
    <p class="login-msg" id="loginMsg"></p>
    <p style="text-align:center; margin-top:6px;"><a href="#" onclick="showForgotPassword(); return false;" style="font-size:12.5px; color:var(--ink-soft); text-decoration:underline;">Forgot password?</a></p>

    <div class="demo-box">
      <span class="dhead">Demo accounts</span>
      <b>admin</b> / admin123 — Administrator<br>
      <b>teacher1</b> / teach@01 — Teacher<br>
      <b>accounts</b> / fees@2026 — Accountant
    </div>
  </div>
</div>

<!-- ================= APP ================= -->
<div class="app" id="app">
  <div class="sidebar" id="sidebar">
    <div class="side-brand">
      <div class="crest"><img src="data:image/png;base64,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v/Xvd//39d3/4fXffv++/254+vf/9d/9e/+v063vvff9v3950/d73//+97e93///O++/8e5///m753/v//9v+/vf/3m2+/8S/N+u+93//3//4929c3t7//0v3f2/9//f1+v8m3//7b//e/99s2dveefd3//Xfffff/ff85918yP/96f30d3v2f3X///0/++/++/v/fO++/+d+///7e1u1Pveee/f/ve3u3fe++/ff3X///veeeeffvv2f293994p/4I31113r//XvX+/vef3f//994M1/3s/A831a2v32///2ff0//++/f//8u3v3fffb3+5u//b27/+1u3e/d///e/d9ff4G/4b5+p374f/3f82mEa+Iq8v95e99vveeeceeffe95e/++/ffffed//0v3//f/++7//74Hvvff9/+8E84O3m6l81155sYp5+sL2sM6I9X1/xO2x6/o4m8E7eM4X0+q6a/mI1P4f/+/2764fvvf+/229/93s1s/0A4eX3X37xR15f2a1p+p1s315694N2c9pG3P1/9//4r//e/924f/Xvfffvf//995e+e+54+8/+/fe///94/8fXvne4e///ve9/+/O//++e9+///33vff++e+88sO1Pff/fefed//3u5f/9+/d+50/f++f/+v/e+94+sX339///f+//e/7/s2f/8e5u3vve/e34//++514+7P8N9u13s37/v3S2P2/ve/d//ve/ff++/3u5r2d/r/94/w2cO/Xf+I/xPz1l3A==" alt="School Logo" style="width:100%;height:100%;object-fit:contain;"></div>
      <div class="side-brand-text">Gyan Dayini<br>Bal Mandir</div>
    </div>
    <div class="nav-item active" data-view="dashboard"><span class="ic">◆</span><span>Dashboard</span></div>
    <div class="nav-item" data-view="students"><span class="ic">◆</span><span>Students</span></div>
    <div class="nav-item" data-view="alumni"><span class="ic">◆</span><span>Alumni</span></div>
    <div class="nav-item" data-view="attendance"><span class="ic">◆</span><span>Attendance</span></div>
    <div class="nav-item" data-view="staff"><span class="ic">◆</span><span>Staff</span></div>
    <div class="nav-item" data-view="fees"><span class="ic">◆</span><span>Fees</span></div>
    <div class="nav-item" data-view="exams"><span class="ic">◆</span><span>Exams</span></div>
    <div class="nav-item" data-view="timetable"><span class="ic">◆</span><span>Timetable</span></div>
    <div class="nav-item" data-view="transport"><span class="ic">◆</span><span>Transport</span></div>
    <div class="nav-item" data-view="announcements"><span class="ic">◆</span><span>Announcements</span></div>
    <div class="nav-item" data-view="homework"><span class="ic">◆</span><span>Homework</span></div>
    <div class="nav-item" data-view="access"><span class="ic">◆</span><span>User Access</span></div>
    <div class="nav-item" data-view="salary"><span class="ic">◆</span><span>Salary</span></div>
    <div class="nav-item" data-view="settings"><span class="ic">◆</span><span>Settings</span></div>
    <div class="nav-spacer"></div>
    <div class="principal-chip">
      <div class="pc-lbl">Principal</div>
      <div class="pc-name">Mr. Arun Mishra</div>
    </div>
    <div class="logout-item" onclick="doLogout()">Log Out</div>
  </div>
  <div class="sidebar-backdrop" id="sidebarBackdrop" onclick="closeSidebar()"></div>

  <div class="main">
    <div class="topbar">
      <div class="topbar-left">
        <div class="hamburger" id="hamburgerBtn" onclick="toggleSidebar()"><span></span></div>
        <h1 id="viewTitle">Dashboard</h1>
      </div>
      <div style="display:flex; align-items:center; gap:16px;">
        <div class="savebar" id="onlineStatus"><span class="dot"></span><span id="onlineStatusText">Online</span></div>
        <div class="savebar" id="saveBar"><span class="dot"></span><span id="saveBarText">All changes saved</span></div>
        <div class="userchip">
          <div class="avatar" id="avatarInit">A</div>
          <div>
            <div id="chipName" style="font-weight:600;">—</div>
            <div class="role" id="chipRole">—</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content" id="content"></div>
  </div>
</div>

<!-- ================= MODAL ================= -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal-box" id="modalBox"></div>
</div>

<div id="printArea"></div>
<div id="pdfRenderArea" style="position:fixed; left:-9999px; top:0;"></div>

<script src="app.js"></script>
</body>
</html>
    if (navigator.onLine) {
        badge.innerText = "ऑनलाइन";
        badge.className = "status-badge online";
    } else {
        badge.innerText = "ऑफलाइन";
        badge.className = "status-badge offline";
    }
}

// 5. Navigation Logic
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetElement = document.getElementById(`${targetTab}-tab`);
            if (targetElement) targetElement.classList.add('active');
        });
    });
}

// 6. Firestore Student Operations
function setupStudentForms() {
    const studentForm = document.getElementById('add-student-form');
    if (!studentForm) return;

    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('student-name').value.trim();
        const studentClass = document.getElementById('student-class').value.trim();
        const rollNo = parseInt(document.getElementById('student-roll').value.trim(), 10);

        if (!name || !studentClass || isNaN(rollNo)) {
            showToast("कृपया सभी विवरण सही से भरें", true);
            return;
        }

        try {
            await db.collection('students').add({
                name: name,
                class: studentClass,
                rollNo: rollNo,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            showToast("छात्र सफलता पूर्वक जोड़ा गया!");
            studentForm.reset();
        } catch (error) {
            console.error("Add student error:", error);
            showToast("छात्र जोड़ने में त्रुटि: " + error.message, true);
        }
    });
}

// Delete Student
async function deleteStudent(studentId) {
    if (!confirm("क्या आप इस छात्र को हटाना चाहते हैं?")) return;
    try {
        await db.collection('students').doc(studentId).delete();
        showToast("छात्र सूची से हटा दिया गया।");
    } catch (error) {
        console.error("Delete error:", error);
        showToast("हटाने में विफलता: " + error.message, true);
    }
}

// 7. Firestore Real-time Listener (Safe Connection Engine)
function bindRealtimeListeners() {
    db.collection('students').orderBy('rollNo', 'asc')
        .onSnapshot((snapshot) => {
            const listBody = document.getElementById('student-list-body');
            const totalStudentsElem = document.getElementById('total-students');

            if (!listBody) return;

            listBody.innerHTML = '';
            let count = 0;

            snapshot.forEach((doc) => {
                count++;
                const student = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.rollNo}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td>
                        <button class="btn-danger" onclick="deleteStudent('${doc.id}')">हटाएं</button>
                    </td>
                `;
                listBody.appendChild(row);
            });

            if (totalStudentsElem) totalStudentsElem.innerText = count;
        }, (error) => {
            console.error("Firestore Snapshot Error:", error);
            showToast("डेटा प्राप्त करने में त्रुटि: " + error.message, true);
        });
}

// 8. Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered successfully:', reg.scope))
            .catch(err => console.warn('Service Worker registration failed:', err));
    }
}
      {id:"STF002", name:"Neha Gupta", desig:"Accountant", dept:"Administration", contact:"9988776656", email:"neha.g@school.edu", eligibility:"B.Com", bankAccount:"2345678901", ifsc:"SBIN0001234", bankName:"State Bank of India"},
      {id:"STF003", name:"Anita Verma", desig:"Principal", dept:"Administration", contact:"9988776657", email:"anita.v@school.edu", eligibility:"M.A, B.Ed, Ph.D", bankAccount:"3456789012", ifsc:"SBIN0001234", bankName:"State Bank of India"},
      {id:"STF004", name:"Ramesh Kumar", desig:"Teacher", dept:"Science", contact:"9988776658", email:"ramesh.k@school.edu", eligibility:"M.Sc, B.Ed", bankAccount:"4567890123", ifsc:"SBIN0001234", bankName:"State Bank of India"},
    ],
    studentAttendance: {
      "2026-07-10": {
        STU001:{status:"P",location:null}, STU002:{status:"P",location:null},
        STU003:{status:"A",location:null}, STU004:{status:"P",location:null},
        STU005:{status:"P",location:null}
      }
    },
    staffAttendance: {
      "2026-07-10": {
        STF001:{status:"P",location:null}, STF002:{status:"P",location:null},
        STF003:{status:"P",location:null}, STF004:{status:"A",location:null}
      }
    },
    fees: [
      {id:"STU001", total:50000, paid:50000, due:"2026-04-30", parentContact:"9876543210", payments:[{amount:50000, date:"2026-04-15", mode:"UPI", receiptNo:"RCPT1001"}]},
      {id:"STU002", total:50000, paid:30000, due:"2026-04-30", parentContact:"9876543211", payments:[{amount:30000, date:"2026-04-10", mode:"Cash", receiptNo:"RCPT1002"}]},
      {id:"STU003", total:45000, paid:45000, due:"2026-04-30", parentContact:"9876543212", payments:[{amount:45000, date:"2026-04-12", mode:"Bank Transfer", receiptNo:"RCPT1003"}]},
      {id:"STU004", total:45000, paid:20000, due:"2026-04-30", parentContact:"9876543213", payments:[{amount:20000, date:"2026-04-11", mode:"UPI", receiptNo:"RCPT1004"}]},
      {id:"STU005", total:40000, paid:0, due:"2026-04-30", parentContact:"9876543214", payments:[]},
    ],
    announcements: [
      {id:"ann1", date:"2026-07-01", title:"Summer Break Ends", desc:"School reopens for the new academic session on 1st July.", by:"Principal"},
      {id:"ann2", date:"2026-07-05", title:"PTM Notice", desc:"Parent-Teacher Meeting scheduled for 15th July, 10 AM onwards.", by:"Admin Office"},
      {id:"ann3", date:"2026-07-10", title:"Sports Day", desc:"Annual Sports Day will be held on 25th July in the school ground.", by:"Sports Dept."},
    ],
    exams: [],
    salary: {},
    transport: {
      buses: [
        {id:"BUS001", busNo:"UP-33 AB 1234", route:"Semrauta - Tiloi - Amethi", driverName:"Ram Lal", driverContact:"9876500001", conductorName:"Shyam Prasad", conductorContact:"9876500002", vehicleNo:"UP-33 AB 1234", capacity:40},
      ],
      assignments: [
        {id:"TRA001", studentId:"STU001", busId:"BUS001", pickupPoint:"Semrauta Chowk", monthlyFee:500, totalDue:500, paid:0},
      ],
    },
    timetable: {
      Monday:["Maths","Science","English","Hindi","LUNCH","Social Sci.","Computer"],
      Tuesday:["Science","Maths","Hindi","English","LUNCH","Computer","Social Sci."],
      Wednesday:["English","Social Sci.","Maths","Science","LUNCH","Hindi","Art"],
      Thursday:["Hindi","English","Science","Maths","LUNCH","Art","Computer"],
      Friday:["Social Sci.","Computer","English","Hindi","LUNCH","Maths","Science"],
      Saturday:["Sports","Sports","Library","Club Activity","LUNCH","-","-"],
    }
  };
}

const TT_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const TT_PERIODS = ["P1\n9:00","P2\n9:45","P3\n10:30","P4\n11:15","Lunch","P5\n12:40","P6\n1:25"];

function todayISO(){
  const d = new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,'0')+"-"+String(d.getDate()).padStart(2,'0');
}
function fmtDate(iso){
  const d = new Date(iso+"T00:00:00");
  if(isNaN(d)) return iso;
  return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
}
function getUpcomingBirthdays(list, daysAhead){
  const today = new Date(); today.setHours(0,0,0,0);
  const results = [];
  list.forEach(p=>{
    if(!p.dob || p.dob === "-") return;
    const parts = p.dob.split('-');
    if(parts.length !== 3) return;
    const day = parseInt(parts[0],10);
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const month = monthNames.indexOf(parts[1]);
    if(isNaN(day) || month === -1) return;
    let next = new Date(today.getFullYear(), month, day);
    if(next < today){ next = new Date(today.getFullYear()+1, month, day); }
    const diffDays = Math.round((next - today) / (1000*60*60*24));
    if(diffDays >= 0 && diffDays <= daysAhead){
      results.push({ name: p.name, cls: p.cls, diffDays, dateStr: next.toLocaleDateString('en-IN',{day:'2-digit',month:'short'}) });
    }
  });
  return results.sort((a,b)=>a.diffDays-b.diffDays);
}
function findStudentAnywhere(id){
  return db.students.find(x=>x.id===id) || db.alumni.find(x=>x.id===id);
}
function nextId(list, prefix){
  let max = 0;
  list.forEach(x=>{
    const n = parseInt(String(x.id).replace(prefix,''),10);
    if(!isNaN(n) && n>max) max = n;
  });
  return prefix + String(max+1).padStart(3,'0');
}
function fileToCompressedDataURL(file, maxSize, quality){
  return new Promise((resolve, reject)=>{
    if(!file){ resolve(null); return; }
    const reader = new FileReader();
    reader.onload = e=>{
      const img = new Image();
      img.onload = ()=>{
        let w = img.width, h = img.height;
        if(w > h){ if(w > maxSize){ h = h * maxSize / w; w = maxSize; } }
        else{ if(h > maxSize){ w = w * maxSize / h; h = maxSize; } }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = ()=>resolve(null);
      img.src = e.target.result;
    };
    reader.onerror = ()=>resolve(null);
    reader.readAsDataURL(file);
  });
}
function fileToDataURL(file){
  return new Promise((resolve, reject)=>{
    if(!file){ resolve(null); return; }
    const reader = new FileReader();
    reader.onload = e=>resolve(e.target.result);
    reader.onerror = ()=>resolve(null);
    reader.readAsDataURL(file);
  });
}
function getGrade(pct){
  if(pct>=91) return "A1";
  if(pct>=81) return "A2";
  if(pct>=71) return "B1";
  if(pct>=61) return "B2";
  if(pct>=51) return "C1";
  if(pct>=41) return "C2";
  if(pct>=33) return "D";
  return "E";
}

/* ---------------- FIRESTORE LOAD / SAVE ---------------- */
async function loadData(){
  if(!firebaseReady){
    db = defaultData();
    showBanner("⚠ Firebase not set up yet — changes will NOT be saved. See setup guide.", "");
    finishBoot();
    return;
  }
  try{
    const [studentsSnap, staffSnap, feesSnap, annSnap, usersSnap, examsSnap, salarySnap, busSnap, transAssignSnap, alumniSnap, homeworkSnap, settingsDoc, sAttSnap, tAttSnap] = await Promise.all([
      firestoreDb.collection('students').get(),
      firestoreDb.collection('staff').get(),
      firestoreDb.collection('fees').get(),
      firestoreDb.collection('announcements').get(),
      firestoreDb.collection('users').get(),
      firestoreDb.collection('exams').get(),
      firestoreDb.collection('salary').get(),
      firestoreDb.collection('transportBuses').get(),
      firestoreDb.collection('transportAssignments').get(),
      firestoreDb.collection('alumni').get(),
      firestoreDb.collection('homework').get(),
      firestoreDb.collection('settings').doc('main').get(),
      firestoreDb.collection('attendanceStudents').get(),
      firestoreDb.collection('attendanceStaff').get(),
    ]);

    if(studentsSnap.empty && usersSnap.empty){
      db = defaultData();
      await seedFirestore(db);
    } else {
      db = {
        settings: settingsDoc.exists ? settingsDoc.data() : {whatsapp:""},
        users: [], students: [], staff: [], fees: [], announcements: [], exams: [], salary: {}, alumni: [], homework: [],
        transport: { buses: [], assignments: [] },
        studentAttendance: {}, staffAttendance: {}, timetable: defaultData().timetable
      };
      usersSnap.forEach(d=> db.users.push({u:d.id, ...d.data()}));
      studentsSnap.forEach(d=> db.students.push({id:d.id, ...d.data()}));
      staffSnap.forEach(d=> db.staff.push({id:d.id, ...d.data()}));
      feesSnap.forEach(d=> db.fees.push({id:d.id, ...d.data()}));
      annSnap.forEach(d=> db.announcements.push({id:d.id, ...d.data()}));
      alumniSnap.forEach(d=> db.alumni.push({id:d.id, ...d.data()}));
      homeworkSnap.forEach(d=> db.homework.push({id:d.id, ...d.data()}));
      examsSnap.forEach(d=> db.exams.push({id:d.id, ...d.data()}));
      salarySnap.forEach(d=> db.salary[d.id] = d.data());
      busSnap.forEach(d=> db.transport.buses.push({id:d.id, ...d.data()}));
      transAssignSnap.forEach(d=> db.transport.assignments.push({id:d.id, ...d.data()}));
      sAttSnap.forEach(d=> db.studentAttendance[d.id] = d.data());
      tAttSnap.forEach(d=> db.staffAttendance[d.id] = d.data());
    }
    hideBanner();
  }catch(e){
    db = defaultData();
    showBanner("⚠ Could not connect to Firebase — check your internet connection. Working temporarily offline.", "info");
  }
  migrateData();
  finishBoot();
}

function migrateData(){
  let changed = false;
  if(!db.settings.subjects){ db.settings.subjects = ["Hindi","English","Maths","Science","Social Science"]; changed = true; }
  if(db.settings.upiId === undefined){ db.settings.upiId = ""; db.settings.bankAccount = ""; db.settings.ifsc = ""; db.settings.bankName = ""; changed = true; }
  if(db.settings.qrImage === undefined){ db.settings.qrImage = null; changed = true; }
  if(db.settings.currentSession === undefined){ db.settings.currentSession = "2026-27"; changed = true; }
  if(db.settings.feeStructure === undefined){ db.settings.feeStructure = {}; changed = true; }
  if(!db.homework){ db.homework = []; changed = true; }
  db.fees.forEach(f=>{ if(f.session === undefined){ f.session = db.settings.currentSession; changed = true; } });
  db.exams.forEach(x=>{ if(x.session === undefined){ x.session = db.settings.currentSession; changed = true; } });
  if(!db.alumni){ db.alumni = []; changed = true; }
  const mapCode = { Present:"P", Absent:"A", Late:"L", Leave:"L" };
  ["studentAttendance","staffAttendance"].forEach(key=>{
    const byDate = db[key] || {};
    Object.keys(byDate).forEach(date=>{
      Object.keys(byDate[date]).forEach(id=>{
        const rec = byDate[date][id];
        if(rec && mapCode[rec.status]){ rec.status = mapCode[rec.status]; changed = true; }
      });
    });
  });
  if(!db.exams){ db.exams = []; changed = true; }
  if(!db.salary){ db.salary = {}; changed = true; }
  if(!db.transport){ db.transport = { buses: [], assignments: [] }; changed = true; }
  else {
    db.transport.buses.forEach(b=>{
      if(b.conductorName === undefined){ b.conductorName = "-"; b.conductorContact = "-"; changed = true; }
    });
    db.transport.assignments.forEach(a=>{
      if(a.totalDue === undefined){ a.totalDue = a.monthlyFee || 0; a.paid = 0; changed = true; }
    });
  }
  db.students.forEach(s=>{
    if(s.address === undefined){ s.address = "-"; changed = true; }
    if(s.photo === undefined){ s.photo = null; s.document = null; s.documentName = null; changed = true; }
    if(s.admissionDate === undefined){ s.admissionDate = "-"; changed = true; }
  });
  db.staff.forEach(s=>{
    if(s.eligibility === undefined){ s.eligibility = "-"; changed = true; }
    if(s.bankAccount === undefined){ s.bankAccount = "-"; s.ifsc = "-"; s.bankName = "-"; changed = true; }
    if(s.photo === undefined){ s.photo = null; s.document = null; s.documentName = null; changed = true; }
  });
  db.fees.forEach(f=>{
    if(f.parentContact === undefined){
      const s = db.students.find(x=>x.id===f.id);
      f.parentContact = s ? s.contact : "";
      changed = true;
    }
    if(!f.payments){ f.payments = []; changed = true; }
  });
  db.users.forEach(u=>{
    if(u.assignedClass === undefined){ u.assignedClass = null; changed = true; }
    if(u.assignedStudent === undefined){ u.assignedStudent = null; changed = true; }
  });
  // note: migrated attendance status codes are not re-pushed to Firestore automatically here to avoid
  // excess writes on every load; they will be corrected next time attendance is saved for that date.
}

async function seedFirestore(data){
  const batch = firestoreDb.batch();
  data.users.forEach(u=>{ const {u:uid,...rest}=u; batch.set(firestoreDb.collection('users').doc(uid), rest); });
  data.students.forEach(s=>{ const {id,...rest}=s; batch.set(firestoreDb.collection('students').doc(id), rest); });
  data.staff.forEach(s=>{ const {id,...rest}=s; batch.set(firestoreDb.collection('staff').doc(id), rest); });
  data.fees.forEach(f=>{ const {id,...rest}=f; batch.set(firestoreDb.collection('fees').doc(id), rest); });
  data.announcements.forEach(a=>{ const {id,...rest}=a; batch.set(firestoreDb.collection('announcements').doc(id), rest); });
  data.exams.forEach(x=>{ const {id,...rest}=x; batch.set(firestoreDb.collection('exams').doc(id), rest); });
  data.transport.buses.forEach(b=>{ const {id,...rest}=b; batch.set(firestoreDb.collection('transportBuses').doc(id), rest); });
  data.transport.assignments.forEach(a=>{ const {id,...rest}=a; batch.set(firestoreDb.collection('transportAssignments').doc(id), rest); });
  data.alumni.forEach(al=>{ const {id,...rest}=al; batch.set(firestoreDb.collection('alumni').doc(id), rest); });
  data.homework.forEach(h=>{ const {id,...rest}=h; batch.set(firestoreDb.collection('homework').doc(id), rest); });
  Object.keys(data.studentAttendance).forEach(date=>{ batch.set(firestoreDb.collection('attendanceStudents').doc(date), data.studentAttendance[date]); });
  Object.keys(data.staffAttendance).forEach(date=>{ batch.set(firestoreDb.collection('attendanceStaff').doc(date), data.staffAttendance[date]); });
  batch.set(firestoreDb.collection('settings').doc('main'), data.settings);
  await batch.commit();
}

function finishBoot(){
  document.getElementById('boot').style.display = 'none';
  document.getElementById('loginWrap').style.display = 'flex';
}

async function fsWrite(promise){
  const bar = document.getElementById('saveBar');
  const txt = document.getElementById('saveBarText');
  if(!firebaseReady){
    bar.className = 'savebar';
    bar.style.color = 'var(--red)';
    txt.textContent = 'Not saved — Firebase not set up';
    return;
  }
  bar.className = 'savebar saving';
  bar.style.color = '';
  txt.textContent = 'Saving…';
  try{
    await promise;
    bar.className = 'savebar saved';
    txt.textContent = 'Saved to cloud';
  }catch(e){
    bar.className = 'savebar';
    bar.style.color = 'var(--red)';
    txt.textContent = 'Save failed — check internet';
  }
}

/* ---------------- LOGIN ---------------- */
/* ---------------- FORGOT PASSWORD ---------------- */
function showForgotPassword(){
  openModal(`
    <h2>Forgot Password</h2>
    <div class="field"><label>Username</label><input id="fp_user" type="text" placeholder="Enter your username"></div>
    <p class="empty-note" id="fp_msg"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()" style="flex:1;">Close</button>
      <button class="primary-btn" style="flex:1.4; margin-top:0;" onclick="submitForgotPassword()">Check</button>
    </div>
  `);
}
function submitForgotPassword(){
  const u = document.getElementById('fp_user').value.trim();
  const msg = document.getElementById('fp_msg');
  if(!u){ msg.textContent = "Enter your username"; return; }
  const found = db.users.find(x=>x.u===u);
  if(found){
    msg.textContent = `Please contact your school administrator (${SCHOOL_NAME}) to reset the password for "${u}". They can reset it from the User Access page.`;
  } else {
    msg.textContent = "No account found with that username. Please contact your administrator.";
  }
}

function attemptLogin(){
  const u = document.getElementById('user').value.trim();
  const p = document.getElementById('pass').value;
  const msg = document.getElementById('loginMsg');
  if(!u || !p){ msg.textContent = "Enter username and password"; msg.className = "login-msg hint"; return; }
  const found = db.users.find(x => x.u === u && x.p === p && x.status === "Active");
  if(found){
    currentUser = found;
    msg.textContent = "";
    document.getElementById('loginWrap').style.display = "none";
    document.getElementById('app').classList.add('active');
    document.getElementById('chipName').textContent = found.name;
    document.getElementById('chipRole').textContent = found.role;
    document.getElementById('avatarInit').textContent = found.name.charAt(0);
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    document.querySelector('.nav-item[data-view="dashboard"]').classList.add('active');
    applyRoleRestrictions();
    renderView('dashboard');
  } else {
    msg.textContent = "Invalid username or password";
    msg.className = "login-msg error";
  }
}

function isRestrictedTeacher(){
  return currentUser && currentUser.role === "Teacher" && currentUser.assignedClass;
}
function isClerk(){
  return currentUser && (currentUser.role === "Clerk" || currentUser.role === "Accountant");
}
function isParent(){
  return currentUser && currentUser.role === "Parent" && currentUser.assignedStudent;
}
const VIEW_HIDE_BY_ROLE = {
  Teacher: ["staff","access","salary","settings","alumni"],
  Clerk: ["attendance","exams","access","settings","alumni"],
  Accountant: ["attendance","exams","access","settings","alumni"],
  Parent: ["students","alumni","staff","attendance","salary","transport","access","settings"],
};
function applyRoleRestrictions(){
  const role = currentUser ? currentUser.role : null;
  const hidden = VIEW_HIDE_BY_ROLE[role] || [];
  document.querySelectorAll('.nav-item').forEach(el=>{
    const view = el.dataset.view;
    el.style.display = hidden.includes(view) ? 'none' : '';
  });
}
document.getElementById('pass').addEventListener('keydown', e => { if(e.key==='Enter') attemptLogin(); });
document.getElementById('user').addEventListener('keydown', e => { if(e.key==='Enter') attemptLogin(); });

function doLogout(){
  currentUser = null;
  document.getElementById('user').value = "";
  document.getElementById('pass').value = "";
  document.getElementById('loginMsg').textContent = "";
  document.getElementById('app').classList.remove('active');
  document.getElementById('loginWrap').style.display = "flex";
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarBackdrop').classList.toggle('active');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('active');
}

document.querySelectorAll('.nav-item').forEach(el=>{
  el.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
    el.classList.add('active');
    renderView(el.dataset.view);
    closeSidebar();
  });
});

const titles = { dashboard:"Dashboard", students:"Students", alumni:"Alumni", attendance:"Attendance", staff:"Staff", fees:"Fees", exams:"Exams", timetable:"Time Table", transport:"Transport", announcements:"Announcements", homework:"Homework", access:"User Access", salary:"Salary", settings:"Settings" };

function renderView(view){
  document.getElementById('viewTitle').textContent = titles[view];
  document.getElementById('content').innerHTML = renderers[view]();
  if(view === 'dashboard') initDashboardCharts();
}
function rerenderCurrent(){
  const active = document.querySelector('.nav-item.active');
  renderView(active ? active.dataset.view : 'dashboard');
}

function initDashboardCharts(){
  if(!window.Chart) return;
  const feesCanvas = document.getElementById('feesChart');
  if(feesCanvas){
    const collected = db.fees.reduce((s,f)=>s+f.paid,0);
    const pending = db.fees.reduce((s,f)=>s+(f.total-f.paid),0);
    new Chart(feesCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Collected', 'Pending'],
        datasets: [{ data: [collected, pending], backgroundColor: ['#3E6B4F', '#A3432F'] }]
      },
      options: { plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } }
    });
  }
  const gradeCanvas = document.getElementById('gradeChart');
  if(gradeCanvas){
    const grades = ['A1','A2','B1','B2','C1','C2','D','E'];
    const counts = grades.map(g => db.exams.filter(x=>x.grade===g).length);
    new Chart(gradeCanvas, {
      type: 'bar',
      data: {
        labels: grades,
        datasets: [{ label: 'Students', data: counts, backgroundColor: '#1B2A4A' }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }
}

function quickNav(view, thenOpenFn){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const navEl = document.querySelector(`.nav-item[data-view="${view}"]`);
  if(navEl) navEl.classList.add('active');
  renderView(view);
  if(thenOpenFn && typeof window[thenOpenFn] === 'function'){
    setTimeout(()=>window[thenOpenFn](), 50);
  }
}

function goToFeesSearch(name){
  quickNav('fees');
  setTimeout(()=>{
    const inp = document.getElementById('feesSearch');
    if(inp){ inp.value = name; filterTable('feesSearch','feesTable'); }
  }, 60);
}

function toggleSelectAllFees(checked){
  document.querySelectorAll('.fee-checkbox').forEach(cb=>{
    if(cb.closest('tr').style.display !== 'none'){ cb.checked = checked; }
  });
  updateBulkReminderCount();
}
function updateBulkReminderCount(){
  const n = document.querySelectorAll('.fee-checkbox:checked').length;
  const btn = document.getElementById('bulkReminderBtn');
  if(btn){
    btn.textContent = `📤 Send Bulk Reminders (${n})`;
    btn.disabled = n === 0;
  }
}

let bulkReminderQueue = [];
let bulkReminderIndex = 0;
function startBulkReminders(){
  const checked = Array.from(document.querySelectorAll('.fee-checkbox:checked'));
  if(!checked.length) return;
  bulkReminderQueue = checked.map(cb=>cb.dataset.feeid);
  bulkReminderIndex = 0;
  showBulkReminderModal();
}
function showBulkReminderModal(){
  if(bulkReminderIndex >= bulkReminderQueue.length){
    openModal(`
      <h2>✅ Bulk Reminders Complete</h2>
      <p class="empty-note">Processed ${bulkReminderQueue.length} reminder(s).</p>
      <div class="modal-actions"><button class="primary-btn" style="flex:1; margin-top:0;" onclick="closeModal(); rerenderCurrent();">Done</button></div>
    `);
    return;
  }
  const feeId = bulkReminderQueue[bulkReminderIndex];
  const rec = db.fees.find(f=>f.id===feeId);
  const student = findStudentAnywhere(feeId);
  if(!rec || !student){ bulkReminderIndex++; showBulkReminderModal(); return; }
  const bal = rec.total - rec.paid;
  const name = student.name;
  const target = formatIndianPhone(rec.parentContact);
  const msg = buildFeeReminderMessage(name, student.cls, bal, rec.due);
  const url = target ? `https://wa.me/${target}?text=${encodeURIComponent(msg)}` : null;
  openModal(`
    <h2>Bulk Reminders — ${bulkReminderIndex+1} of ${bulkReminderQueue.length}</h2>
    <p style="font-size:14px;"><b>${name}</b> (Class ${student.cls})<br>Balance due: ₹${bal.toLocaleString('en-IN')}</p>
    ${url
      ? `<a class="wa-btn" target="_blank" href="${url}" style="display:inline-flex; margin-bottom:16px;" onclick="setTimeout(advanceBulkReminder, 300)">💬 Open WhatsApp & Send</a>`
      : `<p class="empty-note">No parent number on file — this one will be skipped.</p>`}
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()" style="flex:1;">Stop Here</button>
      <button class="primary-btn" style="flex:1; margin-top:0;" onclick="advanceBulkReminder()">Skip / Next →</button>
    </div>
  `);
}
function advanceBulkReminder(){
  bulkReminderIndex++;
  showBulkReminderModal();
}

/* ---------------- MODAL HELPERS ---------------- */
function openModal(html){
  document.getElementById('modalBox').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('active');
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('active');
}
document.getElementById('modalOverlay').addEventListener('click', e=>{
  if(e.target.id === 'modalOverlay') closeModal();
});

/* ---------------- RENDERERS ---------------- */
const renderers = {
  dashboard(){
    const totalStudents = db.students.length;
    const totalStaff = db.staff.length;
    const sDates = Object.keys(db.studentAttendance).sort();
    const sLastDate = sDates[sDates.length-1];
    const sTodayRec = sLastDate ? db.studentAttendance[sLastDate] : {};
    const presentToday = Object.values(sTodayRec).filter(r=>r.status==="P").length;

    const tDates = Object.keys(db.staffAttendance).sort();
    const tLastDate = tDates[tDates.length-1];
    const tTodayRec = tLastDate ? db.staffAttendance[tLastDate] : {};
    const absentStaff = Object.values(tTodayRec).filter(r=>r.status==="A").length;

    const collected = db.fees.reduce((s,f)=>s+f.paid,0);
    const upcomingBdays = getUpcomingBirthdays(db.students, 7);
    const pending = db.fees.reduce((s,f)=>s+(f.total-f.paid),0);
    const topDues = db.fees
      .map(f=>({ f, bal: f.total - f.paid, student: findStudentAnywhere(f.id) }))
      .filter(x=>x.bal>0)
      .sort((a,b)=>b.bal-a.bal)
      .slice(0,5);
    const annRows = db.announcements.slice(-3).reverse().map((a,i)=>`<tr><td>${fmtDate(a.date)}</td><td>${a.title}</td><td>${a.by}</td></tr>`).join('');
    const wa = schoolWhatsApp();

    const examAvg = db.exams.length
      ? (db.exams.reduce((s,e)=>s+e.percentage,0)/db.exams.length).toFixed(1)
      : null;

    const transportCount = db.transport.assignments.length;

    // Attendance trend — last 7 recorded dates
    const trendDates = sDates.slice(-7);
    const trendMax = totalStudents || 1;
    const trendBars = trendDates.map(d=>{
      const rec = db.studentAttendance[d];
      const present = Object.values(rec).filter(r=>r.status==="P").length;
      const pct = Math.round((present/trendMax)*100);
      const dd = new Date(d+"T00:00:00");
      const label = isNaN(dd) ? d : dd.toLocaleDateString('en-IN',{day:'2-digit',month:'short'});
      return `<div class="trend-bar-wrap">
        <div class="trend-bar-track"><div class="trend-bar-fill" style="height:${pct}%;"></div></div>
        <div class="trend-bar-val">${present}</div>
        <div class="trend-bar-lbl">${label}</div>
      </div>`;
    }).join('');

    // Class-wise strength
    const classCounts = {};
    db.students.forEach(s=>{ classCounts[s.cls] = (classCounts[s.cls]||0) + 1; });
    const maxClassCount = Math.max(1, ...Object.values(classCounts));
    const classBars = Object.keys(classCounts).sort().map(cls=>{
      const n = classCounts[cls];
      const pct = Math.round((n/maxClassCount)*100);
      return `<div class="cls-bar-row">
        <span class="cls-bar-lbl">Class ${cls}</span>
        <div class="cls-bar-track"><div class="cls-bar-fill" style="width:${pct}%;"></div></div>
        <span class="cls-bar-val">${n}</span>
      </div>`;
    }).join('');

    return `
    <div class="school-info">
      <div class="si-item"><span class="si-lbl">School</span><span class="si-val">${SCHOOL_NAME}, Semrauta, Tiloi, Amethi</span></div>
      <div class="si-item"><span class="si-lbl">Principal</span><span class="si-val">Mr. Arun Mishra</span></div>
      <div class="si-item"><span class="si-lbl">WhatsApp</span><span class="si-val">${wa ? "+"+wa : "Not set — go to Settings"}</span></div>
    </div>

    <div class="quick-actions">
      <button class="qa-btn" onclick="quickNav('students','showAddStudent')"><span>➕</span>Add Student</button>
      <button class="qa-btn" onclick="quickNav('attendance')"><span>✅</span>Mark Attendance</button>
      <button class="qa-btn" onclick="quickNav('fees','showAddFee')"><span>💰</span>Add Fee Record</button>
      <button class="qa-btn" onclick="quickNav('announcements','showAddAnnouncement')"><span>📢</span>New Announcement</button>
    </div>

    <div class="cards">
      <div class="card c-navy"><span class="card-ic">🎓</span><div class="lbl">Total Students</div><div class="val">${totalStudents}</div><div class="sub">across all classes</div></div>
      <div class="card c-purple"><span class="card-ic">🧑‍🏫</span><div class="lbl">Total Staff</div><div class="val">${totalStaff}</div><div class="sub">all departments</div></div>
      <div class="card c-green"><span class="card-ic">✅</span><div class="lbl">Present (Last Marked)</div><div class="val">${presentToday}/${totalStudents}</div><div class="sub">${sLastDate ? fmtDate(sLastDate) : "no attendance yet"}</div></div>
      <div class="card c-red"><span class="card-ic">⚠️</span><div class="lbl">Absent Teachers/Staff</div><div class="val">${absentStaff}</div><div class="sub">${tLastDate ? fmtDate(tLastDate) : "no attendance yet"}</div></div>
      <div class="card c-gold"><span class="card-ic">💰</span><div class="lbl">Fees Collected</div><div class="val">₹${(collected/1000).toFixed(0)}k</div><div class="sub">this session</div></div>
      <div class="card c-red"><span class="card-ic">📌</span><div class="lbl">Fees Pending</div><div class="val">₹${(pending/1000).toFixed(0)}k</div><div class="sub">follow up needed</div></div>
      <div class="card c-blue"><span class="card-ic">📝</span><div class="lbl">Avg. Exam Score</div><div class="val">${examAvg ? examAvg+"%" : "—"}</div><div class="sub">${db.exams.length} exam records</div></div>
      <div class="card c-purple"><span class="card-ic">🚌</span><div class="lbl">Transport Users</div><div class="val">${transportCount}</div><div class="sub">${db.transport.buses.length} buses running</div></div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <h2>📈 Attendance Trend (Last ${trendDates.length || 0} Days)</h2>
        ${trendDates.length ? `<div class="trend-chart">${trendBars}</div>` : '<p class="empty-note">Mark attendance on a few days to see the trend here.</p>'}
      </div>
      <div class="panel">
        <h2>🏫 Class-wise Strength</h2>
        ${classBars || '<p class="empty-note">No students yet</p>'}
      </div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <h2>💰 Fees Collected vs Pending</h2>
        ${(collected+pending)>0 ? `<div style="max-width:220px; margin:0 auto;"><canvas id="feesChart"></canvas></div>` : '<p class="empty-note">No fee data yet</p>'}
      </div>
      <div class="panel">
        <h2>📝 Exam Grade Distribution</h2>
        ${db.exams.length ? `<canvas id="gradeChart" style="max-height:220px;"></canvas>` : '<p class="empty-note">No exam records yet</p>'}
      </div>
    </div>

    <div class="panel">
      <div class="toolbar"><h2 style="margin:0;">📌 Top Fee Dues</h2><button class="mini-btn" onclick="quickNav('fees')">View All Dues →</button></div>
      <table>
        <tr><th>Student</th><th>Class</th><th>Balance</th><th></th></tr>
        ${topDues.length ? topDues.map(x=>`
          <tr style="cursor:pointer;" onclick="goToFeesSearch('${x.student ? x.student.name.replace(/'/g,"\\\\'") : x.f.id}')">
            <td>${x.student ? x.student.name : '(unknown)'}</td>
            <td>${x.student ? x.student.cls : '-'}</td>
            <td><b>₹${x.bal.toLocaleString('en-IN')}</b></td>
            <td><span style="color:var(--navy); font-size:12px;">View →</span></td>
          </tr>`).join('') : '<tr><td colspan="4" class="empty-note">No pending dues 🎉</td></tr>'}
      </table>
    </div>

    <div class="panel">
      <h2>🎂 Upcoming Birthdays (Next 7 Days)</h2>
      ${upcomingBdays.length ? `<table><tr><th>Student</th><th>Class</th><th>Date</th></tr>
        ${upcomingBdays.map(b=>`<tr><td>${b.name}</td><td>${b.cls}</td><td>${b.diffDays===0?'🎉 Today!':b.dateStr}</td></tr>`).join('')}
      </table>` : '<p class="empty-note">No birthdays in the next 7 days</p>'}
    </div>

    <div class="panel">
      <h2>📢 Recent Announcements</h2>
      <table><tr><th>Date</th><th>Title</th><th>Posted By</th></tr>${annRows || '<tr><td colspan="3" class="empty-note">No announcements yet</td></tr>'}</table>
    </div>`;
  },

  students(){
    const restricted = isRestrictedTeacher();
    const list = restricted ? db.students.filter(s=>s.cls===currentUser.assignedClass) : db.students;
    const classes = [...new Set(db.students.map(s=>s.cls))].sort();
    const cards = list.map(s=>{
      const searchText = `${s.id} ${s.name} ${s.father} ${s.contact}`.toLowerCase();
      return `
      <div class="person-card" data-search="${searchText}" data-class="${s.cls}">
        ${s.photo ? `<img src="${s.photo}" class="avatar-lg">` : `<div class="avatar-lg">${s.name.charAt(0)}</div>`}
        <div class="p-name">${s.name}</div>
        <div class="p-sub">${s.id} &nbsp;•&nbsp; Class ${s.cls}-${s.sec} &nbsp;•&nbsp; Roll ${s.roll}</div>
        <div class="p-detail"><span class="ic">👤</span> ${s.gender} &nbsp;|&nbsp; DOB: ${s.dob}</div>
        <div class="p-detail"><span class="ic">👨</span> ${s.father}</div>
        <div class="p-detail"><span class="ic">📞</span> ${s.contact}</div>
        <div class="p-detail"><span class="ic">🏠</span> ${s.address}</div>
        <div class="p-tags">${s.document ? `<a class="mini-btn" target="_blank" href="${s.document}">📄 ${s.documentName||'Document'}</a>` : ''}</div>
        <div class="p-actions">
          <button class="mini-btn" onclick="showIDCard('${s.id}')">🪪 ID Card</button>
          <button class="mini-btn" onclick="showEditStudent('${s.id}')">✏ Edit</button>
          ${restricted ? '' : `<button class="mini-btn" style="color:var(--red); border-color:var(--red);" onclick="showRemoveStudent('${s.id}')">🗂 Mark as Left</button>`}
        </div>
      </div>`;
    }).join('');
    const filterUI = restricted ? `<p class="empty-note">Showing Class ${currentUser.assignedClass} only</p>` : `
      <div class="filter-row">
        <select id="stuClassFilter" onchange="filterPeople('studentGrid','studentSearch','stuClassFilter')"><option value="">All Classes</option>${classes.map(c=>`<option value="${c}">Class ${c}</option>`).join('')}</select>
      </div>`;
    return `
    <div class="panel">
      ${filterUI}
      <div class="toolbar">
        <input class="search" id="studentSearch" placeholder="Search students..." oninput="filterPeople('studentGrid','studentSearch','stuClassFilter')">
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${restricted ? '' : '<button class="mini-btn" onclick="showPromoteStudents()">🎓 Promote Students</button>'}
          <button class="add-btn" onclick="showAddStudent()">+ Add Student</button>
        </div>
      </div>
      <div class="people-grid" id="studentGrid">
        ${cards || '<p class="empty-note">No students added yet</p>'}
      </div>
    </div>`;
  },

  alumni(){
    const cards = db.alumni.slice().reverse().map(s=>{
      const searchText = `${s.id} ${s.name}`.toLowerCase();
      return `
      <div class="person-card" data-search="${searchText}">
        ${s.photo ? `<img src="${s.photo}" class="avatar-lg">` : `<div class="avatar-lg">${s.name.charAt(0)}</div>`}
        <div class="p-name">${s.name}</div>
        <div class="p-sub">${s.id} &nbsp;•&nbsp; Last Class: ${s.cls}-${s.sec}</div>
        <div class="p-detail"><span class="ic">📅</span> Studied: ${s.admissionDate!=='-' ? fmtDate(s.admissionDate) : 'Unknown'} → ${fmtDate(s.leavingDate)}</div>
        <div class="p-detail"><span class="ic">📋</span> Reason: ${s.reason}</div>
        <div class="p-detail"><span class="ic">👨</span> ${s.father}</div>
        <div class="p-detail"><span class="ic">📞</span> ${s.contact}</div>
        <div class="p-actions">
          <button class="mini-btn" onclick="restoreAlumnus('${s.id}')">↩ Restore to Active</button>
        </div>
      </div>`;
    }).join('');
    return `
    <div class="panel">
      <h2>🎓 Alumni — Past Students</h2>
      <p class="empty-note">Students marked as "Left" appear here with their study period. Their fee and exam history remain linked to their Student ID and are still visible in Fees/Exams records.</p>
      <input class="search" id="alumniSearch" placeholder="Search alumni..." oninput="filterPeople('alumniGrid','alumniSearch',null)" style="margin-bottom:14px;">
      <div class="people-grid" id="alumniGrid">
        ${cards || '<p class="empty-note">No past students yet</p>'}
      </div>
    </div>`;
  },

  attendance(){
    const date = todayISO();
    initAttendanceDraft(date);
    const restricted = isRestrictedTeacher();

    let allClasses = [...new Set(db.students.map(s=>s.cls))].sort((a,b)=>{
      const na = parseInt(a,10), nb = parseInt(b,10);
      if(!isNaN(na) && !isNaN(nb)) return na-nb;
      return String(a).localeCompare(String(b));
    });
    let classes = allClasses;
    if(restricted){
      classes = allClasses.filter(c=>c===currentUser.assignedClass);
    } else if(attendanceClassFilter){
      classes = allClasses.filter(c=>c===attendanceClassFilter);
    }

    const classSelectorUI = restricted ? '' : `
      <div class="filter-row">
        <select id="attClassFilter" onchange="setAttendanceClassFilter(this.value)">
          <option value="">All Classes</option>
          ${allClasses.map(c=>`<option value="${c}" ${attendanceClassFilter===c?'selected':''}>Class ${c}</option>`).join('')}
        </select>
      </div>`;

    const groups = classes.map(cls=>{
      const list = db.students.filter(s=>s.cls===cls).sort((a,b)=>(a.roll||0)-(b.roll||0));
      let p=0,a=0,l=0;
      const rows = list.map(s=>{
        const st = attendanceDraft.student[s.id].status;
        if(st==='P') p++; else if(st==='A') a++; else if(st==='L') l++;
        return `<tr><td>${s.roll || '-'}</td><td>${s.name}</td><td>${s.sec}</td>
          <td>${attBtnGroup('student', s.id, st)}</td></tr>`;
      }).join('');
      return `
      <div class="class-group">
        <div class="class-group-head">
          <span>Class ${cls}</span>
          <span class="cg-summary">P:${p} &nbsp; A:${a} &nbsp; L:${l}</span>
        </div>
        <table><tr><th>Roll</th><th>Name</th><th>Sec</th><th>Status</th></tr>${rows || '<tr><td colspan="4" class="empty-note">No students in this class</td></tr>'}</table>
      </div>`;
    }).join('');

    const history = Object.keys(db.studentAttendance).sort().reverse().slice(0,5).map(d=>{
      const rec = db.studentAttendance[d];
      const present = Object.values(rec).filter(r=>r.status==="P").length;
      return `<tr><td>${fmtDate(d)}</td><td>${present}/${Object.keys(rec).length} present</td></tr>`;
    }).join('');

    const todayRec = db.studentAttendance[date] || {};
    const absentIds = Object.keys(todayRec).filter(id=>todayRec[id].status==='A' && (!restricted || (db.students.find(s=>s.id===id)||{}).cls===currentUser.assignedClass));
    const absentRows = absentIds.map(id=>{
      const s = db.students.find(x=>x.id===id);
      if(!s) return '';
      const msg = `Dear Parent, your child ${s.name} (Class ${s.cls}) was absent from school today, ${fmtDate(date)}. - ${SCHOOL_NAME}`;
      const target = formatIndianPhone(s.contact);
      const btn = target ? `<a class="wa-btn" target="_blank" href="https://wa.me/${target}?text=${encodeURIComponent(msg)}">Send Alert</a>` : `<span class="empty-note">No contact number on file</span>`;
      return `<tr><td>${s.name}</td><td>${s.cls}</td><td>${btn}</td></tr>`;
    }).join('');

    return `
    <div class="panel">
      ${classSelectorUI}
      <div class="toolbar"><h2 style="margin:0;">🗓 Mark Student Attendance — ${fmtDate(date)}</h2>
        <button class="add-btn" onclick="saveAttendance('student')">Save Attendance</button>
      </div>
      <p class="empty-note">P = Present &nbsp; A = Absent &nbsp; L = Late. Select a class above to focus on one at a time.</p>
      ${groups || '<p class="empty-note">No students found for this class</p>'}
    </div>
    <div class="panel">
      <h2>🚨 Absent Today — Parent Alerts</h2>
      <p class="empty-note">These open WhatsApp with a pre-filled message per parent — tap "Send Alert" for each one (not fully automatic, but one tap per parent).</p>
      <table><tr><th>Student</th><th>Class</th><th>Action</th></tr>${absentRows || '<tr><td colspan="3" class="empty-note">No absences marked for today yet</td></tr>'}</table>
    </div>
    <div class="panel">
      <h2>📈 Recent Attendance History</h2>
      <table><tr><th>Date</th><th>Summary</th></tr>${history || '<tr><td colspan="2" class="empty-note">No history yet</td></tr>'}</table>
    </div>`;
  },

  staff(){
    const date = todayISO();
    initAttendanceDraft(date);

    const cards = db.staff.map(s=>{
      const searchText = `${s.id} ${s.name} ${s.desig} ${s.dept} ${s.contact}`.toLowerCase();
      return `
      <div class="person-card" data-search="${searchText}">
        ${s.photo ? `<img src="${s.photo}" class="avatar-lg">` : `<div class="avatar-lg">${s.name.charAt(0)}</div>`}
        <div class="p-name">${s.name}</div>
        <div class="p-sub">${s.id} &nbsp;•&nbsp; ${s.desig}</div>
        <div class="p-detail"><span class="ic">🏢</span> ${s.dept}</div>
        <div class="p-detail"><span class="ic">📞</span> ${s.contact}</div>
        <div class="p-detail"><span class="ic">📧</span> ${s.email}</div>
        <div class="p-tags">
          <span class="elig-tag">🎖 ${s.eligibility}</span>
          ${s.document ? `<a class="mini-btn" target="_blank" href="${s.document}">📄 ${s.documentName||'Document'}</a>` : ''}
        </div>
        <div class="p-actions">
          <button class="mini-btn" onclick="showEditStaff('${s.id}')">✏ Edit</button>
        </div>
      </div>`;
    }).join('');

    const attRows = db.staff.map(s=>`
      <tr><td>${s.id}</td><td>${s.name}</td><td>${s.desig}</td>
      <td>${attBtnGroup('staff', s.id, attendanceDraft.staff[s.id].status)}</td>
      <td>${locationCell(s.id)}</td></tr>`).join('');

    return `
    <div class="panel">
      <div class="toolbar">
        <input class="search" id="staffSearch" placeholder="Search staff..." oninput="filterPeople('staffGrid','staffSearch',null)">
        <button class="add-btn" onclick="showAddStaff()">+ Add Staff</button>
      </div>
      <div class="people-grid" id="staffGrid">
        ${cards || '<p class="empty-note">No staff added yet</p>'}
      </div>
    </div>
    <div class="panel">
      <h2>🕒 Staff Attendance — ${fmtDate(date)}</h2>
      <p class="empty-note">P = Present &nbsp; A = Absent &nbsp; L = Late. Marking "Present" auto-captures location.</p>
      <table><tr><th>ID</th><th>Name</th><th>Designation</th><th>Status</th><th>Location</th></tr>
      ${attRows || '<tr><td colspan="5" class="empty-note">No staff yet</td></tr>'}</table>
      <button class="add-btn" style="margin-top:12px;" onclick="saveAttendance('staff')">Save Staff Attendance</button>
    </div>`;
  },

  fees(){
    const restricted = isRestrictedTeacher();
    const parentView = isParent();
    const feeList = restricted
      ? db.fees.filter(f=>{ const s = findStudentAnywhere(f.id); return s && s.cls===currentUser.assignedClass; })
      : parentView
      ? db.fees.filter(f=>f.id === currentUser.assignedStudent)
      : db.fees;
    const rows = feeList.map(f=>{
      const student = findStudentAnywhere(f.id);
      const name = student ? student.name : "(unknown)";
      const cls = student ? student.cls : "-";
      const father = student ? student.father : "-";
      const address = student ? student.address : "-";
      const bal = f.total - f.paid;
      const pct = f.total>0 ? Math.round((f.paid/f.total)*100) : 0;
      const status = bal<=0 ? "Paid" : (f.paid===0 ? "Unpaid" : "Partial");
      const msg = buildFeeReminderMessage(name, cls, bal, f.due);
      const target = formatIndianPhone(f.parentContact);
      const reminderBtn = (bal>0 && target)
        ? `<a class="wa-btn" target="_blank" href="https://wa.me/${target}?text=${encodeURIComponent(msg)}">Send Reminder</a>`
        : (bal>0 ? `<span class="empty-note">Add parent number</span>` : `<span class="empty-note">—</span>`);
      const qrBtn = (bal>0 && db.settings.upiId) ? `<button class="mini-btn" onclick="showPaymentQR('${f.id}')">📱 QR</button>` : '';
      const payBtn = (bal>0 && !restricted && !parentView) ? `<button class="mini-btn" onclick="showRecordPayment('${f.id}')">Record Payment</button>` : '';
      const receiptBtn = (f.payments && f.payments.length>0) ? `<button class="mini-btn" onclick="downloadReceipt('${f.id}')">🧾 Receipt</button>` : '';
      const editContactBtn = (!restricted && !parentView) ? `<a href="#" onclick="showEditParentContact('${f.id}'); return false;" style="font-size:11px;">✏ edit</a>` : '';
      const canBulk = bal>0 && target && !restricted && !parentView;
      const checkboxCell = (restricted || parentView) ? '' : `<td>${canBulk ? `<input type="checkbox" class="fee-checkbox" data-feeid="${f.id}" onchange="updateBulkReminderCount()">` : ''}</td>`;
      return `<tr>
        ${checkboxCell}
        <td><b>${f.id}</b></td><td>${name}</td><td>${cls}</td><td>${father}</td><td>${address}</td>
        <td style="white-space:nowrap;">${f.parentContact || '—'}<br>${editContactBtn}</td>
        <td>₹${f.total.toLocaleString('en-IN')}</td><td>₹${f.paid.toLocaleString('en-IN')}</td>
        <td>₹${bal.toLocaleString('en-IN')}</td>
        <td style="min-width:90px;">
          <div style="background:var(--paper-dim); border-radius:20px; overflow:hidden; height:8px;">
            <div style="width:${pct}%; height:100%; background:${pct>=100?'var(--green)':(pct===0?'var(--red)':'var(--amber)')};"></div>
          </div>
          <span style="font-size:10.5px; color:var(--ink-soft);">${pct}%</span>
        </td>
        <td>${fmtDate(f.due)}</td>
        <td><span class="badge ${status.toLowerCase()}">${status}</span></td>
        <td style="display:flex; gap:6px; flex-wrap:wrap;">${reminderBtn}${qrBtn}${payBtn}${receiptBtn}</td>
      </tr>`;
    }).join('');

    let reportPanel = '';
    if(!restricted && !parentView){
      const byClass = {};
      db.fees.forEach(f=>{
        const s = findStudentAnywhere(f.id);
        const cls = s ? s.cls : "Unknown";
        if(!byClass[cls]) byClass[cls] = {total:0, paid:0};
        byClass[cls].total += f.total;
        byClass[cls].paid += f.paid;
      });
      const classRows = Object.keys(byClass).sort().map(cls=>{
        const d = byClass[cls];
        const pending = d.total - d.paid;
        const pct = d.total>0 ? Math.round((d.paid/d.total)*100) : 0;
        return `<tr><td>Class ${cls}</td><td>₹${d.total.toLocaleString('en-IN')}</td><td>₹${d.paid.toLocaleString('en-IN')}</td><td>₹${pending.toLocaleString('en-IN')}</td><td>${pct}%</td></tr>`;
      }).join('');
      reportPanel = `
      <div class="panel">
        <h2>📊 Class-wise Fees Collection Report</h2>
        <table><tr><th>Class</th><th>Total Fees</th><th>Collected</th><th>Pending</th><th>% Collected</th></tr>
        ${classRows || '<tr><td colspan="5" class="empty-note">No fee data yet</td></tr>'}</table>
      </div>`;
    }

    return `
    <div class="panel">
      <div class="toolbar">
        <h2 style="margin:0;">💰 Fee Records${restricted ? ' — Class '+currentUser.assignedClass : ''}${parentView ? ' — Your Child' : ''}</h2>
        ${(restricted || parentView) ? '' : '<button class="add-btn" onclick="showAddFee()">+ Add Fee Record</button>'}
      </div>
      ${parentView ? '' : '<input class="search" id="feesSearch" placeholder="Search by student name or ID..." oninput="filterTable(\'feesSearch\',\'feesTable\')" style="margin-bottom:14px; width:100%; max-width:320px;">'}
      ${(restricted || parentView) ? '' : `
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
        <label style="font-size:12.5px; display:flex; align-items:center; gap:6px;"><input type="checkbox" id="feeSelectAll" onchange="toggleSelectAllFees(this.checked)"> Select All Due</label>
        <button class="add-btn" id="bulkReminderBtn" onclick="startBulkReminders()" disabled>📤 Send Bulk Reminders (0)</button>
      </div>`}
      <div class="table-scroll">
        <table id="feesTable"><tr>${(restricted || parentView) ? '' : '<th></th>'}<th>Sr. No.</th><th>Name</th><th>Class</th><th>Father's Name</th><th>Address</th><th>Parent WhatsApp</th><th>Total</th><th>Paid</th><th>Balance</th><th>Progress</th><th>Due Date</th><th>Status</th><th>Actions</th></tr>
        ${rows || '<tr><td colspan="13" class="empty-note">No fee records yet</td></tr>'}</table>
      </div>
      <p class="empty-note">Reminders include the remaining balance and a UPI payment link, sent to the parent's WhatsApp number.</p>
    </div>
    ${reportPanel}`;
  },

  exams(){
    const restricted = isRestrictedTeacher();
    const parentView = isParent();
    const list = restricted
      ? db.exams.filter(x=>x.cls===currentUser.assignedClass)
      : parentView
      ? db.exams.filter(x=>x.studentId === currentUser.assignedStudent)
      : db.exams;
    const rows = list.slice().reverse().map(x=>`
      <tr>
        <td><b>${x.srNo}</b></td><td>${x.studentName}</td><td>${x.cls}</td><td>${x.sec}</td>
        <td>${x.examName}</td><td>${x.obtained}/${x.maxTotal}</td><td>${x.percentage}%</td>
        <td><span class="grade-pill grade-${x.grade}">${x.grade}</span></td>
        <td><button class="mini-btn" onclick="viewMarksheet('${x.id}')">View Marksheet</button></td>
      </tr>`).join('');
    return `
    <div class="panel">
      <div class="toolbar">
        <h2 style="margin:0;">📝 Exam Records${restricted ? ' — Class '+currentUser.assignedClass : ''}${parentView ? ' — Your Child' : ''}</h2>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${parentView ? '' : '<button class="mini-btn" onclick="downloadExamsExcel()">⬇ Download Excel</button>'}
          ${parentView ? '' : '<button class="add-btn" onclick="showAddExam()">+ Add Exam Result</button>'}
        </div>
      </div>
      <div class="table-scroll">
        <table><tr><th>Sr No.</th><th>Student</th><th>Class</th><th>Sec</th><th>Exam</th><th>Marks</th><th>%</th><th>Grade</th><th></th></tr>
        ${rows || '<tr><td colspan="9" class="empty-note">No exam records yet</td></tr>'}</table>
      </div>
    </div>`;
  },

  timetable(){
    let head = `<div class="tt-cell head">Day</div>` + TT_PERIODS.map(p=>`<div class="tt-cell head">${p.replace('\n','<br>')}</div>`).join('');
    let rows = TT_DAYS.map(d=>{
      let cells = db.timetable[d].map(subj=>`<div class="tt-cell ${subj==='LUNCH'?'lunch':''}">${subj}</div>`).join('');
      return `<div class="tt-cell day">${d}</div>${cells}`;
    }).join('');
    return `
    <div class="panel">
      <h2>🗓 Class 10-A — Weekly Timetable</h2>
      <div class="tt-grid">${head}${rows}</div>
      <p class="empty-note">Ask me anytime if you'd like an editable timetable or separate timetables per class.</p>
    </div>`;
  },

  transport(){
    const busCards = db.transport.buses.map(b=>{
      const count = db.transport.assignments.filter(a=>a.busId===b.id).length;
      return `
      <div class="person-card">
        <div class="avatar-lg">🚌</div>
        <div class="p-name">${b.busNo}</div>
        <div class="p-sub">${b.id} &nbsp;•&nbsp; ${b.route}</div>
        <div class="p-detail"><span class="ic">🧑‍✈️</span> Driver: ${b.driverName} (${b.driverContact})</div>
        <div class="p-detail"><span class="ic">🎫</span> Conductor: ${b.conductorName} (${b.conductorContact})</div>
        <div class="p-detail"><span class="ic">💺</span> Capacity: ${b.capacity}</div>
        <div class="p-tags"><span class="elig-tag">${count} students assigned</span></div>
      </div>`;
    }).join('');

    const assignCards = db.transport.assignments.map(a=>{
      const s = db.students.find(x=>x.id===a.studentId);
      const b = db.transport.buses.find(x=>x.id===a.busId);
      const bal = (a.totalDue||0) - (a.paid||0);
      const status = bal<=0 ? "Paid" : (a.paid===0 ? "Unpaid" : "Partial");
      const name = s ? s.name : '(unknown)';
      const cls = s ? s.cls : '-';
      const pct = a.totalDue>0 ? Math.round(((a.paid||0)/a.totalDue)*100) : 0;
      const msg = `Dear Parent, this is a transport fee reminder from ${SCHOOL_NAME} for ${name} (Class ${cls}). Balance due: ₹${bal.toLocaleString('en-IN')} for bus transport. Please pay at the earliest. - Principal, Mr. Arun Mishra`;
      const target = s ? formatIndianPhone(s.contact) : '';
      const reminderBtn = (bal>0 && target)
        ? `<a class="wa-btn" target="_blank" href="https://wa.me/${target}?text=${encodeURIComponent(msg)}">Send Reminder</a>`
        : (bal>0 ? `<span class="empty-note">No contact number on file</span>` : '');
      const payBtn = bal>0 ? `<button class="mini-btn" onclick="showRecordTransportPayment('${a.id}')">Record Payment</button>` : '';
      return `
      <div class="person-card">
        ${s && s.photo ? `<img src="${s.photo}" class="avatar-lg">` : `<div class="avatar-lg">${name.charAt(0)}</div>`}
        <div class="p-name">${name}</div>
        <div class="p-sub">Class ${cls} &nbsp;•&nbsp; ${b ? b.busNo : '(no bus)'}</div>
        <div class="p-detail"><span class="ic">🗺</span> ${a.pickupPoint}</div>
        <div class="p-detail"><span class="ic">🚌</span> ${b ? b.route : '-'}</div>
        <div style="margin:10px 0 4px;">
          <div style="background:var(--paper-dim); border-radius:20px; overflow:hidden; height:8px;">
            <div style="width:${pct}%; height:100%; background:${pct>=100?'var(--green)':(pct===0?'var(--red)':'var(--amber)')};"></div>
          </div>
          <div style="font-size:11px; color:var(--ink-soft); margin-top:3px;">₹${(a.paid||0).toLocaleString('en-IN')} of ₹${(a.totalDue||0).toLocaleString('en-IN')} paid</div>
        </div>
        <div class="p-tags"><span class="badge ${status.toLowerCase()}">${status}</span></div>
        <div class="p-actions">${reminderBtn}${payBtn}</div>
      </div>`;
    }).join('');

    return `
    <div class="panel">
      <div class="toolbar"><h2 style="margin:0;">🚌 Buses / Routes</h2><button class="add-btn" onclick="showAddBus()">+ Add Bus</button></div>
      <div class="people-grid">
        ${busCards || '<p class="empty-note">No buses added yet</p>'}
      </div>
    </div>
    <div class="panel">
      <div class="toolbar"><h2 style="margin:0;">🎒 Student Transport Assignments &amp; Fees</h2><button class="add-btn" onclick="showAddTransportAssignment()">+ Assign Student</button></div>
      <div class="people-grid">
        ${assignCards || '<p class="empty-note">No assignments yet</p>'}
      </div>
      <p class="empty-note">Reminders open WhatsApp with a pre-filled message using the number set in Settings.</p>
    </div>`;
  },

  announcements(){
    const cards = db.announcements.slice().reverse().map(a=>`
      <div class="ann-card">
        <div class="ann-date">${fmtDate(a.date)}</div>
        <h3>${a.title}</h3>
        <p>${a.desc}</p>
        <div class="ann-by">Posted by ${a.by}</div>
      </div>`).join('');
    return `
    <div class="panel">
      <div class="toolbar"><h2 style="margin:0;">📢 All Announcements</h2><button class="add-btn" onclick="showAddAnnouncement()">+ New Announcement</button></div>
      ${cards || '<p class="empty-note">No announcements yet</p>'}
    </div>`;
  },

  homework(){
    const restricted = isRestrictedTeacher();
    const parentView = isParent();
    let list = db.homework;
    let filterCls = null;
    if(restricted) filterCls = currentUser.assignedClass;
    else if(parentView){ const s = findStudentAnywhere(currentUser.assignedStudent); filterCls = s ? s.cls : null; }
    else if(homeworkClassFilter) filterCls = homeworkClassFilter;
    if(filterCls) list = list.filter(h=>h.cls === filterCls);

    const classes = [...new Set(db.students.map(s=>s.cls))].sort();
    const canAdd = !parentView;
    const cards = list.slice().reverse().map(h=>`
      <div class="ann-card">
        <div class="ann-date">${fmtDate(h.date)} &nbsp;•&nbsp; Class ${h.cls} &nbsp;•&nbsp; ${h.subject}</div>
        <h3>${h.title}</h3>
        <p>${h.description}</p>
        <div class="ann-by">Posted by ${h.postedBy}${(!parentView) ? ` &nbsp;•&nbsp; <a href="#" onclick="deleteHomework('${h.id}'); return false;" style="color:var(--red);">Delete</a>` : ''}</div>
      </div>`).join('');
    return `
    <div class="panel">
      <div class="toolbar">
        <h2 style="margin:0;">📚 Homework${filterCls ? ' — Class '+filterCls : ''}</h2>
        ${canAdd ? `<button class="add-btn" onclick="showAddHomework()">+ Add Homework</button>` : ''}
      </div>
      ${(!restricted && !parentView) ? `<div class="filter-row"><select id="hwClassFilter" onchange="setHomeworkClassFilter(this.value)"><option value="">All Classes</option>${classes.map(c=>`<option value="${c}" ${homeworkClassFilter===c?'selected':''}>Class ${c}</option>`).join('')}</select></div>` : ''}
      ${cards || '<p class="empty-note">No homework posted yet</p>'}
    </div>`;
  },

  access(){
    const rows = db.users.map(u=>`
      <tr><td><b>${u.u}</b></td><td>••••••••</td><td>${u.name}</td><td>${u.role}</td>
      <td><span class="badge active">${u.status}</span></td>
      <td><button class="mini-btn" onclick="showResetPassword('${u.u}')">Reset Password</button></td></tr>
    `).join('');
    return `
    <div class="panel">
      <div class="toolbar"><h2 style="margin:0;">🔐 User Accounts</h2><button class="add-btn" onclick="showAddUser()">+ Add User</button></div>
      <table><tr><th>Username</th><th>Password</th><th>Full Name</th><th>Role</th><th>Status</th><th>Actions</th></tr>${rows}</table>
      <p class="empty-note">Passwords are masked here for display. Use "Reset Password" if a user forgets their login.</p>
    </div>`;
  },

  salary(){
    const month = todayISO().slice(0,7);
    const rows = db.staff.map(s=>{
      const key = s.id + "_" + month;
      const rec = db.salary[key];
      const status = rec ? rec.status : "Not Set";
      const net = rec ? rec.net : 0;
      const badgeClass = status === "Paid" ? "active" : (status === "Pending" ? "partial" : "unpaid");
      return `<tr>
        <td><b>${s.id}</b></td><td>${s.name}</td><td>${s.desig}</td>
        <td>${rec ? '₹'+net.toLocaleString('en-IN') : '—'}</td>
        <td><span class="badge ${badgeClass}">${status}</span></td>
        <td style="white-space:nowrap;">${s.bankAccount}<br><span style="font-size:11px;color:var(--ink-soft);">${s.bankName}</span></td>
        <td style="white-space:nowrap;">
          <button class="mini-btn" onclick="showSetSalary('${s.id}')">${rec ? 'Edit' : 'Set'} Salary</button>
          ${rec && rec.status==='Pending' ? `<button class="mini-btn" onclick="markSalaryPaid('${s.id}')" style="margin-top:4px;">Mark Paid</button>` : ''}
        </td>
      </tr>`;
    }).join('');
    return `
    <div class="panel">
      <h2>💵 Staff Salary — ${fmtDate(month+'-01')}</h2>
      <p class="empty-note">This tracks salary records only. Actual bank transfer must be done manually via your bank's NEFT/UPI/IMPS — then mark it "Paid" here for your records.</p>
      <div class="table-scroll">
        <table><tr><th>ID</th><th>Name</th><th>Designation</th><th>Net Pay</th><th>Status</th><th>Bank Details</th><th>Actions</th></tr>
        ${rows || '<tr><td colspan="7" class="empty-note">No staff yet</td></tr>'}</table>
      </div>
      <p class="empty-note">Swipe left/right on the table to see all columns on a small screen.</p>
    </div>`;
  },

  settings(){
    const wa = schoolWhatsApp();
    const fbStatusBadge = firebaseReady
      ? `<span class="badge active">Connected</span>`
      : `<span class="badge unpaid">Not Connected</span>`;
    return `
    <div class="panel" style="max-width:460px;">
      <h2>💬 WhatsApp Settings</h2>
      <div class="field">
        <label>School WhatsApp Number</label>
        <input id="set_whatsapp" type="text" placeholder="e.g. 919876543210 (country code, no + or spaces)" value="${wa}">
      </div>
      <p class="empty-note">Shown on the Dashboard as the school's contact number. Reminders themselves are sent to each parent's own number (set per fee record).</p>
      <p class="form-err" id="set_err"></p>
      <button class="primary-btn" style="max-width:220px;" onclick="submitSettings()">Save Settings</button>
    </div>
    <div class="panel" style="max-width:460px;">
      <h2>💳 Payment Details (for Fee Reminders)</h2>
      <div class="field"><label>School UPI ID</label><input id="set_upi" type="text" placeholder="e.g. schoolname@okicici" value="${db.settings.upiId||''}"></div>
      <div class="field"><label>Bank Account Number</label><input id="set_bankacc" type="text" value="${db.settings.bankAccount||''}"></div>
      <div class="field"><label>IFSC Code</label><input id="set_ifsc" type="text" value="${db.settings.ifsc||''}"></div>
      <div class="field"><label>Bank Name</label><input id="set_bankname" type="text" value="${db.settings.bankName||''}"></div>
      <div class="field">
        <label>Payment QR Code Image (photo of your bank/PhonePe/GPay QR sticker)</label>
        ${db.settings.qrImage ? `<img src="${db.settings.qrImage}" style="width:120px;height:120px;object-fit:contain;border:1px solid var(--line);border-radius:8px;margin-bottom:8px;display:block;">` : ''}
        <input id="set_qr" type="file" accept="image/*">
        <div class="empty-note">Upload a photo of your actual QR sticker — this will be shown to parents instead of a generated code.</div>
      </div>
      <p class="empty-note">When a UPI ID is set, fee reminders include a tap-to-pay UPI link and a "📱 QR" scan option so parents can pay instantly via PhonePe, Google Pay, Paytm, or BHIM.</p>
      <p class="form-err" id="set_pay_err"></p>
      <button class="primary-btn" style="max-width:220px;" onclick="submitPaymentSettings()">Save Payment Details</button>
    </div>
    <div class="panel" style="max-width:460px;">
      <h2>📚 Manage Exam Subjects</h2>
      <p class="empty-note">This list appears by default whenever you add a new exam result — you can still add/remove subjects per exam too.</p>
      <div class="p-tags" style="justify-content:flex-start;">
        ${(db.settings.subjects||[]).map((s,i)=>`<span class="elig-tag">${s} <a href="#" onclick="removeSubject(${i}); return false;" style="color:var(--red); text-decoration:none; margin-left:4px;">✕</a></span>`).join('') || '<span class="empty-note">No subjects yet</span>'}
      </div>
      <div class="field" style="display:flex; gap:8px; align-items:flex-end; margin-top:14px;">
        <div style="flex:1;"><label>New Subject</label><input id="new_subject" type="text" placeholder="e.g. Sanskrit"></div>
        <button class="mini-btn" onclick="addSubjectToSettings()">+ Add</button>
      </div>
    </div>
    <div class="panel" style="max-width:460px;">
      <h2>📅 Academic Session</h2>
      <div class="field"><label>Current Academic Session</label><input id="set_session" type="text" placeholder="e.g. 2026-27" value="${db.settings.currentSession||''}"></div>
      <p class="empty-note">Applied automatically to new Fee and Exam records so you can tell different years apart later.</p>
      <p class="form-err" id="set_session_err"></p>
      <button class="primary-btn" style="max-width:220px;" onclick="submitSessionSettings()">Save Session</button>
    </div>
    <div class="panel" style="max-width:460px;">
      <h2>🏷 Fee Structure (Class-wise)</h2>
      <p class="empty-note">Set the standard yearly fee per class — it will auto-fill when you add a fee record for a student in that class.</p>
      <div id="feeStructureList">
        ${[...new Set(db.students.map(s=>s.cls))].sort().map(c=>`
          <div class="field" style="display:flex; gap:8px; align-items:flex-end;">
            <div style="flex:1;"><label>Class ${c}</label><input type="number" class="fs-input" data-cls="${c}" placeholder="e.g. 50000" value="${db.settings.feeStructure && db.settings.feeStructure[c] ? db.settings.feeStructure[c] : ''}"></div>
          </div>`).join('') || '<p class="empty-note">Add students first to set class fees.</p>'}
      </div>
      <button class="primary-btn" style="max-width:220px; margin-top:8px;" onclick="submitFeeStructure()">Save Fee Structure</button>
    </div>
    <div class="panel" style="max-width:460px;">
      <h2>☁ Cloud Backup Status</h2>
      <p style="font-size:13.5px;">Firebase connection: ${fbStatusBadge}</p>
      <p class="empty-note">${firebaseReady ? "Your data is being saved to Firebase automatically." : "Firebase is not set up yet — data will reset on reload. Ask Claude for the setup guide."}</p>
    </div>
    <div class="panel" style="max-width:460px;">
      <h2>⬇ Download Backup</h2>
      <p class="empty-note">Download a full copy of all school data as an Excel file you can save anywhere.</p>
      <button class="add-btn" onclick="downloadBackup()">⬇ Download Backup (Excel)</button>
    </div>
    <div class="panel" style="max-width:460px;">
      <h2>📥 Import Student Data</h2>
      <p class="empty-note">
        Note: this app cannot directly connect to the Prerna Portal or any government/school database —
        those systems don't allow outside apps to log in or pull data automatically for security reasons.
        The practical way in: export your student list from Prerna (or any system) as Excel/CSV, then upload it here.
      </p>
      <div class="import-box">
        <div style="font-size:13px; color:var(--ink-soft);">Excel file should have columns: srno, name, cls, sec, roll, gender, dob, father, contact, address. "srno" is your register number and must be unique — rows without it (or with a Sr. No. already used) will be skipped.</div>
        <input type="file" id="importFile" accept=".xlsx,.xls,.csv">
        <br>
        <button class="mini-btn" style="margin-top:10px;" onclick="importStudents()">Import Students</button>
      </div>
      <p class="form-err" id="import_err"></p>
    </div>`;
  }
};

function filterTable(inputId, tableId){
  const q = document.getElementById(inputId).value.toLowerCase();
  const table = document.getElementById(tableId);
  Array.from(table.rows).slice(1).forEach(row=>{
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

function filterPeople(gridId, searchInputId, classSelectId){
  const q = searchInputId ? document.getElementById(searchInputId).value.toLowerCase() : '';
  const cls = classSelectId ? document.getElementById(classSelectId).value : '';
  const grid = document.getElementById(gridId);
  if(!grid) return;
  Array.from(grid.children).forEach(card=>{
    if(!card.dataset) return;
    const matchesSearch = !q || (card.dataset.search || '').includes(q);
    const matchesClass = !cls || card.dataset.class === cls;
    card.style.display = (matchesSearch && matchesClass) ? '' : 'none';
  });
}

/* ---------------- ATTENDANCE (P/A/L + location) ---------------- */
let attendanceDraft = null;
let attendanceClassFilter = "";
function setAttendanceClassFilter(cls){
  attendanceClassFilter = cls;
  rerenderCurrent();
}

let homeworkClassFilter = "";
function setHomeworkClassFilter(cls){
  homeworkClassFilter = cls;
  rerenderCurrent();
}

function initAttendanceDraft(date){
  if(attendanceDraft && attendanceDraft.date === date) return;
  attendanceDraft = { date, student:{}, staff:{} };
  db.students.forEach(s=>{
    const rec = (db.studentAttendance[date] && db.studentAttendance[date][s.id]) || {status:"P", location:null};
    attendanceDraft.student[s.id] = { status: rec.status, location: rec.location || null };
  });
  db.staff.forEach(s=>{
    const rec = (db.staffAttendance[date] && db.staffAttendance[date][s.id]) || {status:"P", location:null};
    attendanceDraft.staff[s.id] = { status: rec.status, location: rec.location || null };
  });
}

function attBtnGroup(kind, id, current){
  const opts = [
    {v:"P", cls:"present"},
    {v:"A", cls:"absent"},
    {v:"L", cls:"leave"},
  ];
  return `<div class="att-btn-group compact">${opts.map(o=>
    `<button type="button" class="att-btn compact ${o.cls} ${current===o.v?'active':''}" onclick="setAttendanceStatus('${kind}','${id}','${o.v}')">${o.v}</button>`
  ).join('')}</div>`;
}

function locationCell(id){
  const rec = attendanceDraft.staff[id];
  if(rec.location){
    return `<a class="mini-btn" target="_blank" href="https://www.google.com/maps?q=${rec.location.lat},${rec.location.lng}">📍 View</a>`;
  }
  if(rec.status === 'P'){
    return `<button class="mini-btn" onclick="captureLocationFor('${id}')">📍 Capture</button>`;
  }
  return `<span class="empty-note">—</span>`;
}

function setAttendanceStatus(kind, id, status){
  attendanceDraft[kind][id].status = status;
  if(kind === 'staff' && status === 'P' && !attendanceDraft.staff[id].location){
    captureLocationFor(id);
  }
  rerenderCurrent();
}

function captureLocationFor(id){
  if(!navigator.geolocation){ return; }
  navigator.geolocation.getCurrentPosition(
    pos=>{
      attendanceDraft.staff[id].location = { lat: pos.coords.latitude.toFixed(5), lng: pos.coords.longitude.toFixed(5) };
      if(document.getElementById('viewTitle').textContent === titles.staff) rerenderCurrent();
    },
    err=>{ /* permission denied or unavailable — leave as not captured */ },
    { timeout: 8000 }
  );
}

async function saveAttendance(kind){
  const date = todayISO();
  if(kind === 'student'){
    db.studentAttendance[date] = JSON.parse(JSON.stringify(attendanceDraft.student));
    await fsWrite(firebaseReady ? firestoreDb.collection('attendanceStudents').doc(date).set(db.studentAttendance[date]) : Promise.resolve());
  } else {
    db.staffAttendance[date] = JSON.parse(JSON.stringify(attendanceDraft.staff));
    await fsWrite(firebaseReady ? firestoreDb.collection('attendanceStaff').doc(date).set(db.staffAttendance[date]) : Promise.resolve());
  }
  rerenderCurrent();
}

/* ---------------- ADD STUDENT ---------------- */
function studentFormFields(s, isNew){
  s = s || {};
  const srNoField = isNew
    ? `<div class="field"><label>Sr. No. (Register Number)</label><input id="f_srno" type="text" placeholder="e.g. 245 or 2026/045"></div>`
    : `<div class="field"><label>Sr. No. (Register Number)</label><input type="text" value="${s.id||''}" disabled style="background:var(--paper-dim); color:var(--ink-soft);"></div>`;
  return `
    ${srNoField}
    <div class="field"><label>Full Name</label><input id="f_name" type="text" value="${s.name||''}" placeholder="e.g. Ravi Kumar"></div>
    <div class="field"><label>Class</label><input id="f_cls" type="text" value="${s.cls||''}" placeholder="e.g. 10"></div>
    <div class="field"><label>Section</label><input id="f_sec" type="text" value="${s.sec||''}" placeholder="e.g. A"></div>
    <div class="field"><label>Roll No.</label><input id="f_roll" type="number" value="${s.roll||''}" placeholder="e.g. 12"></div>
    <div class="field"><label>Gender</label><select id="f_gender">
      <option ${s.gender==='Male'?'selected':''}>Male</option>
      <option ${s.gender==='Female'?'selected':''}>Female</option>
      <option ${s.gender==='Other'?'selected':''}>Other</option>
    </select></div>
    <div class="field"><label>Date of Birth</label><input id="f_dob" type="date"></div>
    <div class="field"><label>Admission Date</label><input id="f_admdate" type="date" value="${(s.admissionDate && s.admissionDate!=='-') ? s.admissionDate : ''}"></div>
    <div class="field"><label>Father's Name</label><input id="f_father" type="text" value="${s.father||''}"></div>
    <div class="field"><label>Contact No.</label><input id="f_contact" type="text" value="${s.contact||''}" placeholder="10-digit number"></div>
    <div class="field"><label>Address</label><textarea id="f_address" rows="2" placeholder="Village/Town, Block, District">${s.address||''}</textarea></div>
    <div class="field">
      <label>Photo</label>
      ${s.photo ? `<img src="${s.photo}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;margin-bottom:6px;display:block;">` : ''}
      <input id="f_photo" type="file" accept="image/*">
    </div>
    <div class="field">
      <label>Document (Birth Certificate / Aadhar, etc.)</label>
      ${s.document ? `<div class="empty-note" style="margin-bottom:6px;">Current file: ${s.documentName||'file'} — <a href="${s.document}" target="_blank">view</a></div>` : ''}
      <input id="f_doc" type="file" accept="image/*,.pdf">
      <div class="empty-note">Max 700KB per document. Leave blank to keep existing file.</div>
    </div>
  `;
}
async function processStudentFiles(existing){
  const photoFile = document.getElementById('f_photo').files[0];
  const docFile = document.getElementById('f_doc').files[0];
  let photo = existing ? existing.photo : null;
  let docData = existing ? existing.document : null;
  let docName = existing ? existing.documentName : null;
  if(photoFile){ photo = await fileToCompressedDataURL(photoFile, 300, 0.75); }
  if(docFile){
    if(docFile.size > 700*1024){ throw new Error("Document too large — please use a file under 700KB"); }
    docData = await fileToDataURL(docFile);
    docName = docFile.name;
  }
  return {photo, document: docData, documentName: docName};
}

function showAddStudent(){
  openModal(`
    <h2>Add Student</h2>
    ${studentFormFields(null, true)}
    <p class="form-err" id="f_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitAddStudent()">Add Student</button>
    </div>
  `);
}
async function submitAddStudent(){
  const srNo = document.getElementById('f_srno').value.trim();
  const name = document.getElementById('f_name').value.trim();
  const cls = document.getElementById('f_cls').value.trim();
  if(!srNo){ document.getElementById('f_err').textContent = "Enter the Sr. No. from your admission register"; return; }
  if(!name || !cls){ document.getElementById('f_err').textContent = "Name and Class are required"; return; }
  if(db.students.find(x=>x.id===srNo) || db.alumni.find(x=>x.id===srNo)){
    document.getElementById('f_err').textContent = "This Sr. No. is already used by another student"; return;
  }
  let files;
  try{ files = await processStudentFiles(null); }
  catch(e){ document.getElementById('f_err').textContent = e.message; return; }
  const s = {
    id: srNo,
    name, cls,
    sec: document.getElementById('f_sec').value.trim() || "-",
    roll: parseInt(document.getElementById('f_roll').value,10) || 0,
    gender: document.getElementById('f_gender').value,
    dob: document.getElementById('f_dob').value ? fmtDate(document.getElementById('f_dob').value) : "-",
    admissionDate: document.getElementById('f_admdate').value || todayISO(),
    father: document.getElementById('f_father').value.trim() || "-",
    contact: document.getElementById('f_contact').value.trim() || "-",
    address: document.getElementById('f_address').value.trim() || "-",
    ...files,
  };
  db.students.push(s);
  closeModal();
  const {id, ...rest} = s;
  await fsWrite(firebaseReady ? firestoreDb.collection('students').doc(id).set(rest) : Promise.resolve());
  rerenderCurrent();
}

function showEditStudent(studentId){
  const s = db.students.find(x=>x.id===studentId);
  if(!s) return;
  openModal(`
    <h2>Edit Student — Sr. No. ${s.id}</h2>
    ${studentFormFields(s, false)}
    <p class="form-err" id="f_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitEditStudent('${studentId}')">Save Changes</button>
    </div>
  `);
}
async function submitEditStudent(studentId){
  const student = db.students.find(x=>x.id===studentId);
  if(!student) return;
  const name = document.getElementById('f_name').value.trim();
  const cls = document.getElementById('f_cls').value.trim();
  if(!name || !cls){ document.getElementById('f_err').textContent = "Name and Class are required"; return; }
  let files;
  try{ files = await processStudentFiles(student); }
  catch(e){ document.getElementById('f_err').textContent = e.message; return; }
  Object.assign(student, {
    name, cls,
    sec: document.getElementById('f_sec').value.trim() || "-",
    roll: parseInt(document.getElementById('f_roll').value,10) || 0,
    gender: document.getElementById('f_gender').value,
    dob: document.getElementById('f_dob').value ? fmtDate(document.getElementById('f_dob').value) : student.dob,
    admissionDate: document.getElementById('f_admdate').value || student.admissionDate,
    father: document.getElementById('f_father').value.trim() || "-",
    contact: document.getElementById('f_contact').value.trim() || "-",
    address: document.getElementById('f_address').value.trim() || "-",
    ...files,
  });
  closeModal();
  const {id, ...rest} = student;
  await fsWrite(firebaseReady ? firestoreDb.collection('students').doc(id).set(rest) : Promise.resolve());
  rerenderCurrent();

}

function showRemoveStudent(studentId){
  const s = db.students.find(x=>x.id===studentId);
  if(!s) return;
  openModal(`
    <h2>Mark Student as Left — ${s.name}</h2>
    <p class="empty-note">This moves the student to the Alumni (Past Students) list. Their attendance, fees, and exam history stay intact and remain viewable in Alumni — this is not a permanent delete.</p>
    <div class="field"><label>Leaving Date</label><input id="rm_date" type="date" value="${todayISO()}"></div>
    <div class="field"><label>Reason</label>
      <select id="rm_reason">
        <option>Graduated</option>
        <option>Transferred to another school</option>
        <option>Dropped out</option>
        <option>Other</option>
      </select>
    </div>
    <p class="form-err" id="rm_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" style="background:var(--red);" onclick="submitRemoveStudent('${studentId}')">Mark as Left</button>
    </div>
  `);
}
async function submitRemoveStudent(studentId){
  const idx = db.students.findIndex(x=>x.id===studentId);
  if(idx === -1) return;
  const s = db.students[idx];
  const leavingDate = document.getElementById('rm_date').value || todayISO();
  const reason = document.getElementById('rm_reason').value;
  const alumniRec = { ...s, leavingDate, reason };
  db.students.splice(idx, 1);
  db.alumni.push(alumniRec);
  closeModal();
  if(firebaseReady){
    const batch = firestoreDb.batch();
    const {id, ...rest} = alumniRec;
    batch.set(firestoreDb.collection('alumni').doc(id), rest);
    batch.delete(firestoreDb.collection('students').doc(studentId));
    await fsWrite(batch.commit());
  } else {
    await fsWrite(Promise.resolve());
  }
  rerenderCurrent();
}

async function restoreAlumnus(alumniId){
  const idx = db.alumni.findIndex(x=>x.id===alumniId);
  if(idx === -1) return;
  const a = db.alumni[idx];
  const {leavingDate, reason, ...studentRec} = a;
  db.alumni.splice(idx, 1);
  db.students.push(studentRec);
  if(firebaseReady){
    const batch = firestoreDb.batch();
    const {id, ...rest} = studentRec;
    batch.set(firestoreDb.collection('students').doc(id), rest);
    batch.delete(firestoreDb.collection('alumni').doc(alumniId));
    await fsWrite(batch.commit());
  } else {
    await fsWrite(Promise.resolve());
  }
  rerenderCurrent();
}

/* ---------------- BULK PROMOTE ---------------- */
function showPromoteStudents(){
  const classes = [...new Set(db.students.map(s=>s.cls))].sort((a,b)=>{
    const na = parseInt(a,10), nb = parseInt(b,10);
    if(!isNaN(na) && !isNaN(nb)) return na-nb;
    return String(a).localeCompare(String(b));
  });
  const rows = classes.map(c=>{
    const n = parseInt(c,10);
    const guess = !isNaN(n) ? String(n+1) : '';
    const count = db.students.filter(s=>s.cls===c).length;
    return `
    <div class="field" style="display:flex; gap:8px; align-items:center;">
      <div style="flex:1; font-size:13px;"><b>Class ${c}</b> <span class="empty-note">(${count} students)</span></div>
      <span style="font-size:13px;">→</span>
      <input type="text" class="promote-input" data-cls="${c}" placeholder="e.g. ${guess||'11'} or GRADUATE" value="${guess}" style="flex:1; padding:8px 10px; border:1.5px solid var(--line); border-radius:8px;">
    </div>`;
  }).join('');
  openModal(`
    <h2>🎓 Promote Students to Next Class</h2>
    <p class="empty-note">Type the new class for each row, or type <b>GRADUATE</b> to move that class's students to Alumni (e.g. for a graduating Class 12). Leave a row blank to skip it.</p>
    ${rows || '<p class="empty-note">No students yet</p>'}
    <p class="form-err" id="promote_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" style="background:var(--red);" onclick="submitPromoteStudents()">Apply Promotion</button>
    </div>
  `);
}
async function submitPromoteStudents(){
  const mapping = {};
  document.querySelectorAll('.promote-input').forEach(inp=>{
    const val = inp.value.trim();
    if(val) mapping[inp.dataset.cls] = val;
  });
  if(Object.keys(mapping).length === 0){ document.getElementById('promote_err').textContent = "Enter at least one new class"; return; }
  closeModal();
  const batch = firebaseReady ? firestoreDb.batch() : null;
  const leavingDate = todayISO();
  const toGraduate = [];
  db.students.forEach(s=>{
    const newCls = mapping[s.cls];
    if(!newCls) return;
    if(newCls.toUpperCase() === 'GRADUATE'){
      toGraduate.push(s.id);
    } else {
      s.cls = newCls;
      if(batch){ const {id, ...rest} = s; batch.set(firestoreDb.collection('students').doc(id), rest); }
    }
  });
  toGraduate.forEach(sid=>{
    const idx = db.students.findIndex(x=>x.id===sid);
    if(idx === -1) return;
    const s = db.students[idx];
    const alumniRec = { ...s, leavingDate, reason: "Graduated" };
    db.students.splice(idx, 1);
    db.alumni.push(alumniRec);
    if(batch){
      const {id, ...rest} = alumniRec;
      batch.set(firestoreDb.collection('alumni').doc(id), rest);
      batch.delete(firestoreDb.collection('students').doc(sid));
    }
  });
  if(batch){ await fsWrite(batch.commit()); } else { await fsWrite(Promise.resolve()); }
  rerenderCurrent();
  alert("Promotion applied.");
}

/* ---------------- ADD STAFF ---------------- */
function staffFormFields(s){
  s = s || {};
  return `
    <div class="field"><label>Full Name</label><input id="s_name" type="text" value="${s.name||''}"></div>
    <div class="field"><label>Designation</label><input id="s_desig" type="text" value="${s.desig||''}" placeholder="e.g. Teacher"></div>
    <div class="field"><label>Department</label><input id="s_dept" type="text" value="${s.dept||''}" placeholder="e.g. Mathematics"></div>
    <div class="field"><label>Eligibility / Qualification</label><input id="s_elig" type="text" value="${s.eligibility||''}" placeholder="e.g. B.Sc, B.Ed"></div>
    <div class="field"><label>Contact No.</label><input id="s_contact" type="text" value="${s.contact||''}"></div>
    <div class="field"><label>Email</label><input id="s_email" type="email" value="${s.email||''}"></div>
    <h2 style="font-size:15px; margin-top:18px;">Bank Details (for salary records)</h2>
    <div class="field"><label>Bank Account Number</label><input id="s_bankacc" type="text" value="${(s.bankAccount&&s.bankAccount!=='-')?s.bankAccount:''}"></div>
    <div class="field"><label>IFSC Code</label><input id="s_ifsc" type="text" value="${(s.ifsc&&s.ifsc!=='-')?s.ifsc:''}"></div>
    <div class="field"><label>Bank Name</label><input id="s_bankname" type="text" value="${(s.bankName&&s.bankName!=='-')?s.bankName:''}"></div>
    <div class="field">
      <label>Photo</label>
      ${s.photo ? `<img src="${s.photo}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;margin-bottom:6px;display:block;">` : ''}
      <input id="s_photo" type="file" accept="image/*">
    </div>
    <div class="field">
      <label>Document (Certificate / ID proof, etc.)</label>
      ${s.document ? `<div class="empty-note" style="margin-bottom:6px;">Current file: ${s.documentName||'file'} — <a href="${s.document}" target="_blank">view</a></div>` : ''}
      <input id="s_doc" type="file" accept="image/*,.pdf">
      <div class="empty-note">Max 700KB per document. Leave blank to keep existing file.</div>
    </div>
  `;
}
async function processStaffFiles(existing){
  const photoFile = document.getElementById('s_photo').files[0];
  const docFile = document.getElementById('s_doc').files[0];
  let photo = existing ? existing.photo : null;
  let docData = existing ? existing.document : null;
  let docName = existing ? existing.documentName : null;
  if(photoFile){ photo = await fileToCompressedDataURL(photoFile, 300, 0.75); }
  if(docFile){
    if(docFile.size > 700*1024){ throw new Error("Document too large — please use a file under 700KB"); }
    docData = await fileToDataURL(docFile);
    docName = docFile.name;
  }
  return {photo, document: docData, documentName: docName};
}

function showAddStaff(){
  openModal(`
    <h2>Add Staff</h2>
    ${staffFormFields(null)}
    <p class="form-err" id="s_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitAddStaff()">Add Staff</button>
    </div>
  `);
}
async function submitAddStaff(){
  const name = document.getElementById('s_name').value.trim();
  const desig = document.getElementById('s_desig').value.trim();
  if(!name || !desig){ document.getElementById('s_err').textContent = "Name and Designation are required"; return; }
  let files;
  try{ files = await processStaffFiles(null); }
  catch(e){ document.getElementById('s_err').textContent = e.message; return; }
  const s = {
    id: nextId(db.staff, "STF"),
    name, desig,
    dept: document.getElementById('s_dept').value.trim() || "-",
    eligibility: document.getElementById('s_elig').value.trim() || "-",
    contact: document.getElementById('s_contact').value.trim() || "-",
    email: document.getElementById('s_email').value.trim() || "-",
    bankAccount: document.getElementById('s_bankacc').value.trim() || "-",
    ifsc: document.getElementById('s_ifsc').value.trim() || "-",
    bankName: document.getElementById('s_bankname').value.trim() || "-",
    ...files,
  };
  db.staff.push(s);
  closeModal();
  const {id, ...rest} = s;
  await fsWrite(firebaseReady ? firestoreDb.collection('staff').doc(id).set(rest) : Promise.resolve());
  rerenderCurrent();
}

function showEditStaff(staffId){
  const s = db.staff.find(x=>x.id===staffId);
  if(!s) return;
  openModal(`
    <h2>Edit Staff — ${s.id}</h2>
    ${staffFormFields(s)}
    <p class="form-err" id="s_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitEditStaff('${staffId}')">Save Changes</button>
    </div>
  `);
}
async function submitEditStaff(staffId){
  const staffMember = db.staff.find(x=>x.id===staffId);
  if(!staffMember) return;
  const name = document.getElementById('s_name').value.trim();
  const desig = document.getElementById('s_desig').value.trim();
  if(!name || !desig){ document.getElementById('s_err').textContent = "Name and Designation are required"; return; }
  let files;
  try{ files = await processStaffFiles(staffMember); }
  catch(e){ document.getElementById('s_err').textContent = e.message; return; }
  Object.assign(staffMember, {
    name, desig,
    dept: document.getElementById('s_dept').value.trim() || "-",
    eligibility: document.getElementById('s_elig').value.trim() || "-",
    contact: document.getElementById('s_contact').value.trim() || "-",
    email: document.getElementById('s_email').value.trim() || "-",
    bankAccount: document.getElementById('s_bankacc').value.trim() || "-",
    ifsc: document.getElementById('s_ifsc').value.trim() || "-",
    bankName: document.getElementById('s_bankname').value.trim() || "-",
    ...files,
  });
  closeModal();
  const {id, ...rest} = staffMember;
  await fsWrite(firebaseReady ? firestoreDb.collection('staff').doc(id).set(rest) : Promise.resolve());
  rerenderCurrent();
}

/* ---------------- ADD FEE RECORD ---------------- */
function showAddFee(){
  const options = db.students.map(s=>`<option value="${s.id}" data-contact="${s.contact}" data-cls="${s.cls}">${s.id} — ${s.name}</option>`).join('');
  openModal(`
    <h2>Add Fee Record</h2>
    <div class="field"><label>Student</label><select id="fe_id" onchange="autofillParentContact()">${options || '<option value="">No students yet</option>'}</select></div>
    <div class="field"><label>Parent's WhatsApp Number</label><input id="fe_parent" type="text" placeholder="10-digit number"></div>
    <div class="field"><label>Total Fees (₹)</label><input id="fe_total" type="number" placeholder="e.g. 50000"></div>
    <div class="field"><label>Paid Amount (₹)</label><input id="fe_paid" type="number" placeholder="e.g. 0" value="0"></div>
    <div class="field"><label>Due Date</label><input id="fe_due" type="date"></div>
    <p class="form-err" id="fe_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitAddFee()">Add Record</button>
    </div>
  `);
  autofillParentContact();
}
function autofillParentContact(){
  const sel = document.getElementById('fe_id');
  const opt = sel.options[sel.selectedIndex];
  document.getElementById('fe_parent').value = opt ? (opt.dataset.contact || '') : '';
  const cls = opt ? opt.dataset.cls : null;
  const structAmt = cls && db.settings.feeStructure ? db.settings.feeStructure[cls] : null;
  const totalInp = document.getElementById('fe_total');
  if(structAmt && !totalInp.value){ totalInp.value = structAmt; }
}
async function submitAddFee(){
  const id = document.getElementById('fe_id').value;
  const total = parseInt(document.getElementById('fe_total').value,10);
  if(!id || !total){ document.getElementById('fe_err').textContent = "Select a student and enter total fees"; return; }
  const paid = parseInt(document.getElementById('fe_paid').value,10) || 0;
  const rec = {
    total, paid, due: document.getElementById('fe_due').value || todayISO(),
    parentContact: document.getElementById('fe_parent').value.trim(),
    payments: paid>0 ? [{amount:paid, date:todayISO(), mode:"Cash", receiptNo:"RCPT"+Date.now()}] : [],
    session: db.settings.currentSession || "",
  };
  db.fees.push({ id, ...rec });
  closeModal();
  await fsWrite(firebaseReady ? firestoreDb.collection('fees').doc(id).set(rec) : Promise.resolve());
  rerenderCurrent();
}

function showRecordPayment(feeId){
  openModal(`
    <h2>Record Payment</h2>
    <div class="field"><label>Amount Received (₹)</label><input id="pay_amt" type="number" placeholder="e.g. 10000"></div>
    <div class="field"><label>Payment Mode</label>
      <select id="pay_mode"><option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Cheque</option></select>
    </div>
    <p class="form-err" id="pay_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitPayment('${feeId}')">Save Payment</button>
    </div>
  `);
}
async function submitPayment(feeId){
  const amt = parseInt(document.getElementById('pay_amt').value,10);
  if(!amt || amt<=0){ document.getElementById('pay_err').textContent = "Enter a valid amount"; return; }
  const mode = document.getElementById('pay_mode').value;
  const rec = db.fees.find(f=>f.id===feeId);
  if(!rec) return;
  rec.paid += amt;
  if(!rec.payments) rec.payments = [];
  const receiptNo = "RCPT" + Date.now();
  const paymentEntry = { amount: amt, date: todayISO(), mode, receiptNo };
  rec.payments.push(paymentEntry);
  closeModal();
  await fsWrite(firebaseReady ? firestoreDb.collection('fees').doc(feeId).update({
    paid: firebase.firestore.FieldValue.increment(amt),
    payments: firebase.firestore.FieldValue.arrayUnion(paymentEntry)
  }) : Promise.resolve());
  rerenderCurrent();
  downloadReceipt(feeId);
}

function showEditParentContact(feeId){
  const rec = db.fees.find(f=>f.id===feeId);
  if(!rec) return;
  openModal(`
    <h2>Edit Parent's WhatsApp Number</h2>
    <div class="field"><label>Parent's WhatsApp Number</label><input id="epc_num" type="text" value="${rec.parentContact||''}" placeholder="10-digit number"></div>
    <p class="form-err" id="epc_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitEditParentContact('${feeId}')">Save</button>
    </div>
  `);
}
async function submitEditParentContact(feeId){
  const val = document.getElementById('epc_num').value.trim();
  const rec = db.fees.find(f=>f.id===feeId);
  if(!rec) return;
  rec.parentContact = val;
  closeModal();
  await fsWrite(firebaseReady ? firestoreDb.collection('fees').doc(feeId).update({parentContact: val}) : Promise.resolve());
  rerenderCurrent();
}

function showPaymentQR(feeId){
  const rec = db.fees.find(f=>f.id===feeId);
  if(!rec) return;
  const student = findStudentAnywhere(feeId);
  const bal = rec.total - rec.paid;
  const upiLink = buildUpiLink(bal, `Fee for ${student?student.name:feeId}`);
  const s = db.settings;
  const accDetails = (s.upiId || s.bankAccount) ? `
    <div style="background:var(--paper-dim); border-radius:8px; padding:12px; font-size:12.5px; text-align:left; margin-top:10px;">
      ${s.upiId ? `<div><b>UPI ID:</b> ${s.upiId}</div>` : ''}
      ${s.bankAccount ? `<div><b>Account No.:</b> ${s.bankAccount}</div>` : ''}
      ${s.ifsc ? `<div><b>IFSC:</b> ${s.ifsc}</div>` : ''}
      ${s.bankName ? `<div><b>Bank:</b> ${s.bankName}</div>` : ''}
    </div>` : '';
  if(!s.qrImage && !upiLink){
    openModal(`<h2>Payment QR</h2><p class="empty-note">Add a UPI ID, bank details, or upload a QR code image in Settings → Payment Details first.</p><div class="modal-actions"><button class="cancel-btn" onclick="closeModal()" style="flex:1;">Close</button></div>`);
    return;
  }
  openModal(`
    <h2>Scan to Pay — ₹${bal.toLocaleString('en-IN')}</h2>
    <div style="display:flex; justify-content:center; padding:10px;">
      ${s.qrImage ? `<img src="${s.qrImage}" style="width:220px; height:220px; object-fit:contain; border:1px solid var(--line); border-radius:8px;">` : `<div id="qrCodeBox"></div>`}
    </div>
    <p class="empty-note" style="text-align:center;">Scan with any UPI app (PhonePe, Google Pay, Paytm, BHIM) to pay ₹${bal.toLocaleString('en-IN')} directly to ${SCHOOL_NAME}.</p>
    ${accDetails}
    <div class="modal-actions"><button class="cancel-btn" onclick="closeModal()" style="flex:1;">Close</button></div>
  `);
  if(!s.qrImage && upiLink){
    setTimeout(()=>{
      const box = document.getElementById('qrCodeBox');
      if(box && window.QRCode){ new QRCode(box, { text: upiLink, width: 200, height: 200 }); }
    }, 50);
  }
}

function buildReceiptHTML(feeId){
  const rec = db.fees.find(f=>f.id===feeId);
  if(!rec || !rec.payments || !rec.payments.length) return null;
  const student = findStudentAnywhere(feeId);
  const payment = rec.payments[rec.payments.length-1];
  const bal = rec.total - rec.paid;
  return `
    <div class="print-marksheet">
      <div class="pm-head">
        <img src="${LOGO_DATA_URI}" alt="logo">
        <h2>${SCHOOL_NAME}</h2>
        <div>Semrauta, Tiloi, Amethi</div>
        <div style="margin-top:6px; font-weight:700;">Fee Payment Receipt</div>
      </div>
      <table>
        <tr><td><b>Receipt No.</b></td><td>${payment.receiptNo}</td><td><b>Date</b></td><td>${fmtDate(payment.date)}</td></tr>
        <tr><td><b>Student Name</b></td><td>${student?student.name:feeId}</td><td><b>Class</b></td><td>${student?student.cls+'-'+student.sec:'-'}</td></tr>
        <tr><td><b>Total Fees</b></td><td>₹${rec.total.toLocaleString('en-IN')}</td><td><b>Amount Paid (this receipt)</b></td><td>₹${payment.amount.toLocaleString('en-IN')}</td></tr>
        <tr><td><b>Total Paid So Far</b></td><td>₹${rec.paid.toLocaleString('en-IN')}</td><td><b>Balance Remaining</b></td><td>₹${bal.toLocaleString('en-IN')}</td></tr>
        <tr><td><b>Payment Mode</b></td><td colspan="3">${payment.mode}</td></tr>
      </table>
      <p style="text-align:center; font-size:11px; color:#666; margin-top:40px;">This is a computer-generated receipt.<br>Principal: Mr. Arun Mishra</p>
    </div>`;
}

function downloadReceipt(feeId){
  const html = buildReceiptHTML(feeId);
  if(!html){ alert("No payment has been recorded for this student yet."); return; }
  printHTML(html);
}

/* ---------------- ADD ANNOUNCEMENT ---------------- */
function showAddAnnouncement(){
  openModal(`
    <h2>New Announcement</h2>
    <div class="field"><label>Title</label><input id="an_title" type="text"></div>
    <div class="field"><label>Description</label><textarea id="an_desc" rows="3"></textarea></div>
    <div class="field"><label>Posted By</label><input id="an_by" type="text" value="${currentUser ? currentUser.name : ''}"></div>
    <p class="form-err" id="an_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitAnnouncement()">Post Announcement</button>
    </div>
  `);
}
async function submitAnnouncement(){
  const title = document.getElementById('an_title').value.trim();
  if(!title){ document.getElementById('an_err').textContent = "Title is required"; return; }
  const id = "ann" + Date.now();
  const rec = {
    date: todayISO(), title,
    desc: document.getElementById('an_desc').value.trim(),
    by: document.getElementById('an_by').value.trim() || "Admin",
  };
  db.announcements.push({ id, ...rec });
  closeModal();
  await fsWrite(firebaseReady ? firestoreDb.collection('announcements').doc(id).set(rec) : Promise.resolve());
  rerenderCurrent();
}

/* ---------------- HOMEWORK ---------------- */
function showAddHomework(){
  const restricted = isRestrictedTeacher();
  const classes = restricted ? [currentUser.assignedClass] : [...new Set(db.students.map(s=>s.cls))].sort();
  openModal(`
    <h2>Add Homework</h2>
    <div class="field"><label>Class</label>
      <select id="hw_cls" ${restricted ? 'disabled' : ''}>${classes.map(c=>`<option value="${c}">Class ${c}</option>`).join('')}</select>
    </div>
    <div class="field"><label>Subject</label>
      <select id="hw_subject">${(db.settings.subjects||[]).map(s=>`<option>${s}</option>`).join('')}</select>
    </div>
    <div class="field"><label>Title</label><input id="hw_title" type="text" placeholder="e.g. Chapter 5 Exercise"></div>
    <div class="field"><label>Description</label><textarea id="hw_desc" rows="3" placeholder="Details of the homework..."></textarea></div>
    <p class="form-err" id="hw_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitHomework()">Post Homework</button>
    </div>
  `);
}
async function submitHomework(){
  const title = document.getElementById('hw_title').value.trim();
  if(!title){ document.getElementById('hw_err').textContent = "Title is required"; return; }
  const restricted = isRestrictedTeacher();
  const id = "hw" + Date.now();
  const rec = {
    cls: restricted ? currentUser.assignedClass : document.getElementById('hw_cls').value,
    subject: document.getElementById('hw_subject').value,
    title,
    description: document.getElementById('hw_desc').value.trim(),
    date: todayISO(),
    postedBy: currentUser ? currentUser.name : "Admin",
  };
  db.homework.push({ id, ...rec });
  closeModal();
  await fsWrite(firebaseReady ? firestoreDb.collection('homework').doc(id).set(rec) : Promise.resolve());
  rerenderCurrent();
}
async function deleteHomework(id){
  const idx = db.homework.findIndex(h=>h.id===id);
  if(idx === -1) return;
  db.homework.splice(idx, 1);
  await fsWrite(firebaseReady ? firestoreDb.collection('homework').doc(id).delete() : Promise.resolve());
  rerenderCurrent();
}

/* ---------------- ADD USER ---------------- */
function showAddUser(){
  const classes = [...new Set(db.students.map(s=>s.cls))].sort();
  const studentOptions = db.students.map(s=>`<option value="${s.id}">${s.id} — ${s.name} (Class ${s.cls})</option>`).join('');
  openModal(`
    <h2>Add User</h2>
    <div class="field"><label>Username</label><input id="u_user" type="text"></div>
    <div class="field"><label>Password</label><input id="u_pass" type="text"></div>
    <div class="field"><label>Full Name</label><input id="u_name" type="text"></div>
    <div class="field"><label>Role</label>
      <select id="u_role" onchange="toggleUserRoleFields()">
        <option value="Administrator">Admin</option>
        <option value="Teacher">Teacher</option>
        <option value="Clerk">Clerk</option>
        <option value="Parent">Parent</option>
      </select>
    </div>
    <div class="field" id="u_class_field">
      <label>Assigned Class (Teacher only)</label>
      <select id="u_class"><option value="">Select class</option>${classes.map(c=>`<option value="${c}">Class ${c} only</option>`).join('')}</select>
    </div>
    <div class="field" id="u_student_field" style="display:none;">
      <label>Linked Student (Parent only)</label>
      <select id="u_student"><option value="">Select student</option>${studentOptions}</select>
    </div>
    <p class="form-err" id="u_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitAddUser()">Add User</button>
    </div>
  `);
  toggleUserRoleFields();
}
function toggleUserRoleFields(){
  const role = document.getElementById('u_role').value;
  document.getElementById('u_class_field').style.display = role === 'Teacher' ? '' : 'none';
  document.getElementById('u_student_field').style.display = role === 'Parent' ? '' : 'none';
}
async function submitAddUser(){
  const u = document.getElementById('u_user').value.trim();
  const p = document.getElementById('u_pass').value.trim();
  if(!u || !p){ document.getElementById('u_err').textContent = "Username and password are required"; return; }
  if(db.users.find(x=>x.u===u)){ document.getElementById('u_err').textContent = "Username already exists"; return; }
  const role = document.getElementById('u_role').value;
  const rec = {
    p, name: document.getElementById('u_name').value.trim() || u,
    role,
    status: "Active",
    assignedClass: role === 'Teacher' ? (document.getElementById('u_class').value || null) : null,
    assignedStudent: role === 'Parent' ? (document.getElementById('u_student').value || null) : null,
  };
  db.users.push({ u, ...rec });
  closeModal();
  await fsWrite(firebaseReady ? firestoreDb.collection('users').doc(u).set(rec) : Promise.resolve());
  rerenderCurrent();
}

function showResetPassword(username){
  openModal(`
    <h2>Reset Password — ${username}</h2>
    <div class="field"><label>New Password</label><input id="rp_pass" type="text" placeholder="Enter new password"></div>
    <p class="form-err" id="rp_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitResetPassword('${username}')">Save New Password</button>
    </div>
  `);
}
async function submitResetPassword(username){
  const newPass = document.getElementById('rp_pass').value.trim();
  if(!newPass){ document.getElementById('rp_err').textContent = "Enter a new password"; return; }
  const user = db.users.find(x=>x.u===username);
  if(!user) return;
  user.p = newPass;
  closeModal();
  await fsWrite(firebaseReady ? firestoreDb.collection('users').doc(username).update({p:newPass}) : Promise.resolve());
  rerenderCurrent();
}

/* ---------------- SALARY ---------------- */
function showSetSalary(staffId){
  const month = todayISO().slice(0,7);
  const key = staffId + "_" + month;
  const existing = db.salary[key] || {basic:0, allowances:0, deductions:0};
  openModal(`
    <h2>Set Salary — ${fmtDate(month+'-01')}</h2>
    <div class="field"><label>Basic Pay (₹)</label><input id="sal_basic" type="number" value="${existing.basic}"></div>
    <div class="field"><label>Allowances (₹)</label><input id="sal_allow" type="number" value="${existing.allowances}"></div>
    <div class="field"><label>Deductions (₹)</label><input id="sal_ded" type="number" value="${existing.deductions}"></div>
    <p class="form-err" id="sal_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitSetSalary('${staffId}')">Save Salary</button>
    </div>
  `);
}
async function submitSetSalary(staffId){
  const basic = parseFloat(document.getElementById('sal_basic').value) || 0;
  const allowances = parseFloat(document.getElementById('sal_allow').value) || 0;
  const deductions = parseFloat(document.getElementById('sal_ded').value) || 0;
  if(basic<=0){ document.getElementById('sal_err').textContent = "Enter a valid basic pay"; return; }
  const net = basic + allowances - deductions;
  const month = todayISO().slice(0,7);
  const key = staffId + "_" + month;
  const existing = db.salary[key];
  const rec = { staffId, month, basic, allowances, deductions, net, status: (existing ? existing.status : "Pending"), paidDate: existing ? existing.paidDate : null };
  db.salary[key] = rec;
  closeModal();
  await fsWrite(firebaseReady ? firestoreDb.collection('salary').doc(key).set(rec) : Promise.resolve());
  rerenderCurrent();
}
async function markSalaryPaid(staffId){
  const month = todayISO().slice(0,7);
  const key = staffId + "_" + month;
  const rec = db.salary[key];
  if(!rec) return;
  rec.status = "Paid";
  rec.paidDate = todayISO();
  await fsWrite(firebaseReady ? firestoreDb.collection('salary').doc(key).update({status:"Paid", paidDate: rec.paidDate}) : Promise.resolve());
  rerenderCurrent();
}

/* ---------------- TRANSPORT ---------------- */
function showAddBus(){
  openModal(`
    <h2>Add Bus / Route</h2>
    <div class="field"><label>Bus Number</label><input id="bus_no" type="text" placeholder="e.g. UP-33 AB 1234"></div>
    <div class="field"><label>Route Name</label><input id="bus_route" type="text" placeholder="e.g. Semrauta - Tiloi - Amethi"></div>
    <div class="field"><label>Driver Name</label><input id="bus_driver" type="text"></div>
    <div class="field"><label>Driver Contact</label><input id="bus_driverc" type="text"></div>
    <div class="field"><label>Conductor Name</label><input id="bus_cond" type="text"></div>
    <div class="field"><label>Conductor Contact</label><input id="bus_condc" type="text"></div>
    <div class="field"><label>Capacity</label><input id="bus_cap" type="number" placeholder="e.g. 40"></div>
    <p class="form-err" id="bus_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitAddBus()">Add Bus</button>
    </div>
  `);
}
async function submitAddBus(){
  const busNo = document.getElementById('bus_no').value.trim();
  const route = document.getElementById('bus_route').value.trim();
  if(!busNo || !route){ document.getElementById('bus_err').textContent = "Bus number and route are required"; return; }
  const rec = {
    busNo, route,
    driverName: document.getElementById('bus_driver').value.trim() || "-",
    driverContact: document.getElementById('bus_driverc').value.trim() || "-",
    conductorName: document.getElementById('bus_cond').value.trim() || "-",
    conductorContact: document.getElementById('bus_condc').value.trim() || "-",
    vehicleNo: busNo,
    capacity: parseInt(document.getElementById('bus_cap').value,10) || 0,
  };
  const id = nextId(db.transport.buses, "BUS");
  db.transport.buses.push({ id, ...rec });
  closeModal();
  await fsWrite(firebaseReady ? firestoreDb.collection('transportBuses').doc(id).set(rec) : Promise.resolve());
  rerenderCurrent();
}

function showAddTransportAssignment(){
  const studentOptions = db.students.map(s=>`<option value="${s.id}">${s.id} — ${s.name} (Class ${s.cls})</option>`).join('');
  const busOptions = db.transport.buses.map(b=>`<option value="${b.id}">${b.busNo} — ${b.route}</option>`).join('');
  openModal(`
    <h2>Assign Student to Bus</h2>
    <div class="field"><label>Student</label><select id="ta_student">${studentOptions || '<option value="">No students yet</option>'}</select></div>
    <div class="field"><label>Bus</label><select id="ta_bus">${busOptions || '<option value="">No buses yet</option>'}</select></div>
    <div class="field"><label>Pickup Point</label><input id="ta_pickup" type="text" placeholder="e.g. Semrauta Chowk"></div>
    <div class="field"><label>Monthly Fee (₹)</label><input id="ta_fee" type="number" placeholder="e.g. 500"></div>
    <div class="field"><label>Total Due (₹)</label><input id="ta_due" type="number" placeholder="e.g. 500"></div>
    <p class="form-err" id="ta_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitTransportAssignment()">Save Assignment</button>
    </div>
  `);
}
async function submitTransportAssignment(){
  const studentId = document.getElementById('ta_student').value;
  const busId = document.getElementById('ta_bus').value;
  if(!studentId || !busId){ document.getElementById('ta_err').textContent = "Select a student and a bus"; return; }
  const monthlyFee = parseInt(document.getElementById('ta_fee').value,10) || 0;
  const rec = {
    studentId, busId,
    pickupPoint: document.getElementById('ta_pickup').value.trim() || "-",
    monthlyFee,
    totalDue: parseInt(document.getElementById('ta_due').value,10) || monthlyFee,
    paid: 0,
  };
  const id = nextId(db.transport.assignments, "TRA");
  db.transport.assignments.push({ id, ...rec });
  closeModal();
  await fsWrite(firebaseReady ? firestoreDb.collection('transportAssignments').doc(id).set(rec) : Promise.resolve());
  rerenderCurrent();
}

function showRecordTransportPayment(assignId){
  openModal(`
    <h2>Record Transport Payment</h2>
    <div class="field"><label>Amount Received (₹)</label><input id="tp_amt" type="number" placeholder="e.g. 500"></div>
    <p class="form-err" id="tp_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitTransportPayment('${assignId}')">Save Payment</button>
    </div>
  `);
}
async function submitTransportPayment(assignId){
  const amt = parseInt(document.getElementById('tp_amt').value,10);
  if(!amt || amt<=0){ document.getElementById('tp_err').textContent = "Enter a valid amount"; return; }
  const rec = db.transport.assignments.find(a=>a.id===assignId);
  if(!rec) return;
  rec.paid = (rec.paid||0) + amt;
  closeModal();
  await fsWrite(firebaseReady ? firestoreDb.collection('transportAssignments').doc(assignId).update({
    paid: firebase.firestore.FieldValue.increment(amt)
  }) : Promise.resolve());
  rerenderCurrent();
}

/* ---------------- EXAMS ---------------- */
function downloadExamsExcel(){
  const restricted = isRestrictedTeacher();
  const list = restricted ? db.exams.filter(x=>x.cls===currentUser.assignedClass) : db.exams;
  const rows = list.map(x=>({
    "Sr No.": x.srNo, "Student Name": x.studentName, "Class": x.cls, "Section": x.sec,
    "DOB": x.dob, "Father's Name": x.father, "Mother's Name": x.mother, "Address": x.address,
    "Exam": x.examName, "Obtained": x.obtained, "Max Marks": x.maxTotal, "Percentage": x.percentage, "Grade": x.grade,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Exam Results");
  XLSX.writeFile(wb, `Exam_Results_${todayISO()}.xlsx`);
}

function subjectRowHTML(subName){
  return `
    <div class="field subj-row" style="display:flex; gap:8px; align-items:flex-end;">
      <div style="flex:2;"><label>Subject</label><input type="text" class="ex-subj-name" value="${subName||''}" placeholder="e.g. Computer"></div>
      <div style="flex:1.3;"><label>Obtained</label><input type="number" class="ex-obt" placeholder="0"></div>
      <div style="flex:1;"><label>Out of</label><input type="number" class="ex-max" value="100"></div>
      <button type="button" class="cancel-btn" style="flex:0; padding:11px 12px;" onclick="this.closest('.subj-row').remove()">✕</button>
    </div>`;
}
function addExamSubjectRow(){
  document.getElementById('examSubjectRows').insertAdjacentHTML('beforeend', subjectRowHTML(''));
}
function showAddExam(){
  const options = db.students.map(s=>`<option value="${s.id}">${s.id} — ${s.name} (Class ${s.cls}${s.sec!=='-'?'-'+s.sec:''})</option>`).join('');
  const subjectFields = (db.settings.subjects || []).map(sub=>subjectRowHTML(sub)).join('');
  openModal(`
    <h2>Add Exam Result</h2>
    <div class="field"><label>Student</label><select id="ex_student">${options || '<option value="">No students yet</option>'}</select></div>
    <div class="field"><label>Sr. No.</label><input id="ex_srno" type="text" placeholder="e.g. 1"></div>
    <div class="field"><label>Exam Name</label><input id="ex_name" type="text" placeholder="e.g. Half Yearly 2026"></div>
    <div class="field"><label>Mother's Name</label><input id="ex_mother" type="text"></div>
    <h2 style="font-size:15px; margin-top:20px;">Subject-wise Marks</h2>
    <div id="examSubjectRows">${subjectFields}</div>
    <button type="button" class="mini-btn" onclick="addExamSubjectRow()" style="margin-top:6px;">+ Add Subject</button>
    <p class="form-err" id="ex_err"></p>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">Cancel</button>
      <button class="primary-btn" onclick="submitExam()">Save Result</button>
    </div>
  `);
}
async function submitExam(){
  const studentId = document.getElementById('ex_student').value;
  const student = db.students.find(s=>s.id===studentId);
  if(!student){ document.getElementById('ex_err').textContent = "Select a student"; return; }
  const srNo = document.getElementById('ex_srno').value.trim() || "-";
  const examName = document.getElementById('ex_name').value.trim() || "Exam";
  const mother = document.getElementById('ex_mother').value.trim() || "-";

  const subjects = [];
  let obtained = 0, maxTotal = 0;
  document.querySelectorAll('#examSubjectRows .subj-row').forEach(row=>{
    const subj = row.querySelector('.ex-subj-name').value.trim();
    if(!subj) return;
    const obt = parseFloat(row.querySelector('.ex-obt').value) || 0;
    const max = parseFloat(row.querySelector('.ex-max').value) || 100;
    subjects.push({ subject: subj, obtained: obt, max });
    obtained += obt; maxTotal += max;
  });
  if(subjects.length === 0){ document.getElementById('ex_err').textContent = "Add at least one subject"; return; }
  const percentage = maxTotal>0 ? Math.round((obtained/maxTotal)*1000)/10 : 0;
  const grade = getGrade(percentage);

  const id = "exam" + Date.now();
  const rec = {
    studentId, studentName: student.name, srNo, cls: student.cls, sec: student.sec,
    dob: student.dob, father: student.father, mother, address: student.address,
    examName, subjects, obtained, maxTotal, percentage, grade,
    session: db.settings.currentSession || "",
  };
  db.exams.push({ id, ...rec });
  closeModal();
  await fsWrite(firebaseReady ? firestoreDb.collection('exams').doc(id).set(rec) : Promise.resolve());
  rerenderCurrent();
}

function buildMarksheetHTML(x){
  const subjRows = x.subjects.map(s=>`<tr><td>${s.subject}</td><td>${s.obtained}</td><td>${s.max}</td></tr>`).join('');
  return `
    <div class="print-marksheet">
      <div class="pm-head">
        <img src="${LOGO_DATA_URI}" alt="logo">
        <h2>${SCHOOL_NAME}</h2>
        <div>Semrauta, Tiloi, Amethi</div>
        <div style="margin-top:6px; font-weight:700;">${x.examName} — Marksheet</div>
      </div>
      <table>
        <tr><td><b>Student Name</b></td><td>${x.studentName}</td><td><b>Sr. No.</b></td><td>${x.srNo}</td></tr>
        <tr><td><b>Class / Section</b></td><td>${x.cls} - ${x.sec}</td><td><b>Date of Birth</b></td><td>${x.dob}</td></tr>
        <tr><td><b>Father's Name</b></td><td>${x.father}</td><td><b>Mother's Name</b></td><td>${x.mother}</td></tr>
        <tr><td colspan="4"><b>Address:</b> ${x.address}</td></tr>
      </table>
      <table>
        <tr><th>Subject</th><th>Marks Obtained</th><th>Maximum Marks</th></tr>
        ${subjRows}
        <tr><td><b>Total</b></td><td><b>${x.obtained}</b></td><td><b>${x.maxTotal}</b></td></tr>
      </table>
      <p style="text-align:center; font-size:15px;"><b>Percentage: ${x.percentage}%</b> &nbsp;|&nbsp; <b>Grade: ${x.grade}</b></p>
      <p style="text-align:center; font-size:11px; color:#666; margin-top:30px;">Principal: Mr. Arun Mishra</p>
    </div>`;
}

function viewMarksheet(examId){
  const x = db.exams.find(e=>e.id===examId);
  if(!x) return;
  const subjRows = x.subjects.map(s=>`<tr class="ms-subject-row"><td>${s.subject}</td><td>${s.obtained}</td><td>${s.max}</td></tr>`).join('');
  openModal(`
    <h2>Marksheet — ${x.studentName}</h2>
    <div class="marksheet-box">
      <div class="ms-row"><span>Sr. No.</span><b>${x.srNo}</b></div>
      <div class="ms-row"><span>Class / Section</span><b>${x.cls} - ${x.sec}</b></div>
      <div class="ms-row"><span>Date of Birth</span><b>${x.dob}</b></div>
      <div class="ms-row"><span>Father's Name</span><b>${x.father}</b></div>
      <div class="ms-row"><span>Mother's Name</span><b>${x.mother}</b></div>
      <div class="ms-row"><span>Address</span><b>${x.address}</b></div>
      <div class="ms-row"><span>Exam</span><b>${x.examName}</b></div>
    </div>
    <table style="margin-top:14px;"><tr><th>Subject</th><th>Obtained</th><th>Max</th></tr>${subjRows}</table>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding:14px; background:var(--paper-dim); border-radius:8px;">
      <div><b>${x.obtained} / ${x.maxTotal}</b><br><span style="font-size:12px; color:var(--ink-soft);">${x.percentage}%</span></div>
      <span class="grade-pill grade-${x.grade}" style="width:44px;height:34px;font-size:15px;">${x.grade}</span>
    </div>
    <div id="ms_pdf_status" class="empty-note" style="text-align:center; min-height:16px;"></div>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()" style="flex:1;">Close</button>
      <button class="primary-btn" style="flex:1; margin-top:0;" onclick="printMarksheet('${x.id}')">🖨 Print</button>
    </div>
    <div class="modal-actions">
      <button class="mini-btn" style="flex:1;" onclick="downloadMarksheetPDF('${x.id}')">⬇ Download PDF</button>
      <button class="wa-btn" style="flex:1; justify-content:center; text-decoration:none;" onclick="shareMarksheetWhatsApp('${x.id}')">💬 Share on WhatsApp</button>
    </div>
  `);
}

/* ---------------- PRINT: ID CARD & MARKSHEET ---------------- */
function printHTML(html){
  document.getElementById('printArea').innerHTML = html;
  window.print();
}

function showIDCard(studentId){
  const s = db.students.find(x=>x.id===studentId);
  if(!s) return;
  const cardHTML = `
    <div class="idcard">
      <div class="idcard-head">
        <img src="${LOGO_DATA_URI}" alt="logo">
        <div class="sname">${SCHOOL_NAME}</div>
        <div class="sloc">Semrauta, Tiloi, Amethi</div>
      </div>
      <div class="idcard-body">
        <div class="idcard-photo" style="${s.photo ? 'padding:0;overflow:hidden;' : ''}">${s.photo ? `<img src="${s.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">` : s.name.charAt(0)}</div>
        <div class="idcard-fields">
          <div><b>${s.name}</b></div>
          <div>Class: ${s.cls} - ${s.sec} &nbsp; Roll: ${s.roll}</div>
          <div>DOB: ${s.dob}</div>
          <div>Father: ${s.father}</div>
          <div>Contact: ${s.contact}</div>
          <div>Sr. No.: ${s.id}</div>
        </div>
      </div>
      <div class="idcard-foot">${s.address}</div>
    </div>`;
  openModal(`
    <h2>Student ID Card</h2>
    ${cardHTML}
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()" style="flex:1;">Close</button>
      <button class="primary-btn" style="flex:1.4; margin-top:0;" onclick='printHTML(${JSON.stringify(cardHTML)})'>🖨 Print ID Card</button>
    </div>
  `);
}

function printMarksheet(examId){
  const x = db.exams.find(e=>e.id===examId);
  if(!x) return;
  printHTML(buildMarksheetHTML(x));
}

async function downloadMarksheetPDF(examId){
  const x = db.exams.find(e=>e.id===examId);
  if(!x) return;
  const statusEl = document.getElementById('ms_pdf_status');
  if(statusEl) statusEl.textContent = "Generating PDF…";
  try{
    const container = document.getElementById('pdfRenderArea');
    container.innerHTML = buildMarksheetHTML(x);
    await new Promise(r=>setTimeout(r, 80));
    const target = container.firstElementChild;
    const canvas = await html2canvas(target, {scale:2, backgroundColor:"#ffffff"});
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p','mm','a4');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const imgProps = doc.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    doc.save(`Marksheet_${x.studentName.replace(/\s+/g,'_')}.pdf`);
    container.innerHTML = '';
    if(statusEl) statusEl.textContent = "PDF downloaded.";
  }catch(e){
    if(statusEl) statusEl.textContent = "Could not generate PDF — try Print instead.";
  }
}

function shareMarksheetWhatsApp(examId){
  const x = db.exams.find(e=>e.id===examId);
  if(!x) return;
  const wa = schoolWhatsApp();
  const msg = `${SCHOOL_NAME} — Exam Result\nStudent: ${x.studentName}\nClass: ${x.cls}-${x.sec}\nExam: ${x.examName}\nMarks: ${x.obtained}/${x.maxTotal} (${x.percentage}%)\nGrade: ${x.grade}\n\n(Full marksheet PDF has been downloaded — please attach it manually in WhatsApp)`;
  const url = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ---------------- SETTINGS ---------------- */
async function submitSettings(){
  const val = document.getElementById('set_whatsapp').value.trim().replace(/[^0-9]/g,'');
  if(!val || val.length < 10){ document.getElementById('set_err').textContent = "Enter a valid WhatsApp number with country code"; return; }
  db.settings.whatsapp = val;
  await fsWrite(firebaseReady ? firestoreDb.collection('settings').doc('main').set(db.settings) : Promise.resolve());
  rerenderCurrent();
}

async function submitPaymentSettings(){
  db.settings.upiId = document.getElementById('set_upi').value.trim();
  db.settings.bankAccount = document.getElementById('set_bankacc').value.trim();
  db.settings.ifsc = document.getElementById('set_ifsc').value.trim();
  db.settings.bankName = document.getElementById('set_bankname').value.trim();
  const qrFile = document.getElementById('set_qr').files[0];
  if(qrFile){
    const compressed = await fileToCompressedDataURL(qrFile, 400, 0.85);
    if(compressed) db.settings.qrImage = compressed;
  }
  await fsWrite(firebaseReady ? firestoreDb.collection('settings').doc('main').set(db.settings) : Promise.resolve());
  rerenderCurrent();
}

async function submitSessionSettings(){
  const val = document.getElementById('set_session').value.trim();
  if(!val){ document.getElementById('set_session_err').textContent = "Enter a session, e.g. 2026-27"; return; }
  db.settings.currentSession = val;
  await fsWrite(firebaseReady ? firestoreDb.collection('settings').doc('main').set(db.settings) : Promise.resolve());
  rerenderCurrent();
}

async function submitFeeStructure(){
  const structure = {};
  document.querySelectorAll('.fs-input').forEach(inp=>{
    const val = parseInt(inp.value,10);
    if(val>0) structure[inp.dataset.cls] = val;
  });
  db.settings.feeStructure = structure;
  await fsWrite(firebaseReady ? firestoreDb.collection('settings').doc('main').set(db.settings) : Promise.resolve());
  rerenderCurrent();
}

async function addSubjectToSettings(){
  const val = document.getElementById('new_subject').value.trim();
  if(!val) return;
  if(!db.settings.subjects) db.settings.subjects = [];
  if(db.settings.subjects.includes(val)) return;
  db.settings.subjects.push(val);
  await fsWrite(firebaseReady ? firestoreDb.collection('settings').doc('main').set(db.settings) : Promise.resolve());
  rerenderCurrent();
}
async function removeSubject(index){
  db.settings.subjects.splice(index, 1);
  await fsWrite(firebaseReady ? firestoreDb.collection('settings').doc('main').set(db.settings) : Promise.resolve());
  rerenderCurrent();
}

/* ---------------- IMPORT STUDENTS ---------------- */
function importStudents(){
  const fileInput = document.getElementById('importFile');
  const errEl = document.getElementById('import_err');
  errEl.textContent = "";
  if(!fileInput.files || !fileInput.files[0]){ errEl.textContent = "Choose a file first"; return; }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = async function(e){
    try{
      const wb = XLSX.read(e.target.result, {type:'array'});
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      if(!rows.length){ errEl.textContent = "No rows found in the file"; return; }
      let added = 0;
      let skipped = 0;
      const batch = firebaseReady ? firestoreDb.batch() : null;
      rows.forEach(r=>{
        const srNo = String(r.srno || r.SrNo || r["Sr. No."] || r.id || r.ID || "").trim();
        if(!srNo || db.students.find(x=>x.id===srNo) || db.alumni.find(x=>x.id===srNo)){ skipped++; return; }
        const s = {
          id: srNo,
          name: String(r.name || r.Name || "").trim() || "Unknown",
          cls: String(r.cls || r.Class || "-").trim(),
          sec: String(r.sec || r.Section || "-").trim(),
          roll: parseInt(r.roll || r.Roll,10) || 0,
          gender: String(r.gender || r.Gender || "-").trim(),
          dob: String(r.dob || r.DOB || "-").trim(),
          father: String(r.father || r.Father || "-").trim(),
          contact: String(r.contact || r.Contact || "-").trim(),
          address: String(r.address || r.Address || "-").trim(),
        };
        db.students.push(s);
        if(batch){ const {id, ...rest} = s; batch.set(firestoreDb.collection('students').doc(id), rest); }
        added++;
      });
      if(batch) await fsWrite(batch.commit());
      closeImportAndRefresh(added, skipped);
    }catch(err){
      errEl.textContent = "Could not read this file — make sure it's a valid Excel/CSV export";
    }
  };
  reader.readAsArrayBuffer(file);
}
function closeImportAndRefresh(count, skipped){
  rerenderCurrent();
  let msg = count + " students imported successfully.";
  if(skipped) msg += " " + skipped + " row(s) skipped (missing or duplicate Sr. No.).";
  alert(msg);
}

/* ---------------- DOWNLOAD BACKUP (Excel) ---------------- */
function downloadBackup(){
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(db.students), "Students");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(db.staff), "Staff");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(db.fees), "Fees");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(db.announcements), "Announcements");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(db.users.map(u=>({username:u.u, name:u.name, role:u.role, status:u.status}))), "Users");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(db.exams.map(x=>({srNo:x.srNo, student:x.studentName, cls:x.cls, sec:x.sec, exam:x.examName, obtained:x.obtained, max:x.maxTotal, percentage:x.percentage, grade:x.grade}))), "Exams");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(Object.values(db.salary).map(s=>({staffId:s.staffId, month:s.month, basic:s.basic, allowances:s.allowances, deductions:s.deductions, net:s.net, status:s.status, paidDate:s.paidDate||""}))), "Salary");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(db.transport.buses), "Transport Buses");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(db.transport.assignments.map(a=>{
    const s = db.students.find(x=>x.id===a.studentId);
    const b = db.transport.buses.find(x=>x.id===a.busId);
    return { student: s?s.name:a.studentId, cls: s?s.cls:"", bus: b?b.busNo:a.busId, pickupPoint: a.pickupPoint, monthlyFee: a.monthlyFee };
  })), "Transport Assignments");

  function flattenAttendance(byDate){
    const rows = [];
    Object.keys(byDate).sort().forEach(date=>{
      Object.keys(byDate[date]).forEach(id=>{
        const rec = byDate[date][id];
        rows.push({
          date, id, status: rec.status,
          lat: rec.location ? rec.location.lat : "",
          lng: rec.location ? rec.location.lng : "",
        });
      });
    });
    return rows;
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(flattenAttendance(db.studentAttendance)), "Student Attendance");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(flattenAttendance(db.staffAttendance)), "Staff Attendance");

  XLSX.writeFile(wb, `School_Backup_${todayISO()}.xlsx`);
}

/* ---------------- INIT ---------------- */
function updateOnlineStatus(){
  const el = document.getElementById('onlineStatus');
  const txt = document.getElementById('onlineStatusText');
  if(!el || !txt) return;
  if(navigator.onLine){
    el.className = 'savebar saved';
    txt.textContent = 'Online';
  } else {
    el.className = 'savebar';
    el.style.color = 'var(--amber)';
    txt.textContent = 'Offline — will sync when back online';
  }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

loadData();
updateOnlineStatus();

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{ /* offline support unavailable, app still works online */ });
  });
}
