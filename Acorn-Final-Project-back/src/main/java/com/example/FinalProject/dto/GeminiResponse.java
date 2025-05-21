package com.example.FinalProject.dto;

import java.util.List;

import com.google.gson.annotations.SerializedName;

public class GeminiResponse {
    @SerializedName("candidates")
    private List<Candidate> candidates;

    public List<Candidate> getCandidates() {
        return candidates;
    }

    public static class Candidate {
        @SerializedName("content")
        private Content content;

        public Content getContent() {
            return content;
        }
    }

    public static class Content {
        @SerializedName("parts")
        private List<Part> parts;

        public List<Part> getParts() {
            return parts;
        }
    }

    public static class Part {
        @SerializedName("text")
        private String text;

        public String getText() {
            return text;
        }
    }
}