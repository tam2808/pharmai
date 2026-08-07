package com.pharmai.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "drugs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Drug {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "active_ingredient")
    private String activeIngredient;

    private String dosage;
    private String form;
    private String category;
    private Double price;
    private String image;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "usage_instruction", columnDefinition = "TEXT")
    private String usageInstruction;

    @Column(columnDefinition = "TEXT")
    private String ingredients;

    @Column(columnDefinition = "TEXT")
    private String warnings;

    @Column(name = "requires_prescription")
    private Boolean requiresPrescription;

    @Column(name = "in_stock")
    private Boolean inStock;

    private String manufacturer;
}
