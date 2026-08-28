export default {
  id: "presence",
  name: "Presence",
  icon: "👊",
  color: "#d15b45",
  nodes: [
    {
      id: "backbone",
      name: "Grow a Backbone",
      description: "Say what you mean. Hold your ground even when it's uncomfortable.",
      stages: [
        {
          id: "backbone-1",
          title: "Notice the Pattern",
          done: false,
          resources: [
            "Book: No More Mr Nice Guy – Robert Glover",
            "Track every time you agree to something you didn't want to do",
          ],
        },
        {
          id: "backbone-2",
          title: "Practice Saying No",
          done: false,
          resources: [
            "Book: When I Say No, I Feel Guilty – Manuel Smith",
            "Practice: say no to one small thing per day",
          ],
        },
        {
          id: "backbone-3",
          title: "Hold Your Ground",
          done: false,
          resources: [
            "Practice: disagree with someone once a day, respectfully",
            "Don't soften your position just to avoid tension",
          ],
        },
      ],
      habits: ["Said no to something today", "Held my position in a conversation"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
    {
      id: "command",
      name: "Command a Room / Respect",
      description: "Posture, eye contact, deliberate speech — the physical signals of authority.",
      stages: [
        {
          id: "command-1",
          title: "Posture & Presence",
          done: false,
          resources: ["Book: Presence – Amy Cuddy", "Practice: power posture before high-stakes moments"],
        },
        {
          id: "command-2",
          title: "Eye Contact & Pace",
          done: false,
          resources: [
            "YouTube: Charisma on Command",
            "Practice: hold eye contact a beat longer than feels natural",
            "Slow down speech, pause before answering",
          ],
        },
        {
          id: "command-3",
          title: "Own the Room",
          done: false,
          resources: [
            "Practice: be the one who speaks last/decisively in group settings",
            "Notice who commands respect around you and study their behavior",
          ],
        },
      ],
      habits: ["Practiced eye contact today", "Spoke deliberately, didn't rush"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
    {
      id: "confrontational",
      name: "Be More Confrontational",
      description: "Speak up when something bothers you. Don't let things slide.",
      stages: [
        {
          id: "confrontational-1",
          title: "Name It Internally",
          done: false,
          resources: ["Notice the moment something bothers you, don't suppress it", "Book: Crucial Conversations"],
        },
        {
          id: "confrontational-2",
          title: "Say Something Small",
          done: false,
          resources: ["Practice: address one uncomfortable thing per week, start low-stakes"],
        },
        {
          id: "confrontational-3",
          title: "Raise the Stakes",
          done: false,
          resources: [
            "Address higher-stakes conflicts directly instead of avoiding",
            "Get comfortable with the other person being upset with you",
          ],
        },
      ],
      habits: ["Addressed something directly instead of letting it go"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
    {
      id: "drive",
      name: "Build Discipline & Drive",
      description: "Follow through on what you say you'll do, especially when motivation is gone.",
      stages: [
        {
          id: "drive-1",
          title: "Set the Standard",
          done: false,
          resources: [
            "Pick one commitment you keep breaking and fix just that one",
            "Book: Can't Hurt Me – David Goggins",
          ],
        },
        {
          id: "drive-2",
          title: "Show Up Anyway",
          done: false,
          resources: ["Practice: do the thing on the days you don't feel like it, especially those days"],
        },
        {
          id: "drive-3",
          title: "Track It",
          done: false,
          resources: [
            "Keep a visible streak/log of follow-through",
            "Weekly review: where did I quit early this week?",
          ],
        },
      ],
      habits: ["Did what I said I'd do today, even without motivation", "No excuses logged today"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
  ],
};
