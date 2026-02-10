package com.mt.UMS.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mt.UMS.dto.LoginRequestDto;
import com.mt.UMS.dto.LoginResponseDto;
import com.mt.UMS.dto.RegisterDto;
import com.mt.UMS.dto.UserDto;
import com.mt.UMS.exceptions.ResourceNotFoundException;
import com.mt.UMS.model.UserEntity;
import com.mt.UMS.repository.UserRepository;
import com.mt.UMS.service.AuthenticationService;
import com.mt.UMS.utils.ConvertToDto;

@RestController
@RequestMapping("/auth")
public class AuthController {

  // 1. Register normal user
  // 2. Login jwt -> http cookie only
  // 3. Logout
  // 4. Get current logged in user

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private AuthenticationService authenticationService;

  @PostMapping("/registerNormalUser")
  public ResponseEntity<UserDto> registerNormalUser(@RequestBody RegisterDto registerDto) {
    return ResponseEntity.ok(authenticationService.registerNormalUser(registerDto));
  }

  @PostMapping("/login")
  public ResponseEntity<UserDto> login(@RequestBody LoginRequestDto lopLoginRequestDto) {
    LoginResponseDto loginResponseDto = authenticationService.login(lopLoginRequestDto);
    ResponseCookie cookie = ResponseCookie.from("JWT", loginResponseDto.getJwtToken())
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(1 * 60 * 60) // 1 Hour
        .sameSite("Strict")
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(loginResponseDto.getUserDto());
  }

  @PostMapping("/logout")
  public ResponseEntity<String> logout() {
    return authenticationService.logout();
  }

  @GetMapping("/getCurrentUser")
  public ResponseEntity<?> getCurrentUser(Authentication authentication) {
    if (authentication == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
    }
    String username = authentication.getName();
    UserEntity user = userRepository.findByUsername(username)
        .orElseThrow(() -> new ResourceNotFoundException("user not found with username :{}" + username));
    return ResponseEntity.ok(ConvertToDto.convertToUserDto(user));
  }

}
