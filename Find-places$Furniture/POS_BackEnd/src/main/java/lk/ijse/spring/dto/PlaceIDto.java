package lk.ijse.spring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PlaceIDto {
    private String value;
    private int count;

    public PlaceIDto(String lastIndex) {
        this.value=lastIndex;
    }

    public PlaceIDto(int count) {
        this.count=count;
    }
}
