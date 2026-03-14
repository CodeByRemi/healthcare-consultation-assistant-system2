const { getFirestore, doc, getDoc, collection, getDocs } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
// read firebase config
const fs = require('fs');
let fbConfigStr = fs.readFileSync('src/lib/firebase.ts', 'utf8');

// The config will have to be extracted to a standalone script
