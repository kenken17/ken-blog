---
title: "Code Block Test Fixture"
pubDate: 2026-05-22
description: "A test post for verifying code block rendering features."
tags: ["test", "code"]
draft: true
---

This post contains code blocks for testing the enhanced code block feature.

## JavaScript Example

```javascript title="hello.js"
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Hello, ${name}!`;
}

greet("World");
```

## Python Example

```python title="script.py"
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
```

## Plain Text

```text
This is a plain text block without a language label.
It should still render correctly.
```

## Bash Example

```bash
#!/bin/bash
echo "Setting up environment..."
npm install
npm run build
```
