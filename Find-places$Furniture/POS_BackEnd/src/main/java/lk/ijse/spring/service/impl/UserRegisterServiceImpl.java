package lk.ijse.spring.service.impl;

import lk.ijse.spring.dto.CustomDTO;
import lk.ijse.spring.dto.UserDTO;
import lk.ijse.spring.dto.UserIDTO;
import lk.ijse.spring.entity.Customer;
import lk.ijse.spring.entity.User;
import lk.ijse.spring.repo.CustomerRepo;
import lk.ijse.spring.repo.UserRepo;
import lk.ijse.spring.service.UserRegisterService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserRegisterServiceImpl implements UserRegisterService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void saveUser(UserDTO dto) {
        System.out.println("dto in service" );
        System.out.println(dto.getId());
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        if (repo.existsById(dto.getId())) {
            throw new RuntimeException("Customer Already Exist. Please enter another id..!");
        }
        repo.save(mapper.map(dto, User.class));
    }

    @Override
    public UserIDTO userIdGenerate() {
        return new UserIDTO(repo.getLastIndex());
    }
}
