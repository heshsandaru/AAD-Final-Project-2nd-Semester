package lk.ijse.spring.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {

   @Id
   private String id;
    private String username;
    private String email;
    private String password;
    private Role role = Role.USER;
    public enum Role {
        USER, ADMIN
    }

}
