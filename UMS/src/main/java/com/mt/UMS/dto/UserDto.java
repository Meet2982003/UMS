package com.mt.UMS.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
        public Long id;
        @NotBlank
        @Size(min = 3, max = 50)
        public String username;
        @NotBlank
        @Size(max = 70)
        @Email
        public String email;

}
