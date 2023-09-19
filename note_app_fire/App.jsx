import React from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from 'react-split';
import { nanoid } from 'nanoid';
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import fire from './firebase';

export default function App() {
    const [notes, setNotes] = React.useState([]);
    const [currentNoteId, setCurrentNoteId] = React.useState('');
    const [tempNoteText, settempNoteText] = React.useState('');
    const currentNote =
        notes.find((note) => note.id === currentNoteId) || notes[0];
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);
    //getting the snapshot of the data
    React.useEffect(() => {
        const unSebscribe = onSnapshot(fire.notesCollection, (snapshot) => {
            const noteArray = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setNotes(noteArray);
        });
        return unSebscribe;
    }, []);
    //effects
    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id);
        }
    }, [notes]);

    React.useEffect(() => {
        if (currentNote) {
            settempNoteText(currentNote.body);
        }
    }, [currentNote]);
    //debouncing
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateNote(tempNoteText);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [tempNoteText]);
    //creating new note
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const docRef = await addDoc(fire.notesCollection, newNote);
        setCurrentNoteId(docRef.id);
    }
    //updating the note
    async function updateNote(text) {
        const updatedNote = { body: text, updatedAt: Date.now() };
        const docRef = doc(fire.db, 'Notes', currentNoteId);
        await setDoc(docRef, updatedNote, { merge: true });
    }
    //delete a note
    async function deleteNote(noteId) {
        const docRef = doc(fire.db, 'Notes', noteId);
        await deleteDoc(docRef);
    }

    return (
        <main>
            {notes.length > 0 ? (
                <Split
                    sizes={[30, 70]}
                    direction="horizontal"
                    className="split"
                >
                    <Sidebar
                        notes={sortedNotes}
                        currentNote={currentNote}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                        deleteNote={deleteNote}
                    />
                    <Editor
                        tempNoteText={tempNoteText}
                        settempNoteText={settempNoteText}
                    />
                </Split>
            ) : (
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button className="first-note" onClick={createNewNote}>
                        Create one now
                    </button>
                </div>
            )}
        </main>
    );
}
