export default {
  id: "social",
  name: "Social",
  icon: "🤝",
  color: "#3f9baa",
  nodes: [
    {
      id: "socialize",
      name: "Learn to Socialize",
      description: "Small talk, reading the room, group dynamics.",
      stages: [
        {
          id: "socialize-1",
          title: "Small Talk Basics",
          done: false,
          resources: ["Book: How to Win Friends and Influence People – Dale Carnegie"],
        },
        {
          id: "socialize-2",
          title: "Read People",
          done: false,
          resources: [
            "Book: The Like Switch – Jack Schafer",
            "Practice: notice body language and group energy before speaking",
          ],
        },
        {
          id: "socialize-3",
          title: "Initiate",
          done: false,
          resources: [
            "Practice: start 1 conversation with a stranger per week",
            "Ask someone a genuine question and actually listen",
          ],
        },
      ],
      habits: ["Started a conversation today", "Asked someone a genuine question"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
    {
      id: "street",
      name: "Be More Street Smart",
      description: "Read people. Understand how the world actually works.",
      stages: [
        {
          id: "street-1",
          title: "Study the Game",
          done: false,
          resources: ["Book: 48 Laws of Power – Robert Greene", "Book: The Prince – Machiavelli"],
        },
        {
          id: "street-2",
          title: "Observe",
          done: false,
          resources: ["Practice: watch how people negotiate, persuade, and posture in daily life"],
        },
        {
          id: "street-3",
          title: "Apply",
          done: false,
          resources: [
            "Podcast: Huberman Lab (social dynamics episodes)",
            "Note one 'real world' lesson per week and how you'd use it",
          ],
        },
      ],
      habits: ["Observed a social dynamic and noted it", "Learned one 'real world' thing today"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
    {
      id: "circle",
      name: "Build Your Circle",
      description: "Quality connections. Put yourself in rooms. Stop being lonely by design, not accident.",
      stages: [
        {
          id: "circle-1",
          title: "Get in the Room",
          done: false,
          resources: ["Join 1 club/group/class in something you actually like", "App: Meetup"],
        },
        {
          id: "circle-2",
          title: "Say Yes",
          done: false,
          resources: ["Say yes to 1 social invite per week, even when you'd rather not"],
        },
        {
          id: "circle-3",
          title: "Deepen It",
          done: false,
          resources: ["Turn acquaintances into friends: follow up, remember details, initiate plans"],
        },
      ],
      habits: ["Reached out to someone today", "Said yes to a social opportunity"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
    {
      id: "extroverted",
      name: "Be More Extroverted",
      description: "Build the energy and habit of initiating instead of waiting to be invited in.",
      stages: [
        {
          id: "extroverted-1",
          title: "Lower the Bar",
          done: false,
          resources: ["Practice: say one extra sentence in every interaction (cashier, coworker, etc.)"],
        },
        {
          id: "extroverted-2",
          title: "Initiate More",
          done: false,
          resources: ["Be the one who starts the group chat / suggests the plan / makes the intro"],
        },
        {
          id: "extroverted-3",
          title: "Sustain the Energy",
          done: false,
          resources: ["Practice recovering after socializing instead of avoiding the next event"],
        },
      ],
      habits: ["Initiated an interaction instead of waiting", "Suggested a plan or made an introduction"],
      streak: 0,
      lastChecked: null,
      completed: [],
    },
  ],
};
