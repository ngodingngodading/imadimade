"use client"

import { useEffect, useState } from "react"
import { useNotes } from "@/components/notes-provider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useDebounce } from "@/hooks/use-debounce"

export function NoteEditor() {
  const { notes, activeNoteId, updateNote } = useNotes()
  const activeNote = notes.find((note) => note.id === activeNoteId)

  const [title, setTitle] = useState(activeNote?.title || "")
  const [content, setContent] = useState(activeNote?.content || "")

  const debouncedTitle = useDebounce(title, 500)
  const debouncedContent = useDebounce(content, 500)

  // Update local state when active note changes
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title)
      setContent(activeNote.content)
    }
  }, [activeNote])

  // Autosave when debounced values change
  useEffect(() => {
    if (activeNoteId && (debouncedTitle !== activeNote?.title || debouncedContent !== activeNote?.content)) {
      updateNote(activeNoteId, {
        title: debouncedTitle,
        content: debouncedContent,
      })
    }
  }, [debouncedTitle, debouncedContent, activeNoteId, updateNote, activeNote])

  if (!activeNote) return null

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        className="text-xl font-bold border-none shadow-none focus-visible:ring-0 px-0"
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 min-h-[70vh] resize-none border-none shadow-none focus-visible:ring-0 px-0"
      />
    </div>
  )
}
