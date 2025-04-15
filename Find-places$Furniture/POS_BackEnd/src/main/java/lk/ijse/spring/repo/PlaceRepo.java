package lk.ijse.spring.repo;

import lk.ijse.spring.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PlaceRepo extends JpaRepository<Place, String> {
    @Query(value = "SELECT id FROM Place ORDER BY id DESC LIMIT 1", nativeQuery = true)
    String getLastIndex();

    @Query(value = "SELECT COUNT(id) FROM Place", nativeQuery = true)
    int getSumCustomer();
}
