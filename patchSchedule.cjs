const fs = require('fs');

function patch() {
    let file = 'src/pages/doctor-dashboard/DoctorSchedule.tsx';
    let content = fs.readFileSync(file, 'utf8');

    // Make sure we have getDoc imported
    if (!content.includes('getDoc,')) {
        content = content.replace('getDocs,', 'getDocs, getDoc,');
    }
    
    const targetBlock = `            const querySnapshot = await getDocs(q);
            const appts: Appointment[] = [];
            let blockedCount = 0;
            let newPatientsCount = 0;

            querySnapshot.forEach((doc) => {`;

    const newBlock = `            const querySnapshot = await getDocs(q);
            const appts: Appointment[] = [];
            let blockedCount = 0;
            let newPatientsCount = 0;

            // Pre-fetch patient info matching my patients logic
            const patientDataMap = new Map<string, any>();
            for (const docSnap of querySnapshot.docs) {
               const data = docSnap.data();
               if (data.patientId && !patientDataMap.has(data.patientId)) {
                   try {
                       const pDoc = await getDoc(doc(db, "patients", data.patientId));
                       if (pDoc.exists()) {
                           patientDataMap.set(data.patientId, pDoc.data());
                       }
                   } catch(e) { console.error(e); }
               }
            }

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const pData = patientDataMap.get(data.patientId) || {};`;

    content = content.replace(/            const querySnapshot = await getDocs\(q\);\r?\n            const appts: Appointment\[\] = \[\];\r?\n            let blockedCount = 0;\r?\n            let newPatientsCount = 0;\r?\n\r?\n            querySnapshot\.forEach\(\(doc\) => \{/s, newBlock);

    // Also replace references to `doc.id` -> `docSnap.id`
    // And `patient: data.patientName || "Unknown Patient"` to pick up pData
    // And inject pData into phone / email

    const mappingRegex = /appts\.push\(\{([\s\S]*?)id: doc\.id,([\s\S]*?)patient: data\.patientName \|\| "Unknown Patient",([\s\S]*?)patientPhone: data\.patientPhone,([\s\S]*?)patientEmail: data\.patientEmail,([\s\S]*?)\}\);/s;
    
    content = content.replace(mappingRegex, `appts.push({$1id: docSnap.id,$2patient: pData.fullName || data.patientName || "Unknown Patient",$3patientPhone: pData.phoneNumber || data.patientPhone || "Phone not available",$4patientEmail: pData.email || data.patientEmail || "Email not available",$5});`);

    fs.writeFileSync(file, content);
    console.log("Patched DoctorSchedule");
}

patch();
