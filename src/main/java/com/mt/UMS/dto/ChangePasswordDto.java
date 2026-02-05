package com.mt.UMS.dto;

public record ChangePasswordDto(String currentPassword, String newPassword, String confirmPassword) {

}
