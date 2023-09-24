FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginImageResize,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageEdit
);
FilePond.setOptions({
  maxFileSize: 5000000,
  stylePanelAspectRatio: 4 / 3,
  imageResizeTargetWidth: 400,
  imageResizeTargetHeight: 300,
  acceptedFileTypes: ["image/jpeg", "image/png", "image/gif"],
});

FilePond.parse(document.body);
