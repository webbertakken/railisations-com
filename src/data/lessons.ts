export type Lesson = Readonly<{
  date: string;
  title: string;
  desc: string;
}>;

export const lessons: ReadonlyArray<Lesson> = Object.freeze([
  {
    date: "JANUARY 2021",
    title: "Embrace the Initial Friction",
    desc: "The first steps in any significant endeavor are fraught with resistance. Recognizing this friction as a natural part of the process, rather than a signal to stop, is crucial for sustained progress.",
  },
  {
    date: "APRIL 2021",
    title: "Iterative Refinement is Key",
    desc: "Perfection is an illusion. The most robust systems are built through constant, small iterations. Feedback loops must be tight and actionable.",
  },
  {
    date: "AUGUST 2021",
    title: "The Value of Documentation",
    desc: 'Institutional memory is fragile. Documenting not just the "how" but the "why" behind decisions prevents future cycles from repeating past mistakes.',
  },
  {
    date: "DECEMBER 2021",
    title: "Silence the Noise",
    desc: "In an era of constant connectivity, the ability to focus deeply on a single complex problem is a superpower. Deliberate disconnection is necessary.",
  },
  {
    date: "MARCH 2022",
    title: "Empathy in Engineering",
    desc: "Systems are built for people. Ignoring the human element in technical design leads to robust solutions that no one wants to use.",
  },
  {
    date: "JULY 2022",
    title: "Celebrate Small Wins",
    desc: "Long-term projects can feel like a slog. Recognizing and celebrating intermediate milestones maintains morale and momentum.",
  },
  {
    date: "NOVEMBER 2022",
    title: "The Fallacy of Sunk Costs",
    desc: "Being willing to abandon a failing strategy, regardless of the time already invested, is a mark of mature decision-making.",
  },
  {
    date: "FEBRUARY 2023",
    title: "Cross-Disciplinary Insight",
    desc: "The best solutions often come from the intersection of different fields. Encouraging cross-pollination of ideas yields unexpected breakthroughs.",
  },
  {
    date: "JUNE 2023",
    title: "Simplicity is Hard",
    desc: "Making something complex is easy; making it simple requires profound understanding and rigorous editing. Strive for elegant simplicity.",
  },
  {
    date: "OCTOBER 2023",
    title: "Resilience Over Rigidity",
    desc: "Systems that bend survive storms. Designing for adaptability and failure recovery is more important than trying to prevent all errors.",
  },
  {
    date: "JANUARY 2024",
    title: "The Power of Asynchronous Work",
    desc: "Not everything requires a meeting. Mastering written, asynchronous communication unlocks deep work and global collaboration.",
  },
  {
    date: "MARCH 2024",
    title: "Question the Defaults",
    desc: "Accepted wisdom is often just institutional inertia. Continuously questioning why things are done a certain way prevents stagnation.",
  },
  {
    date: "MAY 2024",
    title: "Protect the Core",
    desc: "Identify the absolute core value proposition of a project and defend it ruthlessly against feature creep and distraction.",
  },
  {
    date: "JULY 2024",
    title: "Feedback is a Gift",
    desc: "Constructive criticism, even when uncomfortable, is the fastest vehicle for growth. Cultivate environments where feedback flows freely.",
  },
  {
    date: "SEPTEMBER 2024",
    title: "Rest is Not Inaction",
    desc: "Burnout is a systemic failure, not an individual one. Adequate rest is a required input for high-quality creative output.",
  },
  {
    date: "NOVEMBER 2024",
    title: "Scale Changes Everything",
    desc: "Processes that work for ten people break at a hundred. Anticipating the inflection points of scale prevents catastrophic bottlenecks.",
  },
  {
    date: "JANUARY 2025",
    title: "Metrics Inform, Intuition Decides",
    desc: "Data is a compass, not a map. Over-reliance on metrics can obscure the broader context that intuition often grasps.",
  },
  {
    date: "MARCH 2025",
    title: "Cultivate Curiosity",
    desc: "The most effective teams are those driven by a genuine desire to understand how things work. Curiosity is the engine of innovation.",
  },
  {
    date: "MAY 2025",
    title: "Transparency Builds Trust",
    desc: "Hoarding information creates silos. Defaulting to transparency builds trust and empowers individuals to make better local decisions.",
  },
  {
    date: "AUGUST 2025",
    title: "The Journey is the Destination",
    desc: "Obsessing over the final outcome often diminishes the quality of the work in the present. Finding joy in the daily practice is the ultimate goal.",
  },
] as const satisfies ReadonlyArray<Lesson>);
