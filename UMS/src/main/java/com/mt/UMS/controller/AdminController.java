package com.mt.UMS.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mt.UMS.dto.RegisterDto;
import com.mt.UMS.dto.UserDto;
import com.mt.UMS.service.AuthenticationService;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/registerAdminUser")
    public ResponseEntity<UserDto> registerAdminUser(@RequestBody RegisterDto registerDto) {
        return ResponseEntity.ok(authenticationService.registerAdminUser(registerDto));
    }
}
