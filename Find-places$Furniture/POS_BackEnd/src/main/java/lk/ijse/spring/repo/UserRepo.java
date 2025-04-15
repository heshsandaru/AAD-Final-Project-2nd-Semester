package lk.ijse.spring.repo;

import lk.ijse.spring.entity.Customer;
import lk.ijse.spring.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepo extends JpaRepository<User, String> {
    @Override
    Optional<User> findById(String s);

    @Query(value = "SELECT id FROM User ORDER BY id DESC LIMIT 1", nativeQuery = true)
    String getLastIndex();
}
