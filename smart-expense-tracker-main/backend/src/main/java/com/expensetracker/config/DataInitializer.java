package com.expensetracker.config;

import com.expensetracker.entity.Category;
import com.expensetracker.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        List<String> defaultCategories = Arrays.asList(
                "Food", "Transport", "Shopping", "Education",
                "Bills", "Healthcare", "Entertainment", "Rent", "Travel", "Other"
        );

        for (String catName : defaultCategories) {
            if (!categoryRepository.existsByNameAndUserIsNull(catName)) {
                categoryRepository.save(new Category(catName, null));
            }
        }
    }
}
