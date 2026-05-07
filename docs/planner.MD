# DocIntel Frontend Architecture & Implementation Planner

This document summarizes the major architectural implementations and structural decisions made across the DocIntel frontend, along with a comprehensive User and Data flow diagram.

## Accumulated Implementation Plans

### 1. Vectorless RAG Tree Visualization

**Objective:** Modernize the document tree visualization for director-level presentations.

- **Implementation:** Replaced heavy, card-based layouts with a Notion-inspired, clean row-based design.
- **Features:** Depth-aware color coding, subtle connector lines for hierarchical clarity, and a minimalist aesthetic that emphasizes the "Vectorless RAG" structure without overwhelming the user.

### 2. Premium API Key Authentication Overlay

**Objective:** Create a visually stunning, secure onboarding experience for first-time users.

- **Implementation:** Integrated `@magicui/particles` for dynamic, theme-responsive backgrounds and `@magicui/blur-fade` for staggered entrance animations.
- **Refinement:** Standardized the Call-to-Action (CTA) using standard `shadcn` Buttons to ensure strict adherence to accessibility and design-system aesthetics, fully replacing earlier custom Shimmer buttons.

### 3. Axios Networking & Error Handling Architecture

**Objective:** Replace native `fetch` with a scalable, robust networking layer.

- **Implementation:** Created a centralized `apiClient` using `axios`.
- **Features:**
  - Global Request Interceptor automatically injects the `Authorization: Bearer <key>` header from `localStorage`.
  - Global Response Interceptor normalizes backend errors into standard `ApiError` instances.
  - Custom `streamClient` utilizing Axios' `fetch` adapter to seamlessly handle LLM text streaming (Server-Sent Events) without buffering.

### 4. React Rendering & Performance Optimizations

**Objective:** Ensure production-readiness by resolving React 19 performance warnings.

- **Implementation:** Eliminated "cascading render" warnings (e.g., `setState` calls during render phases in `useEffect` hooks) across `use-documents.ts`, `use-tree.ts`, and `theme-provider.tsx`.
- **Solution:** Strategically deferred state updates using `requestAnimationFrame`, strictly adhering to Vercel and Next.js React best practices.

### 5. Markdown Streaming & Chat Interface

**Objective:** Provide a rich, real-time chat experience for document queries.

- **Implementation:** Rendered the AI's response dynamically as Markdown. Added intelligent tree-navigation loading states and logging. The chat UI visually represents the internal "Tree Search" tool execution as well as the final response.

---

## Application Flow Diagram

The following Mermaid diagram illustrates how users and data flow through the DocIntel application, from authentication to querying a document.

[![](https://mermaid.ink/img/pako:eNqVV1tv3EQU_isjoyCQnHZ92d3sForS3UZEJG3oJpFok4fJ-Hh3tF6PNbZzaRIJIXhBRVBa8VAVRZWQEIgXxAtP_Jj-AfoTODO-7HjTktZP9pzvfOfMuc341GIiAKtvLS2d8phnfXK6FxOyZ2UTmMGe1cfXAEKaR9meZRuiXSo5PYggVRito0SJ5DMqTwYiErJQfs9tdzw4KJUNzDYcZyYu1M9l3C0hA5Am0gl8CFY0ssKmwEQcLFhuhU7XpQZjjbrSdo28bN3zfKfdbljPQGZ8wXi4EtKQGZQVaNH2JS8r4GXT7CBog9MwHfEYTEjH7_orZrRDEWdrdMajkwKxHiO_TUYwFkB21m2S0jhdTkHycEFrxB-WBeC0k-OGVRblKdLcmo5LsxCGnUYAK4TeQwnqeawdBg2iGIuvgXHA7Xmm_xCMYYMeQHSLsulYijwOFpKmkOd78fn50pIiDiNxxCZUZmR7WBlaWiIfv-mpEas5FnaccUYzLmKyhjxvo11gRhla_ODBq4tnX5IdjCa5m0CcktUk2f-QLC_fJIMJsKkycfrq4uljsrq1Tj6DE8Ljjw7k9ZuRYDQaZULSMXxyXpHWOshA7gjNoz7vHoKM6Ala-_2iZioXNd1qjK2TQYAJ3i-oDDVNs0sjHiAENR-8fP4NWY-TPNM879ey_coPA6yUz0Y5Y5CmZ2REDzXDq4sf_9EfJBPE3EtpvcQVG0iSIU0nB4LK4E0G1iiPcglnptuvDcoXkF4iRW-efEuGgqlSj0i9vv9O1bBJeaxo37EOTEe0Z-jHJo0xFDOsLcz9k6_UUq6-yCpTlXZu-LWTRIIGhs2GutpxiVDUxet9EYPa8i-VaGu4potghjObJ1iW10MhZ8sYX1qHYK5aho8PIo4WinWke_QDWT3mIiVbd0fb5Hqu1_fnu2zgNceWiHAYjVH36dckT6HaZaolqXZpSwpVOAhTDZPlac1YahflpUV9wsQsiQDL-EyFYYOnmdrnY3Q-0MVdx1GJzOyOIAK20MSXAlmAtOvFKyKQ_6c___37-6KFi-W0tlObqPFaew0yNtmWoLLw6C-1dfVBPhViSkIlwxpVK0MzAbWSplAvt48xlhIksvz6G3a78n85zU4i0GKyy9Mc2-Shnk7mbgcTmhkbbTqnhDvrqkH_KIC7HI72572kpGUM4uDzHKQaB98ZIYgDTKDETJjbL6GFYiaBzopyUPl5URZOsU4KQZF9XUo4mw0qQ7moIipTKFZPXz57UXyjRYlDYHlUMd0-1IU1mOTxtG4fQ1Xld1uIiNw-BpbrSlDkG2KsY_HkeVlD5B5kksMhjZRMU-tYj4BKNtH9eTgfgwsGNqmcBuIoJgM8LCv_72FsQFYiZevnKhI1HmfkwAxCU8dI2zsNrBGWiuqgQUTTFK9lbz2ymFIYQkioGqohj6L-e8EB0BDsNJNiCv3yDmczddHo4xnt0RVaCpePeJBN-m5yfGOBLqjnYMEJAfQMzi7zKAQVp8-coNe-krOYQ5WTLGTQrQmdDvV8Wjvptz03uJIwrUdFwRlC6LE5Z9DrdludirO74rVb4ZWcqsJrOnDBndMxt-PO6UIncK52MQDG07mH0ApdI4wtd8VHh0vKFvNpB15HOb_mJEl00igUw15xj7HrM9Y2DmDbOKXt6kRXNXOjSWEegXZz7NYlsaAyP47shaPFLg8GuzwBygpY0K9nnl3PVducqfM0LygWfWbXE802B5JtNLytZ4e90Koq02Zsh1Wq7uC9Nm0aqiLaiIhpok60ybjB42nV2sUivk1H-lgo_8tIVQrF3f9y8i3bGkseWP2QRinY1gzkjKpv63_-9fBCjXoJje8LMbP6mcxRE6_f40nNk-sZOuR0LOkcoiM0wHt6ZvV9x9UcVv_UOrb6Xrd3rdvznFbPabm9tovCE6vvtK91vK7f8d2W57s91z-3rYfaaOtar-O2W62W73ZQzVnp2vg_wPFquVn8tOp_1_P_AGaA6Zs?type=png)](https://mermaid.live/edit#pako:eNqVV1tv3EQU_isjoyCQnHZ92d3sForS3UZEJG3oJpFok4fJ-Hh3tF6PNbZzaRIJIXhBRVBa8VAVRZWQEIgXxAtP_Jj-AfoTODO-7HjTktZP9pzvfOfMuc341GIiAKtvLS2d8phnfXK6FxOyZ2UTmMGe1cfXAEKaR9meZRuiXSo5PYggVRito0SJ5DMqTwYiErJQfs9tdzw4KJUNzDYcZyYu1M9l3C0hA5Am0gl8CFY0ssKmwEQcLFhuhU7XpQZjjbrSdo28bN3zfKfdbljPQGZ8wXi4EtKQGZQVaNH2JS8r4GXT7CBog9MwHfEYTEjH7_orZrRDEWdrdMajkwKxHiO_TUYwFkB21m2S0jhdTkHycEFrxB-WBeC0k-OGVRblKdLcmo5LsxCGnUYAK4TeQwnqeawdBg2iGIuvgXHA7Xmm_xCMYYMeQHSLsulYijwOFpKmkOd78fn50pIiDiNxxCZUZmR7WBlaWiIfv-mpEas5FnaccUYzLmKyhjxvo11gRhla_ODBq4tnX5IdjCa5m0CcktUk2f-QLC_fJIMJsKkycfrq4uljsrq1Tj6DE8Ljjw7k9ZuRYDQaZULSMXxyXpHWOshA7gjNoz7vHoKM6Ala-_2iZioXNd1qjK2TQYAJ3i-oDDVNs0sjHiAENR-8fP4NWY-TPNM879ey_coPA6yUz0Y5Y5CmZ2REDzXDq4sf_9EfJBPE3EtpvcQVG0iSIU0nB4LK4E0G1iiPcglnptuvDcoXkF4iRW-efEuGgqlSj0i9vv9O1bBJeaxo37EOTEe0Z-jHJo0xFDOsLcz9k6_UUq6-yCpTlXZu-LWTRIIGhs2GutpxiVDUxet9EYPa8i-VaGu4potghjObJ1iW10MhZ8sYX1qHYK5aho8PIo4WinWke_QDWT3mIiVbd0fb5Hqu1_fnu2zgNceWiHAYjVH36dckT6HaZaolqXZpSwpVOAhTDZPlac1YahflpUV9wsQsiQDL-EyFYYOnmdrnY3Q-0MVdx1GJzOyOIAK20MSXAlmAtOvFKyKQ_6c___37-6KFi-W0tlObqPFaew0yNtmWoLLw6C-1dfVBPhViSkIlwxpVK0MzAbWSplAvt48xlhIksvz6G3a78n85zU4i0GKyy9Mc2-Shnk7mbgcTmhkbbTqnhDvrqkH_KIC7HI72572kpGUM4uDzHKQaB98ZIYgDTKDETJjbL6GFYiaBzopyUPl5URZOsU4KQZF9XUo4mw0qQ7moIipTKFZPXz57UXyjRYlDYHlUMd0-1IU1mOTxtG4fQ1Xld1uIiNw-BpbrSlDkG2KsY_HkeVlD5B5kksMhjZRMU-tYj4BKNtH9eTgfgwsGNqmcBuIoJgM8LCv_72FsQFYiZevnKhI1HmfkwAxCU8dI2zsNrBGWiuqgQUTTFK9lbz2ymFIYQkioGqohj6L-e8EB0BDsNJNiCv3yDmczddHo4xnt0RVaCpePeJBN-m5yfGOBLqjnYMEJAfQMzi7zKAQVp8-coNe-krOYQ5WTLGTQrQmdDvV8Wjvptz03uJIwrUdFwRlC6LE5Z9DrdludirO74rVb4ZWcqsJrOnDBndMxt-PO6UIncK52MQDG07mH0ApdI4wtd8VHh0vKFvNpB15HOb_mJEl00igUw15xj7HrM9Y2DmDbOKXt6kRXNXOjSWEegXZz7NYlsaAyP47shaPFLg8GuzwBygpY0K9nnl3PVducqfM0LygWfWbXE802B5JtNLytZ4e90Koq02Zsh1Wq7uC9Nm0aqiLaiIhpok60ybjB42nV2sUivk1H-lgo_8tIVQrF3f9y8i3bGkseWP2QRinY1gzkjKpv63_-9fBCjXoJje8LMbP6mcxRE6_f40nNk-sZOuR0LOkcoiM0wHt6ZvV9x9UcVv_UOrb6Xrd3rdvznFbPabm9tovCE6vvtK91vK7f8d2W57s91z-3rYfaaOtar-O2W62W73ZQzVnp2vg_wPFquVn8tOp_1_P_AGaA6Zs)

## Data Lifecycle & API Interactions

1. **Authentication:** Managed by the `useApiKey` hook. The API key is stored locally and intercepted by Axios to authorize all subsequent requests.
2. **Document State:** `useDocuments` maintains the source of truth for the available documents. It implements smart polling to check the backend processing queue.
3. **Tree State:** Upon selecting a document, `useTree` hydrates the visual document hierarchy.
4. **Conversational State:** `useChat` maintains the message history and parses raw `[DONE]`, `content`, and `metadata` events from the Axios stream reader to render the Markdown output and the "Retrieval Log".
