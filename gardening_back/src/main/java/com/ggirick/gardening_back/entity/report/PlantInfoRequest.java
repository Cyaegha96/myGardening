package com.ggirick.gardening_back.entity.report;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "PLANT_INFO_REQUEST")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantInfoRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "plant_info_report_seq")
    @SequenceGenerator(name="plant_info_report_seq", sequenceName = "PLANT_INFO_REQUEST_SEQ", allocationSize = 1)

    private Long id;

    @CreatedDate
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "PLANT_SCIENTIFIC_NAME", length = 200)
    private String scientificName;

    @Column(name = "REQUESTED_CHANGES", length = 500)
    private String changes;

    @Column(name = "REVIEWER_UID", length = 200)
    private String reviewerUid;

    @Column(name = "REVIEW_NOTE", length = 30)
    private String reviewNote;

    @Column(name = "STATUS", length = 30)
    private String status = "pending";

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @Column(name = "USER_UID", length = 36)
    private String userUid;
}