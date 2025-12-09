package com.ggirick.gardening_back.entity.report;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;


@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "REPORT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "report_seq")
    @SequenceGenerator(name="report_seq", sequenceName = "REPORT_SEQ", allocationSize = 1)
    private Long id;

    @CreatedDate
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "REASON", length = 500)
    private String reason;

    @Column(name = "REPORTER_UID", length = 36)
    private String reporterUid;

    @Column(name = "STATUS", length = 30)
    private String status = "pending";

    @Column(name = "TARGET_ID")
    private Long targetId;

    @Column(name = "TARGET_TYPE", length = 30)
    private String targetType;
}