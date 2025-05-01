"use client"

import { useState } from "react"
import { useNotes } from "@/components/notes-provider"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
} from "@/components/ui/sidebar"
import { Plus, Search, Trash2, ChevronUp, ChevronDown, GripVertical } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function NoteSidebar() {
  const { notes, activeNoteId, setActiveNoteId, createNote, deleteNote, searchNotes, reorderNotes } = useNotes()
  const [searchQuery, setSearchQuery] = useState("")
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

  const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderNotes(index, index - 1)
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < notes.length - 1) {
      reorderNotes(index, index + 1)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <SidebarInput
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredNotes.map((note, index) => (
            <SidebarMenuItem key={note.id} className="group">
              <SidebarMenuButton
                isActive={activeNoteId === note.id}
                onClick={() => setActiveNoteId(note.id)}
                className="flex flex-col items-start"
              >
                <div className="flex w-full items-center">
                  <GripVertical className="h-4 w-4 mr-2 opacity-50 cursor-move" />
                  <span className="font-medium truncate flex-1">{note.title || "Untitled"}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-6">{formatDate(note.updatedAt)}</span>
              </SidebarMenuButton>
              <div className="flex gap-1 absolute right-2 top-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                  <span className="sr-only">Move up</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === notes.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                  <span className="sr-only">Move down</span>
                </Button>
                <AlertDialog open={noteToDelete === note.id} onOpenChange={(open) => !open && setNoteToDelete(null)}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setNoteToDelete(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Note</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this note? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteNote(note.id)
                          setNoteToDelete(null)
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={createNote} className="w-full flex items-center gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
