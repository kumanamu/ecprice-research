package com.ecprice_research.config.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class RateLimitFilter implements Filter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String clientIp = req.getRemoteAddr();

        Bucket bucket = cache.computeIfAbsent(clientIp, this::newBucket);

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            log.warn("⛔ Rate limit exceeded - IP = {}", clientIp);
            HttpServletResponse resp = (HttpServletResponse) response;
            resp.setStatus(429);
            resp.getWriter().write("Too Many Requests");
        }
    }

    private Bucket newBucket(String ip) {
        log.info("⚙️ New rate limit bucket created for IP = {}", ip);

        Refill refill = Refill.greedy(5, Duration.ofMinutes(1));  // 1분당 5회
        Bandwidth limit = Bandwidth.classic(5, refill);

        return Bucket4j.builder()
                .addLimit(limit)
                .build();
    }
}
