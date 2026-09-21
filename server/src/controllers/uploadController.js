export const handleUpload = (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      if (req.file) {
        // Single file upload fallback
        return res.status(200).json({
          success: true,
          data: [{
            url: `/uploads/${req.file.filename}`,
            filename: req.file.filename,
            size: req.file.size,
          }],
          message: 'Image uploaded successfully.',
        });
      }

      return res.status(400).json({
        success: false,
        message: 'No files were uploaded. Please select at least one valid image.',
      });
    }

    const uploaded = req.files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
    }));

    return res.status(200).json({
      success: true,
      data: uploaded,
      message: `${uploaded.length} image(s) uploaded successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
