package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.dto.BudgetResponse;
import com.expensetracker.dto.BudgetStatusResponse;
import com.expensetracker.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> createOrUpdateBudget(@Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.createOrUpdateBudget(request);
        return new ResponseEntity<>(ApiResponse.success("Monthly budget set successfully!", response), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getAllBudgets() {
        List<BudgetResponse> response = budgetService.getAllBudgets();
        return ResponseEntity.ok(ApiResponse.success("Budgets retrieved successfully", response));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<BudgetStatusResponse>> getBudgetStatus(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        BudgetStatusResponse response = budgetService.getBudgetStatus(month, year);
        return ResponseEntity.ok(ApiResponse.success("Budget status calculated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok(ApiResponse.success("Budget record deleted successfully!"));
    }
}
