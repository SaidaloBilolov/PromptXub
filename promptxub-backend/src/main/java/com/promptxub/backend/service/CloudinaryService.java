package com.promptxub.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.promptxub.backend.dto.CloudinaryUploadResponse;
import com.promptxub.backend.entity.ContentType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Streams media file directly to Cloudinary without saving to the local filesystem.
     * Ideal for ephemeral containers such as Render.com.
     */
    public CloudinaryUploadResponse uploadMedia(MultipartFile file, ContentType contentType) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty media file");
        }

        String resourceType = (contentType == ContentType.VIDEO) ? "video" : "image";
        String folder = (contentType == ContentType.VIDEO) ? "promptxub/videos" : "promptxub/photos";

        Map<String, Object> uploadParams = new HashMap<>();
        uploadParams.put("resource_type", resourceType);
        uploadParams.put("folder", folder);
        uploadParams.put("overwrite", true);
        uploadParams.put("unique_filename", true);

        // Apply auto quality and auto format transformations for high performance CDN delivery
        if (contentType == ContentType.PHOTO) {
            uploadParams.put("quality", "auto:good");
            uploadParams.put("fetch_format", "auto");
        } else {
            uploadParams.put("quality", "auto");
        }

        log.info("Streaming upload to Cloudinary for file: {}, resourceType: {}", file.getOriginalFilename(), resourceType);

        try (InputStream inputStream = file.getInputStream()) {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(inputStream, uploadParams);

            log.info("Cloudinary upload successful. PublicId: {}, SecureUrl: {}", result.get("public_id"), result.get("secure_url"));

            return CloudinaryUploadResponse.builder()
                    .publicId((String) result.get("public_id"))
                    .secureUrl((String) result.get("secure_url"))
                    .format((String) result.get("format"))
                    .resourceType((String) result.get("resource_type"))
                    .width(result.get("width") != null ? ((Number) result.get("width")).intValue() : null)
                    .height(result.get("height") != null ? ((Number) result.get("height")).intValue() : null)
                    .duration(result.get("duration") != null ? ((Number) result.get("duration")).doubleValue() : null)
                    .bytes(result.get("bytes") != null ? ((Number) result.get("bytes")).longValue() : null)
                    .build();
        }
    }

    /**
     * Deletes asset from Cloudinary by public ID.
     */
    public boolean deleteMedia(String publicId, ContentType contentType) {
        if (publicId == null || publicId.isBlank()) {
            return false;
        }
        try {
            String resourceType = (contentType == ContentType.VIDEO) ? "video" : "image";
            Map<String, Object> options = ObjectUtils.asMap("resource_type", resourceType);
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().destroy(publicId, options);
            String resultStatus = (String) result.get("result");
            log.info("Cloudinary deletion for publicId: {} returned status: {}", publicId, resultStatus);
            return "ok".equalsIgnoreCase(resultStatus);
        } catch (Exception ex) {
            log.error("Failed to delete Cloudinary media with publicId: {}", publicId, ex);
            return false;
        }
    }
}
