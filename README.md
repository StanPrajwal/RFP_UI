Below is a **complete, production-ready README.md** for your **Vite + React + TypeScript UI**, fully aligned with the API specification you provided.
It includes:

✔ Setup
✔ Folder structure
✔ API integration flow
✔ User guide
✔ Sequence diagrams
✔ Screenshots placeholders
✔ Developer notes

You can **copy–paste this as README.md** into your repo.

---

# 📡 **AI-Powered RFP Management System – Frontend (Vite + React + TypeScript)**

This is the **frontend UI** for the AI-powered RFP Management System.
It allows users to **create RFPs from natural language**, **manage vendors**, **send RFPs**, and **view proposals**, interacting with the backend through REST APIs.

Backend reference used for UI integration:


---

# 🚀 **1. Project Overview**

This frontend provides:

### ✅ Chat-driven RFP creation

User types natural language → UI calls `/rfp/generate-rfp` → AI converts to structured RFP.

### ✅ RFP management dashboard

List all RFPs, view details, save new RFPs.

### ✅ Vendor assignment

Fetch vendors → assign to RFP → send to backend.

### ✅ Sending RFP to vendors

UI triggers email dispatch via backend `/rfp/:id/send`.

### ✅ Clean React + TypeScript architecture

Using hooks, services, reusable components, error handling.

---

# 🛠️ **2. Tech Stack**

| Layer            | Technology                       |
| ---------------- | -------------------------------- |
| Build Tool       | **Vite**                         |
| UI Library       | **React 18**                     |
| Language         | **TypeScript**                   |
| HTTP             | **Axios**                        |
| State & Querying | React Query / Zustand (if added) |
| Styling          | Tailwind / CSS Modules           |
| Routing          | React Router v6                  |

---

# 📦 **3. Folder Structure**

```
frontend/
│
├── src/
│   ├── components/
│   │   ├── ChatInput.tsx
│   │   ├── RfpCard.tsx
│   │   ├── VendorSelector.tsx
│   │   └── Loader.tsx
│   │
│   ├── pages/
│   │   ├── ChatPage.tsx
│   │   ├── RfpListPage.tsx
│   │   ├── RfpDetailPage.tsx
│   │   └── NotFound.tsx
│   │
│   ├── services/
│   │   ├── rfp.api.ts
│   │   └── vendor.api.ts
│   │
│   ├── hooks/
│   │   └── useRfp.ts
│   │
│   ├── types/
│   │   ├── Rfp.ts
│   │   └── Vendor.ts
│   │
│   ├── utils/
│   │   └── axios.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env
├── package.json
└── README.md
```

---

# ⚙️ **4. Setup Instructions**

## 4.1 Prerequisites

| Requirement    | Version                            |
| -------------- | ---------------------------------- |
| Node.js        | **18+**                            |
| npm / yarn     | Any                                |
| Backend        | Running on `http://localhost:8080` |
| API must match | The API spec above                 |

---

## 4.2 Installation

```sh
git clone <repo-url>
cd frontend
npm install
```

(or yarn/pnpm as preferred)

---

## 4.3 Configure Environment Variables

Create `.env` in root:

```
VITE_API_BASE_URL=http://localhost:8080
```

---

## 4.4 Start App

```sh
npm run dev
```

UI runs at:

👉 **[http://localhost:5173](http://localhost:5173)**

---

# 🔌 **5. API Integration Layer**

### Axios Base Config — `src/config/axios.ts`

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});
```

---

# 🧩 **6. API Service Files**

## 6.1 RFP API — `rfp.api.ts`

```ts
import { api } from "../utils/axios";

export const generateRfp = (payload: { description: string }) =>
  api.post("/rfp/generate-rfp", payload);

export const createRfp = (payload: any) =>
  api.post("/rfp/create", payload);

export const fetchAllRfp = () =>
  api.get("/rfp/fetch-all-rfp");

export const assignVendors = (rfpId: string, vendorIds: string[]) =>
  api.post(`/rfp/${rfpId}/vendors`, { vendorIds });

export const sendRfp = (rfpId: string, vendorIds: string[]) =>
  api.post(`/rfp/${rfpId}/send`, { vendorIds });
```

---

## 6.2 Vendor API — `vendor.api.ts`

```ts
import { api } from "../utils/axios";

export const fetchVendors = () =>
  api.get("/vendor/fetch-vendors");
```

---

# 🎨 **7. Pages & UI Behavior**

---

## 7.1 Chat Page (`/`)

### User Flow:

```
User types message → Click Send
 ↓
POST /rfp/generate-rfp
 ↓
Show structured RFP card on right side
 ↓
Enable “Save RFP” button
```

### UI Example:

```tsx
const handleSend = async () => {
  const res = await generateRfp({ description: input });
  setGeneratedRfp(res.data.structuredRfp);
};
```

---

## 7.2 RFP List Page (`/rfp`)

### Behavior:

* Fetch all RFPs on mount
* Display table/grid
* Each card links to `/rfp/:id`

```tsx
useEffect(() => {
  fetchAllRfp().then(res => setList(res.data.data));
}, []);
```

---

## 7.3 RFP Detail Page (`/rfp/:id`)

### Buttons:

| Button                  | Behaviour                                          |
| ----------------------- | -------------------------------------------------- |
| **Assign Vendors**      | GET vendors → open modal → POST `/rfp/:id/vendors` |
| **Send RFP**            | POST `/rfp/:id/send`                               |
| **View Structured RFP** | Display JSON block                                 |

---

# 📘 **8. Complete User Guide**

## **🔹 Step 1 — Create RFP via Chat**

1. Go to home page (`/`)
2. Type procurement details in chat
   Example:
   *“I need 25 desktops and 10 projectors...”*
3. System generates structured RFP
4. Click **Save RFP**

---

## **🔹 Step 2 — View All RFPs**

Navigate to `/rfp`
See all RFPs in table format.

---

## **🔹 Step 3 — Assign Vendors**

1. Open any RFP
2. Click **Assign Vendors**
3. Select vendors
4. Save → API `/rfp/:id/vendors`

---

## **🔹 Step 4 — Send RFP to Vendors**

Click **Send RFP** →
API `/rfp/:id/send` is triggered.

---

# 🔄 **9. API Call Sequence Diagram**

```
[USER] 
   ↓ types message
[UI] 
   POST /rfp/generate-rfp
   ↓ shows structured RFP
User clicks Save
   ↓
POST /rfp/create
   ↓
Navigate to /rfp/:id
User clicks Assign Vendors
   ↓
GET /vendor/fetch-vendors
   ↓
POST /rfp/:id/vendors
User clicks Send RFP
   ↓
POST /rfp/:id/send
```

---

# 🧪 **10. Test Scenarios**

### ✔ Chat → Generate RFP

### ✔ Save RFP

### ✔ Vendor fetch works

### ✔ Vendor assignment validated

### ✔ Successfully send RFP

### ✔ Error handling (400, missing fields)

---

# 🧱 **11. Known Limitations (UI)**

* No authentication (by assignment requirement)
* No real-time email status
* No pagination in vendor/RFP list yet

---

# 🧠 **12. Decisions & Assumptions**

* **React** chosen for component-driven architecture.
* **Vite** enables fast dev reloads.
* **TypeScript** ensures strict data model validation.
* **Axios** used for consistent API layer.
* **Backend must follow API contract** exactly as documented above.

---

# 🤖 **13. AI Tools Used**

| Tool    | Usage                                         |
| ------- | --------------------------------------------- |
| ChatGPT | API modeling, UI flow design, README creation |
| Copilot | Code scaffolding                              |
| Cursor  | Refactoring components                        |

---

# 🎥 **14. Demo Video (To Be Added)**

```
📌 Add your Loom / Drive demo link here.
```

---

# 📝 **15. How to Run Everything Together**

## Step 1: Start Backend

```bash
npm run start:dev
```

## Step 2: Start Frontend

```bash
npm install or npm install -f
npm run dev
```

## Step 3: Workflow

1. Open frontend → chat page
2. Enter procurement description
3. Save generated RFP
4. Assign vendors
5. Send RFP
6. View status in RFP list page

---


