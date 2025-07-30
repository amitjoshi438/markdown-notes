# Note-Taking App with Markdown Support

A clean, efficient note-taking application that supports markdown formatting and powerful search capabilities for organizing and retrieving thoughts quickly.

**Experience Qualities**:
1. **Focused** - Distraction-free writing environment that keeps users in flow state
2. **Responsive** - Fast, real-time markdown preview and instant search results
3. **Intuitive** - Natural workflow from creating to organizing to finding notes

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple interconnected features (create, edit, search, organize) with persistent state management but no complex user accounts or advanced collaboration features.

## Essential Features

**Create New Note**
- Functionality: Add new markdown-formatted notes with title and content
- Purpose: Capture thoughts and ideas quickly without friction
- Trigger: "New Note" button or keyboard shortcut
- Progression: Click new → enter title → write content in markdown → auto-save
- Success criteria: Note appears in list, markdown renders correctly, content persists

**Live Markdown Preview**
- Functionality: Real-time rendering of markdown as user types
- Purpose: Visual feedback for formatting without switching modes
- Trigger: Typing in the editor
- Progression: Type markdown → see formatted preview → continue editing
- Success criteria: Common markdown syntax renders correctly (headers, lists, links, emphasis)

**Search Notes**
- Functionality: Full-text search across all note titles and content
- Purpose: Quickly find specific notes from growing collection
- Trigger: Type in search bar
- Progression: Enter search term → see filtered results → click to open note
- Success criteria: Results update instantly, highlights matches, searches both title and content

**Note Management**
- Functionality: Edit, delete, and organize existing notes
- Purpose: Maintain and curate note collection over time
- Trigger: Click on note or use action buttons
- Progression: Select note → edit content → changes auto-save OR select note → delete → confirm
- Success criteria: Changes persist, deleted notes removed from list, no data loss

## Edge Case Handling

- **Empty Search**: Show all notes when search is cleared
- **No Notes**: Display helpful empty state with create prompt
- **Long Content**: Scroll within editor and preview panes
- **Invalid Markdown**: Gracefully handle malformed syntax without breaking
- **Rapid Typing**: Debounce search and auto-save to prevent performance issues

## Design Direction

The design should feel clean, focused, and writer-friendly - similar to modern writing tools like Notion or Obsidian but simpler. Minimal interface that puts content first, with subtle visual hierarchy that doesn't compete with the user's writing.

## Color Selection

Analogous (adjacent colors on color wheel) - Using warm grays and subtle blues to create a calming, focused writing environment that reduces eye strain during long writing sessions.

- **Primary Color**: Deep slate blue (oklch(0.25 0.05 240)) - Communicates trust and focus for primary actions
- **Secondary Colors**: Warm gray (oklch(0.95 0.01 60)) for backgrounds and soft blue-gray (oklch(0.85 0.02 220)) for secondary elements
- **Accent Color**: Warm amber (oklch(0.7 0.15 60)) for highlights, search matches, and interactive states
- **Foreground/Background Pairings**:
  - Background (Light Gray oklch(0.98 0.005 60)): Dark slate text (oklch(0.15 0.02 240)) - Ratio 14.2:1 ✓
  - Card (White oklch(1 0 0)): Dark slate text (oklch(0.15 0.02 240)) - Ratio 15.1:1 ✓
  - Primary (Deep Slate oklch(0.25 0.05 240)): White text (oklch(1 0 0)) - Ratio 12.8:1 ✓
  - Accent (Warm Amber oklch(0.7 0.15 60)): Dark slate text (oklch(0.15 0.02 240)) - Ratio 8.5:1 ✓

## Font Selection

Typography should feel modern and highly legible for extended reading and writing, with clear distinction between interface text and user content using a system font stack for familiarity and performance.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Medium/24px/tight letter spacing
  - H2 (Note Titles): Inter Medium/18px/normal spacing
  - Body (Note Content): System UI/16px/relaxed line height (1.6)
  - Interface (Buttons, Labels): Inter/14px/normal spacing
  - Code (Markdown): JetBrains Mono/14px/normal spacing

## Animations

Subtle and functional animations that provide feedback without disrupting the writing flow, focusing on state transitions and search result updates rather than decorative effects.

- **Purposeful Meaning**: Smooth transitions communicate app responsiveness and guide attention to search results and note changes
- **Hierarchy of Movement**: Search results and note switching deserve priority animation focus, while typing feedback should be minimal

## Component Selection

- **Components**: 
  - Card for note items and main editor container
  - Input for search functionality
  - Button for actions (new note, delete)
  - Textarea for markdown editing
  - ScrollArea for note lists and long content
  - Separator for visual organization
  - Dialog for delete confirmations

- **Customizations**: 
  - Split-pane layout component for editor/preview
  - Custom markdown renderer using marked library
  - Search highlighting component for matching text

- **States**: 
  - Buttons: Subtle hover states with slight opacity changes
  - Inputs: Focus states with accent color borders
  - Notes: Selected state with soft background highlight
  - Search: Loading state for debounced searches

- **Icon Selection**: 
  - Plus icon for new note creation
  - MagnifyingGlass for search functionality  
  - Trash for delete actions
  - PencilSimple for edit mode indication

- **Spacing**: 
  - Container padding: p-6
  - Component gaps: space-y-4 for vertical, gap-4 for grid
  - Input padding: px-4 py-2
  - Button padding: px-4 py-2

- **Mobile**: 
  - Stack editor and preview vertically on mobile
  - Collapsible sidebar for note list
  - Touch-friendly button sizes (min 44px)
  - Single-column layout with tab switching between edit/preview modes