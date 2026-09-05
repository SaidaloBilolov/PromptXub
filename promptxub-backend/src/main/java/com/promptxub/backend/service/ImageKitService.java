package com.promptxub.backend.service;

import com.promptxub.backend.config.ImageKitConfig;
import com.promptxub.backend.dto.MediaUploadResponse;
import com.promptxub.backend.entity.ContentType;
import io.imagekit.client.ImageKitClient;
import io.imagekit.models.files.FileUploadParams;
import io.imagekit.models.files.FileUploadResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class ImageKitService {

    private static final Logger log = LoggerFactory.getLogger(ImageKitService.class);

    private final ImageKitClient imageKitClient;
    private final ImageKitConfig imageKitConfig;

    public ImageKitService(ImageKitClient imageKitClient, ImageKitConfig imageKitConfig) {
        this.imageKitClient = imageKitClient;
        this.imageKitConfig = imageKitConfig;
    }

    /**
     * Uploads media file (photo or video) directly to ImageKit.io CDN.
     */
    public MediaUploadResponse uploadMedia(MultipartFile file, ContentType contentType) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty media file");
        }

        String folder = (contentType == ContentType.VIDEO) ? "/promptxub/videos" : "/promptxub/photos";
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            extension = (contentType == ContentType.VIDEO) ? ".mp4" : ".jpg";
        }

        String uniqueFileName = UUID.randomUUID().toString() + extension;
        byte[] fileBytes = file.getBytes();

        FileUploadParams params = FileUploadParams.builder()
                .file(fileBytes)
                .fileName(uniqueFileName)
                .folder(folder)
                .useUniqueFileName(true)
                .publicKey(imageKitConfig.getPublicKey())
                .build();

        log.info("Uploading file to ImageKit.io: original={}, uniqueName={}, folder={}", originalFilename, uniqueFileName, folder);

        try {
            FileUploadResponse response = imageKitClient.files().upload(params);

            if (response == null) {
                throw new IOException("ImageKit upload returned null response");
            }

            String fileId = response.fileId().orElse("");
            String url = response.url().orElse("");
            String thumbUrl = response.thumbnailUrl().orElse(url);
            String name = response.name().orElse(uniqueFileName);
            String filePath = response.filePath().orElse(null);
            String fileType = response.fileType().orElse(contentType == ContentType.VIDEO ? "video" : "image");
            Integer width = response.width().map(Double::intValue).orElse(null);
            Integer height = response.height().map(Double::intValue).orElse(null);
            Long size = response.size().map(Double::longValue).orElse((long) fileBytes.length);

            log.info("ImageKit upload successful. FileId: {}, URL: {}", fileId, url);

            return MediaUploadResponse.builder()
                    .fileId(fileId)
                    .url(url)
                    .thumbnailUrl(thumbUrl)
                    .name(name)
                    .filePath(filePath)
                    .fileType(fileType)
                    .width(width)
                    .height(height)
                    .size(size)
                    .build();
        } catch (Exception ex) {
            log.error("ImageKit upload error: {}", ex.getMessage(), ex);
            throw new IOException("Failed to upload media to ImageKit: " + ex.getMessage(), ex);
        }
    }

    /**
     * Deletes media file from ImageKit by file ID.
     */
    public boolean deleteMedia(String fileId) {
        if (fileId == null || fileId.isBlank()) {
            return false;
        }
        try {
            imageKitClient.files().delete(fileId);
            log.info("ImageKit file deleted successfully with fileId: {}", fileId);
            return true;
        } catch (Exception ex) {
            log.error("Failed to delete media from ImageKit with fileId: {}", fileId, ex);
            return false;
        }
    }
}
