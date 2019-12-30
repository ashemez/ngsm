package com.entitymatrix.ngsm.app.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

// this is currently not used in the CustomWebSecurityConfigurerAdapter
@Component
public class NGSMLogoutSuccessHandler extends
SimpleUrlLogoutSuccessHandler implements LogoutSuccessHandler {

	//@Autowired
	//private AuditService auditService; 

	@Override
	public void onLogoutSuccess(
		HttpServletRequest request, 
	    HttpServletResponse response, 
	    Authentication authentication) 
	    throws IOException, ServletException {
	
		//String refererUrl = request.getHeader("Referer");
		//auditService.track("Logout from: " + refererUrl);
	
		super.onLogoutSuccess(request, response, authentication);
	}
}
