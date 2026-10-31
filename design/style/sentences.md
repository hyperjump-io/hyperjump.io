# Sentences

Keep each sentence easy to read once.

- When a sentence needs a second "so", "and", or "which" to finish, split it.
- Don't use a comma to split off what the sentence is for. Delete what
  follows the comma. If the sentence no longer says what it's for, drop the
  comma or rewrite. "It's an ES module with TypeScript types" reads better
  than "It's an ES module, with TypeScript types". "No cache of its own
  because `fetch` already caches" needs no comma because the reason is the
  point. A comma is fine before a separate statement that follows from the
  first: "Entries are JSON, so they can be stored anywhere."
- Don't put a comma before "and" when it joins only two things, but do when
  it ends a list of three or more: "apples and bananas", "apples, bananas,
  and oranges". A comma after an introductory clause is fine: "When you step
  into one, you get the value it refers to."
- Name the subject when "it" could mean more than one thing. "A URL that
  ends with `/` gets its headers for everything under it, and any other URL
  gets them only for itself" makes the reader work out what each "it" is.
  "Headers for a URL that ends with `/` are sent with every request under
  that URL" doesn't.
- Don't add a short sentence that only points back at the one before it,
  such as "It replaces the default one." or "That's the same rule
  `allowRetrieval` uses." Fold it into the sentence it's about, or lead with
  it so it frames what follows: "URLs match the way they do in
  `allowRetrieval`."
- Lead with the action and say who does what: "Use `--frail` to fail on
  warnings."
- Use a list or a table for three or more parallel items with details,
  instead of a long sentence that strings them together.
- Prefer "for example" and "such as" over a parenthetical, and "see X" as
  its own sentence over "(see X)".
- Use small words like "that", "the", and "it's" when they make a sentence
  easier to read. Short isn't the goal. Clear is.
