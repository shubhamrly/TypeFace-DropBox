const File = require('../models/File');
const path = require('path');
const fs = require('fs');
//get files from the db, most recent first
const getAllFiles = async () => {
    return await File.find().sort({ uploadedDate: -1 });
};
//crud operation to Save in db first then move the local file storage
const saveFiles = async (files) => {
    const savedFiles = [];
    for (const file of files) {
        const newFile = new File({
            originalName: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            uploadedDate: new Date(),
            fileType: file.mimetype.split('/')[0],
        });//console.log('File data: ', newFile);

        //db save 
        await newFile.save();
                   // save to upload folder
                    savedFiles.push(newFile);
    }
    return savedFiles;
};

//page in ui
const getFilesPaginated = async (page, limit) => {
           const skip = (page - 1) * limit; //console.log(`Fetching files for page ${page}:: ${limit}  ::  ${skip}`);
    const [files, total] = await Promise.all([
        File.find().sort({ uploadedDate: -1 }).skip(skip).limit(limit),
        File.countDocuments()
    ]);
return { files, total };
};

//for prevew and downloads
const getFilePath = async (filename) => {
    const file = await File.findOne({ filename });
    if (!file) return null;
    const filePath = path.join(__dirname, '../uploads', file.filename);
    //console.log(`File path for ${filename}: ${filePath}`);
    return fs.existsSync(filePath) ? filePath : null;
};



//for preview info icon, must have in thumbail but not in list view
const getFilePathAndMeta = async (filename) => {
    const file = await File.findOne({ filename });
    if (!file) return { filePath: null, file: null };
    const filePath = path.join(__dirname, '../uploads', file.filename);
    return fs.existsSync(filePath) ? { filePath, file } : { filePath: null, file: null };
};
//for renaiming a file in the mingodb
const renameFile = async (filename, newName) => {
    const file = await File.findOne({ filename });
    if (!file) return null;
    
    file.originalName = newName;
    await file.save();
    return file;
};// removing entry in the fb and then local storage
            const deleteFile = async (filename) => {
    const file = await File.findOne({ filename });
    if (!file) return false;
    
    const filePath = path.join(__dirname, '../uploads', file.filename);
    
    // Delete from mongodb
    await File.deleteOne({ filename });
    
    // remove from uploads
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    
    return true;
};


module.exports = {
    saveFiles,
    getAllFiles,
    getFilePath,
    getFilePathAndMeta,
    getFilesPaginated,
    renameFile,      // <-- add this
    deleteFile       // <-- and this
};