package com.expensetracker.dto;

import java.math.BigDecimal;
import java.util.List;

public class MonthlyReportResponse {

    private Integer month;
    private Integer year;
    private BigDecimal totalExpenses;
    private BigDecimal monthlyBudget;
    private BigDecimal remainingBudget;
    private Double budgetUtilizationPercentage;
    private String highestSpendingCategory;
    private String lowestSpendingCategory;
    private BigDecimal averageDailySpending;
    private Long totalTransactions;
    private List<CategorySummaryResponse> categorySummaries;

    public MonthlyReportResponse() {
    }

    public MonthlyReportResponse(Integer month, Integer year, BigDecimal totalExpenses, BigDecimal monthlyBudget, BigDecimal remainingBudget, Double budgetUtilizationPercentage, String highestSpendingCategory, String lowestSpendingCategory, BigDecimal averageDailySpending, Long totalTransactions, List<CategorySummaryResponse> categorySummaries) {
        this.month = month;
        this.year = year;
        this.totalExpenses = totalExpenses;
        this.monthlyBudget = monthlyBudget;
        this.remainingBudget = remainingBudget;
        this.budgetUtilizationPercentage = budgetUtilizationPercentage;
        this.highestSpendingCategory = highestSpendingCategory;
        this.lowestSpendingCategory = lowestSpendingCategory;
        this.averageDailySpending = averageDailySpending;
        this.totalTransactions = totalTransactions;
        this.categorySummaries = categorySummaries;
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

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(BigDecimal monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }

    public BigDecimal getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(BigDecimal remainingBudget) {
        this.remainingBudget = remainingBudget;
    }

    public Double getBudgetUtilizationPercentage() {
        return budgetUtilizationPercentage;
    }

    public void setBudgetUtilizationPercentage(Double budgetUtilizationPercentage) {
        this.budgetUtilizationPercentage = budgetUtilizationPercentage;
    }

    public String getHighestSpendingCategory() {
        return highestSpendingCategory;
    }

    public void setHighestSpendingCategory(String highestSpendingCategory) {
        this.highestSpendingCategory = highestSpendingCategory;
    }

    public String getLowestSpendingCategory() {
        return lowestSpendingCategory;
    }

    public void setLowestSpendingCategory(String lowestSpendingCategory) {
        this.lowestSpendingCategory = lowestSpendingCategory;
    }

    public BigDecimal getAverageDailySpending() {
        return averageDailySpending;
    }

    public void setAverageDailySpending(BigDecimal averageDailySpending) {
        this.averageDailySpending = averageDailySpending;
    }

    public Long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public List<CategorySummaryResponse> getCategorySummaries() {
        return categorySummaries;
    }

    public void setCategorySummaries(List<CategorySummaryResponse> categorySummaries) {
        this.categorySummaries = categorySummaries;
    }
}
