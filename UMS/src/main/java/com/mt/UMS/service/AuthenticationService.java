package com.mt.UMS.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.mt.UMS.dto.LoginRequestDto;
import com.mt.UMS.dto.LoginResponseDto;
import com.mt.UMS.dto.RegisterDto;
import com.mt.UMS.dto.UserDto;
import com.mt.UMS.exceptions.ResourceNotFoundException;
import com.mt.UMS.model.UserEntity;
import com.mt.UMS.repository.UserRepository;
import com.mt.UMS.utils.ConvertToDto;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public UserDto registerNormalUser(RegisterDto registerDto) {
        if (userRepository.findByUsername(registerDto.getUsername()).isPresent()) {
            throw new RuntimeException("Use is already registered");
        }
        Set<String> set = new HashSet<>();
        set.add("ROLE_USER");
        UserEntity user = new UserEntity();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRoles(set);

        UserEntity savedUser = userRepository.save(user);

        return ConvertToDto.convertToUserDto(savedUser);
    }

    public UserDto registerAdminUser(RegisterDto registerDto) {
        if (userRepository.findByUsername(registerDto.getUsername()).isPresent()) {
            throw new RuntimeException("Use is already registered");
        }
        Set<String> set = new HashSet<>();
        set.add("ROLE_USER");
        set.add("ROLE_ADMIN");

        UserEntity user = new UserEntity();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRoles(set);

        UserEntity savedUser = userRepository.save(user);

        return ConvertToDto.convertToUserDto(savedUser);
    }

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        UserEntity user = userRepository.findByUsername(loginRequestDto.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User is already present"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword()));

        String jwtToken = jwtService.generateToken(user);

        return LoginResponseDto.builder()
                .jwtToken(jwtToken)
                .userDto(ConvertToDto.convertToUserDto(user))
                .build();
    }

    public ResponseEntity<String> logout() {
        // create expired cookie

        ResponseCookie cookie = ResponseCookie.from("JWT", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("LOGGED OUT SUCCESSFULLY");
    }

}
