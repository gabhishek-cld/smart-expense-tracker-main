package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.CategorySummaryResponse;
import com.expensetracker.dto.MonthlyReportResponse;
import com.expensetracker.dto.SpendingTrendResponse;
import com.expensetracker.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<MonthlyReportResponse>> getMonthlyReport(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        MonthlyReportResponse report = reportService.getMonthlyReport(month, year);
        return ResponseEntity.ok(ApiResponse.success("Monthly report generated", report));
    }

    @GetMapping("/category-summary")
    public ResponseEntity<ApiResponse<List<CategorySummaryResponse>>> getCategorySummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<CategorySummaryResponse> summary = reportService.getCategorySummary(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Category summary generated", summary));
    }

    @GetMapping("/spending-trends")
    public ResponseEntity<ApiResponse<List<SpendingTrendResponse>>> getSpendingTrends(
            @RequestParam(defaultValue = "6") int months
    ) {
        List<SpendingTrendResponse> trends = reportService.getSpendingTrends(months);
        return ResponseEntity.ok(ApiResponse.success("Spending trends generated", trends));
    }
}
