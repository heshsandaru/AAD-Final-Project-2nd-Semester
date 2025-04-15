package lk.ijse.spring.service;

import lk.ijse.spring.entity.User;

import java.util.Optional;

public interface LoginService {
    Optional<User> findByName(String name);

}
