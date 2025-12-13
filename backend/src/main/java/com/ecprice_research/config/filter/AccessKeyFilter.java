package com.ecprice_research.config.filter;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AccessKeyFilter extends OncePerRequestFilter {

    // 🔥 여기 *하나만* 쓴다
    @Value("${ecprice.access-key}")
    private String serverKey;

    @PostConstruct
    public void init() {
        System.out.println("🔥 Loaded ACCESS KEY: [" + serverKey + "]");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String clientKey = request.getHeader("X-EC-ACCESS");

// 🔽 SSE 대응: query param fallback
        if (clientKey == null) {
            clientKey = request.getParameter("key");
        }

        System.out.println("🔥 RECEIVED KEY = " + clientKey);
        System.out.println("🔥 SERVER KEY   = " + serverKey);

        if (clientKey == null || !clientKey.equals(serverKey)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Forbidden: Invalid API Access Key");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
