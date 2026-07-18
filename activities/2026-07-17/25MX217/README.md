# Dynamic JSON-Driven Form Generator

## Overview

This project demonstrates a dynamic form generator built using React/Next.js. The application renders forms based on a JSON schema, eliminating the need to hardcode UI components. The system supports nested questionnaires, field validation, and conditional rendering, making it suitable for enterprise consulting applications.

## Problem Statement

Develop a JSON-driven form generator that:

* Dynamically renders form fields from a JSON schema.
* Supports nested form sections.
* Performs validation (e.g., Age must be greater than 18).
* Displays conditional fields (e.g., show "Company Name" only when "Employed" is selected).
* Collects and validates user responses.

## Features

* Dynamic form rendering from JSON configuration.
* Nested questionnaire support.
* Conditional field visibility.
* Client-side validation.
* Error message handling.
* Responsive user interface.
* Easily extensible schema for future requirements.

## Architecture

### Components

* **Form Renderer** – Reads the JSON schema and renders UI components.
* **Field Renderer** – Dynamically selects the appropriate input component.
* **Validation Engine** – Validates user input according to schema rules.
* **Conditional Logic Engine** – Evaluates dependencies between fields.
* **State Manager** – Stores and updates user responses.

## Technologies Used

* React / Next.js
* JavaScript / TypeScript
* JSON
* CSS / Tailwind CSS (optional)

## Time Complexity

| Operation                    | Complexity |
| ---------------------------- | ---------- |
| Render Form                  | O(n)       |
| Validate Inputs              | O(n)       |
| Conditional Logic Evaluation | O(n)       |
| Update Field Value           | O(1)       |

Where **n** is the number of fields in the JSON schema.

## Design Decisions

* JSON-driven architecture improves maintainability.
* Component-based design increases reusability.
* Validation rules are defined within the schema instead of hardcoding.
* Conditional rendering minimizes unnecessary UI rendering.
* Modular architecture allows future integration with APIs and databases.

## Trade-offs

### Advantages

* Highly scalable.
* Easy to extend.
* Reduced code duplication.
* Supports multiple questionnaire formats.

### Limitations

* Large schemas may increase rendering time.
* Deeply nested forms require additional recursion.
* Complex conditional dependencies can increase maintenance effort.

## Future Improvements

* Multi-step forms.
* Backend schema management.
* Async validation.
* File upload support.
* Internationalization.
* Form analytics and reporting.

Sakthivel Mallaiah
