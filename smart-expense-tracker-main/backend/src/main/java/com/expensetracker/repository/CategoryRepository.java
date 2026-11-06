package com.expensetracker.repository;

import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUserIsNull();

    List<Category> findByUser(User user);

    @Query("SELECT c FROM Category c WHERE c.user IS NULL OR c.user = :user")
    List<Category> findAllAvailableForUser(@Param("user") User user);

    Optional<Category> findByNameAndUser(String name, User user);

    Boolean existsByNameAndUserIsNull(String name);
}
