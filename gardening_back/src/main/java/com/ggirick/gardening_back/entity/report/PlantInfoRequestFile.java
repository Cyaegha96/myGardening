package com.ggirick.gardening_back.entity.report;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "PLANT_INFO_REQUEST_FILE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantInfoRequestFile {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE , generator = "plant_info_report_file_seq")
    @SequenceGenerator(name="plant_info_report_file_seq", sequenceName = "PLANT_INFO_REQUEST_FILE_SEQ", allocationSize = 1)
    private Long id;

    @CreatedDate
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "ORI_NAME", length = 200)
    private String oriName;

    @Column(name = "REQUEST_USER_UID", length = 36)
    private String requestUserUid;

    @Column(name = "SYS_NAME", length = 200)
    private String sysName;

    @Column(name = "URL", length = 500)
    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    private PlantInfoRequest request;
}