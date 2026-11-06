package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.dto.PageResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.ExpenseRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public ExpenseResponse addExpense(ExpenseRequest request) {
        User currentUser = authService.getCurrentUser();

        Expense expense = new Expense(
                currentUser,
                request.getTitle(),
                request.getAmount(),
                request.getCategory(),
                request.getExpenseDate(),
                request.getDescription(),
                request.getPaymentMethod()
        );

        Expense saved = expenseRepository.save(expense);
        return mapToResponse(saved);
    }

    public PageResponse<ExpenseResponse> getExpenses(
            String title,
            String category,
            String paymentMethod,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        User currentUser = authService.getCurrentUser();

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Expense> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // User level data isolation
            predicates.add(cb.equal(root.get("user"), currentUser));

            if (title != null && !title.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + title.trim().toLowerCase() + "%"));
            }

            if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
                predicates.add(cb.equal(root.get("category"), category.trim()));
            }

            if (paymentMethod != null && !paymentMethod.trim().isEmpty() && !paymentMethod.equalsIgnoreCase("ALL")) {
                predicates.add(cb.equal(root.get("paymentMethod"), paymentMethod.trim()));
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("expenseDate"), startDate));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("expenseDate"), endDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Expense> expensePage = expenseRepository.findAll(spec, pageable);

        List<ExpenseResponse> content = expensePage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                expensePage.getNumber(),
                expensePage.getSize(),
                expensePage.getTotalElements(),
                expensePage.getTotalPages(),
                expensePage.isLast()
        );
    }

    public ExpenseResponse getExpenseById(Long id) {
        User currentUser = authService.getCurrentUser();
        Expense expense = expenseRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        return mapToResponse(expense);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        User currentUser = authService.getCurrentUser();
        Expense expense = expenseRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());
        expense.setPaymentMethod(request.getPaymentMethod());

        Expense updated = expenseRepository.save(expense);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteExpense(Long id) {
        User currentUser = authService.getCurrentUser();
        Expense expense = expenseRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        expenseRepository.delete(expense);
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getExpenseDate(),
                expense.getDescription(),
                expense.getPaymentMethod(),
                expense.getCreatedAt()
        );
    }
}
