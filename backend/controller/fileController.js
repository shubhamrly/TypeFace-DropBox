const fileService = require('../services/fileService');

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

module.exports = {
    getFiles
}