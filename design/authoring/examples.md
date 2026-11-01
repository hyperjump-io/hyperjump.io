# Code examples

## Write examples in TypeScript

Put examples in `typescript` blocks, and write them the way a TypeScript
user would:

- Use `satisfies` for an object that has to fit a type, such as a
  keyword.
- Add types to parameters that TypeScript can't infer.
- Explain a type in the same place as the thing that it types, not in a
  separate "In TypeScript" section.

Check that each typed example compiles.

## Write examples like real code

Write an example the way a user would write the real thing. Make examples
of the same kind of thing look alike on every page. For example, a plugin
is always a class that keeps its own state, not an object literal that
reads a variable from outside it.

## Show results

Show a short return value in a comment on the same line:

```typescript
validator.validate(value); // true
```

Show a longer result after the code block, in a block of its own:

- Put printed output in a `text` block.
- Put data in a `json` block or a table, with only the properties that
  matter to the example.

## Keep lines short

Keep lines in code blocks to 76 characters or fewer, so they fit without
scrolling. Printed output in `text` blocks can be any length, because the
site wraps it. For other ways to wrap, see [Code blocks](code-blocks.md).
