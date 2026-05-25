export type Lesson = Readonly<{
  date: string;
  title: string;
  desc: string;
}>;

export const lessons: ReadonlyArray<Lesson> = Object.freeze([
  {
    date: "June, 2021",
    title: "Code autocompletion",
    desc: "We're able to have GitHub Copilot autocomplete our code. We may hint our intentions by writing comments first. Many experienced engineers admit generated code is often better than their own.",
  },
  {
    date: "August, 2022",
    title: "Image generation",
    desc: "Midjourney, Stable Diffusion and Dall-E made stylized image generation mainstream.",
  },
  {
    date: "November, 2022",
    title: "Conversational AI",
    desc: "With general availability of OpenAI's GPT3 through ChatGPT, we can now massively accellerate our learning on any topic, if only we open our minds to it.",
  },
  {
    date: "May, 2025",
    title: "Agentic AI",
    desc: "When Anthropic opened up Claude Code, alongside Sonnet 3.7, developers got a first taste agents doing tasks for minutes a time; creating and modifying files and reasoning about their code.",
  },
  {
    date: "",
    title: "",
    desc: "",
  },
  {
    date: "",
    title: "",
    desc: "",
  },
  {
    date: "",
    title: "",
    desc: "",
  },
  {
    date: "",
    title: "",
    desc: "",
  },
  {
    date: "",
    title: "",
    desc: "",
  },
  {
    date: "",
    title: "",
    desc: "",
  },
  {
    date: "",
    title: "",
    desc: "",
  },
  {
    date: "",
    title: "",
    desc: "",
  },
  {
    date: "",
    title: "",
    desc: "",
  },
  {
    date: "",
    title: "",
    desc: "",
  },
  {
    date: "",
    title: "",
    desc: "",
  },
] as const satisfies ReadonlyArray<Lesson>);
