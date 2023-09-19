import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';

/*

    your fire base config goes here

*/

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, 'Notes');
export default {
    notesCollection: notesCollection,
    db: db,
};
