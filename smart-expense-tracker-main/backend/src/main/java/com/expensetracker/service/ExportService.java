package com.expensetracker.service;

import com.expensetracker.dto.MonthlyReportResponse;

import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.repository.ExpenseRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import java.awt.Color;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExportService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ReportService reportService;

    @Autowired
    private AuthService authService;

    public ByteArrayInputStream exportExpensesToCsv(LocalDate startDate, LocalDate endDate) throws IOException {
        User currentUser = authService.getCurrentUser();

        if (startDate == null) startDate = LocalDate.now().withDayOfMonth(1);
        if (endDate == null) endDate = LocalDate.now();

        List<Expense> expenses = expenseRepository.findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(
                currentUser, startDate, endDate
        );

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setHeader("ID", "Title", "Amount", "Category", "Payment Method", "Expense Date", "Description")
                .build();

        try (PrintWriter writer = new PrintWriter(out);
             CSVPrinter csvPrinter = new CSVPrinter(writer, format)) {

            for (Expense e : expenses) {
                csvPrinter.printRecord(
                        e.getId(),
                        e.getTitle(),
                        e.getAmount(),
                        e.getCategory(),
                        e.getPaymentMethod(),
                        e.getExpenseDate(),
                        e.getDescription() != null ? e.getDescription() : ""
                );
            }
            csvPrinter.flush();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream exportMonthlyReportToPdf(Integer month, Integer year) {
        User currentUser = authService.getCurrentUser();

        if (month == null || year == null) {
            LocalDate now = LocalDate.now();
            month = now.getMonthValue();
            year = now.getYear();
        }

        MonthlyReportResponse report = reportService.getMonthlyReport(month, year);
        YearMonth yearMonth = YearMonth.of(year, month);
        List<Expense> expenses = expenseRepository.findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(
                currentUser, yearMonth.atDay(1), yearMonth.atEndOfMonth()
        );

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Document Header / Banner
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.DARK_GRAY);
            Paragraph title = new Paragraph("Smart Expense Tracker Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.GRAY);
            Paragraph sub = new Paragraph("User: " + currentUser.getName() + " | Email: " + currentUser.getEmail() + " | Month: " + yearMonth.getMonth() + " " + year, subFont);
            sub.setAlignment(Element.ALIGN_CENTER);
            sub.setSpacingAfter(15);
            document.add(sub);

            // Summary Table Cards
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setSpacingAfter(15);

            addCell(summaryTable, "Total Expenses:", "$" + report.getTotalExpenses(), true);
            addCell(summaryTable, "Monthly Budget:", "$" + report.getMonthlyBudget(), false);
            addCell(summaryTable, "Remaining Budget:", "$" + report.getRemainingBudget(), true);
            addCell(summaryTable, "Budget Utilization:", String.format("%.1f%%", report.getBudgetUtilizationPercentage()), false);
            addCell(summaryTable, "Top Category:", report.getHighestSpendingCategory(), true);
            addCell(summaryTable, "Avg Daily Spend:", "$" + report.getAverageDailySpending(), false);

            document.add(summaryTable);

            // Transactions Heading
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.BLACK);
            Paragraph secHeader = new Paragraph("Detailed Expense Records", sectionFont);
            secHeader.setSpacingAfter(10);
            document.add(secHeader);

            // Expenses Table
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{15, 30, 20, 15, 20});

            // Table Header
            String[] headers = {"Date", "Title", "Category", "Method", "Amount"};
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                cell.setBackgroundColor(new Color(41, 128, 185));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(6);
                table.addCell(cell);
            }

            // Table Rows
            Font rowFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.DARK_GRAY);
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            for (Expense e : expenses) {
                table.addCell(new Phrase(e.getExpenseDate().format(dateFormatter), rowFont));
                table.addCell(new Phrase(e.getTitle(), rowFont));
                table.addCell(new Phrase(e.getCategory(), rowFont));
                table.addCell(new Phrase(e.getPaymentMethod(), rowFont));
                table.addCell(new Phrase("$" + e.getAmount(), rowFont));
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addCell(PdfPTable table, String label, String value, boolean isAlt) {
        Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.DARK_GRAY);
        Font valFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        PdfPCell cell = new PdfPCell(new Phrase(label + " " + value, valFont));
        if (isAlt) cell.setBackgroundColor(new Color(245, 247, 250));
        cell.setPadding(8);
        table.addCell(cell);
    }
}
