package com.mt.UMS.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordDto {
    public String currentPassword;
    public String newPassword;
    public String confirmPassword;
}
