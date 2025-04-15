package lk.ijse.spring.service;

import lk.ijse.spring.dto.CustomDTO;
import lk.ijse.spring.dto.CustomerDTO;
import lk.ijse.spring.dto.PlaceDto;
import lk.ijse.spring.dto.PlaceIDto;

import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;

public interface PlaceService {
    void savePlace(@ModelAttribute PlaceDto dto);

    void updatePlace(@RequestBody PlaceDto dto);

    void deletePlace(String id);

    PlaceDto searchPlaceId(String id);

    ArrayList<PlaceDto> loadAllPlace();

    @ResponseBody
    PlaceIDto placeIdGenerate();

    @ResponseBody
    PlaceIDto getSumCustomer();

}
