package lk.ijse.spring.controller;

import lk.ijse.spring.dto.LoginRequest;
import lk.ijse.spring.entity.User;
import lk.ijse.spring.repo.LoginUserRepo;
import lk.ijse.spring.secuirity.JwtUtil;
import lk.ijse.spring.service.LoginService;
import lk.ijse.spring.util.ResponseUtil;
import org.modelmapper.internal.bytebuddy.agent.builder.AgentBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
@CrossOrigin("*")
@RestController
@RequestMapping("/auth")
public class LoginController {
    @Autowired
    private LoginService loginService;
    @Autowired
    private LoginUserRepo repo;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseUtil login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Username: " + loginRequest.getUsername());
        System.out.println("Password: " + loginRequest.getPassword());

        Optional<User> userOptional = loginService.findByName(loginRequest.getUsername());
        ResponseUtil responseUtil = new ResponseUtil();

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Check hashed password using BCrypt
            boolean isPasswordMatch = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());

            if (isPasswordMatch) {
                String token = jwtUtil.generateToken(user.getId(), user.getRole());
                System.out.println("token: " + token);

                responseUtil.setState("200");
                responseUtil.setMessage("User successfully logged in");
                responseUtil.setData(token);  // You can return user info + token if needed
                return responseUtil;
            } else {
                responseUtil.setState("401");
                responseUtil.setMessage("Invalid credentials");
                responseUtil.setData(null);
                return responseUtil;
            }

        } else {
            responseUtil.setState("404");
            responseUtil.setMessage("User not found");
            responseUtil.setData(null);
            return responseUtil;
        }
    }

}
