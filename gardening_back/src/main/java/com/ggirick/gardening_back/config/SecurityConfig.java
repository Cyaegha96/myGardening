package com.ggirick.gardening_back.config;

import com.ggirick.gardening_back.filters.JWTFilter;
import com.ggirick.gardening_back.handlers.OAuthLoginSuccessHandler;
import com.ggirick.gardening_back.mappers.auth.AuthMapper;
import com.ggirick.gardening_back.mappers.auth.UserMapper;
import com.ggirick.gardening_back.services.auth.AuthService;
import com.ggirick.gardening_back.services.auth.OAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    @Value("${cors.allowed-origins}")
    private String allowedOrigins; // 쉼표로 구분된 문자열

    private final JWTFilter jwtFilter;


    private final OAuthLoginSuccessHandler successHandler;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, OAuth2UserService oAuth2UserService) throws Exception {

        // 옛날 지원 security 문법들은 다 공식처럼 꺼놓고 들어가는게 일반적임
        http
                .formLogin(form->form.disable()) //Spring security가 제공하는 Form Login 기능 off시키기
                .httpBasic(basic->basic.disable()) //Authrization header 기반의 로그인 처리 방식 차단하여 자원 낭비 방지
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) //JWT 토큰 기반 인증 서버에서 불필요한 세션 생성 및 검증 로딕 차단하여 빼버리기
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(requests ->
                        requests
                                .requestMatchers("/auth/qr").permitAll()
                                .requestMatchers("/auth/checkOtp").permitAll()
                                .requestMatchers("/auth/requestOtp").permitAll()
                                .requestMatchers("/auth/login").permitAll()
                                .requestMatchers("/auth/existEmailCheck/**").permitAll()
                                .requestMatchers("/auth/existIdCheck").permitAll()
                                .requestMatchers("/auth/existPhoneCheck").permitAll()
                                .requestMatchers("/auth/send-certification").permitAll()
                                .requestMatchers("/auth/verify-code").permitAll()
                                .requestMatchers("/auth/password/**").permitAll()
                                .requestMatchers("/auth/signup").permitAll()
                                .requestMatchers("/auth/refresh").permitAll()
                                .requestMatchers("/oauth/**").permitAll() // OAuth 관련도 열기

                                // 인증이 필요한 경로
                                .requestMatchers("/auth/**").authenticated()
                                .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/shop/**").hasRole("SHOP_OWNER")
                        .requestMatchers("/gardener/**").hasRole("GARDENER")
                        .anyRequest().permitAll() // 요청을 허용할 url
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                // OAuth 2.0 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        // Spring Security가 토큰 교환 후 사용자 정보를 가져왔을 때 처리할 Service 등록
                        .userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserService))
                        // 로그인 성공 시 JWT 토큰을 발행하고 프론트엔드로 리다이렉트하는 Handler 등록
                        .successHandler(successHandler)
                        .failureHandler((request, response, exception) -> {
                            exception.printStackTrace();
                            response.sendRedirect("/error?error=true"); // 존재하는 페이지로
                        })


                ) ;
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        List<String> origins = Arrays.asList(allowedOrigins.split(","));

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(List.of("*")); // 요청을 허용할 method(get/post/put/delete 등)
        configuration.setAllowedHeaders(List.of("*")); // 요청을 허용할 header
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // BCrypt방식으로 암호화.
    }
    @Bean
    public OAuth2UserService oAuth2UserService(HttpSession session,
                                               AuthMapper authMapper,
                                               UserMapper userMapper,
                                               AuthService authService) {
        return new OAuth2UserService(session, authMapper, userMapper, authService);
    }
}
