# Document Management Dashboard

A full-stack document management dashboard featuring drag-and-drop file uploading, progress tracking, and notifications.

## Current Features
- **Drag-and-Drop Uploads**: Easily upload PDFs via drag-and-drop or file selection.
- **Progress Tracking**: Real-time progress bars for individual file uploads.
- **Bulk Upload Notifications**: Backend polling for bulk upload notifications.
- **Notification Center**: Persistent notifications for completed uploads and errors.
- **Database Integration**: SQLite backend for tracking document data.
- **Modern UI**: Clean, responsive white-and-blue interface using the Livvic font.

## Planned / Possible Features

### 1. Document Management
- **File Preview:** Allow users to preview PDFs directly in the browser without downloading.
- **Download, Rename, and Delete:** Add actions to the document table to manage uploaded files.
- **Search & Filtering:** Add a search bar and filters (by date, size, or status) to easily find specific documents.
- **Categories/Folders:** Allow users to organize their documents into custom folders.

### 2. User Experience
- **Dark Mode:** Implement a dark mode toggle to complement the current white-and-blue UI.
- **Sorting:** Allow clicking on table headers (Name, Size, Date) to sort the documents.
- **Pagination:** Add pagination or infinite scrolling for the document list to handle large amounts of files.

### 3. Backend & Security
- **User Authentication:** Add login/registration so different users can have their own private dashboards.
- **File Validation & Antivirus:** Enhance backend validation to scan uploaded files and ensure they aren't corrupted or malicious.
- **Document Versioning:** Implement semantic versioning for documents, allowing users to upload a "new version" of an existing document and keep track of changes over time.
