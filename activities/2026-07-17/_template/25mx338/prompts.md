# AI Prompts Used During Development

The following prompts were used to assist in understanding concepts, planning the architecture, and improving implementation. All generated outputs were reviewed, verified, and adapted before use.

---

## Prompt 1

> Explain how to build a dynamic JSON-driven form generator in React with recursive rendering.

### Useful Output

- Learned recursive rendering
- Understood component hierarchy
- Identified reusable architecture

### Why It Worked

It provided a high-level design instead of implementation-specific code.

---

## Prompt 2

> How can conditional rendering be implemented using a JSON schema?

### Useful Output

Suggested using a visibility rule like:

```
visibleIf:
    field: employed
    equals: true
```

### Why It Worked

It separated UI logic from business logic.

---

## Prompt 3

> Explain validation architecture for schema-driven forms.

### Useful Output

Suggested creating a dedicated validation utility instead of placing validation inside components.

### Why It Worked

Improved modularity and maintainability.

---

## Prompt 4

> Explain Big-O complexity for recursive tree traversal.

### Useful Output

Confirmed:

- Rendering → O(n)
- Validation → O(n)
- Lookup → O(1)
- Memory → O(n)

### Why It Worked

Helped justify architectural decisions in the README.

---

## Prompt 5

> Suggest edge cases for a dynamic form generator.

### Useful Output

Identified cases including:

- Empty required fields
- Invalid age
- Hidden conditional fields
- Missing schema properties
- Deeply nested forms

### Why It Worked

Improved testing coverage.

---

# How AI Was Used

AI was used as a learning and productivity tool for:

- Understanding concepts
- Exploring architectural options
- Reviewing algorithmic complexity
- Improving documentation

The implementation, testing, debugging, and final decisions were completed manually based on the project requirements.
