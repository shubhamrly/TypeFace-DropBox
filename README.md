## TypeFace-DropBox
A full-stack Dropbox clone using ReactJS for the frontend, Node.js for the backend, and MongoDB for meta-data and local FMS for storage.

## Base Functionilty: CRUD operation:
1. Upload a file resource.
2. Get list of all file.
3. Get a single file preview.
4. Rename a file by name.
5. Delete a file. 

## Backend includes controller and service to: 
1. Upload a file resource.
2. Get list of all file.
3. Get a single file preview.
4. Rename a file by name.
5. Delete a file. 

## Frontend includes:
1. Mocked Welcome Page, for user Sign-in (supports single user).
2. Home Page with following components:
   a. Drag & Drop functionlity, with file Selection upto 15 files.
   b. Searching, sorting, filtering, view-modes.
   c. Uploaded files with CardContent View, with following buttons:
     i.  View file in the new tab.
     ii. Download file with name.
     iii.Rename the file by uploaded name.
     iv. Delete the file by name. 
     v.  information of the file. 
3. Profile menu section with following: 
    a. user email.
    b. Sign-out button.
4. A footer component that shows placeholder text.
5. A logout page which shows a good-bye message.

## Application Setup: 
Requirements: Node.js, Docker, VsCode. 
1. Run local mongodb setup: 
   a. cd TypeFace-DropBox
   b. chmod +x mongoSetup.sh 
   c. ./mongoSetup.sh

2. Setup Frontend,
   a. cd frontend
   b. npm install
   c. npm start 
      i.  npm test 

   server will start at port 3000.

3. Setup backend,
   a. cd backend
   b. npm install
   c. node server.js
      i.  npm test
      ii. npx jest --coverage

   server will start at port 5000.

## Project Structure
```
/frontend   # ReactJS frontend
/backend    # NodeJS backend (Express)
/mongoSetup.sh # MongoDB setup script
```
### Notes on Storage

- **MongoDB** is used to store file metadata (such as original name, upload date, size, and file reference).
- **UUIDs** are generated for each file to prevent filename collisions and ensure unique file storage on the server.
- **Uploaded files** are physically stored in the `/backend/uploads` directory.

## API Endpoints
Please refer to request.http for comprehensive HTTP request method.

- `POST /api/files/upload` - Upload files
- `GET /api/files` - List all files
- `GET /api/files/:id` - Get file preview and download.
- `PUT /api/files/:id/rename` - Rename file
- `DELETE /api/files/:id` - Delete file


## Screenshots
Please refer to the Demo.pdf file in root directory
sample file contains the sample images for upload.

## Resources Used
1. My Design:
    https://www.canva.com/design/DAGtFAIvdoU/PuQ79IzXcomVspbVJl0z4A/edit?utm_content=DAGtFAIvdoU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
2. Google images.
3. https://daily.dev/blog/test-cases-for-react-js-a-starter-guide