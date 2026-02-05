package com.mt.UMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mt.UMS.model.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

}
