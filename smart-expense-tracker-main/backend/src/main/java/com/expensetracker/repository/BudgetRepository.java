package com.expensetracker.repository;

import com.expensetracker.entity.Budget;
import com.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByUserAndMonthAndYear(User user, Integer month, Integer year);

    List<Budget> findByUserOrderByYearDescMonthDesc(User user);

    List<Budget> findByUserAndYearOrderByMonthAsc(User user, Integer year);

    Boolean existsByUserAndMonthAndYear(User user, Integer month, Integer year);
}
