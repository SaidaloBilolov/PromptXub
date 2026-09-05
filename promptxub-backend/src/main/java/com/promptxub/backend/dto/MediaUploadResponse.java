package com.promptxub.backend.dto;

public class MediaUploadResponse {
    private String fileId;
    private String url;
    private String thumbnailUrl;
    private String name;
    private String filePath;
    private String fileType;
    private Integer width;
    private Integer height;
    private Long size;

    public MediaUploadResponse() {
    }

    public MediaUploadResponse(String fileId, String url, String thumbnailUrl, String name,
                               String filePath, String fileType, Integer width, Integer height, Long size) {
        this.fileId = fileId;
        this.url = url;
        this.thumbnailUrl = thumbnailUrl;
        this.name = name;
        this.filePath = filePath;
        this.fileType = fileType;
        this.width = width;
        this.height = height;
        this.size = size;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public static class Builder {
        private String fileId;
        private String url;
        private String thumbnailUrl;
        private String name;
        private String filePath;
        private String fileType;
        private Integer width;
        private Integer height;
        private Long size;

        public Builder fileId(String fileId) {
            this.fileId = fileId;
            return this;
        }

        public Builder url(String url) {
            this.url = url;
            return this;
        }

        public Builder thumbnailUrl(String thumbnailUrl) {
            this.thumbnailUrl = thumbnailUrl;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder filePath(String filePath) {
            this.filePath = filePath;
            return this;
        }

        public Builder fileType(String fileType) {
            this.fileType = fileType;
            return this;
        }

        public Builder width(Integer width) {
            this.width = width;
            return this;
        }

        public Builder height(Integer height) {
            this.height = height;
            return this;
        }

        public Builder size(Long size) {
            this.size = size;
            return this;
        }

        public MediaUploadResponse build() {
            return new MediaUploadResponse(fileId, url, thumbnailUrl, name, filePath, fileType, width, height, size);
        }
    }
}
