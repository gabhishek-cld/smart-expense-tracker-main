package com.expensetracker.dto;

import java.math.BigDecimal;

public class CategorySummaryResponse {

    private String category;
    private BigDecimal totalAmount;
    private Double percentage;

    public CategorySummaryResponse() {
    }

    public CategorySummaryResponse(String category, BigDecimal totalAmount, Double percentage) {
        this.category = category;
        this.totalAmount = totalAmount;
        this.percentage = percentage;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
}
