package com.ggirick.gardening_back.entity.report;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "POT_LISTING_REPORT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PotListingReport {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "pot_report_seq")
    @SequenceGenerator(name="pot_report_seq", sequenceName = "POT_REPORT_SEQ", allocationSize = 1)
    private Long id;

    @CreatedDate
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    private Long potListingId;

    @Column(length = 300)
    private String reason;

    @Column(name = "REPORTER_UID", length = 36)
    private String reporterUid;

    @Column(name = "STATUS", length = 30)
    private String status = "pending";
}