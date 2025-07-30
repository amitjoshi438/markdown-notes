import { useState, useEffect, useMemo } from 'react'
import { marked } from 'marked'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { PencilSimple, Eye } from '@phosphor-icons/react'
import { useIsMobile } from '@/hooks/use-mobile'
import type { Note } from '@/App'

interface NoteEditorProps {
  note: Note
  onUpdate: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void
  className?: string
}

export function NoteEditor({ note, onUpdate, className = '' }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const isMobile = useIsMobile()

  // Configure marked for security and features
  marked.setOptions({
    breaks: true,
    gfm: true,
  })

  const htmlContent = useMemo(() => {
    if (!content.trim()) return '<p class="text-muted-foreground italic">Start writing your note...</p>'
    
    try {
      return marked.parse(content)
    } catch (error) {
      return '<p class="text-destructive">Error rendering markdown</p>'
    }
  }, [content])

  // Auto-save with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        onUpdate(note.id, { title: title.trim() || 'Untitled Note', content })
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [title, content, note.id, note.title, note.content, onUpdate])

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
  }, [note.id, note.title, note.content])

  const togglePreview = () => setIsPreviewMode(!isPreviewMode)

  if (isMobile) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        {/* Mobile Header */}
        <div className="flex items-center gap-2 p-4 border-b bg-card">
          <Button
            variant={isPreviewMode ? "outline" : "default"}
            size="sm"
            onClick={togglePreview}
          >
            {isPreviewMode ? <PencilSimple className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
        </div>

        {/* Title */}
        <div className="p-4 border-b">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-lg font-medium border-0 px-0 focus-visible:ring-0 bg-transparent"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          {isPreviewMode ? (
            <ScrollArea className="h-full">
              <div 
                className="p-4 prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:text-muted-foreground prose-blockquote:border-border"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </ScrollArea>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing in markdown..."
              className="w-full h-full p-4 resize-none border-0 bg-transparent focus:outline-none font-mono text-sm leading-relaxed"
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Title */}
      <div className="p-6 border-b">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="text-xl font-medium border-0 px-0 focus-visible:ring-0 bg-transparent"
        />
      </div>

      {/* Editor and Preview */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="px-6 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <PencilSimple className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Editor</span>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing in markdown..."
              className="w-full h-full min-h-[500px] p-6 resize-none border-0 bg-transparent focus:outline-none font-mono text-sm leading-relaxed"
            />
          </ScrollArea>
        </div>

        <Separator orientation="vertical" />

        {/* Preview */}
        <div className="flex-1 flex flex-col">
          <div className="px-6 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Preview</span>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div 
              className="p-6 prose max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:text-muted-foreground prose-blockquote:border-border prose-a:text-primary hover:prose-a:text-primary/80"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}