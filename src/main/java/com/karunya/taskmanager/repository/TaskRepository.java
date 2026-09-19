package com.karunya.taskmanager.repository;

import com.karunya.taskmanager.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}