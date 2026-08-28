export default {
  id: "communication",
  name: "Communication",
  icon: "🗣️",
  color: "#5b8f6b",
  nodes: [
    {
      id: "eloquent",
      name: "Be More Eloquent",
      description: "Vocabulary, delivery, word choice.",
      stages: [
        {
          id: "eloquent-1",
          title: "Vocabulary",
          done: false,
          resources: ["App: Vocabulary.com", "Book: Word Power Made Easy – Norman Lewis"],
        },
        {
          id: "eloquent-2",
          title: "Delivery",
          done: false,
          resources: ["Practice: record yourself speaking, listen back", "Cut filler words (um, like, you know)"],
        },
        {
          id: "eloquent-3",
          title: "Polish",
          done: false,
          resources: [
            "Study how skilled speakers phrase ideas (TED, interviews)",
            "Rewrite a rambling thought into one clean sentence",
          ],
        },
      ],
      habits: ["Learned 1 new word today", "Recorded myself speaking for 2 min"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
    {
      id: "vocal",
      name: "Be More Vocal",
      description: "Speak up in groups. Share opinions. Don't hold back.",
      stages: [
        {
          id: "vocal-1",
          title: "Lower the Threshold",
          done: false,
          resources: ["Practice: contribute once in every group conversation, no matter how small"],
        },
        {
          id: "vocal-2",
          title: "Share Opinions",
          done: false,
          resources: ["YouTube: TED Talks (study delivery)", "Practice: give your actual opinion instead of a neutral one"],
        },
        {
          id: "vocal-3",
          title: "Lead the Conversation",
          done: false,
          resources: ["Toastmasters (if interested)", "Practice: ask the group a question and drive discussion"],
        },
      ],
      habits: ["Shared my opinion unprompted today", "Spoke up in a group setting"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
  ],
};
