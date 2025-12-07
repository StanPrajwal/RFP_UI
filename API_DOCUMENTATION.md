# 📡 RFP Management System - API Documentation

## Total APIs: **6 Endpoints**

---

## 1. 🎯 **Generate RFP (AI Parsing)**

**Endpoint:** `POST /rfp/generate-rfp`

**When to Call:**
- ✅ When user types a message in the chat window describing their procurement needs
- ✅ After user sends natural language description (e.g., "I need 25 desktops and 10 projectors...")
- ✅ **Trigger:** User clicks "Send" button in chat with procurement description

**Request:**
```json
{
  "description": "User's natural language text about what they need to procure"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "RFP generated successfully",
  "structuredRfp": {
    "title": "Auto-generated title",
    "descriptionRaw": "Original user text",
    "descriptionStructured": {
      "budget": 40000,
      "currency": "USD",
      "currencySymbol": "$",
      "deliveryTimeline": "45 days",
      "paymentTerms": "Net 45",
      "warranty": "2 years",
      "items": [
        {
          "item": "Desktop computers",
          "quantity": 25,
          "specs": "Specifications..."
        }
      ]
    }
  }
}
```

**UI Flow:**
```
User types message → Click Send → Call API → Show structured RFP in right panel
```

---

## 2. 💾 **Create/Save RFP**

**Endpoint:** `POST /rfp/create`

**When to Call:**
- ✅ After RFP is generated and user wants to save it
- ✅ When user clicks "Save RFP" or "Create RFP" button
- ✅ **Trigger:** User confirms they want to save the generated RFP
- ✅ Before assigning vendors or sending RFP

**Request:**
```json
{
  "title": "RFP Title",
  "descriptionRaw": "Original user description",
  "descriptionStructured": {
    "budget": 40000,
    "currency": "USD",
    "currencySymbol": "$",
    "deliveryTimeline": "45 days",
    "paymentTerms": "Net 45",
    "warranty": "2 years",
    "items": [
      {
        "item": "Desktop computer",
        "quantity": 25,
        "specs": "Specifications..."
      }
    ]
  }
}
```

**Response:**
```json
{
  "code": 201,
  "success": true,
  "message": "RFP created successfully"
}
```

**UI Flow:**
```
Generated RFP displayed → User clicks "Save RFP" → Call API → Show success message → Navigate to RFP list or detail page
```

---

## 3. 👥 **Assign Vendors to RFP**

**Endpoint:** `POST /rfp/:id/vendors`

**When to Call:**
- ✅ After RFP is created (has an ID)
- ✅ When user selects vendors and clicks "Assign Vendors" button
- ✅ **Trigger:** User action on RFP detail page to add vendors
- ✅ Before sending RFP (vendors must be assigned first)

**Request:**
```json
{
  "vendorIds": [
    "6932e9c3048e0d4bf0bb1ae6",
    "6932e9c3048e0d4bf0bb1ae6"
  ]
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Vendors assigned to RFP successfully"
}
```

**UI Flow:**
```
RFP Detail Page → User selects vendors → Click "Assign Vendors" → Call API → Update UI to show assigned vendors
```

---

## 4. ✉️ **Send RFP to Vendors**

**Endpoint:** `POST /rfp/:id/send`

**When to Call:**
- ✅ After vendors are assigned to the RFP
- ✅ When user clicks "Send RFP" button
- ✅ **Trigger:** Final action to send RFP to selected vendors
- ✅ Changes RFP status from "draft" to "sent"

**Request:**
```json
{
  "vendorIds": [
    "6932e9c3048e0d4bf0bb1ae6",
    "6932e9c3048e0d4bf0bb1ae6"
  ]
}
```

**Response (Success):**
```json
{
  "code": 200,
  "message": "RFP sent successfully"
}
```

**Response (Error - if vendors not found):**
```json
{
  "message": "No vendors found for provided IDs",
  "error": "Bad Request",
  "statusCode": 400
}
```

**UI Flow:**
```
RFP Detail Page → Vendors assigned → Click "Send RFP" → Call API → Show success/error → Update status to "sent"
```

---

## 5. 👥 **Fetch All Vendors**

**Endpoint:** `GET /vendor/fetch-vendors`

**When to Call:**
- ✅ When user wants to assign vendors to an RFP
- ✅ On RFP detail page when showing vendor selection dropdown/checklist
- ✅ Before assigning vendors (to populate vendor list)
- ✅ **Trigger:** Component mount on vendor assignment interface
- ✅ No request body needed (GET request)

**Request:**
```
No body required (GET request)
```

**Response:**
```json
{
  "code": 200,
  "message": "Vendor list fetched successfully",
  "data": [
    {
      "_id": "693186f8f243511faab08876",
      "name": "BlueWave Electronics",
      "email": "info@bluewave.co",
      "phone": "+91-9090909090",
      "address": "12 Tech Park, Hyderabad, Telangana",
      "createdAt": "2025-12-04T13:04:56.433Z",
      "__v": 0
    },
    {
      "_id": "693186edf243511faab08874",
      "name": "GreenLine Office Supplies",
      "email": "support@greenline.com",
      "phone": "+91-9801234567",
      "address": "Shop No. 88, MG Road, Pune, Maharashtra",
      "createdAt": "2025-12-04T13:04:45.234Z",
      "__v": 0
    }
  ]
}
```

**UI Flow:**
```
RFP Detail Page → User clicks "Assign Vendors" → Call API → Display vendor list → User selects vendors → Assign
```

---

## 6. 📋 **Fetch All RFPs**

**Endpoint:** `GET /rfp/fetch-all-rfp`

**When to Call:**
- ✅ When user navigates to RFP list page (`/rfp`)
- ✅ On page load/initial render of RFP list
- ✅ After creating a new RFP (to refresh the list)
- ✅ **Trigger:** Component mount or manual refresh
- ✅ No request body needed (GET request)

**Request:**
```
No body required (GET request)
```

**Response:**
```json
{
  "code": 200,
  "message": "RFP list fetched successfully",
  "data": [
    {
      "_id": "6932e9c3048e0d4bf0bb1ae6",
      "title": "RFP Title",
      "status": "sent",
      "descriptionStructured": {
        "budget": 40000,
        "currency": "USD",
        "deliveryTimeline": "45 days",
        "paymentTerms": "Net 45",
        "warranty": "2 years",
        "items": [...]
      },
      "vendorsInvited": ["vendor-id-1", "vendor-id-2"],
      "createdAt": "2025-12-05T14:18:43.796Z"
    }
  ]
}
```

**UI Flow:**
```
User navigates to /rfp → Component mounts → Call API → Display RFP list in table
```

---

## 📊 **API Call Sequence Summary**

### **Complete RFP Creation Flow:**

```
1. User types description in chat
   ↓
2. POST /rfp/generate-rfp
   ↓ (Shows generated RFP)
3. User clicks "Save RFP"
   ↓
4. POST /rfp/create
   ↓ (RFP saved, get RFP ID)
5. User clicks "Assign Vendors"
   ↓
6. GET /vendor/fetch-vendors
   ↓ (Shows vendor list)
7. User selects vendors → POST /rfp/:id/vendors
   ↓ (Vendors assigned)
8. User clicks "Send RFP"
   ↓
9. POST /rfp/:id/send
   ↓ (RFP sent, status = "sent")
```

### **Viewing RFPs:**

```
User navigates to /rfp
   ↓
GET /rfp/fetch-all-rfp
   ↓
Display all RFPs in table
```

---

## 🎯 **API Usage by Page/Component**

| Page/Component | APIs Called | When |
|---------------|-------------|------|
| **Chat Page** (`/` or `/chat`) | `POST /rfp/generate-rfp` | User sends message |
| **RFP Display Component** | `POST /rfp/create` | User saves generated RFP |
| **RFP List Page** (`/rfp`) | `GET /rfp/fetch-all-rfp` | Page loads |
| **RFP Detail Page** (`/rfp/:id`) | `GET /vendor/fetch-vendors` | Load vendor list for selection |
| **RFP Detail Page** (`/rfp/:id`) | `POST /rfp/:id/vendors` | Assign vendors |
| **RFP Detail Page** (`/rfp/:id`) | `POST /rfp/:id/send` | Send RFP |

---

## 🔑 **Key Points**

1. **Base URL:** `http://localhost:8080`
2. **All POST requests** need `Content-Type: application/json` header
3. **RFP ID** is required for vendor assignment and sending (comes from create response or URL param)
4. **Status values:** `"draft"` or `"sent"`
5. **Error handling:** Check for `statusCode: 400` or error messages in response

---

## 📝 **Notes**

- The `/rfp/:id/send` endpoint requires valid vendor IDs (they must exist in the system)
- The `fetch-all-rfp` endpoint returns all RFPs regardless of status
- RFP creation returns success but doesn't return the created RFP object (you may need to fetch it separately or use the ID from URL)

