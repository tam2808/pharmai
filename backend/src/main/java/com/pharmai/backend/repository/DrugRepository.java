package com.pharmai.backend.repository;

import com.pharmai.backend.model.Drug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DrugRepository extends JpaRepository<Drug, Long> {
    
    List<Drug> findByCategory(String category);
    
    List<Drug> findByForm(String form);
    
    List<Drug> findByRequiresPrescription(Boolean requiresPrescription);

    @Query("SELECT d FROM Drug d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.activeIngredient) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Drug> searchDrugs(@Param("query") String query);
}
