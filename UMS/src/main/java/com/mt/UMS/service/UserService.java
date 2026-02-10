package com.mt.UMS.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.mt.UMS.dto.ChangePasswordDto;
import com.mt.UMS.dto.UserDto;
import com.mt.UMS.exceptions.ResourceNotFoundException;
import com.mt.UMS.model.UserEntity;
import com.mt.UMS.repository.UserRepository;
import com.mt.UMS.utils.ConvertToDto;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  public UserDto getUserById(Long id) {
    UserEntity user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("user not found with id :{}" + id));
    return ConvertToDto.convertToUserDto(user);
  }

  public UserDto getUserByUsername(String username) {
    UserEntity user = userRepository.findByUsername(username)
        .orElseThrow(() -> new ResourceNotFoundException("user not found with username :{}" + username));
    return ConvertToDto.convertToUserDto(user);
  }

  public List<UserDto> getAllUsers() {
    List<UserEntity> users = userRepository.findAll();
    return users.stream().map(ConvertToDto::convertToUserDto).collect(Collectors.toList());
  }

  public UserDto updatePassword(Long id, ChangePasswordDto changePasswordDto) {

    UserEntity user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("user not found with id :{}" + id));

    if (!passwordEncoder.matches(user.getPassword(), changePasswordDto.getCurrentPassword())) {
      throw new RuntimeException("Password entered is incorrect");
    }

    if (!changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmPassword())) {
      throw new RuntimeException("new password and confirm password does not match");
    }

    user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
    UserEntity savedUser = userRepository.save(user);

    return ConvertToDto.convertToUserDto(savedUser);
  }

  public UserDto updateUser(Long id, UserDto userDto) {
    UserEntity user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("user not found with id :{}" + id));
    user.setUsername(userDto.getUsername());
    user.setEmail(userDto.getEmail());

    UserEntity savedUser = userRepository.save(user);
    return ConvertToDto.convertToUserDto(savedUser);

  }

  public void deleteUserById(Long id) {
    userRepository.deleteById(id);
  }

}
