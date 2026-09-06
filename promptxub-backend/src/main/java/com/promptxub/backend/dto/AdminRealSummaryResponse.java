package com.promptxub.backend.dto;

import com.promptxub.backend.entity.Prompt;
import java.util.List;
import java.util.Map;

public class AdminRealSummaryResponse {
    private Long totalPrompts;
    private Long totalRealViews;
    private Long totalRealCopies;
    private Long totalDisplayViews;
    private Long totalDisplayCopies;
    private Double realConversionRatio;
    private Long totalPhotos;
    private Long totalVideos;
    private Long totalSearches;
    private Map<String, Long> userAuthBreakdown;
    private List<ModelConversionStat> topConvertingModels;
    private List<Map<String, Object>> topCopiedPrompts;
    private List<QueryHitStat> popularQueries;

    public AdminRealSummaryResponse() {
    }

    public AdminRealSummaryResponse(Long totalPrompts, Long totalRealViews, Long totalRealCopies,
                                    Long totalDisplayViews, Long totalDisplayCopies, Double realConversionRatio,
                                    Long totalPhotos, Long totalVideos, Long totalSearches,
                                    Map<String, Long> userAuthBreakdown, List<ModelConversionStat> topConvertingModels,
                                    List<Map<String, Object>> topCopiedPrompts, List<QueryHitStat> popularQueries) {
        this.totalPrompts = totalPrompts;
        this.totalRealViews = totalRealViews;
        this.totalRealCopies = totalRealCopies;
        this.totalDisplayViews = totalDisplayViews;
        this.totalDisplayCopies = totalDisplayCopies;
        this.realConversionRatio = realConversionRatio;
        this.totalPhotos = totalPhotos;
        this.totalVideos = totalVideos;
        this.totalSearches = totalSearches;
        this.userAuthBreakdown = userAuthBreakdown;
        this.topConvertingModels = topConvertingModels;
        this.topCopiedPrompts = topCopiedPrompts;
        this.popularQueries = popularQueries;
    }

    public Long getTotalPrompts() {
        return totalPrompts;
    }

    public void setTotalPrompts(Long totalPrompts) {
        this.totalPrompts = totalPrompts;
    }

    public Long getTotalRealViews() {
        return totalRealViews;
    }

    public void setTotalRealViews(Long totalRealViews) {
        this.totalRealViews = totalRealViews;
    }

    public Long getTotalRealCopies() {
        return totalRealCopies;
    }

    public void setTotalRealCopies(Long totalRealCopies) {
        this.totalRealCopies = totalRealCopies;
    }

    public Long getTotalDisplayViews() {
        return totalDisplayViews;
    }

    public void setTotalDisplayViews(Long totalDisplayViews) {
        this.totalDisplayViews = totalDisplayViews;
    }

    public Long getTotalDisplayCopies() {
        return totalDisplayCopies;
    }

    public void setTotalDisplayCopies(Long totalDisplayCopies) {
        this.totalDisplayCopies = totalDisplayCopies;
    }

    public Double getRealConversionRatio() {
        return realConversionRatio;
    }

    public void setRealConversionRatio(Double realConversionRatio) {
        this.realConversionRatio = realConversionRatio;
    }

    public Long getTotalPhotos() {
        return totalPhotos;
    }

    public void setTotalPhotos(Long totalPhotos) {
        this.totalPhotos = totalPhotos;
    }

    public Long getTotalVideos() {
        return totalVideos;
    }

    public void setTotalVideos(Long totalVideos) {
        this.totalVideos = totalVideos;
    }

    public Long getTotalSearches() {
        return totalSearches;
    }

    public void setTotalSearches(Long totalSearches) {
        this.totalSearches = totalSearches;
    }

    public Map<String, Long> getUserAuthBreakdown() {
        return userAuthBreakdown;
    }

    public void setUserAuthBreakdown(Map<String, Long> userAuthBreakdown) {
        this.userAuthBreakdown = userAuthBreakdown;
    }

    public List<ModelConversionStat> getTopConvertingModels() {
        return topConvertingModels;
    }

    public void setTopConvertingModels(List<ModelConversionStat> topConvertingModels) {
        this.topConvertingModels = topConvertingModels;
    }

    public List<Map<String, Object>> getTopCopiedPrompts() {
        return topCopiedPrompts;
    }

    public void setTopCopiedPrompts(List<Map<String, Object>> topCopiedPrompts) {
        this.topCopiedPrompts = topCopiedPrompts;
    }

    public List<QueryHitStat> getPopularQueries() {
        return popularQueries;
    }

    public void setPopularQueries(List<QueryHitStat> popularQueries) {
        this.popularQueries = popularQueries;
    }

    public static class ModelConversionStat {
        private String model;
        private Long realCopies;
        private Long realViews;
        private Double conversionRate;

        public ModelConversionStat() {
        }

        public ModelConversionStat(String model, Long realCopies, Long realViews, Double conversionRate) {
            this.model = model;
            this.realCopies = realCopies;
            this.realViews = realViews;
            this.conversionRate = conversionRate;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public Long getRealCopies() {
            return realCopies;
        }

        public void setRealCopies(Long realCopies) {
            this.realCopies = realCopies;
        }

        public Long getRealViews() {
            return realViews;
        }

        public void setRealViews(Long realViews) {
            this.realViews = realViews;
        }

        public Double getConversionRate() {
            return conversionRate;
        }

        public void setConversionRate(Double conversionRate) {
            this.conversionRate = conversionRate;
        }
    }

    public static class QueryHitStat {
        private String query;
        private Long count;

        public QueryHitStat() {
        }

        public QueryHitStat(String query, Long count) {
            this.query = query;
            this.count = count;
        }

        public String getQuery() {
            return query;
        }

        public void setQuery(String query) {
            this.query = query;
        }

        public Long getCount() {
            return count;
        }

        public void setCount(Long count) {
            this.count = count;
        }
    }
}
