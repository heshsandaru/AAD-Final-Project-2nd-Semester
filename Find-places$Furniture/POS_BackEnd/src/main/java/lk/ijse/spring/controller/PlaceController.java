package lk.ijse.spring.controller;
import lk.ijse.spring.dto.CustomDTO;
import lk.ijse.spring.dto.CustomerDTO;
import lk.ijse.spring.dto.PlaceDto;
import lk.ijse.spring.dto.PlaceIDto;
import lk.ijse.spring.repo.PlaceRepo;
import lk.ijse.spring.service.PlaceService;
import lk.ijse.spring.util.FileUploadUtil;
import lk.ijse.spring.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Objects;

@CrossOrigin("*")
@RestController
@RequestMapping("/products")
public class PlaceController {
    @Autowired
    private PlaceRepo repo;

    @Autowired
    private PlaceService placeService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ResponseUtil savePlace(@ModelAttribute PlaceDto dto) {
        placeService.savePlace(dto);
        return new ResponseUtil("OK", "Successfully add.!", null);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PutMapping
    public ResponseUtil updatePlace(@RequestBody PlaceDto dto) {
        placeService.updatePlace(dto);
        return new ResponseUtil("OK", "Successfully Updated. :" + dto.getId(), null);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @DeleteMapping("/{id}")
    public ResponseUtil deletePlace(@PathVariable String id) {
        placeService.deletePlace(id);
        return new ResponseUtil("OK", "Successfully Deleted: " + id, null);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(path = "/searchPlaceId", params = {"id"})
    public PlaceDto searchPlaceId(String id) {
        return placeService.searchPlaceId(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(path = "/loadAllPlace")
    public ResponseUtil loadAllPlace() {
        return new ResponseUtil("OK", "Successfully Loaded. :", placeService.loadAllPlace());
    }

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(path = "/PlaceIdGenerate")
    public @ResponseBody PlaceIDto placeIdGenerate() {
        return placeService.placeIdGenerate();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @GetMapping(path = "/CustomerCount")
    public @ResponseBody PlaceIDto getSumCustomer() {
        return placeService.getSumCustomer();
    }
}
