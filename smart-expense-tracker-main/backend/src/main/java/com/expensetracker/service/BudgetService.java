package com.expensetracker.service;

import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.dto.BudgetResponse;
import com.expensetracker.dto.BudgetStatusResponse;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.User;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public BudgetResponse createOrUpdateBudget(BudgetRequest request) {
        User currentUser = authService.getCurrentUser();

        Optional<Budget> existingOpt = budgetRepository.findByUserAndMonthAndYear(
                currentUser, request.getMonth(), request.getYear()
        );

        Budget budget;
        if (existingOpt.isPresent()) {
            budget = existingOpt.get();
            budget.setAmount(request.getAmount());
        } else {
            budget = new Budget(currentUser, request.getMonth(), request.getYear(), request.getAmount());
        }

        Budget saved = budgetRepository.save(budget);
        return mapToResponse(saved);
    }

    public List<BudgetResponse> getAllBudgets() {
        User currentUser = authService.getCurrentUser();
        return budgetRepository.findByUserOrderByYearDescMonthDesc(currentUser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BudgetStatusResponse getBudgetStatus(Integer month, Integer year) {
        User currentUser = authService.getCurrentUser();

        if (month == null || year == null) {
            LocalDate now = LocalDate.now();
            month = now.getMonthValue();
            year = now.getYear();
        }

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        BigDecimal budgetAmount = budgetRepository.findByUserAndMonthAndYear(currentUser, month, year)
                .map(Budget::getAmount)
                .orElse(BigDecimal.ZERO);

        BigDecimal totalSpent = expenseRepository.sumExpensesByUserAndDateRange(currentUser, startDate, endDate);
        if (totalSpent == null) {
            totalSpent = BigDecimal.ZERO;
        }

        BigDecimal remainingBudget = budgetAmount.subtract(totalSpent);

        double utilizationPercentage = 0.0;
        if (budgetAmount.compareTo(BigDecimal.ZERO) > 0) {
            utilizationPercentage = totalSpent.divide(budgetAmount, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal(100))
                    .doubleValue();
        }

        String status;
        String message;

        if (budgetAmount.compareTo(BigDecimal.ZERO) == 0) {
            status = "NOT_SET";
            message = "No monthly budget set for " + yearMonth.getMonth() + " " + year;
        } else if (utilizationPercentage > 100.0) {
            status = "EXCEEDED";
            message = "Alert! You have exceeded your monthly budget by $" + totalSpent.subtract(budgetAmount);
        } else if (utilizationPercentage >= 80.0) {
            status = "WARNING";
            message = "Warning: You have used " + String.format("%.1f", utilizationPercentage) + "% of your monthly budget.";
        } else {
            status = "NORMAL";
            message = "Your spending is within your budget limits (" + String.format("%.1f", utilizationPercentage) + "% used).";
        }

        return new BudgetStatusResponse(
                month,
                year,
                budgetAmount,
                totalSpent,
                remainingBudget,
                utilizationPercentage,
                status,
                message
        );
    }

    @Transactional
    public void deleteBudget(Long id) {
        User currentUser = authService.getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        if (!budget.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Unauthorized access to budget record");
        }

        budgetRepository.delete(budget);
    }

    private BudgetResponse mapToResponse(Budget budget) {
        return new BudgetResponse(
                budget.getId(),
                budget.getMonth(),
                budget.getYear(),
                budget.getAmount(),
                budget.getCreatedAt()
        );
    }
}
