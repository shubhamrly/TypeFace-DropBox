

const getAllFiles = async () => {
    return await File.find().sort({ uploadedDate: -1 });
};

module.exports = {   getAllFiles,
};