# Code blocks

The site styles some code blocks beyond normal syntax highlighting. Each
style comes from the block's language or from options in its fence. GitHub
ignores the options, so the Markdown still renders there.

## JSON schemas

The site highlights a `json` block as a schema when it has a `$schema`
property. Keywords stand out from property names that aren't keywords.

For a schema without `$schema`, put the dialect that it's loaded with in
the fence:

````md
```json dialect=https://json-schema.org/draft/2020-12/schema
{ "type": "string" }
```
````

In a `javascript` or `typescript` block, the site highlights each object
literal that has a `$schema` property the same way.

## References in JSON

Put a JRef document in a `jref` block. The site highlights it as JSON, and
each reference looks like a `$ref` that replaces its schema, underlined as
a link. GitHub shows the block without colors.

## Wrapping

`text` blocks wrap, so printed output can be any length. Other blocks
scroll.

- To wrap a block that has a value that you can't break across lines,
  such as a long URI in JSON, add `wrap` to the fence:
  ```` ```json wrap ````.
- To keep a `text` block from wrapping, such as output that's a table,
  add `wrap=false` to the fence.

For how highlighting works, see
[JSON Schema highlighting](../components/highlighting.md).
