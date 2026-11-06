package com.expensetracker.dto;

import java.math.BigDecimal;

public class BudgetStatusResponse {

    private Integer month;
    private Integer year;
    private BigDecimal budgetAmount;
    private BigDecimal totalSpent;
    private BigDecimal remainingBudget;
    private Double utilizationPercentage;
    private String status; // NORMAL, WARNING (>= 80%), EXCEEDED (> 100%)
    private String message;

    public BudgetStatusResponse() {
    }

    public BudgetStatusResponse(Integer month, Integer year, BigDecimal budgetAmount, BigDecimal totalSpent, BigDecimal remainingBudget, Double utilizationPercentage, String status, String message) {
        this.month = month;
        this.year = year;
        this.budgetAmount = budgetAmount;
        this.totalSpent = totalSpent;
        this.remainingBudget = remainingBudget;
        this.utilizationPercentage = utilizationPercentage;
        this.status = status;
        this.message = message;
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

    public BigDecimal getBudgetAmount() {
        return budgetAmount;
    }

    public void setBudgetAmount(BigDecimal budgetAmount) {
        this.budgetAmount = budgetAmount;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
    }

    public BigDecimal getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(BigDecimal remainingBudget) {
        this.remainingBudget = remainingBudget;
    }

    public Double getUtilizationPercentage() {
        return utilizationPercentage;
    }

    public void setUtilizationPercentage(Double utilizationPercentage) {
        this.utilizationPercentage = utilizationPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
