package lk.ijse.spring.controller;

import lk.ijse.spring.dto.CustomDTO;
import lk.ijse.spring.dto.UserDTO;
import lk.ijse.spring.dto.UserIDTO;
import lk.ijse.spring.service.UserRegisterService;
import lk.ijse.spring.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private UserRegisterService service;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public ResponseUtil saveUser(@RequestBody UserDTO dto) {
        System.out.println(dto.getId());
        service.saveUser(dto);
        return new ResponseUtil("OK", "Successfully Registered.!", HttpStatus.CREATED);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(path = "/UserIdGenerate")
    public @ResponseBody UserIDTO UserIdGenerate() {
        return service.userIdGenerate();
    }
}
