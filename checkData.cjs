const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, doc, getDoc } = require('firebase/firestore');
const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

let firebaseConfigStr = code.match(/const firebaseConfig = (\{.*?\});/s)[1];
const firebaseConfig = eval('(' + firebaseConfigStr + ')');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const dDocs = await getDocs(collection(db, "doctors"));
  if (dDocs.empty) { console.log('no doctors'); return; }
  const docId = dDocs.docs[0].id;
  
  const q = query(collection(db, "appointments"), where("doctorId", "==", docId));
  const snaps = await getDocs(q);
  console.log('Appointments:', snaps.size);
  snaps.forEach(async (d) => {
    let appt = d.data();
    console.log('Appt patientId:', appt.patientId);
    if(appt.patientId) {
       const p = await getDoc(doc(db, "patients", appt.patientId));
       console.log('Patient doc exists?', p.exists());
       if(p.exists()) console.log('Patient data:', p.data());
    }
  });
}
run();
