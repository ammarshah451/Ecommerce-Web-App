import multer from "multer";

const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

const uploadSingleAvatar = upload.single("image");
const attachmentsMulter = upload.array("images", 5);

export { uploadSingleAvatar, attachmentsMulter };
