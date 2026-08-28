export default {
  id: "mind",
  name: "Mind",
  icon: "🧠",
  color: "#8b7fd6",
  nodes: [
    {
      id: "reading",
      name: "Read Nonfiction",
      description: "Build a genuine reading habit and turn pages into retained ideas.",
      stages: [
        {
          id: "reading-1",
          title: "Build the Habit",
          done: false,
          resources: [
            "Pick one book you're excited about, not the 'best' one",
            "App: Readwise (highlight + resurface)",
            "Rule: 30 min/day minimum, same time daily",
          ],
        },
        {
          id: "reading-2",
          title: "Read Widely",
          done: false,
          resources: [
            "Atomic Habits – James Clear",
            "Thinking, Fast and Slow – Kahneman",
            "48 Laws of Power – Greene",
            "Rotate between psychology, history, and strategy",
          ],
        },
        {
          id: "reading-3",
          title: "Make It Stick",
          done: false,
          resources: [
            "Write 1 takeaway per chapter",
            "Teach the idea to someone within a week",
            "Keep a running 'best ideas' doc",
          ],
        },
      ],
      habits: ["Read 30 min today", "Write 1 key takeaway"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
    {
      id: "thinking",
      name: "Think & Articulate Clearly",
      description: "Slow down before speaking. Structure thoughts before they leave your mouth.",
      stages: [
        {
          id: "thinking-1",
          title: "Slow Down",
          done: false,
          resources: [
            "Book: The Art of Thinking Clearly – Rolf Dobelli",
            "Practice: pause 2 seconds before answering any question",
            "Notice when you're talking just to fill silence",
          ],
        },
        {
          id: "thinking-2",
          title: "Structure It",
          done: false,
          resources: [
            "Learn a simple framework: point → reason → example",
            "Practice: journal daily using that structure",
            "App: Day One (journal)",
          ],
        },
        {
          id: "thinking-3",
          title: "Say It Out Loud",
          done: false,
          resources: [
            "Practice explaining one concept out loud, unscripted, daily",
            "Record yourself and listen back weekly",
          ],
        },
      ],
      habits: ["Journal 5 min today", "Practice explaining one concept out loud"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
    {
      id: "memory",
      name: "Retain Knowledge & Memory",
      description: "Spaced repetition and active recall so what you learn actually stays.",
      stages: [
        {
          id: "memory-1",
          title: "Capture",
          done: false,
          resources: [
            "App: Readwise (resurfaces highlights)",
            "Highlight or note anything worth remembering as you consume it",
          ],
        },
        {
          id: "memory-2",
          title: "Review",
          done: false,
          resources: ["App: Anki (flashcards, spaced repetition)", "Review your deck daily, even 5 min"],
        },
        {
          id: "memory-3",
          title: "Prove It",
          done: false,
          resources: [
            "Teach it back to someone from memory, no notes",
            "Weekly: summarize one thing you learned that week",
          ],
        },
      ],
      habits: ["Review Anki deck", "Summarize something you learned this week"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
    {
      id: "knowledge",
      name: "Build General Knowledge",
      description: "Get sharper and more broadly knowledgeable, on purpose instead of by accident.",
      stages: [
        {
          id: "knowledge-1",
          title: "Pick Domains",
          done: false,
          resources: [
            "Choose 2-3 areas you're weak in (e.g. history, economics, science)",
            "Pick one educational podcast per domain",
          ],
        },
        {
          id: "knowledge-2",
          title: "Daily Input",
          done: false,
          resources: [
            "15 min/day of a documentary, article, or podcast on a chosen domain",
            "Channels like Kurzgesagt / Veritasium for quick, dense explainers",
          ],
        },
        {
          id: "knowledge-3",
          title: "Connect Ideas",
          done: false,
          resources: [
            "Practice linking new facts to things you already know",
            "Weekly: explain one new concept to someone else",
          ],
        },
      ],
      habits: ["Learned one new fact/concept today", "Connected it to something I already knew"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
  ],
};
