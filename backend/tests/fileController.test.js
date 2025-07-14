const request = require("supertest");
const express = require("express");
const fileController = require("../controller/fileController");
const fileService = require("../service/fileServices");
jest.mock("../service/fileServices");
const app = express();
app.use(express.json());
app.post("/upload", fileController.uploadFiles);
app.get("/files", fileController.getFiles);
app.get("/preview/:filename", fileController.previewFile);
app.put("/rename/:filename", fileController.renameFile);
app.delete("/delete/:filename", fileController.deleteFile);

describe("fileController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("uploadFiles", () => {
    it("should upload files and return saved files", async () => {
      const mockFiles = [{ originalname: "file1.txt", filename: "uuid1.txt" }];
      const mockSavedFiles = [
        { originalname: "file1.txt", filename: "uuid1.txt" },
      ];
      fileService.saveFiles.mockResolvedValue(mockSavedFiles);
      const testApp = express();
      testApp.use(express.json());
      testApp.use((req, res, next) => {
        if (req.path === "/upload" && req.method === "POST") {
          req.files = mockFiles;
        }
        next();
      });
      testApp.post("/upload", fileController.uploadFiles);
      const response = await request(testApp).post("/upload");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSavedFiles);
      expect(fileService.saveFiles).toHaveBeenCalledWith(mockFiles);
    });
    it("should return 400 if no files are provided", async () => {
      // This test matches the actual controller behavior which returns 400
      // when no files are provided
      const response = await request(app).post("/upload").send({ files: [] });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Please provide atleat 1 file" });
    });
    it("should return 500 if an error occurs during upload", async () => {
      // Create a custom test app that provides req.files to simulate multer
      const testApp = express();
      testApp.use(express.json());
      testApp.use((req, res, next) => {
        if (req.path === "/upload" && req.method === "POST") {
          req.files = [{ originalname: "file1.txt", filename: "uuid1.txt" }];
        }
        next();
      });
      testApp.post("/upload", fileController.uploadFiles);

      fileService.saveFiles.mockRejectedValue(new Error("Error saving files"));
      const response = await request(testApp).post("/upload");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: "internal server error during the upload",
      });
    });
  });
  describe("getFiles", () => {
    it("should return all files if query all=true", async () => {
      const mockFiles = [{ originalName: "file1.txt" }];
      fileService.getAllFiles.mockResolvedValue(mockFiles);
      const response = await request(app).get("/files?all=true");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        files: mockFiles,
        total: mockFiles.length,
      });
      expect(fileService.getAllFiles).toHaveBeenCalled();
    });
    it("should return paginated files if query all is not true", async () => {
      const mockFiles = [{ originalName: "file1.txt" }];
      const mockTotal = 1;
      fileService.getFilesPaginated.mockResolvedValue({
        files: mockFiles,
        total: mockTotal,
      });
      const response = await request(app).get("/files?page=1&limit=1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ files: mockFiles, total: mockTotal });
      expect(fileService.getFilesPaginated).toHaveBeenCalledWith(1, 1);
    });
    it("should return 500 if an error occurs", async () => {
      fileService.getAllFiles.mockRejectedValue(
        new Error("Error fetching files")
      );
      const response = await request(app).get("/files?all=true");
      expect(response.status).toBe(500);
      // Update to match the actual error message in the controller
      expect(response.body).toEqual({
        error: "Internal server error,files not found",
      });
    });
  });
  describe("previewFile", () => {
    it("should return file preview if file exists", async () => {
      const mockFilePath = "/path/to/file.txt";
      const mockFile = {
        originalName: "file.txt",
        mimetype: "text/plain",
        filename: "abc123.txt",
      };
      fileService.getFilePathAndMeta.mockResolvedValue({
        filePath: mockFilePath,
        file: mockFile,
      });
      const testApp = express();
      testApp.use(express.json());
      testApp.get("/preview/:filename", (req, res, next) => {
        res.sendFile = jest.fn((path, callback) => {
          if (callback) callback(null);
          res.status(200).end();
          return res;
        });
        fileController.previewFile(req, res, next);
      });
      const response = await request(testApp).get("/preview/abc123.txt");
      expect(response.status).toBe(200);
      expect(fileService.getFilePathAndMeta).toHaveBeenCalledWith("abc123.txt");
    });
    it("should return 404 if file does not exist", async () => {
      fileService.getFilePathAndMeta.mockResolvedValue({
        filePath: null,
        file: null,
      });
      const response = await request(app).get("/preview/file.txt");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "File not found" });
    });
    it("should return 500 if an error occurs", async () => {
      fileService.getFilePathAndMeta.mockRejectedValue(
        new Error("Error fetching file")
      );
      const response = await request(app).get("/preview/file.txt");
      expect(response.status).toBe(500);
      // Update to match the actual error message in the controller
      expect(response.body).toEqual({
        error: "Something went wrong while loading the file preview",
      });
    });
  });
  describe("renameFile", () => {
    it("should rename a file and return the updated file", async () => {
      const mockUpdatedFile = {
        originalName: "newname.txt",
        filename: "uuid1.txt",
      };
      fileService.renameFile.mockResolvedValue(mockUpdatedFile);

      const response = await request(app)
        .put("/rename/uuid1.txt")
        .send({ newName: "newname.txt" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedFile);
      expect(fileService.renameFile).toHaveBeenCalledWith(
        "uuid1.txt",
        "newname.txt"
      );
    });

    it("should return 400 if new name is invalid", async () => {
      const response = await request(app)
        .put("/rename/uuid1.txt")
        .send({ newName: "" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "file name exists" });
      expect(fileService.renameFile).not.toHaveBeenCalled();
    });

    it("should return 404 if file does not exist", async () => {
      fileService.renameFile.mockResolvedValue(null);

      const response = await request(app)
        .put("/rename/nonexistent.txt")
        .send({ newName: "newname.txt" });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "File not found" });
      expect(fileService.renameFile).toHaveBeenCalledWith(
        "nonexistent.txt",
        "newname.txt"
      );
    });

    it("should return 500 if an error occurs during rename", async () => {
      const errorMessage = "Database connection error";
      fileService.renameFile.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .put("/rename/uuid1.txt")
        .send({ newName: "newname.txt" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });

  describe("deleteFile", () => {
    it("should delete a file and return success message", async () => {
      fileService.deleteFile.mockResolvedValue(true);

      const response = await request(app).delete("/delete/uuid1.txt");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, message: "file deleted" });
      expect(fileService.deleteFile).toHaveBeenCalledWith("uuid1.txt");
    });

    it("should return 404 if file does not exist", async () => {
      fileService.deleteFile.mockResolvedValue(false);

      const response = await request(app).delete("/delete/nonexistent.txt");

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("file not found");
      expect(fileService.deleteFile).toHaveBeenCalledWith("nonexistent.txt");
    });

    it("should return 500 if an error occurs during deletion", async () => {
      const errorMessage = "File system error";
      fileService.deleteFile.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).delete("/delete/uuid1.txt");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });
});
