package com.mt.UMS.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserDto(Long id,
        @NotBlank @Size(min = 3, max = 50) String username,
        @NotBlank @Size(max = 70) @Email String email) {

}
