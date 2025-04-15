package lk.ijse.spring.service.impl;

import lk.ijse.spring.entity.User;
import lk.ijse.spring.repo.LoginUserRepo;
import lk.ijse.spring.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private LoginUserRepo loginUserRepo;

    @Override
    public Optional<User> findByName(String name) {
        try {
            Optional<User> user = loginUserRepo.findByUsername(name);
            System.out.println(user.isPresent());
            return user;
        }catch (Exception e){
            System.out.println("user not found");
            return Optional.empty();

        }

    }


}
