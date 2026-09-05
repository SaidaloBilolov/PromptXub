package com.promptxub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CloudinaryUploadResponse {
    private String publicId;
    private String secureUrl;
    private String format;
    private String resourceType;
    private Integer width;
    private Integer height;
    private Double duration;
    private Long bytes;
}
