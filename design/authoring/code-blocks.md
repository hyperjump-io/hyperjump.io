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

Code blocks don't wrap. A line that's too long scrolls. Don't add `wrap`
to a fence.

For how highlighting works, see
[JSON Schema highlighting](../components/highlighting.md).
