package lk.ijse.spring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String password;
    private Role role = Role.ADMIN;

    public enum Role {
        USER, ADMIN
    }
}
