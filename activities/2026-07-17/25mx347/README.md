# Dynamic JSON-Driven Form Generator

## Candidate
**Name:** SIVA  
**Roll Number:** <YOUR_ROLL_NUMBER>

---

# Problem Statement

Build a dynamic JSON-driven form generator using React/Next.js that can render complex nested questionnaires from a JSON schema. The application must support validation rules and conditional rendering of fields.

Example:
- Age must be greater than 18.
- If the user selects "Employed", display the "Company Name" field.

---

# Objectives

- Generate forms dynamically using JSON.
- Support nested sections.
- Implement field validation.
- Implement conditional field rendering.
- Keep the architecture scalable and reusable.

---

# Technology Stack

- Next.js
- React
- TypeScript (Optional)
- Tailwind CSS
- React Hooks

---

# Project Structure

```
src/
│
├── components/
│   ├── FormRenderer.jsx
│   ├── FieldRenderer.jsx
│   ├── InputField.jsx
│   ├── CheckboxField.jsx
│   └── ValidationMessage.jsx
│
├── data/
│   └── formSchema.json
│
├── utils/
│   ├── validator.js
│   └── conditionalLogic.js
│
└── app/
    └── page.jsx
```

---

# System Architecture

```
JSON Schema
      │
      ▼
Form Renderer
      │
      ▼
Field Renderer
      │
      ▼
Input Components
      │
      ▼
Validation Engine
      │
      ▼
Conditional Logic Engine
      │
      ▼
Rendered Form
```

---

# Sample JSON Schema

```json
{
  "fields": [
    {
      "type": "number",
      "label": "Age",
      "name": "age",
      "validation": {
        "min": 19
      }
    },
    {
      "type": "checkbox",
      "label": "Employed",
      "name": "employed"
    },
    {
      "type": "text",
      "label": "Company Name",
      "name": "company",
      "showIf": {
        "field": "employed",
        "equals": true
      }
    }
  ]
}
```

---

# Validation Rules

### Age Validation

- Required
- Numeric
- Must be greater than 18

### Company Name

Visible only when:

```
Employed == true
```

---

# Core Algorithm

1. Load JSON schema.
2. Iterate through all fields.
3. Evaluate conditional logic.
4. Render visible fields.
5. Validate inputs.
6. Display validation errors.
7. Submit only if all validations pass.

---

# Edge Cases Tested

✔ Age below 18

✔ Empty required fields

✔ Company Name hidden when unemployed

✔ Company Name shown when employed

✔ Invalid number input

✔ Nested conditional fields

✔ Empty JSON schema

✔ Large forms with 100+ fields

---

# Scalability

The application is designed to support:

- Unlimited form fields
- Nested sections
- Dynamic validation rules
- Multiple input types
- API-driven schemas
- Future plugin support

---

# Time Complexity

| Operation | Complexity |
|------------|------------|
| Render Fields | O(n) |
| Validation | O(n) |
| Conditional Evaluation | O(n) |
| Form Submission | O(n) |

Where **n = number of form fields**

---

# Space Complexity

Form State

```
O(n)
```

Validation Errors

```
O(n)
```

---

# Design Decisions

### Why JSON?

- Easy to modify
- API compatible
- No code changes for new forms

### Why Component-Based Architecture?

- Reusable
- Easy maintenance
- Better scalability

### Why Separate Validation Engine?

- Cleaner code
- Reusable rules
- Easy testing

---

# Trade-offs

### Advantages

- Highly scalable
- Easy maintenance
- Dynamic forms
- Separation of concerns

### Limitations

- Slightly slower than static forms
- Large schemas increase rendering time
- Complex nested logic requires recursive evaluation

---

# Future Improvements

- Drag-and-drop form builder
- Database integration
- Multi-step forms
- File upload support
- Dynamic API validation
- Internationalization
- Theme customization

---

# Conclusion

The solution successfully demonstrates a scalable JSON-driven form generator capable of rendering dynamic forms with validation and conditional logic. The architecture is modular, reusable, and suitable for enterprise consulting applications.
