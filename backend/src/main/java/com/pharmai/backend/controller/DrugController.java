package com.pharmai.backend.controller;

import com.pharmai.backend.model.Drug;
import com.pharmai.backend.repository.DrugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/drugs")
@CrossOrigin(origins = "*")
public class DrugController {

    @Autowired
    private DrugRepository drugRepository;

    @GetMapping
    public ResponseEntity<?> getAllDrugs(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "form", required = false) String form,
            @RequestParam(value = "requiresPrescription", required = false) Boolean requiresPrescription) {
        
        List<Drug> drugs = drugRepository.findAll();

        if (search != null && !search.trim().isEmpty()) {
            drugs = drugRepository.searchDrugs(search.trim());
        }

        if (category != null && !category.trim().isEmpty()) {
            String catTrim = category.trim();
            drugs = drugs.stream()
                    .filter(d -> d.getCategory() != null && d.getCategory().equalsIgnoreCase(catTrim))
                    .collect(Collectors.toList());
        }

        if (form != null && !form.trim().isEmpty()) {
            String formTrim = form.trim();
            drugs = drugs.stream()
                    .filter(d -> d.getForm() != null && d.getForm().equalsIgnoreCase(formTrim))
                    .collect(Collectors.toList());
        }

        if (requiresPrescription != null) {
            drugs = drugs.stream()
                    .filter(d -> d.getRequiresPrescription() != null && d.getRequiresPrescription().equals(requiresPrescription))
                    .collect(Collectors.toList());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", drugs);
        response.put("total", drugs.size());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDrugById(@PathVariable("id") long id) {
        Drug drug = drugRepository.findById(id).orElse(null);
        if (drug == null) return ResponseEntity.notFound().build();
        Map<String, Object> response = new HashMap<>();
        response.put("data", drug);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<?> getSuggestions(@RequestParam("q") String query) {
        if (query == null || query.trim().length() < 2) {
            Map<String, Object> response = new HashMap<>();
            response.put("data", List.of());
            return ResponseEntity.ok(response);
        }

        List<Drug> results = drugRepository.searchDrugs(query.trim());
        List<Map<String, Object>> suggestions = results.stream()
                .limit(5)
                .map(d -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", d.getId().toString());
                    item.put("name", d.getName());
                    item.put("activeIngredient", d.getActiveIngredient());
                    return item;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("data", suggestions);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedDrugs() {
        List<Drug> drugs = drugRepository.findAll().stream()
                .limit(4)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", drugs);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        // Group and count dynamically based on drugs in database
        List<Drug> allDrugs = drugRepository.findAll();
        Map<String, Long> categoryCounts = allDrugs.stream()
                .filter(d -> d.getCategory() != null && !d.getCategory().trim().isEmpty())
                .collect(Collectors.groupingBy(
                        d -> d.getCategory().trim(),
                        Collectors.counting()
                ));

        List<Map<String, Object>> categories = new ArrayList<>();
        long index = 1;
        for (Map.Entry<String, Long> entry : categoryCounts.entrySet()) {
            Map<String, Object> catMap = new HashMap<>();
            catMap.put("id", String.valueOf(index++));
            catMap.put("name", entry.getKey());
            catMap.put("count", entry.getValue());
            categories.add(catMap);
        }

        // Fallback standard categories if database is empty
        if (categories.isEmpty()) {
            categories = List.of(
                Map.of("id", "1", "name", "Giảm đau - Hạ sốt", "count", 0),
                Map.of("id", "2", "name", "Kháng sinh", "count", 0),
                Map.of("id", "3", "name", "Tiêu hóa", "count", 0),
                Map.of("id", "4", "name", "Dị ứng", "count", 0),
                Map.of("id", "5", "name", "Tim mạch", "count", 0),
                Map.of("id", "6", "name", "Tiểu đường", "count", 0),
                Map.of("id", "7", "name", "Vitamin & Khoáng chất", "count", 0),
                Map.of("id", "8", "name", "Da liễu", "count", 0)
            );
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", categories);
        
        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Admin CRUD Endpoints
    // ============================================================

    @PostMapping
    public ResponseEntity<?> createDrug(@RequestBody Drug drug) {
        if (drug.getName() == null || drug.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên thuốc không được để trống"));
        }
        // Use placeholder image if none is provided
        if (drug.getImage() == null || drug.getImage().trim().isEmpty()) {
            drug.setImage("/images/paracetamol.png");
        }
        Drug saved = drugRepository.save(drug);
        return ResponseEntity.ok(Map.of("data", saved, "message", "Thêm thuốc mới thành công"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDrug(@PathVariable("id") Long id, @RequestBody Drug drugDetails) {
        if (id == null) return ResponseEntity.badRequest().build();
        Drug existing = drugRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.notFound().build();
        existing.setName(drugDetails.getName());
        existing.setActiveIngredient(drugDetails.getActiveIngredient());
        existing.setDosage(drugDetails.getDosage());
        existing.setForm(drugDetails.getForm());
        existing.setCategory(drugDetails.getCategory());
        existing.setPrice(drugDetails.getPrice());
        if (drugDetails.getImage() != null && !drugDetails.getImage().trim().isEmpty()) {
            existing.setImage(drugDetails.getImage());
        }
        existing.setDescription(drugDetails.getDescription());
        existing.setUsageInstruction(drugDetails.getUsageInstruction());
        existing.setIngredients(drugDetails.getIngredients());
        existing.setWarnings(drugDetails.getWarnings());
        existing.setRequiresPrescription(drugDetails.getRequiresPrescription());
        existing.setInStock(drugDetails.getInStock());
        existing.setManufacturer(drugDetails.getManufacturer());
        Drug updated = drugRepository.save(existing);
        Map<String, Object> response = new HashMap<>();
        response.put("data", updated);
        response.put("message", "Cập nhật thông tin thuốc thành công");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDrug(@PathVariable("id") long id) {
        Drug existing = drugRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.notFound().build();
        drugRepository.delete(existing);
        return ResponseEntity.ok(Map.of("message", "Xóa thuốc thành công"));
    }
}

