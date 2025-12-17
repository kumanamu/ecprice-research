package com.ecprice_research.auth.handler;

import com.ecprice_research.auth.jwt.JwtProvider;
import com.ecprice_research.entity.User;
import com.ecprice_research.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String oauthId = oauthUser.getAttribute("sub");
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");

        User user = userRepository.findByOauthId(oauthId)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .oauthId(oauthId)
                                .email(email)
                                .name(name)
                                .provider("google")
                                .build()
                ));

        String jwt = jwtProvider.createToken(user.getId(), user.getEmail());

        // ✅ 프론트로 토큰 전달 (redirect)
        String redirectUrl = "http://localhost:5173/oauth/success?token=" + jwt;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
