package com.ecprice_research.auth.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        // ✅ 인증 제외: 로그인/회원가입 + SSE
        return path.startsWith("/api/auth/")
                || path.startsWith("/api/margin/stream")
                || path.startsWith("/api/margin/finalCompareStream")
                || path.startsWith("/oauth2/")
                || path.startsWith("/login/oauth2/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // ✅ 토큰 없으면 401 반환
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("🚨 [JWT] 토큰 없음 - URI: {}", request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(
                    "{\"error\":\"No token\",\"message\":\"토큰이 필요합니다.\"}"
            );
            return;
        }

        try {
            String token = authHeader.substring(7);

            // 토큰 검증
            Claims claims = jwtProvider.parse(token);
            Long userId = Long.valueOf(claims.getSubject());
            String role = claims.get("role", String.class);  // ✅ role 추출

            log.debug("✅ [JWT] 인증 성공 - userId: {}, role: {}", userId, role);

            // ✅ 권한 설정 (ROLE_ prefix 없이 저장했으면 그대로, 있으면 그대로)
            List<SimpleGrantedAuthority> authorities = List.of(
                    new SimpleGrantedAuthority(role)  // ✅ role을 권한으로 설정
            );

            // 인증 정보 설정
            Authentication auth = new UsernamePasswordAuthenticationToken(
                    userId,
                    null,
                    authorities  // ✅ 권한 리스트 전달
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            // 만료된 토큰
            log.warn("🚨 [JWT] 토큰 만료 - URI: {}", request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(
                    "{\"error\":\"Token expired\",\"message\":\"토큰이 만료되었습니다.\"}"
            );
            return;

        } catch (Exception e) {
            // 유효하지 않은 토큰
            log.warn("🚨 [JWT] 토큰 검증 실패 - URI: {}, Error: {}",
                    request.getRequestURI(), e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(
                    "{\"error\":\"Invalid token\",\"message\":\"유효하지 않은 토큰입니다.\"}"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}