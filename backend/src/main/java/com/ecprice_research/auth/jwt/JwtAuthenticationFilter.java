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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    // ========================================
    // 🔥 수정 1: 필터 제외 경로 축소
    // ========================================
    // ❌ BEFORE: /api/auth/, /api/margin/stream 모두 제외
    // ✅ AFTER: 로그인/회원가입만 제외 (SSE도 인증 필요)
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        // 공개 API만 필터 제외
        return path.equals("/api/auth/login")
                || path.equals("/api/auth/signup")
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

        // ========================================
        // 🔥 수정 2: 토큰 없으면 401 에러 반환
        // ========================================
        // ❌ BEFORE: 토큰 없어도 filterChain.doFilter() 호출 (통과)
        // ✅ AFTER: 토큰 없으면 401 반환하고 차단
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("🚨 [JWT] 토큰 없음 - URI: {}", request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(
                    "{\"error\":\"No token\",\"message\":\"토큰이 필요합니다.\"}"
            );
            return;  // ✅ 여기서 차단!
        }

        try {
            String token = authHeader.substring(7);

            // 토큰 검증 (만료 체크 포함)
            Claims claims = jwtProvider.parse(token);
            Long userId = Long.valueOf(claims.getSubject());

            log.debug("✅ [JWT] 인증 성공 - userId: {}", userId);

            // 인증 정보 설정
            Authentication auth = new UsernamePasswordAuthenticationToken(
                    userId,
                    null,
                    List.of()
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            // ========================================
            // 🔥 수정 3: 만료된 토큰 명확히 구분
            // ========================================
            // ✅ NEW: 만료 에러를 별도 처리
            log.warn("🚨 [JWT] 토큰 만료 - URI: {}", request.getRequestURI());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(
                    "{\"error\":\"Token expired\",\"message\":\"토큰이 만료되었습니다.\"}"
            );
            return;

        } catch (Exception e) {
            // ========================================
            // 🔥 수정 4: 유효하지 않은 토큰 처리
            // ========================================
            // ❌ BEFORE: response.setStatus(401) 후 filterChain 계속 진행
            // ✅ AFTER: 에러 응답 후 즉시 return
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