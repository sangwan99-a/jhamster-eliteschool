package com.elite.school.service.dto;

import java.io.Serializable;
import lombok.*;

/**
 * A DTO representing a password change required data - current and new password.
 */
@Data
public class PasswordChangeDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String currentPassword;
    private String newPassword;

    public PasswordChangeDTO() {
        // Empty constructor needed for Jackson.
    }

    public PasswordChangeDTO(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }
}
