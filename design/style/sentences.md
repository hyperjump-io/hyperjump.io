# Sentences

Keep each sentence easy to read once.

- When a sentence needs a second "so", "and", or "which" to finish, split it.
- Don't tack a phrase onto the end of a sentence with a comma. "It's an ES
  module with TypeScript types" reads better than "It's an ES module, with
  TypeScript types". A trailing phrase is either part of the sentence or a
  statement of its own. When it's part of the sentence, drop the comma. Add a
  joining word when one says how it relates: "You can use the parsers on their
  own without a `Hyperjump`", "step to the values inside it while following
  references". When it's a statement of its own, give it its own sentence:
  "The check applies to every URI scheme. That includes the ones you add." The
  same goes for a "which" that adds a description: "Their media type comes
  from the file extension. For JRef the extension is `.jref`." A definition
  the reader needs to follow what comes next gets its own sentence too: "a
  hypermedia client for JRef. JRef is JSON with references." After a comma, it
  reads as an aside.
- Put a comma before "so" when it starts a separate result: "Entries are JSON,
  so they can be stored anywhere." A "so" that means "so that" gives the
  sentence's purpose. It takes no comma because the purpose is the point: "It
  follows the references for you so you can work with linked documents as if
  they were one value." A "because" that gives the point takes no comma
  either: "No cache of its own because `fetch` already caches".
- Don't put a comma before "and" when it joins only two things, but do when
  it ends a list of three or more: "apples and bananas", "apples, bananas,
  and oranges". A comma after an introductory clause is fine: "When you step
  into one, you get the value it refers to."
- Name the subject at the start of a page, a section, and a paragraph. Don't
  lead with "it". Readers arrive from search, the sidebar, and links. A reader
  who skims starts at the top of each paragraph. "The Hyperjump browser is an
  ES module with TypeScript types" instead of "It's an ES module with
  TypeScript types". Name the kind of thing, even when the heading makes it
  seem obvious: "A URI scheme plugin defines the `schemes` it handles" instead
  of "A plugin defines the `schemes` it handles".
- After that, a pronoun such as "it" or "one" is fine when only one thing
  could be meant. When more than one could, name the thing. "A URL that ends
  with `/` gets its headers for everything under it, and any other URL gets
  them only for itself" makes the reader work out what each "it" is. "Headers
  for a URL that ends with `/` are sent with every request under that URL"
  doesn't. "Replace the default HTTP plugin with a plugin configured with
  `headers`" is clearer than "with one configured with `headers`".
- Don't add a short sentence that only points back at the one before it,
  such as "It replaces the default one." or "That's the same rule
  `allowRetrieval` uses." Fold it into the sentence it's about, or lead with
  it so it frames what follows: "URLs match the way they do in
  `allowRetrieval`."
- Don't put an "and" list inside another one. "How it's parsed and what
  references and fragments mean" makes the reader go back to work out what
  each "and" joins. Give each item its own sentence.
- Put a name before its description. "Uses `JrefMediaTypeDocument`, which is
  the built-in JRef plugin's type for a document that parsed without errors"
  reads better than a sentence that ends on the name. Don't end on a
  possessive that leaves out its noun, such as "the same as the built-in JRef
  plugin's".
- Use the same verb for the same relationship on every page. A plugin
  "defines" what it handles everywhere. A vague verb like "has" could mean
  contains, owns, or is given, and a different verb makes the reader wonder
  whether something different is meant.
- Use literal verbs for technical facts. "The API can be found at" instead of
  "The API lives at", and "Each character has its own document" instead of
  "Each character lives in a document of its own". A figurative verb makes the
  reader translate it back into what's true.
- Lead with the action and say who does what: "Use `--frail` to fail on
  warnings."
- Use a list or a table for three or more parallel items with details,
  instead of a long sentence that strings them together.
- Prefer "for example" and "such as" over a parenthetical, and "see X" as
  its own sentence over "(see X)".
- Use small words like "that", "the", and "it's" when they make a sentence
  easier to read. Short isn't the goal. Clear is.
