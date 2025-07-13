const fileService = require('../service/fileServices');

// user requested files list controller set ?all=true to get all, else it will in 15 per files/request
const getFiles = async (req, res) => {
    try {
        if (req.query.all === 'true') {
            const files = await fileService.getAllFiles();
            return res.send({ files, total: files.length });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const { files, total } = await fileService.getFilesPaginated(page, limit);
        res.send({ files, total });
    } catch (error) {
        console.error('Something went wrong, check backend service for getFileController', error);
        res.status(500).send({ error: 'Internal server error,files not found' });
    }
};
//uploading files vai curl or ui, same endpoint
   const uploadFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ error: 'Please provide atleat 1 file' });
        }
        const savedFiles = await fileService.saveFiles(req.files);
        res.send(savedFiles);
    } catch (error) {
        console.error('Upload has failed:', error);
        res.status(500).send({ error: 'internal server error during the upload' });
    }
};




//here we will using the card to show preview and same will be used to download the file
const previewFile = async (req, res) => {
    try {
        const { filePath, file } = await fileService.getFilePathAndMeta(req.params.filename);

        if (!filePath || !file) {
            return res.status(404).send({ error: 'File not found' });
        }
        const { mimetype, originalName } = file;
        if (
            mimetype.startsWith('image/') ||   mimetype.startsWith('text/') ||mimetype === 'application/pdf'
        ) { res.setHeader('Content-Disposition', `inline; filename="${originalName}"`);
        } else {res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
        }
        res.sendFile(filePath, (err) => {
            if (err && !res.headersSent) {
                console.error('Preview error on backend:', err);
                res.status(500).send({ error: 'preview failed for file' });
            }
        }); } catch (error) {if (!res.headersSent) { console.error('Preview failed:', error);
            res.status(500).send({ error: 'Something went wrong while loading the file preview' });
        }
    }
};
const renameFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const { newName } = req.body;
        
        if (!newName || typeof newName !== 'string' || newName.trim() === '') {
            return res.status(400).send({ error: 'New name is required' });
        }
        
        const updatedFile = await fileService.renameFile(filename, newName.trim());
        
        if (!updatedFile) {
            return res.status(404).send({ error: 'File not found' });
        }
        
        res.send(updatedFile);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
const deleteFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const deleted = await fileService.deleteFile(filename);
        
        if (!deleted) {
            return res.status(404).send({ error: 'File not found' });
        }
        
        res.send({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    getFiles,
    uploadFiles,
    previewFile,
    renameFile,
    deleteFile,
}