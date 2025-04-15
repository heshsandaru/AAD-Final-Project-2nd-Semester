package lk.ijse.spring.controller;

import lk.ijse.spring.dto.LoginRequest;
import lk.ijse.spring.entity.User;
import lk.ijse.spring.repo.LoginUserRepo;
import lk.ijse.spring.secuirity.JwtUtil;
import lk.ijse.spring.service.LoginService;
import lk.ijse.spring.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/login")
    public ResponseUtil login(@RequestBody LoginRequest loginRequest) {

        System.out.println(loginRequest.getUsername());
        System.out.println(loginRequest.getPassword());
        Optional<User> userOptional = loginService.findByName(loginRequest.getUsername());
        System.out.println(userOptional);
        ResponseUtil responseUtil = new ResponseUtil();
        if (userOptional.isPresent()) {
            User user = userOptional.get();
           String token = jwtUtil.generateToken(user.getId(),user.getRole());
            System.out.println("token: " + token);
            if (user.getPassword().equals(loginRequest.getPassword())) {
                responseUtil.setState("200");
                responseUtil.setMessage("User successfully logged in");
                responseUtil.setData(user);
                responseUtil.setData(token);
                return responseUtil;
            }
        }else {
            responseUtil.setState("404");
            responseUtil.setMessage("User not found");
            responseUtil.setData(null);

        }



       return responseUtil;
    }
}
//postmaping-(/register)