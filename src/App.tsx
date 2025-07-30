import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Plus, MagnifyingGlass, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { NoteEditor } from '@/components/NoteEditor'
import { useIsMobile } from '@/hooks/use-mobile'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

function App() {
  const [notes, setNotes] = useKV<Note[]>("notes", [])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showEditor, setShowEditor] = useState(false)
  const isMobile = useIsMobile()

  const selectedNote = useMemo(() => 
    notes.find(note => note.id === selectedNoteId) || null, 
    [notes, selectedNoteId]
  )

  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) return notes
    
    const query = searchTerm.toLowerCase()
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query)
    )
  }, [notes, searchTerm])

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    setNotes(currentNotes => [newNote, ...currentNotes])
    setSelectedNoteId(newNote.id)
    setShowEditor(true)
  }

  const updateNote = (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    setNotes(currentNotes => 
      currentNotes.map(note =>
        note.id === id 
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      )
    )
  }

  const deleteNote = (id: string) => {
    setNotes(currentNotes => currentNotes.filter(note => note.id !== id))
    if (selectedNoteId === id) {
      setSelectedNoteId(null)
      setShowEditor(false)
    }
  }

  const selectNote = (note: Note) => {
    setSelectedNoteId(note.id)
    if (isMobile) {
      setShowEditor(true)
    }
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-accent/30 text-accent-foreground px-0.5 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  if (isMobile && showEditor) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b bg-card">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowEditor(false)}
          >
            ← Back
          </Button>
          <h1 className="font-medium text-lg">Edit Note</h1>
        </div>
        {selectedNote && (
          <NoteEditor 
            note={selectedNote} 
            onUpdate={updateNote}
            className="flex-1"
          />
        )}
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className={`${isMobile ? 'w-full' : 'w-80'} border-r bg-card flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-medium text-foreground">Notes</h1>
            <Button onClick={createNewNote} size="sm" className="shrink-0">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Notes List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-2">
                  {searchTerm ? 'No notes found' : 'No notes yet'}
                </div>
                {!searchTerm && (
                  <Button onClick={createNewNote} variant="outline" size="sm">
                    Create your first note
                  </Button>
                )}
              </div>
            ) : (
              filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className={`group p-4 cursor-pointer transition-colors hover:bg-secondary/50 ${
                    selectedNoteId === note.id ? 'ring-2 ring-accent bg-secondary/30' : ''
                  }`}
                  onClick={() => selectNote(note)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate mb-1">
                        {highlightMatch(note.title, searchTerm)}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {highlightMatch(
                          note.content.slice(0, 100) + (note.content.length > 100 ? '...' : ''),
                          searchTerm
                        )}
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Note</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete "{note.title}"? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm">Cancel</Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteNote(note.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      {!isMobile && (
        <div className="flex-1">
          {selectedNote ? (
            <NoteEditor note={selectedNote} onUpdate={updateNote} />
          ) : (
            <div className="h-full flex items-center justify-center bg-background">
              <div className="text-center">
                <div className="text-muted-foreground mb-4">Select a note to start editing</div>
                <Button onClick={createNewNote}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Note
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App