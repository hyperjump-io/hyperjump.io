# Lint rule pages

Each lint rule in json-schema has a page in `website/linting/rules/`. The
site lints each schema example on the page with the page's rule, and
underlines what each message is about.

After each example, list the messages that the rule reports for it in a
blockquote, one message to a line:

````md
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "number",
  "multipleOf": 1
}
```

> 'multipleOf': 1 only allows integers. Remove it, and replace 'number' with 'integer' in 'type'.
````

The site shows the list as the linter's output. If the rule reports
different messages than the page lists, the build fails.

For how the site checks and shows the messages, see
[Lint messages on rule pages](../components/highlighting.md#lint-messages-on-rule-pages).
