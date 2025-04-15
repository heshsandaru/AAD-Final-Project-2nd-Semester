package lk.ijse.spring.service.impl;

import lk.ijse.spring.dto.CustomDTO;
import lk.ijse.spring.dto.CustomerDTO;
import lk.ijse.spring.dto.PlaceDto;
import lk.ijse.spring.dto.PlaceIDto;
import lk.ijse.spring.entity.Customer;
import lk.ijse.spring.entity.Place;
import lk.ijse.spring.repo.CustomerRepo;
import lk.ijse.spring.repo.PlaceRepo;
import lk.ijse.spring.service.PlaceService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@Transactional
public class PlaceServiceImpl implements PlaceService {
    @Autowired
    private PlaceRepo repo;
    @Autowired
    private ModelMapper mapper;

    @Override
    public void savePlace(PlaceDto dto) {
        if (repo.existsById(dto.getId())) {
            throw new RuntimeException("Place Already Exist. Please enter another id..!");
        }
        repo.save(mapper.map(dto, Place.class));

    }

    @Override
    public void updatePlace(PlaceDto dto) {
        if (!repo.existsById(dto.getId())) {
            throw new RuntimeException("Place Not Exist. Please enter Valid id..!");
        }
        repo.save(mapper.map(dto, Place.class));

    }

    @Override
    public void deletePlace(String id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Wrong ID. Please enter Valid id..!");
        }
        Place place = repo.getById(id);
        repo.delete(place);

    }

    @Override
    public PlaceDto searchPlaceId(String id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Wrong ID. Please enter Valid id..!");
        }
        return mapper.map(repo.findById(id).get(), PlaceDto.class);
    }

    @Override
    public ArrayList<PlaceDto> loadAllPlace() {
        return mapper.map(repo.findAll(), new TypeToken<ArrayList<Place>>() {
        }.getType());
    }

    @Override
    public PlaceIDto placeIdGenerate() {
        return new PlaceIDto(repo.getLastIndex());
    }

    @Override
    public PlaceIDto getSumCustomer() {
        return new PlaceIDto(repo.getSumCustomer());
    }
}
