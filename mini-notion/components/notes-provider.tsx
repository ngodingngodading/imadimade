"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

interface NotesContextType {
  notes: Note[]
  activeNoteId: string | null
  setActiveNoteId: (id: string | null) => void
  createNote: () => void
  updateNote: (id: string, data: Partial<Note>) => void
  deleteNote: (id: string) => void
  searchNotes: (query: string) => Note[]
  reorderNotes: (sourceIndex: number, destinationIndex: number) => void
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load notes from localStorage on initial render
  useEffect(() => {
    const storedNotes = localStorage.getItem("notes")
    if (storedNotes) {
      try {
        const parsedNotes = JSON.parse(storedNotes)
        setNotes(parsedNotes)
      } catch (error) {
        console.error("Failed to parse notes from localStorage:", error)
      }
    } else {
      // Create a default note if no notes exist
      const defaultNote: Note = {
        id: generateId(),
        title: "Welcome to Mini Notion",
        content: "Start writing your notes here...",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setNotes([defaultNote])
    }
    setIsInitialized(true)
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("notes", JSON.stringify(notes))
    }
  }, [notes, isInitialized])

  // Generate a unique ID for new notes
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Create a new note
  const createNote = () => {
    const newNote: Note = {
      id: generateId(),
      title: "New Note",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setNotes((prevNotes) => [newNote, ...prevNotes])
    setActiveNoteId(newNote.id)
  }

  // Update an existing note
  const updateNote = (id: string, data: Partial<Note>) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, ...data, updatedAt: Date.now() } : note)),
    )
  }

  // Delete a note
  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
    if (activeNoteId === id) {
      const remainingNotes = notes.filter((note) => note.id !== id)
      setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null)
    }
  }

  // Search notes by title
  const searchNotes = (query: string) => {
    if (!query.trim()) return notes
    const lowerCaseQuery = query.toLowerCase()
    return notes.filter((note) => note.title.toLowerCase().includes(lowerCaseQuery))
  }

  // Reorder notes (for drag and drop functionality)
  const reorderNotes = (sourceIndex: number, destinationIndex: number) => {
    const reorderedNotes = [...notes]
    const [removed] = reorderedNotes.splice(sourceIndex, 1)
    reorderedNotes.splice(destinationIndex, 0, removed)
    setNotes(reorderedNotes)
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        activeNoteId,
        setActiveNoteId,
        createNote,
        updateNote,
        deleteNote,
        searchNotes,
        reorderNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider")
  }
  return context
}
