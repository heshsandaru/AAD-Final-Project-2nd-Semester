package lk.ijse.spring.service;

import lk.ijse.spring.dto.CustomDTO;
import lk.ijse.spring.dto.UserDTO;
import lk.ijse.spring.dto.UserIDTO;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.ResponseBody;

public interface UserRegisterService {
    void saveUser( UserDTO dto);

    @ResponseBody
    UserIDTO userIdGenerate();

}
