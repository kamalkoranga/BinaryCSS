# BinaryCSS

**BinaryCSS** is a lightweight and customizable utility-first CSS framework built for rapid UI development. Designed with scalability and performance in mind, BinaryCSS gives you full control over styling with a utility-based approach and a rich set of pre-built components.

---

## 🚀 Features

- **CSS Reset**  
  Normalize styles across browsers with a built-in reset layer.

- **Responsive Container**  
  Built-in responsive container utility for consistent layout width.

- **Typography Utilities**  
  Easily manage:
  - Font size
  - Font weight
  - Text alignment

- **Box Model Utilities**  
  - Margin and Padding
  - Width and Height
  - Borders

- **Color Utilities**  
  - Text color (`tc-[color]`)
  - Background color (`bg-[color]`)

- **Responsive Design**  
  Media query support for responsive utilities.

---

## 📦 Installation

You can include BinaryCSS via CDN for quick setup.

### CSS CDN

Include the BinaryCSS stylesheet in your `<head>`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kamalkoranga/BinaryCSS@latest/dist/css/binarycss.min.css">
```

### JavaScript CDN

For interactive components like modals, tooltips, dropdowns, etc., include the JavaScript file before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/kamalkoranga/BinaryCSS@latest/dist/js/binarycss.min.js"></script>
```

---

## 🧱 Getting Started

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kamalkoranga/BinaryCSS@latest/dist/css/binarycss.min.css">
  <title>BinaryCSS Demo</title>
</head>
<body>
  <div class="container">
    <button class="btn primary">Click Me</button>
  </div>
  <script src="https://cdn.jsdelivr.net/gh/kamalkoranga/BinaryCSS@latest/dist/js/binarycss.min.js"></script>
</body>
</html>
```

---

## 🧩 Components

BinaryCSS comes with a set of essential, customizable UI components:

- **Button**
- **Card**
- **Alert**
- **Badge**
- **Form**
- **Image**
- **Navbar**
- **Table**
- **Modal**
- **Dropdown**
- **Accordion**
- **Carousel**
- **Tooltip**

---

## 🔧 Layout Utilities

- **Flexbox Utilities**  
  Build flexible and responsive layouts quickly.

- **Grid Utilities**  
  Simple and powerful grid system for modern designs.

---


## 🎯 Arbitrary Classes

BinaryCSS supports arbitrary value syntax for full control over spacing, size, and color:

```html
<div class="m-[10px] py-[1rem] w-[250px] h-[300px] tc-[#333] bg-[#f9f9f9]"></div>
```

Supported properties:
- `m-[]`: Margin
- `p-[]`: Padding
- `h-[]`: Height
- `w-[]`: Width
- `fs-[]`: Font size
- `tc-[]`: Text color
- `bg-[]`: Background color

---

## 📖 Documentation

Basic documentation, explore component examples, utility classes, and layout are available at:

👉 [https://binarycss.onrender.com](https://binarycss.onrender.com)

Full documentation with advanced usage and customization options is coming soon!

---

## 🤝 Contributing

We welcome contributions! Please feel free to fork the repository, open issues, and submit pull requests.

---

## 📄 License

MIT License. See [LICENSE](/LICENSE) for more details.

---

## 💡 Inspiration

BinaryCSS is inspired by modern utility-first frameworks like Tailwind CSS but aims to provide a simpler, developer-friendly experience with essential features and components out of the box.

---