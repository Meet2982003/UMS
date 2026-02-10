package com.mt.UMS.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.mt.UMS.model.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByUsername(String username);

}
