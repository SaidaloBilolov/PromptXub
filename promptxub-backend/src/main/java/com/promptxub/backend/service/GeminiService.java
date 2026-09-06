package com.promptxub.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.promptxub.backend.dto.EnhancePromptRequest;
import com.promptxub.backend.dto.EnhancePromptResponse;
import com.promptxub.backend.dto.SmartSearchRequest;
import com.promptxub.backend.dto.SmartSearchResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    @Value("${gemini.api.key:${GEMINI_API_KEY:}}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Converts natural language query into optimized search terms and metadata intent.
     */
    public SmartSearchResponse smartSearch(SmartSearchRequest request) {
        String originalQuery = request.getQuery();
        if (originalQuery == null || originalQuery.trim().isEmpty()) {
            return new SmartSearchResponse("", "", "All", "All", List.of());
        }

        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.warn("GEMINI_API_KEY is not set. Returning fallback smart search response.");
            return fallbackSmartSearch(originalQuery);
        }

        try {
            String promptText = String.format(
                    "You are an AI search optimizer for an AI prompt showcase platform. Analyze this query: '%s'. " +
                    "Extract: 1) optimizedQuery (cleaned search terms), 2) aiModel (e.g. Midjourney, Flux.1, Runway, Luma, DALL-E 3, or 'All'), " +
                    "3) category (e.g. Portraits, 3D Art, Architecture, Cyberpunk, Nature, Anime, or 'All'), " +
                    "4) suggestedKeywords (array of 3-5 keywords). " +
                    "Respond strictly with valid JSON with keys: optimizedQuery, aiModel, category, suggestedKeywords.",
                    originalQuery
            );

            String geminiResponseText = callGeminiApi(promptText);
            return parseSmartSearchResponse(originalQuery, geminiResponseText);

        } catch (Exception e) {
            logger.error("Error calling Gemini API for smartSearch: {}", e.getMessage(), e);
            return fallbackSmartSearch(originalQuery);
        }
    }

    /**
     * Expands a raw prompt into a rich, detailed AI prompt with parameters.
     */
    public EnhancePromptResponse enhancePrompt(EnhancePromptRequest request) {
        String rawPrompt = request.getPrompt();
        String aiModel = (request.getAiModel() != null && !request.getAiModel().trim().isEmpty())
                ? request.getAiModel()
                : "Midjourney v6";

        if (rawPrompt == null || rawPrompt.trim().isEmpty()) {
            return new EnhancePromptResponse("", "", aiModel, "--ar 16:9 --v 6.0");
        }

        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.warn("GEMINI_API_KEY is not set. Returning fallback enhanced prompt response.");
            return fallbackEnhancePrompt(rawPrompt, aiModel);
        }

        try {
            String systemInstruction = String.format(
                    "You are a master AI Prompt Engineer specializing in %s. " +
                    "Expand the following user idea into a vivid, highly detailed, production-quality AI generation prompt: '%s'. " +
                    "Include lighting details, camera angle, artistic style, high resolution modifiers, and appropriate parameters (e.g. --ar 16:9 --v 6.0 --stylize 250). " +
                    "Respond strictly with valid JSON containing keys: enhancedPrompt, originalPrompt, aiModel, suggestedParameters.",
                    aiModel, rawPrompt
            );

            String geminiResponseText = callGeminiApi(systemInstruction);
            return parseEnhancePromptResponse(rawPrompt, aiModel, geminiResponseText);

        } catch (Exception e) {
            logger.error("Error calling Gemini API for enhancePrompt: {}", e.getMessage(), e);
            return fallbackEnhancePrompt(rawPrompt, aiModel);
        }
    }

    /**
     * Executes REST call to Gemini API.
     */
    private String callGeminiApi(String userPrompt) throws Exception {
        String url = GEMINI_API_URL + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build payload
        Map<String, Object> textPart = Map.of("text", userPrompt);
        Map<String, Object> contentObj = Map.of("parts", List.of(textPart));
        Map<String, Object> payload = Map.of("contents", List.of(contentObj));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    return parts.get(0).path("text").asText();
                }
            }
        }
        throw new RuntimeException("Empty or invalid response from Gemini API");
    }

    private SmartSearchResponse parseSmartSearchResponse(String originalQuery, String rawResponse) {
        try {
            // Clean markdown backticks if returned ```json ... ```
            String cleanJson = rawResponse.replaceAll("```json", "").replaceAll("```", "").trim();
            JsonNode node = objectMapper.readTree(cleanJson);

            String optimizedQuery = node.path("optimizedQuery").asText(originalQuery);
            String aiModel = node.path("aiModel").asText("All");
            String category = node.path("category").asText("All");
            List<String> keywords = new ArrayList<>();
            JsonNode kwArray = node.path("suggestedKeywords");
            if (kwArray.isArray()) {
                kwArray.forEach(k -> keywords.add(k.asText()));
            }

            return new SmartSearchResponse(originalQuery, optimizedQuery, aiModel, category, keywords);
        } catch (Exception e) {
            logger.warn("Could not parse JSON from Gemini response, using fallback parser: {}", rawResponse);
            return fallbackSmartSearch(originalQuery);
        }
    }

    private EnhancePromptResponse parseEnhancePromptResponse(String originalPrompt, String aiModel, String rawResponse) {
        try {
            String cleanJson = rawResponse.replaceAll("```json", "").replaceAll("```", "").trim();
            JsonNode node = objectMapper.readTree(cleanJson);

            String enhancedPrompt = node.path("enhancedPrompt").asText(originalPrompt);
            String model = node.path("aiModel").asText(aiModel);
            String params = node.path("suggestedParameters").asText("--ar 16:9 --v 6.0");

            return new EnhancePromptResponse(originalPrompt, enhancedPrompt, model, params);
        } catch (Exception e) {
            logger.warn("Could not parse JSON from Gemini enhance prompt response, using fallback: {}", rawResponse);
            return fallbackEnhancePrompt(originalPrompt, aiModel);
        }
    }

    private SmartSearchResponse fallbackSmartSearch(String query) {
        String cleaned = query.replaceAll("(?i)(midjourney|flux|runway|luma|dall-e|sora)", "").trim();
        if (cleaned.isEmpty()) cleaned = query;

        String detectedModel = "All";
        String lower = query.toLowerCase();
        if (lower.contains("midjourney")) detectedModel = "Midjourney v6";
        else if (lower.contains("flux")) detectedModel = "Flux.1";
        else if (lower.contains("runway")) detectedModel = "Runway Gen-3";

        return new SmartSearchResponse(query, cleaned, detectedModel, "All", List.of("AI Art", "Hyperrealistic", "4K"));
    }

    private EnhancePromptResponse fallbackEnhancePrompt(String rawPrompt, String aiModel) {
        String enhanced = String.format(
                "%s, cinematic lighting, hyper-detailed, octane render, 8k resolution, masterpiece, trending on ArtStation --ar 16:9 --v 6.0",
                rawPrompt
        );
        return new EnhancePromptResponse(rawPrompt, enhanced, aiModel, "--ar 16:9 --v 6.0");
    }
}
