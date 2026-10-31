# Prose

Write prose that reads as one explanation, not a list of separate facts.

- Make each sentence pick up from the one before it. Join a cause to what it
  causes instead of stating them as two sentences. "A document can refer to
  anything anywhere, so `Hyperjump` won't retrieve anything from the network
  until you tell it where it may go."
- Give the reason before the instruction. "The cache belongs to the HTTP
  plugin, so to change it you replace the HTTP plugin" tells the reader why
  the step works.
- Be precise. Use the API's own terms, such as "a `Hyperjump` instance" or
  "the default for `allowRetrieval`", instead of a friendly paraphrase. Don't
  simplify until it's wrong. "The session won't retrieve it again" sounds
  like a document can only be read once. Say what actually happens. Use one
  word for one thing within a sentence. "Its value is the URL of the value it
  refers to" uses "value" for two different things.
- Say what the reader needs and leave out internals that don't change what
  they do. "The string you pass to `get` is the same on every operating
  system" is more useful than the name of the error a backslash causes.
- Join two statements only with a word that says how they relate. "So" says
  the second follows from the first. It has to follow directly: "A
  `Hyperjump` can only browse JRef nodes, so this plugin uses
  `JrefMediaTypeDocument`" skips a step, which is that this plugin's
  documents come from the JRef parser. "And" says the two are alike. Used
  for a consequence or a separate fact, it hides how they relate: "a file is
  still processed if the parser recovered, and those errors are reported as
  warnings". Use the word that says the relationship, such as "which" for a
  consequence, or give the second statement its own sentence. A "which" that
  only adds a description is a statement of its own, so give it its own
  sentence.
- Say what a comparison is compared to. "One that has a lower quality" doesn't
  say lower than what. When the reader is about to see the values, give them:
  "a quality of 0.9", "the default quality of 1".
- Describe things the way the reader sees them, the same way throughout a
  page. A page about documents that come from HTTP or files shouldn't start
  with "a response". A file is a document to the reader, not a response.
- Introduce every code block and table with a sentence that says what it
  shows. When an example demonstrates something, say what.
- When a consequence is hard to picture, show it with a concrete example.
  "Say Alice and Bob each have their own token for the same URL. If their
  requests share a cache, Bob sees Alice's account." Then show the code that
  prevents it. Warnings about security and correctness need this most,
  because the reader has to understand them to act on them.
- Order an explanation as the case that's fine, then the case that isn't,
  then what to do about it.
- When a term is the reason for a behavior, say what the term means. "The
  cache is private" explains nothing until it says "which means it's meant
  for one user".
- Don't announce. Lines like "Now for the good part" or "Look at what's
  missing" add nothing. Say what's interesting instead.
