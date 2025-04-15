package lk.ijse.spring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PlaceDto {
    @Id
    private String id;
    private String location;
    private String category;
    private String phonenumber;
    private double price;
    private String action;
}
