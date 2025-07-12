const express = require('express');
const router = express.Router();

const fileController = require('../controllers/fileController');
const multer = require('../services/multerService');

//uploading  endpoint for single as well as up 20 files at once
router.post('/upload', multer.array('files', 20), fileController.uploadFiles);

// Retursn all file list by first checking with mongo stage 1.
// filters will be in ui, pagination will added for page like structure in ui. 
router.get('/', fileController.getFiles);

// Preview a single file by its stored filename
// Not the safest — maybe switch to ID lookup later?
router.get('/preview/:filename', fileController.previewFile);

module.exports = router;
