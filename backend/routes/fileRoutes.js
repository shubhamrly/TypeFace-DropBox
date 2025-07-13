const express = require('express');
const router = express.Router();

const fileController = require('../controller/fileController');
const multer = require('../service/multerService');

//uploading  endpoint for single as well as up 20 files at once
router.post('/upload', multer.array('files', 20), fileController.uploadFiles);

// Retursn all file list by first checking with mongo stage 1.
// filters will be in ui, pagination will added for page like structure in ui. 
router.get('/', fileController.getFiles);

// Preview a single file by its stored filename, msne 
router.get('/preview/:filename', fileController.previewFile);
//renaming a file in the db, updating the record. 
router.put('/rename/:filename', fileController.renameFile);
// deleting a file from the db and local uploads folder
router.delete('/:filename', fileController.deleteFile);

module.exports = router;
