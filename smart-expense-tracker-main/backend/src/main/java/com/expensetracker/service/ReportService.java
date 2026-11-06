package com.expensetracker.service;

import com.expensetracker.dto.CategorySummaryResponse;
import com.expensetracker.dto.MonthlyReportResponse;
import com.expensetracker.dto.SpendingTrendResponse;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.User;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private AuthService authService;

    public MonthlyReportResponse getMonthlyReport(Integer month, Integer year) {
        User currentUser = authService.getCurrentUser();

        if (month == null || year == null) {
            LocalDate now = LocalDate.now();
            month = now.getMonthValue();
            year = now.getYear();
        }

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        BigDecimal totalExpenses = expenseRepository.sumExpensesByUserAndDateRange(currentUser, startDate, endDate);
        if (totalExpenses == null) {
            totalExpenses = BigDecimal.ZERO;
        }

        BigDecimal monthlyBudget = budgetRepository.findByUserAndMonthAndYear(currentUser, month, year)
                .map(Budget::getAmount)
                .orElse(BigDecimal.ZERO);

        BigDecimal remainingBudget = monthlyBudget.subtract(totalExpenses);

        double utilizationPercentage = 0.0;
        if (monthlyBudget.compareTo(BigDecimal.ZERO) > 0) {
            utilizationPercentage = totalExpenses.divide(monthlyBudget, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal(100))
                    .doubleValue();
        }

        Long totalTransactions = expenseRepository.countByUserAndExpenseDateBetween(currentUser, startDate, endDate);

        // Category breakdown
        List<Object[]> categoryData = expenseRepository.sumExpensesGroupedByCategory(currentUser, startDate, endDate);
        List<CategorySummaryResponse> categorySummaries = new ArrayList<>();

        String highestCategory = "N/A";
        String lowestCategory = "N/A";

        if (!categoryData.isEmpty()) {
            highestCategory = (String) categoryData.get(0)[0];
            lowestCategory = (String) categoryData.get(categoryData.size() - 1)[0];

            final BigDecimal finalTotal = totalExpenses;
            for (Object[] row : categoryData) {
                String catName = (String) row[0];
                BigDecimal catAmount = (BigDecimal) row[1];
                double percentage = 0.0;
                if (finalTotal.compareTo(BigDecimal.ZERO) > 0) {
                    percentage = catAmount.divide(finalTotal, 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal(100))
                            .doubleValue();
                }
                categorySummaries.add(new CategorySummaryResponse(catName, catAmount, percentage));
            }
        }

        // Average daily spending
        int daysInMonth = yearMonth.lengthOfMonth();
        int activeDays = (year == LocalDate.now().getYear() && month == LocalDate.now().getMonthValue())
                ? Math.min(LocalDate.now().getDayOfMonth(), daysInMonth)
                : daysInMonth;

        BigDecimal averageDailySpending = activeDays > 0
                ? totalExpenses.divide(new BigDecimal(activeDays), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return new MonthlyReportResponse(
                month,
                year,
                totalExpenses,
                monthlyBudget,
                remainingBudget,
                utilizationPercentage,
                highestCategory,
                lowestCategory,
                averageDailySpending,
                totalTransactions,
                categorySummaries
        );
    }

    public List<CategorySummaryResponse> getCategorySummary(LocalDate startDate, LocalDate endDate) {
        User currentUser = authService.getCurrentUser();

        if (startDate == null) {
            startDate = LocalDate.now().withDayOfMonth(1);
        }
        if (endDate == null) {
            startDate.plusMonths(1).minusDays(1);
            endDate = LocalDate.now();
        }

        BigDecimal total = expenseRepository.sumExpensesByUserAndDateRange(currentUser, startDate, endDate);
        if (total == null) total = BigDecimal.ZERO;

        List<Object[]> categoryData = expenseRepository.sumExpensesGroupedByCategory(currentUser, startDate, endDate);
        List<CategorySummaryResponse> list = new ArrayList<>();

        final BigDecimal finalTotal = total;
        for (Object[] row : categoryData) {
            String catName = (String) row[0];
            BigDecimal catAmount = (BigDecimal) row[1];
            double percentage = 0.0;
            if (finalTotal.compareTo(BigDecimal.ZERO) > 0) {
                percentage = catAmount.divide(finalTotal, 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal(100))
                        .doubleValue();
            }
            list.add(new CategorySummaryResponse(catName, catAmount, percentage));
        }

        return list;
    }

    public List<SpendingTrendResponse> getSpendingTrends(int lastNMonths) {
        User currentUser = authService.getCurrentUser();
        List<SpendingTrendResponse> trends = new ArrayList<>();

        LocalDate endMonth = LocalDate.now().withDayOfMonth(1);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = lastNMonths - 1; i >= 0; i--) {
            LocalDate m = endMonth.minusMonths(i);
            YearMonth yearMonth = YearMonth.of(m.getYear(), m.getMonthValue());
            LocalDate start = yearMonth.atDay(1);
            LocalDate end = yearMonth.atEndOfMonth();

            BigDecimal total = expenseRepository.sumExpensesByUserAndDateRange(currentUser, start, end);
            if (total == null) total = BigDecimal.ZERO;

            String label = m.format(formatter);
            trends.add(new SpendingTrendResponse(label, m.getMonthValue(), m.getYear(), total));
        }

        return trends;
    }
}
