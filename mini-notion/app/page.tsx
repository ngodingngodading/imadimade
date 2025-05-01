"use client"

import { useEffect, useState } from "react"
import { useNotes } from "@/components/notes-provider"
import { NoteEditor } from "@/components/note-editor"
import { NoteSidebar } from "@/components/note-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  const { activeNoteId, setActiveNoteId, notes } = useNotes()
  const [isMounted, setIsMounted] = useState(false)

  // Set the first note as active on initial load if there are notes and no active note
  useEffect(() => {
    setIsMounted(true)
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id)
    }
  }, [notes, activeNoteId, setActiveNoteId])

  if (!isMounted) {
    return null // Prevent hydration issues
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <NoteSidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <h1 className="text-xl font-bold">Mini Notion</h1>
            <ModeToggle />
          </div>
          <div className="p-4">
            {activeNoteId ? (
              <NoteEditor />
            ) : (
              <div className="flex flex-col items-center justify-center h-[80vh] text-center">
                <h2 className="text-2xl font-bold mb-2">Welcome to Mini Notion</h2>
                <p className="text-muted-foreground mb-4">
                  Create a new note or select an existing one to get started.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
