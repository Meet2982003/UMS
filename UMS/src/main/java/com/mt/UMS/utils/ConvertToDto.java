package com.mt.UMS.utils;

import com.mt.UMS.dto.UserDto;
import com.mt.UMS.model.UserEntity;

public class ConvertToDto {

    public static UserDto convertToUserDto(UserEntity user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        return userDto;
    }
}
