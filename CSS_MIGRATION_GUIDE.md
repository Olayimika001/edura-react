# CSS Migration Guide for Edura React Application

## Table of Contents
1. [Current State Analysis](#current-state-analysis)
2. [Recommended CSS Structure](#recommended-css-structure)
3. [Step-by-Step Migration Process](#step-by-step-migration-process)
4. [CSS Files Setup](#css-files-setup)
5. [Component CSS Migration Examples](#component-css-migration-examples)
6. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Current State Analysis

### Current Folder Structure
```
edura-react/
├── src/
│   ├── styles/
│   │   ├── index.css          # Empty
│   │   └── variables.css      # Empty
│   ├── components/
│   │   ├── common/
│   │   │   └── Header/
│   │   │       └── Header.jsx  # Imports './Header.css' (doesn't exist)
│   │   └── auth/
│   └── pages/
└── main.jsx                    # CSS import commented out
```

### Issues Identified
1. ❌ CSS files are empty
2. ❌ Header component imports non-existent `Header.css`
3. ❌ No CSS Modules setup
4. ❌ No global styles configured
5. ❌ CSS variables not extracted from original `style.css`

---

## Recommended CSS Structure

### Target Structure (After Migration)

```
src/
├── styles/
│   ├── variables.css          # CSS custom properties (:root)
│   ├── globals.css            # Global resets and base styles
│   ├── typography.css         # Typography base styles
│   ├── forms.css             # Shared form element styles
│   ├── utilities.css         # Utility classes (.th-btn, spacing)
│   └── animations.css        # Keyframes and animations
│
├── components/
│   ├── common/
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.module.css    # ✅ CSS Module
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.module.css
│   │   └── Layout/
│   │       ├── Layout.jsx
│   │       └── Layout.module.css
│   │
│   ├── courses/
│   │   ├── CourseCard/
│   │   │   ├── CourseCard.jsx
│   │   │   └── CourseCard.module.css
│   │   └── CourseList/
│   │       ├── CourseList.jsx
│   │       └── CourseList.module.css
│   │
│   └── [other components]/
│       └── [Component]/
│           ├── [Component].jsx
│           └── [Component].module.css
│
└── main.jsx                   # Imports global CSS files
```

### Key Changes Needed

1. ✅ **Create CSS Module files** for each component (`.module.css`)
2. ✅ **Extract CSS variables** from `html-app/assets/css/style.css`
3. ✅ **Set up global styles** (resets, base elements)
4. ✅ **Update component imports** to use CSS Modules
5. ✅ **Configure import order** in `main.jsx`

---

## Step-by-Step Migration Process

### Phase 1: Setup Global CSS Files

#### Step 1.1: Extract CSS Variables

**File:** `src/styles/variables.css`

```css
/* CSS Custom Properties - Extract from html-app/assets/css/style.css lines 2-24 */

:root {
  /* Colors */
  --theme-color: #107507;
  --theme-color2: #f20f10;
  --title-color: #0f2239;
  --body-color: #4d5765;
  --smoke-color: #f3f7fb;
  --black-color: #000000;
  --white-color: #ffffff;
  --light-color: #72849b;
  --yellow-color: #ffb539;
  --success-color: #28a745;
  --error-color: #dc3545;
  --border-color: #ecf1f9;

  /* Fonts */
  --title-font: "Jost", sans-serif;
  --body-font: "Roboto", sans-serif;
  --icon-font: "Font Awesome 6 Pro";

  /* Layout */
  --main-container: 1380px;
  --container-gutters: 24px;
  --section-space: 120px;
  --section-space-mobile: 80px;
  --section-title-space: 70px;

  /* Animations */
  --ripple-ani-duration: 5s;
}
```

#### Step 1.2: Create Global Styles

**File:** `src/styles/globals.css`

```css
/* Base/Reset Styles - Extract from html-app/assets/css/style.css lines 25-600 */

html,
body {
  scroll-behavior: auto !important;
}

body {
  font-family: var(--title-font);
  font-size: 16px;
  font-weight: 400;
  color: var(--body-color);
  line-height: 26px;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar Styles */
body::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  border-radius: 20px;
}

body::-webkit-scrollbar-track {
  background: rgba(252, 0, 18, 0.1);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
}

body::-webkit-scrollbar-thumb {
  background-color: var(--theme-color);
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.3) 25%,
    transparent 20%,
    transparent 50%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.3) 75%,
    transparent 75%,
    transparent
  );
  border-radius: 20px;
}

/* Base Element Styles */
iframe {
  border: none;
  width: 100%;
}

img:not([draggable]),
embed,
object,
video {
  max-width: 100%;
  height: auto;
}

ul {
  list-style-type: disc;
}

ol {
  list-style-type: decimal;
}

table {
  margin: 0 0 1.5em;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid var(--border-color);
}

th {
  font-weight: 700;
  color: var(--title-color);
}

td,
th {
  border: 1px solid var(--border-color);
  padding: 9px 12px;
}

a {
  color: var(--theme-color);
  text-decoration: none;
  outline: 0;
  transition: all ease 0.4s;
}

a:hover {
  color: var(--title-color);
}

a:active,
a:focus,
a:hover,
a:visited {
  text-decoration: none;
  outline: 0;
}

button {
  transition: all ease 0.4s;
}

img {
  border: none;
  max-width: 100%;
}

/* Focus States */
.slick-slide:focus,
button:focus,
a:focus,
a:active,
input,
input:hover,
input:focus,
input:active,
textarea,
textarea:hover,
textarea:focus,
textarea:active {
  outline: none;
}

input:focus {
  outline: none;
  box-shadow: none;
}
```

#### Step 1.3: Create Typography Styles

**File:** `src/styles/typography.css`

```css
/* Typography Base Styles - Extract from html-app/assets/css/style.css lines 176-600 */

.h1, h1,
.h2, h2,
.h3, h3,
.h4, h4,
.h5, h5,
.h6, h6 {
  font-family: var(--title-font);
  color: var(--title-color);
  text-transform: none;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 15px 0;
}

.h1, h1 {
  font-size: 60px;
  line-height: 1.167;
}

.h2, h2 {
  font-size: 48px;
  line-height: 1.2;
}

.h3, h3 {
  font-size: 36px;
  line-height: 1.3;
}

.h4, h4 {
  font-size: 28px;
  line-height: 1.35;
}

.h5, h5 {
  font-size: 24px;
  line-height: 1.4;
}

.h6, h6 {
  font-size: 20px;
  line-height: 1.45;
}

p {
  font-family: var(--body-font);
  margin: 0 0 18px 0;
  color: var(--body-color);
  line-height: 1.75;
}

h1 a, h2 a, h3 a, h4 a, h5 a, h6 a,
p a, span a {
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  line-height: inherit;
}

/* Responsive Typography */
@media (max-width: 1399px) {
  .h1, h1 { font-size: 54px; }
  .h2, h2 { font-size: 42px; }
  .h3, h3 { font-size: 32px; }
}

@media (max-width: 1199px) {
  .h1, h1 { font-size: 48px; }
  .h2, h2 { font-size: 38px; }
  .h3, h3 { font-size: 28px; }
  .h4, h4 { font-size: 24px; }
}

@media (max-width: 767px) {
  .h1, h1 { font-size: 36px; }
  .h2, h2 { font-size: 30px; }
  .h3, h3 { font-size: 24px; }
  .h4, h4 { font-size: 20px; }
  .h5, h5 { font-size: 18px; }
  .h6, h6 { font-size: 16px; }
}
```

#### Step 1.4: Create Form Styles

**File:** `src/styles/forms.css`

```css
/* Form Element Styles - Extract from html-app/assets/css/style.css lines 900-1200 */

.form-control,
.form-select {
  display: block;
  width: 100%;
  padding: 15px 25px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--body-color);
  background-color: var(--smoke-color);
  border: 1px solid transparent;
  border-radius: 5px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus,
.form-select:focus {
  color: var(--body-color);
  background-color: var(--white-color);
  border-color: var(--theme-color);
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(16, 117, 7, 0.25);
}

.form-control::placeholder,
.form-select::placeholder {
  color: var(--body-color);
  opacity: 0.6;
}

.form-group {
  margin-bottom: var(--bs-gutter-x);
  position: relative;
  display: inline-block;
  width: 100%;
}

.form-group > i {
  position: absolute;
  left: 25px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--body-color);
  pointer-events: none;
  z-index: 1;
}

.form-group.has-label > i {
  top: calc(50% + 12px);
}

textarea.form-control,
textarea {
  min-height: 150px;
  padding-top: 16px;
  padding-bottom: 17px;
  border-radius: 5px;
  resize: vertical;
}

.form-select,
select {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3E%3C/svg%3E");
  background-position: right 26px center;
  background-repeat: no-repeat;
  background-size: 16px 12px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  padding-right: 50px;
}
```

#### Step 1.5: Create Utility Styles

**File:** `src/styles/utilities.css`

```css
/* Utility Classes - Extract from html-app/assets/css/style.css */

/* Button Styles */
.th-btn {
  display: inline-block;
  padding: 18px 35px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all ease 0.4s;
  font-family: var(--title-font);
}

.th-btn.style1 {
  background-color: var(--theme-color);
  color: var(--white-color);
}

.th-btn.style1:hover {
  background-color: var(--title-color);
  color: var(--white-color);
}

.th-btn.style2 {
  background-color: transparent;
  color: var(--theme-color);
  border: 2px solid var(--theme-color);
}

.th-btn.style2:hover {
  background-color: var(--theme-color);
  color: var(--white-color);
}

.th-btn.style3 {
  background-color: var(--title-color);
  color: var(--white-color);
}

.th-btn.style3:hover {
  background-color: var(--theme-color);
  color: var(--white-color);
}

/* Spacing Utilities */
.gy-30 {
  --bs-gutter-y: 30px;
}

.gy-40 {
  --bs-gutter-y: 40px;
}

.gy-50 {
  --bs-gutter-y: 50px;
}

.gx-10 {
  --bs-gutter-x: 10px;
}

.gx-70 {
  --bs-gutter-x: 70px;
}

/* Container */
.container {
  max-width: var(--main-container);
  margin: 0 auto;
  padding: 0 var(--container-gutters);
}

@media (max-width: 1399px) {
  .container {
    max-width: 1200px;
  }
}

@media (max-width: 1199px) {
  .container {
    max-width: 992px;
  }
}

@media (max-width: 991px) {
  .container {
    max-width: 768px;
  }
}

@media (max-width: 767px) {
  .container {
    max-width: 100%;
    padding: 0 15px;
  }
}
```

#### Step 1.6: Create Animation Styles

**File:** `src/styles/animations.css`

```css
/* Animations - Extract from html-app/assets/css/style.css */

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes jumpAni {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Animation Utility Classes */
.fade-in {
  animation: fadeIn 0.6s ease-in-out;
}

.slide-in-up {
  animation: slideInUp 0.6s ease-in-out;
}

.slide-in-left {
  animation: slideInLeft 0.6s ease-in-out;
}

.slide-in-right {
  animation: slideInRight 0.6s ease-in-out;
}
```

#### Step 1.7: Update main.jsx

**File:** `src/main.jsx`

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// ✅ IMPORT ORDER IS CRITICAL - Variables must be first!
// 1. CSS Variables (must be imported first)
import './styles/variables.css';

// 2. Global/Base Styles
import './styles/globals.css';
import './styles/typography.css';

// 3. Shared Component Styles
import './styles/forms.css';
import './styles/utilities.css';
import './styles/animations.css';

// 4. React App
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

### Phase 2: Migrate Components to CSS Modules

#### Step 2.1: Create Header CSS Module

**File:** `src/components/common/Header/Header.module.css`

```css
/* Header Component Styles - Extract from html-app/assets/css/style.css */

.header {
  position: relative;
  z-index: 999;
  background-color: var(--white-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: var(--main-container);
  margin: 0 auto;
  padding: 0 var(--container-gutters);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 50px;
  width: auto;
}

.navMenu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
  align-items: center;
}

.navMenu li {
  position: relative;
}

.navMenu a {
  color: var(--body-color);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
  font-family: var(--title-font);
}

.navMenu a:hover {
  color: var(--theme-color);
}

.headerActions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cartIcon {
  position: relative;
  color: var(--body-color);
  font-size: 20px;
  transition: color 0.3s ease;
}

.cartIcon:hover {
  color: var(--theme-color);
}

.userMenu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.userMenu span {
  color: var(--body-color);
  font-weight: 500;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--white-color);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 0.5rem 0;
  min-width: 150px;
  display: none;
}

.userMenu:hover .dropdown {
  display: block;
}

.dropdown a,
.dropdown button {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  color: var(--body-color);
  text-decoration: none;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown a:hover,
.dropdown button:hover {
  background-color: var(--smoke-color);
  color: var(--theme-color);
}

.btnLogin {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px 20px;
  background-color: var(--theme-color);
  color: var(--white-color);
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btnLogin:hover {
  background-color: var(--title-color);
  color: var(--white-color);
}

/* Responsive Styles */
@media (max-width: 991px) {
  .navMenu {
    position: fixed;
    top: 0;
    left: -100%;
    width: 80%;
    height: 100vh;
    background-color: var(--white-color);
    flex-direction: column;
    padding: 2rem;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    transition: left 0.3s ease;
    z-index: 1000;
  }

  .navMenu.active {
    left: 0;
  }

  .headerActions {
    gap: 0.5rem;
  }
}

@media (max-width: 767px) {
  .navbar {
    padding: 0.5rem 0;
  }

  .logo img {
    height: 40px;
  }

  .btnLogin {
    padding: 8px 15px;
    font-size: 14px;
  }
}
```

#### Step 2.2: Update Header Component

**File:** `src/components/common/Header/Header.jsx`

```javascript
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import styles from './Header.module.css'; // ✅ Changed to CSS Module

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <Link to="/">
              <img src="/assets/img/logo.svg" alt="Edura" />
            </Link>
          </div>
          
          <ul className={styles.navMenu}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/instructors">Instructors</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

          <div className={styles.headerActions}>
            {isAuthenticated ? (
              <>
                <Link to="/cart" className={styles.cartIcon}>
                  <i className="fas fa-shopping-cart"></i>
                </Link>
                <div className={styles.userMenu}>
                  <span>{user?.firstName || user?.email}</span>
                  <div className={styles.dropdown}>
                    <Link to="/profile">Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className={styles.btnLogin}>
                <i className="far fa-user"></i> Login / Register
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

---

## Component CSS Migration Examples

### Example 1: CourseCard Component

**Original CSS** (from `style.css` lines ~15000-16000):
```css
.course-card {
  background-color: var(--white-color);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.4s;
}
.course-img {
  position: relative;
  overflow: hidden;
}
.course-content {
  padding: 30px;
}
```

**CSS Module** (`CourseCard.module.css`):
```css
.card {
  background-color: var(--white-color);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.4s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.image {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 250px;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.card:hover .image img {
  transform: scale(1.1);
}

.content {
  padding: 30px;
}

.title {
  font-size: 22px;
  margin-bottom: 15px;
  color: var(--title-color);
  font-family: var(--title-font);
}

.meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.price {
  font-size: 24px;
  color: var(--theme-color);
  font-weight: 700;
  margin-top: 15px;
}

@media (max-width: 767px) {
  .content {
    padding: 20px;
  }
  
  .title {
    font-size: 18px;
  }
}
```

**Component Usage**:
```javascript
import styles from './CourseCard.module.css';

const CourseCard = ({ course }) => {
  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <img src={course.image} alt={course.title} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{course.title}</h3>
        <div className={styles.meta}>...</div>
        <div className={styles.price}>${course.price}</div>
      </div>
    </div>
  );
};
```

### Example 2: Button Component

**CSS Module** (`Button.module.css`):
```css
.button {
  display: inline-block;
  padding: 18px 35px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all ease 0.4s;
  font-family: var(--title-font);
}

.primary {
  background-color: var(--theme-color);
  color: var(--white-color);
}

.primary:hover {
  background-color: var(--title-color);
}

.secondary {
  background-color: transparent;
  color: var(--theme-color);
  border: 2px solid var(--theme-color);
}

.secondary:hover {
  background-color: var(--theme-color);
  color: var(--white-color);
}

.dark {
  background-color: var(--title-color);
  color: var(--white-color);
}

.dark:hover {
  background-color: var(--theme-color);
}

.small {
  padding: 12px 25px;
  font-size: 14px;
}

.large {
  padding: 22px 45px;
  font-size: 18px;
}
```

**Component Usage**:
```javascript
import styles from './Button.module.css';
import classNames from 'classnames'; // npm install classnames

const Button = ({ children, variant = 'primary', size, className, ...props }) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        size && styles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Wrong Import Order
```javascript
// ❌ WRONG - Variables imported after other styles
import './styles/globals.css';
import './styles/variables.css'; // Variables won't be available!
```

```javascript
// ✅ CORRECT - Variables first
import './styles/variables.css';
import './styles/globals.css';
```

### ❌ Mistake 2: Using Regular CSS Instead of CSS Modules
```javascript
// ❌ WRONG
import './Header.css';
<div className="header">...</div>
```

```javascript
// ✅ CORRECT
import styles from './Header.module.css';
<div className={styles.header}>...</div>
```

### ❌ Mistake 3: Hardcoding Colors Instead of CSS Variables
```css
/* ❌ WRONG */
.header {
  background-color: #ffffff;
  color: #0f2239;
}

/* ✅ CORRECT */
.header {
  background-color: var(--white-color);
  color: var(--title-color);
}
```

### ❌ Mistake 4: Not Using Scoped Class Names
```css
/* ❌ WRONG - Too generic, might conflict */
.title {
  font-size: 24px;
}

/* ✅ CORRECT - More specific */
.courseTitle {
  font-size: 24px;
}
```

### ❌ Mistake 5: Forgetting Media Queries
```css
/* ❌ WRONG - No responsive styles */
.card {
  padding: 30px;
}

/* ✅ CORRECT - Includes responsive styles */
.card {
  padding: 30px;
}

@media (max-width: 767px) {
  .card {
    padding: 20px;
  }
}
```

### ❌ Mistake 6: Not Removing Old CSS Files
After migrating to CSS Modules, make sure to:
- Delete old `.css` files that aren't modules
- Remove imports of old CSS files
- Update all component references

---

## Best Practices

### 1. Naming Conventions

**CSS Module Class Names:**
- Use camelCase: `.navMenu`, `.headerActions`
- Or kebab-case: `.nav-menu`, `.header-actions` (but access as `styles['nav-menu']`)
- Be descriptive: `.courseCard` not `.card` (unless it's truly generic)

**File Names:**
- Component CSS: `[ComponentName].module.css`
- Global CSS: `[purpose].css` (e.g., `variables.css`, `globals.css`)

### 2. CSS Variable Usage

**Always use CSS variables for:**
- Colors
- Fonts
- Spacing (when defined as variables)
- Breakpoints (if using CSS variables)

**Example:**
```css
.card {
  background-color: var(--white-color);
  color: var(--title-color);
  padding: var(--section-space);
  font-family: var(--title-font);
}
```

### 3. Component Organization

**Keep related styles together:**
```css
/* ✅ GOOD - Logical grouping */
.card {
  /* Base styles */
}

.card:hover {
  /* Hover state */
}

.cardImage {
  /* Image styles */
}

.cardContent {
  /* Content styles */
}

@media (max-width: 767px) {
  /* Responsive styles */
}
```

### 4. Media Query Strategy

**Co-locate media queries** within the component CSS Module:
```css
.header {
  padding: 1rem;
}

@media (max-width: 991px) {
  .header {
    padding: 0.5rem;
  }
}
```

### 5. Composition

**Use CSS Module composition** for shared styles:
```css
/* Button.module.css */
.base {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.primary {
  composes: base;
  background-color: var(--theme-color);
  color: var(--white-color);
}
```

### 6. Global Styles vs Module Styles

**Use global styles for:**
- CSS variables
- Base HTML element resets
- Typography base styles
- Shared utility classes

**Use CSS Modules for:**
- Component-specific styles
- Scoped component layouts
- Component-specific animations

---

## Troubleshooting

### Issue 1: CSS Variables Not Working

**Symptoms:** Colors/styles not applying, variables showing as literal strings

**Solutions:**
1. Check import order in `main.jsx` - variables must be imported first
2. Verify variables are defined in `:root` selector
3. Check for typos in variable names
4. Ensure variables.css is not empty

### Issue 2: CSS Module Classes Not Applying

**Symptoms:** Styles not showing, console errors about undefined styles

**Solutions:**
1. Verify file is named `[Component].module.css` (not `.css`)
2. Check import statement: `import styles from './Component.module.css'`
3. Verify class names match: `className={styles.className}`
4. Check for typos in class names

### Issue 3: Styles Conflicting Between Components

**Symptoms:** Styles from one component affecting another

**Solutions:**
1. Ensure you're using CSS Modules (`.module.css`)
2. Check that you're not using `:global()` unnecessarily
3. Verify class names are scoped correctly
4. Make sure global styles are truly global (not in modules)

### Issue 4: Media Queries Not Working

**Symptoms:** Responsive styles not applying

**Solutions:**
1. Verify media query syntax is correct
2. Check viewport meta tag in `index.html`
3. Ensure media queries are inside the CSS Module file
4. Test with browser dev tools

### Issue 5: Build Errors

**Symptoms:** Vite/Webpack errors about CSS imports

**Solutions:**
1. Check file paths are correct
2. Verify CSS files exist
3. Check for syntax errors in CSS files
4. Ensure CSS Modules are supported (Vite supports them by default)

---

## Migration Checklist

### Phase 1: Setup ✅
- [ ] Extract CSS variables to `variables.css`
- [ ] Create `globals.css` with base styles
- [ ] Create `typography.css` with typography styles
- [ ] Create `forms.css` with form styles
- [ ] Create `utilities.css` with utility classes
- [ ] Create `animations.css` with animations
- [ ] Update `main.jsx` with correct import order

### Phase 2: Component Migration ✅
- [ ] Migrate Header component to CSS Module
- [ ] Migrate Footer component to CSS Module
- [ ] Migrate Layout component to CSS Module
- [ ] Migrate CourseCard component to CSS Module
- [ ] Migrate CourseList component to CSS Module
- [ ] Migrate all other components to CSS Modules

### Phase 3: Testing ✅
- [ ] Test all components render correctly
- [ ] Verify CSS variables are working
- [ ] Test responsive styles
- [ ] Check for style conflicts
- [ ] Verify build process works

### Phase 4: Cleanup ✅
- [ ] Remove old CSS files
- [ ] Remove unused CSS imports
- [ ] Update documentation
- [ ] Code review

---

## Quick Reference

### CSS Module Import Pattern
```javascript
import styles from './Component.module.css';
<div className={styles.className}>...</div>
```

### Multiple Classes Pattern
```javascript
import styles from './Component.module.css';
import classNames from 'classnames';

<div className={classNames(
  styles.base,
  styles[variant],
  isActive && styles.active,
  className
)}>
```

### CSS Variable Usage
```css
.component {
  color: var(--theme-color);
  background: var(--white-color);
  font-family: var(--title-font);
}
```

### Media Query Pattern
```css
.component {
  padding: 30px;
}

@media (max-width: 991px) {
  .component {
    padding: 20px;
  }
}
```

---

## Additional Resources

- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [Vite CSS Modules Guide](https://vitejs.dev/guide/features.html#css-modules)
- [CSS Custom Properties (Variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**Last Updated:** 2026-02-05
**Version:** 1.0.0
