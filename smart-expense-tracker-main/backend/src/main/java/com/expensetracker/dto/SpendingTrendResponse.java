package com.expensetracker.dto;

import java.math.BigDecimal;

public class SpendingTrendResponse {

    private String label; // e.g. "2026-09" or "Sep 2026"
    private Integer month;
    private Integer year;
    private BigDecimal totalSpent;

    public SpendingTrendResponse() {
    }

    public SpendingTrendResponse(String label, Integer month, Integer year, BigDecimal totalSpent) {
        this.label = label;
        this.month = month;
        this.year = year;
        this.totalSpent = totalSpent;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
    }
}
