const fileService = require("../service/fileServices");
const File = require("../models/File");
const path = require("path");
const fs = require("fs");
jest.mock("../models/File");
jest.mock("fs");
describe("fileService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const createQueryMock = (returnData) => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(returnData),
      };
      return mockQuery;
    };
    File.find = jest.fn().mockImplementation(() => {
      return createQueryMock([]);
    });
  });
  describe("saveFiles", () => {
    it("should save files and return saved files", async () => {
      const mockFiles = [
        {
          originalname: "file1.txt",
          filename: "uuid1.txt",
          mimetype: "text/plain",
          size: 1024,
        },
        {
          originalname: "file2.jpg",
          filename: "uuid2.jpg",
          mimetype: "image/jpeg",
          size: 2048,
        },
      ];
      const mockFileObjects = mockFiles.map((file) => ({
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        uploadedDate: expect.any(Date),
        fileType: file.mimetype.split("/")[0],
        save: jest.fn().mockResolvedValue(true),
      }));
      File.mockImplementation((data) => {
        if (data.filename === "uuid1.txt") return mockFileObjects[0];
        if (data.filename === "uuid2.jpg") return mockFileObjects[1];
        return {};
      });
      const result = await fileService.saveFiles(mockFiles);
      expect(result).toEqual(mockFileObjects);
      expect(mockFileObjects[0].save).toHaveBeenCalled();
      expect(mockFileObjects[1].save).toHaveBeenCalled();
    });
  });
  describe("getAllFiles", () => {
    it("should return all files sorted by uploadedDate", async () => {
      const mockFiles = [
        { uploadedDate: new Date() },
        { uploadedDate: new Date() },
      ];
      const queryMock = {
        sort: jest.fn().mockResolvedValue(mockFiles),
      };
      File.find.mockReturnValue(queryMock);
      const result = await fileService.getAllFiles();
      expect(result).toEqual(mockFiles);
      expect(File.find).toHaveBeenCalled();
      expect(queryMock.sort).toHaveBeenCalledWith({ uploadedDate: -1 });
    });
  });
  describe("getFilePath", () => {
    it("should return file path if file exists", async () => {
      const mockFile = { filename: "uuid1.txt" };
      File.findOne.mockResolvedValue(mockFile);
      fs.existsSync.mockReturnValue(true);
      const result = await fileService.getFilePath("uuid1.txt");
      expect(result).toEqual(path.join(__dirname, "../uploads", "uuid1.txt"));
      expect(File.findOne).toHaveBeenCalledWith({ filename: "uuid1.txt" });
    });
    it("should return null if file does not exist", async () => {
      File.findOne.mockResolvedValue(null);
      const result = await fileService.getFilePath("uuid1.txt");
      expect(result).toBeNull();
    });
  });
  describe("getFilePathAndMeta", () => {
    it("should return file path and metadata if file exists", async () => {
      const mockFile = { filename: "uuid1.txt" };
      File.findOne.mockResolvedValue(mockFile);
      fs.existsSync.mockReturnValue(true);
      const result = await fileService.getFilePathAndMeta("uuid1.txt");
      expect(result).toEqual({
        filePath: path.join(__dirname, "../uploads", "uuid1.txt"),
        file: mockFile,
      });
    });
    it("should return null filePath and metadata if file does not exist", async () => {
      File.findOne.mockResolvedValue(null);
      const result = await fileService.getFilePathAndMeta("uuid1.txt");
      expect(result).toEqual({ filePath: null, file: null });
    });
  });
  describe("getFilesPaginated", () => {
    it("should return paginated files and total count", async () => {
      const mockFiles = [
        { uploadedDate: new Date() },
        { uploadedDate: new Date() },
      ];
      const mockTotal = 2;
      const queryMock = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockFiles),
      };
      File.find.mockReturnValue(queryMock);
      File.countDocuments.mockResolvedValue(mockTotal);
      const result = await fileService.getFilesPaginated(1, 2);
      expect(result).toEqual({ files: mockFiles, total: mockTotal });
      expect(queryMock.sort).toHaveBeenCalledWith({ uploadedDate: -1 });
      expect(queryMock.skip).toHaveBeenCalledWith(0);
      expect(queryMock.limit).toHaveBeenCalledWith(2);
    });
  });

  describe("renameFile", () => {
    it("should rename a file and return the updated file", async () => {
      const mockFile = { 
        filename: "uuid1.txt", 
        originalName: "oldname.txt",
        save: jest.fn().mockResolvedValue(true)
      };
      File.findOne.mockResolvedValue(mockFile);
      
      const result = await fileService.renameFile("uuid1.txt", "newname.txt");
      
      expect(mockFile.originalName).toBe("newname.txt");
      expect(mockFile.save).toHaveBeenCalled();
      expect(result).toEqual(mockFile);
      expect(File.findOne).toHaveBeenCalledWith({ filename: "uuid1.txt" });
    });

    it("should return null if file does not exist", async () => {
      File.findOne.mockResolvedValue(null);
      
      const result = await fileService.renameFile("nonexistent.txt", "newname.txt");
      
      expect(result).toBeNull();
      expect(File.findOne).toHaveBeenCalledWith({ filename: "nonexistent.txt" });
    });
  });

  describe("deleteFile", () => {
    it("should delete a file and return true", async () => {
      const mockFile = { filename: "uuid1.txt" };
      File.findOne.mockResolvedValue(mockFile);
      File.deleteOne.mockResolvedValue({ deletedCount: 1 });
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockReturnValue(undefined);
      
      const result = await fileService.deleteFile("uuid1.txt");
      
      expect(result).toBe(true);
      expect(File.findOne).toHaveBeenCalledWith({ filename: "uuid1.txt" });
      expect(File.deleteOne).toHaveBeenCalledWith({ filename: "uuid1.txt" });
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it("should return false if file does not exist", async () => {
      File.findOne.mockResolvedValue(null);
      
      const result = await fileService.deleteFile("nonexistent.txt");
      
      expect(result).toBe(false);
      expect(File.findOne).toHaveBeenCalledWith({ filename: "nonexistent.txt" });
      expect(File.deleteOne).not.toHaveBeenCalled();
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });
  });
});
